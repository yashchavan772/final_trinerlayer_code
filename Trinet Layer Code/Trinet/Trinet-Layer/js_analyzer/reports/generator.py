"""Report generation for JS analysis results."""

import json
from enum import Enum
from typing import Dict, Any, List
from datetime import datetime
from dataclasses import asdict


class ReportFormat(Enum):
    """Supported report formats."""
    JSON = "json"
    HTML = "html"
    MARKDOWN = "markdown"


def generate_json_report(scan_result: Dict[str, Any]) -> str:
    """Generate JSON report for automation."""
    report = {
        "meta": {
            "tool": "TrinetLayer JS Analyzer",
            "version": "1.0.0",
            "generated_at": datetime.utcnow().isoformat(),
            "scan_id": scan_result.get("scan_id", ""),
            "domain": scan_result.get("domain", "")
        },
        "summary": scan_result.get("summary", {}),
        "findings": scan_result.get("findings", []),
        "js_files_analyzed": scan_result.get("js_files_analyzed", 0),
        "subdomains_checked": scan_result.get("subdomains_checked", 0)
    }
    
    return json.dumps(report, indent=2, default=str)


def generate_html_report(scan_result: Dict[str, Any]) -> str:
    """Generate HTML report for dashboard viewing."""
    findings = scan_result.get("findings", [])
    summary = scan_result.get("summary", {})
    
    severity_colors = {
        "critical": "#dc2626",
        "high": "#ea580c",
        "medium": "#ca8a04",
        "low": "#2563eb",
        "info": "#6b7280"
    }
    
    findings_html = ""
    for finding in findings:
        color = severity_colors.get(finding.get("severity", "info"), "#6b7280")
        findings_html += f"""
        <div class="finding" style="border-left: 4px solid {color}; margin: 10px 0; padding: 15px; background: #1f2937;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="color: {color};">[{finding.get('severity', 'INFO').upper()}] {finding.get('rule_name', '')}</strong>
                <span style="color: #9ca3af;">Confidence: {finding.get('confidence', 0) * 100:.0f}%</span>
            </div>
            <p style="color: #d1d5db; margin: 10px 0;">{finding.get('description', '')}</p>
            <div style="background: #111827; padding: 10px; border-radius: 4px; font-family: monospace;">
                <div><strong style="color: #60a5fa;">File:</strong> <span style="color: #9ca3af;">{finding.get('file_url', '')}</span></div>
                <div><strong style="color: #60a5fa;">Line:</strong> <span style="color: #9ca3af;">{finding.get('line_number', 0)}</span></div>
                <div><strong style="color: #60a5fa;">Value:</strong> <span style="color: #f87171;">{finding.get('masked_value', '')}</span></div>
            </div>
            {f'<span style="background: #374151; color: #f59e0b; padding: 2px 8px; border-radius: 4px; margin-top: 10px; display: inline-block;">{finding.get("security_tag", "")}</span>' if finding.get('security_tag') else ''}
        </div>
        """
    
    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JS Analyzer Report - {scan_result.get('domain', '')}</title>
    <style>
        * {{ box-sizing: border-box; margin: 0; padding: 0; }}
        body {{ background: #111827; color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }}
        .container {{ max-width: 1200px; margin: 0 auto; }}
        h1 {{ color: #06b6d4; margin-bottom: 20px; }}
        .summary {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }}
        .stat {{ background: #1f2937; padding: 20px; border-radius: 8px; text-align: center; }}
        .stat .value {{ font-size: 2rem; font-weight: bold; color: #06b6d4; }}
        .stat .label {{ color: #9ca3af; font-size: 0.9rem; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>JS Analyzer Report</h1>
        <p style="color: #9ca3af; margin-bottom: 20px;">Domain: {scan_result.get('domain', '')} | Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
        
        <div class="summary">
            <div class="stat">
                <div class="value">{summary.get('total_findings', 0)}</div>
                <div class="label">Total Findings</div>
            </div>
            <div class="stat">
                <div class="value" style="color: #dc2626;">{summary.get('critical', 0)}</div>
                <div class="label">Critical</div>
            </div>
            <div class="stat">
                <div class="value" style="color: #ea580c;">{summary.get('high', 0)}</div>
                <div class="label">High</div>
            </div>
            <div class="stat">
                <div class="value" style="color: #ca8a04;">{summary.get('medium', 0)}</div>
                <div class="label">Medium</div>
            </div>
            <div class="stat">
                <div class="value">{scan_result.get('js_files_analyzed', 0)}</div>
                <div class="label">JS Files</div>
            </div>
        </div>
        
        <h2 style="color: #f3f4f6; margin: 30px 0 15px;">Findings</h2>
        {findings_html if findings_html else '<p style="color: #6b7280;">No security issues found.</p>'}
    </div>
</body>
</html>
    """
    
    return html


def generate_markdown_report(scan_result: Dict[str, Any]) -> str:
    """Generate Markdown report (HackerOne-ready)."""
    findings = scan_result.get("findings", [])
    summary = scan_result.get("summary", {})
    domain = scan_result.get("domain", "")
    
    md = f"""# JavaScript Security Analysis Report

**Domain:** {domain}  
**Generated:** {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}  
**Tool:** TrinetLayer JS Analyzer v1.0.0

---

## Executive Summary

| Metric | Count |
|--------|-------|
| Total Findings | {summary.get('total_findings', 0)} |
| Critical | {summary.get('critical', 0)} |
| High | {summary.get('high', 0)} |
| Medium | {summary.get('medium', 0)} |
| Low | {summary.get('low', 0)} |
| JS Files Analyzed | {scan_result.get('js_files_analyzed', 0)} |

---

## Findings

"""
    
    if not findings:
        md += "_No security issues found._\n"
    else:
        for i, finding in enumerate(findings, 1):
            severity = finding.get('severity', 'info').upper()
            md += f"""### {i}. [{severity}] {finding.get('rule_name', 'Unknown')}

**Rule ID:** `{finding.get('rule_id', '')}`  
**Category:** {finding.get('category', '')}  
**Confidence:** {finding.get('confidence', 0) * 100:.0f}%  
**Security Tag:** {finding.get('security_tag', 'N/A')}

**Description:**  
{finding.get('description', '')}

**Affected File:**  
`{finding.get('file_url', '')}`

**Line Number:** {finding.get('line_number', 0)}

**Value (Masked):**  
```
{finding.get('masked_value', '')}
```

---

"""
    
    md += """
## Remediation Recommendations

1. **Secrets:** Rotate any exposed API keys, tokens, or credentials immediately.
2. **Dangerous Patterns:** Review and sanitize all dynamic code execution points.
3. **Auth Issues:** Implement proper origin validation for postMessage handlers.
4. **Endpoints:** Review exposed internal paths for access control.

---

*Report generated by TrinetLayer JS Analyzer*
"""
    
    return md


def generate_report(
    scan_result: Dict[str, Any],
    format: ReportFormat = ReportFormat.JSON
) -> str:
    """
    Generate report in specified format.
    
    Args:
        scan_result: Complete scan result data
        format: Output format (JSON, HTML, or MARKDOWN)
        
    Returns:
        Report string in requested format
    """
    if format == ReportFormat.JSON:
        return generate_json_report(scan_result)
    elif format == ReportFormat.HTML:
        return generate_html_report(scan_result)
    elif format == ReportFormat.MARKDOWN:
        return generate_markdown_report(scan_result)
    else:
        return generate_json_report(scan_result)
