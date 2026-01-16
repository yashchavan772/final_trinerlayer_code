import os
import subprocess
import shutil
import logging
from datetime import datetime
from pathlib import Path

logger = logging.getLogger(__name__)

TEMPLATES_DIR = Path("cve_scanner/data/nuclei-templates")
REPO_URL = "https://github.com/projectdiscovery/nuclei-templates.git"
CVE_YEARS = ["2025", "2026"]

def get_templates_path() -> Path:
    return TEMPLATES_DIR / "http" / "cves"

def sync_cve_templates() -> dict:
    result = {
        "success": False,
        "message": "",
        "timestamp": datetime.utcnow().isoformat(),
        "template_count": 0
    }
    
    try:
        temp_dir = Path("/tmp/nuclei-templates-clone")
        
        if temp_dir.exists():
            shutil.rmtree(temp_dir)
        
        logger.info("Cloning nuclei-templates repository...")
        clone_result = subprocess.run(
            ["git", "clone", "--depth", "1", "--filter=blob:none", "--sparse", REPO_URL, str(temp_dir)],
            capture_output=True,
            text=True,
            timeout=300
        )
        
        if clone_result.returncode != 0:
            result["message"] = f"Git clone failed: {clone_result.stderr}"
            logger.error(result["message"])
            return result
        
        subprocess.run(
            ["git", "sparse-checkout", "set", "http/cves"],
            cwd=temp_dir,
            capture_output=True,
            timeout=60
        )
        
        cves_path = get_templates_path()
        cves_path.mkdir(parents=True, exist_ok=True)
        
        source_cves = temp_dir / "http" / "cves"
        
        for year in CVE_YEARS:
            year_dir = cves_path / year
            year_dir.mkdir(exist_ok=True)
            
            source_year = source_cves / year
            if source_year.exists():
                for template_file in source_year.glob("*.yaml"):
                    dest_file = year_dir / template_file.name
                    shutil.copy2(template_file, dest_file)
                    result["template_count"] += 1
        
        shutil.rmtree(temp_dir, ignore_errors=True)
        
        result["success"] = True
        result["message"] = f"Successfully synced {result['template_count']} CVE templates"
        logger.info(result["message"])
        
    except subprocess.TimeoutExpired:
        result["message"] = "Template sync timed out"
        logger.error(result["message"])
    except Exception as e:
        result["message"] = f"Template sync failed: {str(e)}"
        logger.error(result["message"])
    
    return result

def get_template_stats() -> dict:
    stats = {"total": 0, "by_year": {}}
    cves_path = get_templates_path()
    
    if not cves_path.exists():
        return stats
    
    for year in CVE_YEARS:
        year_dir = cves_path / year
        if year_dir.exists():
            count = len(list(year_dir.glob("*.yaml")))
            stats["by_year"][year] = count
            stats["total"] += count
    
    return stats

def templates_exist() -> bool:
    cves_path = get_templates_path() / "2025"
    return cves_path.exists() and len(list(cves_path.glob("*.yaml"))) > 0

def get_last_sync_time() -> str:
    """Get last modification time of templates directory as proxy for last sync."""
    cves_path = get_templates_path() / "2025"
    if cves_path.exists():
        templates = list(cves_path.glob("*.yaml"))
        if templates:
            latest = max(t.stat().st_mtime for t in templates)
            return datetime.fromtimestamp(latest).isoformat()
    return None
