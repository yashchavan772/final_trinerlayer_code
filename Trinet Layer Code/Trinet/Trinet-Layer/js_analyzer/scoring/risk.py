"""Risk scoring system for findings."""

from enum import Enum
from typing import List
from dataclasses import dataclass


class RiskLevel(Enum):
    """Risk level enumeration."""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


SEVERITY_WEIGHTS = {
    "critical": 1.0,
    "high": 0.8,
    "medium": 0.5,
    "low": 0.3,
    "info": 0.1
}

CATEGORY_SENSITIVITY = {
    "cloud": 1.0,
    "payment": 1.0,
    "auth": 0.9,
    "crypto": 0.95,
    "vcs": 0.8,
    "dangerous": 0.7,
    "auth_issue": 0.7,
    "endpoint": 0.4,
    "communication": 0.6
}

EXPOSURE_MODIFIERS = {
    "SECRET_EXPOSURE": 1.0,
    "AUTH_RISK": 0.9,
    "POSSIBLE_XSS": 0.7,
    "POSSIBLE_IDOR": 0.5
}


@dataclass
class RiskScore:
    """Risk score for a finding."""
    score: float
    level: RiskLevel
    confidence: float
    severity: str
    category: str
    

def calculate_risk_score(
    severity: str,
    category: str,
    confidence: float,
    security_tag: str = None
) -> RiskScore:
    """
    Calculate risk score: risk = confidence × sensitivity × exposure
    
    Args:
        severity: Finding severity level
        category: Finding category
        confidence: Confidence score (0-1)
        security_tag: Optional security tag for exposure modifier
        
    Returns:
        RiskScore with calculated values
    """
    severity_weight = SEVERITY_WEIGHTS.get(severity.lower(), 0.3)
    sensitivity = CATEGORY_SENSITIVITY.get(category.lower(), 0.5)
    exposure = EXPOSURE_MODIFIERS.get(security_tag, 0.5) if security_tag else 0.5
    
    score = confidence * sensitivity * exposure * severity_weight
    
    score = min(max(score, 0.0), 1.0)
    
    if score >= 0.8:
        level = RiskLevel.CRITICAL
    elif score >= 0.6:
        level = RiskLevel.HIGH
    elif score >= 0.4:
        level = RiskLevel.MEDIUM
    elif score >= 0.2:
        level = RiskLevel.LOW
    else:
        level = RiskLevel.INFO
    
    return RiskScore(
        score=round(score, 3),
        level=level,
        confidence=confidence,
        severity=severity,
        category=category
    )


def aggregate_risk_level(findings: List) -> RiskLevel:
    """Determine overall risk level from multiple findings."""
    if not findings:
        return RiskLevel.INFO
    
    severity_order = {
        RiskLevel.CRITICAL: 4,
        RiskLevel.HIGH: 3,
        RiskLevel.MEDIUM: 2,
        RiskLevel.LOW: 1,
        RiskLevel.INFO: 0
    }
    
    max_level = RiskLevel.INFO
    
    for finding in findings:
        if hasattr(finding, 'severity'):
            severity = finding.severity.lower()
            if severity == 'critical':
                level = RiskLevel.CRITICAL
            elif severity == 'high':
                level = RiskLevel.HIGH
            elif severity == 'medium':
                level = RiskLevel.MEDIUM
            elif severity == 'low':
                level = RiskLevel.LOW
            else:
                level = RiskLevel.INFO
            
            if severity_order[level] > severity_order[max_level]:
                max_level = level
    
    return max_level
