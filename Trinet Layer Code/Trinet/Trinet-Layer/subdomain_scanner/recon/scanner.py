import asyncio
import logging
import time
from typing import Dict, Any, Optional
from dataclasses import dataclass

from .passive import passive_enumeration
from .active import dns_bruteforce, validate_dns
from .alive import check_multiple_alive
from .wayback import query_wayback
from .commoncrawl import query_commoncrawl
from .public_js import analyze_public_js
from ..utils.normalizer import normalize_subdomains
from ..utils.deduplicator import deduplicate_results, merge_alive_results
from ..utils.risk import classify_risk

logger = logging.getLogger(__name__)

BASIC_SCAN_TIMEOUT = 120
ADVANCED_SCAN_TIMEOUT = 180
ADVANCED_MODULE_TIMEOUT = 20


@dataclass
class AdvancedPassiveConfig:
    """Configuration for advanced passive intelligence modules."""
    wayback: bool = False
    commoncrawl: bool = False
    public_js: bool = False


class SubdomainScanner:
    """
    Orchestrator for the full subdomain scanning pipeline.
    
    Scan order (strict):
    1. Passive Enumeration (crt.sh)
    2. Active Enumeration (DNS bruteforce)
    3. Advanced Passive Intelligence (optional, user-enabled)
    4. Normalization & Deduplication
    5. DNS Validation
    6. Alive Check
    7. Final Results
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    async def scan(
        self,
        domain: str,
        advanced_config: Optional[AdvancedPassiveConfig] = None
    ) -> Dict[str, Any]:
        """
        Execute the full subdomain scanning pipeline.
        
        Args:
            domain: Target domain to scan
            advanced_config: Configuration for advanced passive modules
        
        Returns:
            Dict with scan results, summary, and metadata
        """
        start_time = time.time()
        
        if advanced_config is None:
            advanced_config = AdvancedPassiveConfig()
        
        has_advanced = any([
            advanced_config.wayback,
            advanced_config.commoncrawl,
            advanced_config.public_js
        ])
        scan_timeout = ADVANCED_SCAN_TIMEOUT if has_advanced else BASIC_SCAN_TIMEOUT
        
        result = {
            "domain": domain,
            "success": True,
            "results": [],
            "summary": {
                "total_discovered": 0,
                "dns_valid": 0,
                "alive": 0,
                "execution_time_seconds": 0
            },
            "disclaimer": "Scan only domains you own or have permission to test.",
            "warning": None,
            "metadata": {
                "passive_success": True,
                "active_success": True,
                "advanced_modules_run": []
            }
        }
        
        try:
            async with asyncio.timeout(scan_timeout):
                passive_results, active_results = await self._run_basic_enum(domain)
                
                result["metadata"]["passive_success"] = passive_results.get(
                    "metadata", {}
                ).get("crt_sh_success", True)
                
                advanced_results = {}
                if any([
                    advanced_config.wayback,
                    advanced_config.commoncrawl,
                    advanced_config.public_js
                ]):
                    advanced_results = await self._run_advanced_passive(
                        domain, advanced_config
                    )
                    result["metadata"]["advanced_modules_run"] = list(advanced_results.keys())
                
                all_subdomains = self._merge_and_normalize(
                    domain, passive_results, active_results, advanced_results
                )
                
                if not all_subdomains:
                    result["summary"]["execution_time_seconds"] = round(
                        time.time() - start_time, 2
                    )
                    return result
                
                dns_results = await validate_dns(set(all_subdomains.keys()))
                
                valid_subdomains = [
                    sub for sub, valid in dns_results.items() if valid
                ]
                alive_results = {}
                if valid_subdomains:
                    alive_results = await check_multiple_alive(valid_subdomains)
                
                final_results = merge_alive_results(
                    all_subdomains, dns_results, alive_results
                )
                
                for item in final_results:
                    item["risk_level"] = classify_risk(
                        item["subdomain"],
                        item["alive"]
                    )
                    if "sources" in item:
                        del item["sources"]
                
                final_results.sort(key=lambda x: (
                    {"high": 0, "medium": 1, "low": 2, "info": 3}.get(x["risk_level"], 4),
                    not x["alive"],
                    not x["dns_valid"],
                    x["subdomain"]
                ))
                
                result["results"] = final_results
                result["summary"]["total_discovered"] = len(final_results)
                result["summary"]["dns_valid"] = sum(
                    1 for r in final_results if r["dns_valid"]
                )
                result["summary"]["alive"] = sum(
                    1 for r in final_results if r["alive"]
                )
        
        except asyncio.TimeoutError:
            result["success"] = False
            result["warning"] = "Scan timed out. Partial results may be returned."
            self.logger.warning(f"Scan timeout for {domain}")
        
        except Exception as e:
            result["success"] = False
            result["warning"] = "An error occurred during scanning."
            self.logger.error(f"Scan error for {domain}: {e}")
        
        result["summary"]["execution_time_seconds"] = round(
            time.time() - start_time, 2
        )
        
        return result
    
    async def _run_basic_enum(self, domain: str) -> tuple:
        """Run passive and active enumeration in parallel."""
        passive_task = passive_enumeration(domain)
        active_task = dns_bruteforce(domain)
        
        passive_results, active_results = await asyncio.gather(
            passive_task, active_task, return_exceptions=True
        )
        
        if isinstance(passive_results, Exception):
            self.logger.error(f"Passive enumeration failed: {passive_results}")
            passive_results = {"subdomains": {}, "metadata": {"crt_sh_success": False}}
        
        if isinstance(active_results, Exception):
            self.logger.error(f"Active enumeration failed: {active_results}")
            active_results = {}
        
        return passive_results, active_results
    
    async def _run_advanced_passive(
        self,
        domain: str,
        config: AdvancedPassiveConfig
    ) -> Dict[str, set]:
        """Run advanced passive intelligence modules based on config."""
        results = {}
        tasks = {}
        
        async def run_with_timeout(coro, name: str):
            try:
                async with asyncio.timeout(ADVANCED_MODULE_TIMEOUT):
                    return await coro
            except asyncio.TimeoutError:
                self.logger.warning(f"{name} module timed out")
                return set()
            except Exception as e:
                self.logger.error(f"{name} module error: {e}")
                return set()
        
        if config.wayback:
            tasks["wayback"] = run_with_timeout(query_wayback(domain), "Wayback")
        
        if config.commoncrawl:
            tasks["commoncrawl"] = run_with_timeout(
                query_commoncrawl(domain), "CommonCrawl"
            )
        
        if config.public_js:
            tasks["public_js"] = run_with_timeout(
                analyze_public_js(domain), "PublicJS"
            )
        
        if tasks:
            task_results = await asyncio.gather(*tasks.values(), return_exceptions=True)
            
            for (name, _), result in zip(tasks.items(), task_results):
                if isinstance(result, set):
                    results[name] = result
                else:
                    results[name] = set()
        
        return results
    
    def _merge_and_normalize(
        self,
        domain: str,
        passive_results: Dict[str, Any],
        active_results: Dict[str, Any],
        advanced_results: Dict[str, set]
    ) -> Dict[str, Dict[str, Any]]:
        """Merge all results, normalize, and deduplicate."""
        normalized_advanced = {}
        for source, subdomains in advanced_results.items():
            normalized_advanced[source] = normalize_subdomains(subdomains, domain)
        
        merged = deduplicate_results(
            passive_results,
            active_results,
            normalized_advanced
        )
        
        final = {}
        for subdomain, data in merged.items():
            normalized = subdomain.lower().strip()
            if normalized and (normalized.endswith(f".{domain}") or normalized == domain):
                final[normalized] = data
        
        return final


scanner = SubdomainScanner()
