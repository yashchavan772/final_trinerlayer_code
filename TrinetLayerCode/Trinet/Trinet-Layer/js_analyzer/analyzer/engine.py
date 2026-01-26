"""Core JavaScript analysis engine with false positive reduction."""

import logging
import re
from typing import Dict, Any, List, Optional, Set
from dataclasses import dataclass, field
from urllib.parse import urlparse

from ..rules.patterns import (
    SECRET_PATTERNS,
    ENDPOINT_PATTERNS,
    DANGEROUS_PATTERNS,
    AUTH_PATTERNS,
    SecurityPattern
)
from ..utils.entropy import (
    calculate_entropy,
    is_high_entropy,
    is_low_entropy_value,
    calculate_secret_score,
    get_entropy_threshold
)
from ..utils.validators import (
    sanitize_output,
    is_placeholder_value,
    is_test_key,
    is_vendor_js,
    is_third_party_url,
    is_in_comment_context,
    is_in_test_context,
    is_valid_email_for_bounty,
    is_cdn_ip,
    is_private_ip,
    validate_aws_key_format,
    validate_jwt_format,
    validate_stripe_key,
    get_context_lines
)

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
    suppressed: bool = False
    suppression_reason: Optional[str] = None
    is_third_party: bool = False
    is_test_value: bool = False


@dataclass
class AnalysisResult:
    """Result of JS file analysis."""
    url: str
    findings: List[Finding] = field(default_factory=list)
    suppressed_findings: List[Finding] = field(default_factory=list)
    secrets_count: int = 0
    endpoints_count: int = 0
    dangerous_count: int = 0
    auth_issues_count: int = 0
    error: Optional[str] = None
    is_vendor_file: bool = False
    is_third_party: bool = False


