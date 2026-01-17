"""Core JavaScript analysis engine."""

import logging
import re
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field

from ..rules.patterns import (
    SECRET_PATTERNS,
    ENDPOINT_PATTERNS,
    DANGEROUS_PATTERNS,
    AUTH_PATTERNS,
    SecurityPattern
)
from ..utils.entropy import calculate_entropy, is_high_entropy
from ..utils.validators import sanitize_output

logger = logging.getLogger(__name__)


@dataclass
class Finding:
    """Security finding from JS analysis."""
    rule_id: str
    rule_name: str
    category: str
    severity: str
    value: str
    masked_value: str
    line_number: int
    context: str
    confidence: float
    file_url: str
    description: str
    security_tag: Optional[str] = None


@dataclass
class AnalysisResult:
    """Result of JS file analysis."""
    url: str
    findings: List[Finding] = field(default_factory=list)
    secrets_count: int = 0
    endpoints_count: int = 0
    dangerous_count: int = 0
    auth_issues_count: int = 0
    error: Optional[str] = None


class JSAnalyzerEngine:
    """Core engine for JavaScript security analysis."""
    
    def __init__(
        self,
        check_secrets: bool = True,
        check_endpoints: bool = True,
        check_dangerous: bool = True,
        check_auth: bool = True,
        min_confidence: float = 0.5,
        mask_secrets: bool = False
    ):
        self.check_secrets = check_secrets
        self.check_endpoints = check_endpoints
        self.check_dangerous = check_dangerous
        self.check_auth = check_auth
        self.min_confidence = min_confidence
        self.mask_secrets = mask_secrets
        
        self.patterns = []
        if check_secrets:
            self.patterns.extend(SECRET_PATTERNS)
        if check_endpoints:
            self.patterns.extend(ENDPOINT_PATTERNS)
        if check_dangerous:
            self.patterns.extend(DANGEROUS_PATTERNS)
        if check_auth:
            self.patterns.extend(AUTH_PATTERNS)
    
    def _get_line_number(self, content: str, match_start: int) -> int:
        """Get line number for a match position."""
        return content[:match_start].count('\n') + 1
    
    def _get_context(self, content: str, match_start: int, match_end: int, context_chars: int = 50) -> str:
        """Get surrounding context for a match."""
        start = max(0, match_start - context_chars)
        end = min(len(content), match_end + context_chars)
        context = content[start:end]
        return context.replace('\n', ' ').strip()
    
    def _calculate_confidence(
        self,
        pattern: SecurityPattern,
        matched_value: str
    ) -> float:
        """Calculate confidence score for a finding."""
        confidence = 0.5
        
        if len(matched_value) >= pattern.min_length:
            confidence += 0.1
        if pattern.max_length and len(matched_value) <= pattern.max_length:
            confidence += 0.05
        
        if pattern.min_entropy > 0:
            entropy = calculate_entropy(matched_value)
            if entropy >= pattern.min_entropy:
                confidence += 0.2
            else:
                confidence -= 0.2
        
        if pattern.prefix_allow_list:
            if any(matched_value.startswith(p) for p in pattern.prefix_allow_list):
                confidence += 0.1
        
        if pattern.validator:
            try:
                if pattern.validator(matched_value):
                    confidence += 0.15
                else:
                    confidence -= 0.15
            except Exception:
                pass
        
        return min(max(confidence, 0.0), 1.0)
    
    def _get_security_tag(self, pattern: SecurityPattern) -> Optional[str]:
        """Assign security tag based on pattern category."""
        tag_mapping = {
            "cloud": "SECRET_EXPOSURE",
            "payment": "SECRET_EXPOSURE",
            "auth": "AUTH_RISK",
            "vcs": "SECRET_EXPOSURE",
            "crypto": "SECRET_EXPOSURE",
            "saas": "SECRET_EXPOSURE",
            "database": "SECRET_EXPOSURE",
            "config": "CONFIG_EXPOSURE",
            "pii": "PII_EXPOSURE",
            "endpoint": "POSSIBLE_IDOR",
            "dangerous": "POSSIBLE_XSS",
            "auth_issue": "AUTH_RISK",
        }
        return tag_mapping.get(pattern.category)
    
    def analyze(self, content: str, file_url: str) -> AnalysisResult:
        """
        Analyze JavaScript content for security issues.
        
        Args:
            content: JavaScript code content
            file_url: Source URL of the JS file
            
        Returns:
            AnalysisResult with all findings
        """
        result = AnalysisResult(url=file_url)
        
        if not content:
            return result
        
        seen_values = set()
        
        for pattern in self.patterns:
            try:
                for match in pattern.pattern.finditer(content):
                    matched_value = match.group(1) if match.lastindex else match.group(0)
                    
                    if matched_value in seen_values:
                        continue
                    
                    if len(matched_value) < pattern.min_length:
                        continue
                    
                    if pattern.max_length and len(matched_value) > pattern.max_length:
                        continue
                    
                    confidence = self._calculate_confidence(pattern, matched_value)
                    
                    if confidence < self.min_confidence:
                        continue
                    
                    seen_values.add(matched_value)
                    
                    line_number = self._get_line_number(content, match.start())
                    context = self._get_context(content, match.start(), match.end())
                    
                    masked_value = sanitize_output(matched_value, self.mask_secrets)
                    
                    finding = Finding(
                        rule_id=pattern.id,
                        rule_name=pattern.name,
                        category=pattern.category,
                        severity=pattern.severity,
                        value=matched_value if not self.mask_secrets else masked_value,
                        masked_value=masked_value,
                        line_number=line_number,
                        context=context,
                        confidence=round(confidence, 2),
                        file_url=file_url,
                        description=pattern.description,
                        security_tag=self._get_security_tag(pattern)
                    )
                    
                    result.findings.append(finding)
                    
                    if pattern.category in ["cloud", "payment", "auth", "vcs", "crypto", "saas", "database", "config", "pii"]:
                        result.secrets_count += 1
                    elif pattern.category == "endpoint":
                        result.endpoints_count += 1
                    elif pattern.category == "dangerous":
                        result.dangerous_count += 1
                    elif pattern.category == "auth_issue":
                        result.auth_issues_count += 1
                        
            except Exception as e:
                logger.debug(f"Pattern {pattern.id} error: {e}")
        
        result.findings.sort(key=lambda f: (
            {"critical": 0, "high": 1, "medium": 2, "low": 3}.get(f.severity, 4),
            -f.confidence
        ))
        
        return result


def analyze_js_content(content: str, file_url: str, **kwargs) -> AnalysisResult:
    """Convenience function to analyze JS content."""
    engine = JSAnalyzerEngine(**kwargs)
    return engine.analyze(content, file_url)
