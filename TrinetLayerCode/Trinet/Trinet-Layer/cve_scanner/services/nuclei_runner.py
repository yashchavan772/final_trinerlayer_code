import subprocess
import json
import logging
import asyncio
import os
import re
from pathlib import Path
from typing import List, Optional, Dict, Any
from datetime import datetime

logger = logging.getLogger(__name__)

class NucleiRunner:
    """Wrapper for ProjectDiscovery Nuclei CVE scanner.
    
    Nuclei templates work by sending HTTP requests to targets and matching
    response patterns to detect known CVEs. Each template contains:
    - Request definitions (paths, methods, payloads)
    - Matchers (status codes, body content, headers)
    - Extractors (capture version info, etc.)
    
    CVE scans only detect SPECIFIC vulnerabilities with known signatures.
    A target not matching any CVE does NOT mean it's secure.
    """
    
    def __init__(self, debug_mode: bool = False):
        self.templates_base = Path("cve_scanner/data/nuclei-templates/http/cves")
        self.rate_limit = 50
        self.timeout = 10
        self.max_execution_time = 300
        self.debug_mode = debug_mode
    
    def count_templates(self, years: List[str] = None) -> Dict[str, int]:
        """Count YAML templates in specified year directories."""
        if years is None:
            years = ["2025"]
        
        counts = {"total": 0, "by_year": {}}
        
        for year in years:
            year_path = self.templates_base / year
            if year_path.exists():
                yaml_files = list(year_path.glob("*.yaml")) + list(year_path.glob("*.yml"))
                count = len(yaml_files)
                counts["by_year"][year] = count
                counts["total"] += count
            else:
                counts["by_year"][year] = 0
        
        return counts
    
    def get_template_paths(self, years: List[str] = None) -> List[str]:
        """Get list of template directory paths for specified years."""
        if years is None:
            years = ["2025"]
        
        paths = []
        for year in years:
            year_path = self.templates_base / year
            if year_path.exists():
                paths.append(str(year_path))
        return paths
    
    async def run_scan(self, target_url: str, years: List[str] = None) -> dict:
        """Execute nuclei scan against target URL using CVE templates.
        
        Nuclei CVE detection works by:
        1. Loading YAML templates with request/matcher definitions
        2. Sending crafted HTTP requests to the target
        3. Matching response patterns against known CVE signatures
        4. Reporting matches as findings
        
        IMPORTANT: Many CVE templates require specific conditions:
        - Exact software/version running on target
        - Specific endpoints/paths available
        - Response patterns matching vulnerability signatures
        
        Returns dict with success, findings, error, and metadata.
        """
        result = {
            "success": False,
            "findings": [],
            "error": None,
            "execution_time": 0,
            "metadata": {
                "templates_loaded": 0,
                "templates_by_year": {},
                "requests_sent": 0,
                "matches_found": 0,
                "nuclei_version": None,
                "debug_output": None
            }
        }
        
        start_time = datetime.utcnow()
        
        template_counts = self.count_templates(years)
        result["metadata"]["templates_loaded"] = template_counts["total"]
        result["metadata"]["templates_by_year"] = template_counts["by_year"]
        
        if template_counts["total"] == 0:
            result["error"] = "No CVE templates loaded. Cannot proceed with scan."
            logger.error(f"Scan aborted: {result['error']}")
            return result
        
        logger.info(f"Templates loaded: {template_counts['total']} from years {list(template_counts['by_year'].keys())}")
        
        template_paths = self.get_template_paths(years)
        if not template_paths:
            result["error"] = "No CVE template directories available"
            return result
        
        cmd = [
            "nuclei",
            "-u", target_url,
            "-severity", "critical,high,medium,low,info",
            "-jsonl",
            "-rate-limit", str(self.rate_limit),
            "-timeout", str(self.timeout),
            "-no-color",
            "-disable-update-check",
            "-stats",
            "-stats-interval", "5"
        ]
        
        for path in template_paths:
            cmd.extend(["-t", path])
        
        if self.debug_mode:
            logger.debug(f"Nuclei command: {' '.join(cmd)}")
        
        try:
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            try:
                stdout, stderr = await asyncio.wait_for(
                    process.communicate(),
                    timeout=self.max_execution_time
                )
            except asyncio.TimeoutError:
                process.kill()
                await process.wait()
                result["error"] = "Scan timed out"
                return result
            
            result["execution_time"] = (datetime.utcnow() - start_time).total_seconds()
            
            stdout_str = stdout.decode() if stdout else ""
            stderr_str = stderr.decode() if stderr else ""
            
            if self.debug_mode:
                result["metadata"]["debug_output"] = {
                    "stdout": stdout_str[:5000],
                    "stderr": stderr_str[:5000],
                    "return_code": process.returncode
                }
                logger.debug(f"Nuclei stderr: {stderr_str[:1000]}")
            
            requests_sent = self._parse_stats_from_output(stderr_str)
            result["metadata"]["requests_sent"] = requests_sent
            
            if stdout_str:
                output_lines = stdout_str.strip().split("\n")
                for line in output_lines:
                    if line.strip():
                        try:
                            data = json.loads(line)
                            if "template-id" in data:
                                parsed = self._parse_finding(data)
                                if parsed:
                                    result["findings"].append(parsed)
                        except json.JSONDecodeError:
                            if self.debug_mode:
                                logger.debug(f"Skipping non-JSON line: {line[:100]}")
            
            result["metadata"]["matches_found"] = len(result["findings"])
            result["success"] = True
            
            logger.info(f"Scan completed: {result['metadata']['templates_loaded']} templates, "
                       f"{result['metadata']['requests_sent']} requests, "
                       f"{result['metadata']['matches_found']} matches")
            
        except FileNotFoundError:
            result["error"] = "Nuclei binary not found"
            logger.error("Nuclei is not installed or not in PATH")
        except Exception as e:
            result["error"] = f"Scan execution failed: {str(e)}"
            logger.error(f"Nuclei scan error: {e}")
        
        return result
    
    def _parse_stats_from_output(self, stderr: str) -> int:
        """Parse request count from nuclei stats output.
        
        Nuclei outputs stats like: [0:00:05] | Templates: 269 | Hosts: 1 | RPS: 12 | Matched: 0 | Errors: 0 | Requests: 64/595 (10%)
        """
        requests_sent = 0
        
        matches = re.findall(r'Requests:\s*(\d+)/(\d+)', stderr)
        if matches:
            latest = matches[-1]
            requests_sent = int(latest[0])
        
        match = re.search(r'Requests:\s*(\d+)\s*\(', stderr)
        if match:
            requests_sent = int(match.group(1))
        
        return requests_sent
    
    def _parse_finding(self, raw: dict) -> Optional[dict]:
        """Parse raw nuclei JSON output into standardized finding format.
        
        Nuclei JSON output contains:
        - template-id: The CVE or template identifier
        - info: Metadata including name, severity, description
        - matched-at: The URL/endpoint where vulnerability was detected
        - host: Target host
        """
        try:
            template_id = raw.get("template-id", "")
            info = raw.get("info", {})
            
            cve_id = None
            if template_id.upper().startswith("CVE-"):
                cve_id = template_id.upper()
            else:
                classification = info.get("classification", {})
                cve_ids = classification.get("cve-id", [])
                if cve_ids:
                    cve_id = cve_ids[0] if isinstance(cve_ids, list) else cve_ids
            
            if not cve_id:
                cve_id = template_id.upper()
            
            severity = info.get("severity", "info").lower()
            if severity not in ["critical", "high", "medium", "low", "info"]:
                severity = "info"
            
            return {
                "cve_id": cve_id,
                "severity": severity,
                "endpoint": raw.get("matched-at", raw.get("host", "")),
                "template_name": info.get("name", template_id),
                "description": info.get("description", "No description available"),
                "detected_at": datetime.utcnow().isoformat()
            }
        except Exception as e:
            logger.error(f"Error parsing finding: {e}")
            return None
    
    async def get_nuclei_version(self) -> Optional[str]:
        """Get installed nuclei version."""
        try:
            process = await asyncio.create_subprocess_exec(
                "nuclei", "-version",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await asyncio.wait_for(
                process.communicate(),
                timeout=10
            )
            output = stdout.decode() + stderr.decode()
            for line in output.split("\n"):
                if "nuclei" in line.lower() or "version" in line.lower():
                    return line.strip()
            return output.split("\n")[0].strip() if output else None
        except Exception as e:
            logger.error(f"Failed to get nuclei version: {e}")
            return None