class JSAnalyzerEngine:
    """
    Core engine for JavaScript security analysis.
    
    Implements bug bounty-quality detection with false positive reduction:
    - Context awareness (comments, tests, vendor code)
    - Entropy validation per secret type
    - Placeholder/mock value filtering
    - Third-party code suppression
    - Test key identification
    """
    
    def __init__(
        self,
        check_secrets: bool = True,
        check_endpoints: bool = True,
        check_dangerous: bool = True,
        check_auth: bool = True,
        min_confidence: float = 0.5,
        mask_secrets: bool = False,
        target_domain: Optional[str] = None,
        suppress_third_party: bool = True,
        suppress_test_values: bool = True,
        suppress_vendor: bool = True,
        pro_mode: bool = False
    ):
        self.check_secrets = check_secrets
        self.check_endpoints = check_endpoints
        self.check_dangerous = check_dangerous
        self.check_auth = check_auth
        self.min_confidence = min_confidence
        self.mask_secrets = mask_secrets
        self.target_domain = target_domain
        self.suppress_third_party = suppress_third_party
        self.suppress_test_values = suppress_test_values
        self.suppress_vendor = suppress_vendor
        self.pro_mode = pro_mode
        
        self.patterns: List[SecurityPattern] = []
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
    
    def _get_secret_type_from_pattern(self, pattern: SecurityPattern) -> str:
        """Map pattern ID to secret type for entropy thresholds."""
        id_lower = pattern.id.lower()
        
        if 'aws_access' in id_lower:
            return 'aws_access_key'
        elif 'aws_secret' in id_lower:
            return 'aws_secret_key'
        elif 'gcp' in id_lower or 'google' in id_lower:
            return 'gcp_api_key'
        elif 'azure' in id_lower:
            return 'azure_key'
        elif 'stripe' in id_lower:
            return 'stripe_key'
        elif 'jwt' in id_lower:
            return 'jwt_token' if 'secret' not in id_lower else 'jwt_secret'
        elif 'github' in id_lower or 'gitlab' in id_lower:
            return 'github_token'
        elif 'bearer' in id_lower:
            return 'bearer_token'
        elif 'session' in id_lower:
            return 'session_token'
        elif 'oauth' in id_lower:
            return 'oauth_token'
        elif 'private_key' in id_lower:
            return 'private_key'
        elif 'encrypt' in id_lower:
            return 'encryption_key'
        elif 'password' in id_lower or 'passwd' in id_lower:
            return 'password'
        elif 'api_key' in id_lower:
            return 'generic_api_key'
        elif 'secret' in id_lower:
            return 'generic_secret'
        else:
            return 'default'
    
    def _apply_custom_validator(self, pattern: SecurityPattern, matched_value: str) -> bool:
        """Apply pattern-specific validation for high-confidence detection."""
        pattern_id = pattern.id.upper()
        
        if 'AWS_ACCESS_KEY' in pattern_id:
            return validate_aws_key_format(matched_value)
        
        if 'JWT_TOKEN' in pattern_id:
            return validate_jwt_format(matched_value)
        
        if 'STRIPE' in pattern_id:
            require_live = 'SECRET' in pattern_id
            return validate_stripe_key(matched_value, require_live=require_live)
        
        if pattern.validator:
            try:
                return pattern.validator(matched_value)
            except Exception:
                return True
        
        return True
    
    def _should_suppress_finding(
        self,
        pattern: SecurityPattern,
        matched_value: str,
        content: str,
        match_start: int,
        file_url: str
    ) -> tuple:
        """
        Determine if a finding should be suppressed.
        Returns (should_suppress, reason).
        """
        if is_placeholder_value(matched_value):
            return True, "Placeholder/mock value"
        
        if self.suppress_test_values and is_test_key(matched_value):
            return True, "Test/sandbox key (not exploitable)"
        
        secret_type = self._get_secret_type_from_pattern(pattern)
        if pattern.min_entropy > 0:
            if is_low_entropy_value(matched_value, max_entropy=pattern.min_entropy * 0.7):
                return True, "Low entropy (likely placeholder)"
        
        if is_in_comment_context(content, match_start):
            if pattern.severity not in ['critical']:
                return True, "Found in comment context"
        
        if is_in_test_context(content, match_start):
            if pattern.severity not in ['critical']:
                return True, "Found in test/demo context"
        
        if self.suppress_third_party and self.target_domain:
            if is_third_party_url(file_url, self.target_domain):
                return True, "Third-party code (not actionable)"
        
        if pattern.category == 'pii':
            if pattern.id == 'EMAIL_ADDRESS':
                if not is_valid_email_for_bounty(matched_value):
                    return True, "Generic/placeholder email"
            elif pattern.id == 'IPV4_ADDRESS':
                if is_cdn_ip(matched_value):
                    return True, "CDN IP address (not sensitive)"
        
        if pattern.category == 'dangerous':
            context = self._get_context(content, match_start, match_start + len(matched_value), 100)
            if not self._has_user_input_flow(context, pattern.id):
                return True, "No user input flow detected (code smell only)"
        
        return False, None
    
    def _has_user_input_flow(self, context: str, pattern_id: str) -> bool:
        """
        Check if dangerous pattern has user input flowing into it.
        Only flag if there's potential for exploitation.
        """
        user_input_indicators = [
            'req.', 'request.', 'params.', 'query.', 'body.',
            'input', 'value', 'data', 'user', 'form',
            'location.', 'document.', 'window.', 'url',
            'search', 'hash', 'pathname', 'href',
            'getParameter', 'getAttribute', 'getElementById',
            'querySelector', 'prompt', 'decodeURI',
        ]
        
        context_lower = context.lower()
        return any(indicator in context_lower for indicator in user_input_indicators)
    
    def _calculate_confidence(
        self,
        pattern: SecurityPattern,
        matched_value: str,
        content: str,
        match_start: int
    ) -> float:
        """
        Calculate confidence score for a finding.
        Higher confidence = more likely real, exploitable issue.
        """
        confidence = 0.5
        
        if len(matched_value) >= pattern.min_length:
            confidence += 0.1
        if pattern.max_length and len(matched_value) <= pattern.max_length:
            confidence += 0.05
        
        secret_type = self._get_secret_type_from_pattern(pattern)
        secret_score = calculate_secret_score(matched_value, secret_type)
        confidence += secret_score * 0.2
        
        if pattern.prefix_allow_list:
            if any(matched_value.startswith(p) for p in pattern.prefix_allow_list):
                confidence += 0.1
        
        if self._apply_custom_validator(pattern, matched_value):
            confidence += 0.15
        else:
            confidence -= 0.2
        
        if is_in_comment_context(content, match_start):
            confidence -= 0.15
        
        if is_in_test_context(content, match_start):
            confidence -= 0.1
        
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
    
    def _adjust_severity_for_test(self, severity: str, is_test: bool) -> str:
        """Downgrade severity for test/sandbox values."""
        if not is_test:
            return severity
        
        severity_map = {
            'critical': 'medium',
            'high': 'low',
            'medium': 'info',
            'low': 'info',
        }
        return severity_map.get(severity, 'info')
    
    def analyze(self, content: str, file_url: str) -> AnalysisResult:
        """
        Analyze JavaScript content for security issues.
        
        Implements bug bounty-quality detection:
        - Pattern matching with validation
        - Entropy-based filtering
        - Context awareness
        - Third-party/vendor suppression
        
        Args:
            content: JavaScript code content
            file_url: Source URL of the JS file
            
        Returns:
            AnalysisResult with findings and suppression details
        """
        result = AnalysisResult(url=file_url)
        
        if not content:
            return result
        
        if self.suppress_vendor and is_vendor_js(file_url):
            result.is_vendor_file = True
            return result
        
        if self.suppress_third_party and self.target_domain:
            if is_third_party_url(file_url, self.target_domain):
                result.is_third_party = True
                return result
        
        seen_values: Set[str] = set()
        
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
                    
                    should_suppress, suppression_reason = self._should_suppress_finding(
                        pattern, matched_value, content, match.start(), file_url
                    )
                    
                    confidence = self._calculate_confidence(
                        pattern, matched_value, content, match.start()
                    )
                    
                    if confidence < self.min_confidence and not should_suppress:
                        should_suppress = True
                        suppression_reason = f"Low confidence ({confidence:.2f})"
                    
                    seen_values.add(matched_value)
                    
                    line_number = self._get_line_number(content, match.start())
                    context = self._get_context(content, match.start(), match.end())
                    
                    masked_value = sanitize_output(matched_value, self.mask_secrets)
                    
                    is_test = is_test_key(matched_value)
                    severity = self._adjust_severity_for_test(pattern.severity, is_test)
                    
                    finding = Finding(
                        rule_id=pattern.id,
                        rule_name=pattern.name,
                        category=pattern.category,
                        severity=severity,
                        value=matched_value if not self.mask_secrets else masked_value,
                        masked_value=masked_value,
                        line_number=line_number,
                        context=context,
                        confidence=round(confidence, 2),
                        file_url=file_url,
                        description=pattern.description,
                        security_tag=self._get_security_tag(pattern),
                        suppressed=should_suppress,
                        suppression_reason=suppression_reason,
                        is_third_party=is_third_party_url(file_url, self.target_domain) if self.target_domain else False,
                        is_test_value=is_test
                    )
                    
                    if should_suppress:
                        result.suppressed_findings.append(finding)
                    else:
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
