"""Security detection patterns with validation rules."""

import re
from dataclasses import dataclass
from typing import Optional, Callable, List


@dataclass
class SecurityPattern:
    """Security detection pattern with validation."""
    id: str
    name: str
    category: str
    pattern: re.Pattern
    severity: str
    min_length: int = 0
    max_length: int = 500
    min_entropy: float = 0.0
    prefix_allow_list: Optional[List[str]] = None
    validator: Optional[Callable[[str], bool]] = None
    description: str = ""


def validate_aws_key(value: str) -> bool:
    """Validate AWS access key format."""
    return value.startswith('AKIA') and len(value) == 20


def validate_jwt(value: str) -> bool:
    """Validate JWT format."""
    parts = value.split('.')
    return len(parts) == 3 and all(len(p) > 10 for p in parts)


def validate_firebase_url(value: str) -> bool:
    """Validate Firebase URL."""
    return 'firebaseio.com' in value or 'firebase' in value.lower()


SECRET_PATTERNS = [
    SecurityPattern(
        id="AWS_ACCESS_KEY",
        name="AWS Access Key",
        category="cloud",
        pattern=re.compile(r'(?:AKIA|A3T|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}'),
        severity="critical",
        min_length=20,
        max_length=20,
        min_entropy=3.5,
        validator=lambda v: v.startswith(('AKIA', 'A3T', 'AGPA')),
        description="AWS Access Key ID"
    ),
    SecurityPattern(
        id="AWS_SECRET_KEY",
        name="AWS Secret Key",
        category="cloud",
        pattern=re.compile(r'(?i)(?:aws[_-]?secret[_-]?(?:access[_-]?)?key|secret[_-]?key)\s*[:=]\s*["\']?([A-Za-z0-9/+=]{40})["\']?'),
        severity="critical",
        min_length=40,
        max_length=40,
        min_entropy=4.5,
        description="AWS Secret Access Key"
    ),
    SecurityPattern(
        id="GCP_API_KEY",
        name="Google Cloud API Key",
        category="cloud",
        pattern=re.compile(r'AIza[A-Za-z0-9_-]{35}'),
        severity="high",
        min_length=39,
        max_length=39,
        min_entropy=4.0,
        description="Google Cloud Platform API Key"
    ),
    SecurityPattern(
        id="GCP_SERVICE_ACCOUNT",
        name="GCP Service Account",
        category="cloud",
        pattern=re.compile(r'[a-zA-Z0-9-]+@[a-zA-Z0-9-]+\.iam\.gserviceaccount\.com'),
        severity="high",
        min_length=20,
        description="Google Cloud Service Account Email"
    ),
    SecurityPattern(
        id="AZURE_CONNECTION_STRING",
        name="Azure Connection String",
        category="cloud",
        pattern=re.compile(r'DefaultEndpointsProtocol=https;AccountName=[^;]+;AccountKey=[A-Za-z0-9+/=]{88};'),
        severity="critical",
        min_length=100,
        min_entropy=4.0,
        description="Azure Storage Connection String"
    ),
    SecurityPattern(
        id="STRIPE_KEY",
        name="Stripe API Key",
        category="payment",
        pattern=re.compile(r'(?:sk|pk)_(?:live|test)_[A-Za-z0-9]{24,}'),
        severity="critical",
        min_length=32,
        min_entropy=4.0,
        description="Stripe Secret or Publishable Key"
    ),
    SecurityPattern(
        id="RAZORPAY_KEY",
        name="Razorpay API Key",
        category="payment",
        pattern=re.compile(r'rzp_(?:live|test)_[A-Za-z0-9]{14,}'),
        severity="critical",
        min_length=20,
        min_entropy=3.5,
        description="Razorpay API Key"
    ),
    SecurityPattern(
        id="JWT_TOKEN",
        name="JWT Token",
        category="auth",
        pattern=re.compile(r'eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*'),
        severity="high",
        min_length=50,
        min_entropy=4.0,
        validator=validate_jwt,
        description="JSON Web Token"
    ),
    SecurityPattern(
        id="OAUTH_TOKEN",
        name="OAuth Token",
        category="auth",
        pattern=re.compile(r'(?i)(?:oauth|bearer|access)[_-]?token\s*[:=]\s*["\']?([A-Za-z0-9_-]{20,})["\']?'),
        severity="high",
        min_length=20,
        min_entropy=3.5,
        description="OAuth/Bearer Access Token"
    ),
    SecurityPattern(
        id="FIREBASE_CONFIG",
        name="Firebase Configuration",
        category="cloud",
        pattern=re.compile(r'(?:apiKey|authDomain|databaseURL|projectId|storageBucket|messagingSenderId|appId)\s*:\s*["\'][^"\']+["\']'),
        severity="medium",
        min_length=10,
        description="Firebase Configuration Key"
    ),
    SecurityPattern(
        id="FIREBASE_URL",
        name="Firebase Database URL",
        category="cloud",
        pattern=re.compile(r'https://[a-zA-Z0-9-]+\.firebaseio\.com'),
        severity="medium",
        min_length=30,
        validator=validate_firebase_url,
        description="Firebase Realtime Database URL"
    ),
    SecurityPattern(
        id="GITHUB_TOKEN",
        name="GitHub Token",
        category="vcs",
        pattern=re.compile(r'(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}'),
        severity="high",
        min_length=40,
        min_entropy=4.0,
        description="GitHub Personal Access Token"
    ),
    SecurityPattern(
        id="SLACK_TOKEN",
        name="Slack Token",
        category="communication",
        pattern=re.compile(r'xox[baprs]-[A-Za-z0-9-]{10,}'),
        severity="high",
        min_length=20,
        min_entropy=3.5,
        description="Slack API Token"
    ),
    SecurityPattern(
        id="PRIVATE_KEY",
        name="Private Key",
        category="crypto",
        pattern=re.compile(r'-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----'),
        severity="critical",
        min_length=50,
        description="Private Key Header"
    ),
    SecurityPattern(
        id="HARDCODED_PASSWORD",
        name="Hardcoded Password",
        category="auth",
        pattern=re.compile(r'(?i)(?:password|passwd|pwd)\s*[:=]\s*["\']([^"\']{8,})["\']'),
        severity="high",
        min_length=8,
        min_entropy=2.5,
        description="Hardcoded Password"
    ),
    SecurityPattern(
        id="API_KEY_GENERIC",
        name="Generic API Key",
        category="auth",
        pattern=re.compile(r'(?i)(?:api[_-]?key|apikey|secret[_-]?key)\s*[:=]\s*["\']?([A-Za-z0-9_-]{20,64})["\']?'),
        severity="medium",
        min_length=20,
        min_entropy=3.5,
        description="Generic API Key"
    ),
]


ENDPOINT_PATTERNS = [
    SecurityPattern(
        id="REST_ENDPOINT",
        name="REST API Endpoint",
        category="endpoint",
        pattern=re.compile(r'["\'](/api/v?\d*/[a-zA-Z0-9/_-]+)["\']'),
        severity="info",
        description="REST API Endpoint"
    ),
    SecurityPattern(
        id="INTERNAL_PATH",
        name="Internal Path",
        category="endpoint",
        pattern=re.compile(r'["\'](/(?:admin|internal|private|dashboard|management|config|settings)[a-zA-Z0-9/_-]*)["\']'),
        severity="medium",
        description="Internal/Admin Path"
    ),
    SecurityPattern(
        id="GRAPHQL_ENDPOINT",
        name="GraphQL Endpoint",
        category="endpoint",
        pattern=re.compile(r'["\']([^"\']*(?:graphql|gql)[^"\']*)["\']'),
        severity="low",
        description="GraphQL Endpoint"
    ),
    SecurityPattern(
        id="WEBSOCKET_URL",
        name="WebSocket URL",
        category="endpoint",
        pattern=re.compile(r'wss?://[^\s"\'<>]+'),
        severity="info",
        description="WebSocket Connection URL"
    ),
    SecurityPattern(
        id="INTERNAL_URL",
        name="Internal URL",
        category="endpoint",
        pattern=re.compile(r'https?://(?:localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+)[:\d]*[^\s"\'<>]*'),
        severity="medium",
        description="Internal/Private IP URL"
    ),
]


DANGEROUS_PATTERNS = [
    SecurityPattern(
        id="EVAL_USAGE",
        name="eval() Usage",
        category="dangerous",
        pattern=re.compile(r'\beval\s*\([^)]+\)'),
        severity="high",
        description="Dynamic code execution with eval()"
    ),
    SecurityPattern(
        id="NEW_FUNCTION",
        name="new Function() Usage",
        category="dangerous",
        pattern=re.compile(r'\bnew\s+Function\s*\([^)]+\)'),
        severity="high",
        description="Dynamic code execution with new Function()"
    ),
    SecurityPattern(
        id="INNERHTML",
        name="innerHTML Assignment",
        category="dangerous",
        pattern=re.compile(r'\.innerHTML\s*=\s*[^;]+'),
        severity="medium",
        description="Potential XSS via innerHTML"
    ),
    SecurityPattern(
        id="DOCUMENT_WRITE",
        name="document.write() Usage",
        category="dangerous",
        pattern=re.compile(r'\bdocument\.write(?:ln)?\s*\([^)]+\)'),
        severity="medium",
        description="DOM manipulation with document.write()"
    ),
    SecurityPattern(
        id="INSECURE_POSTMESSAGE",
        name="Insecure postMessage",
        category="dangerous",
        pattern=re.compile(r'\.postMessage\s*\([^,]+,\s*["\'][*]["\']'),
        severity="high",
        description="postMessage with wildcard origin"
    ),
    SecurityPattern(
        id="PROTOTYPE_POLLUTION",
        name="Prototype Pollution Risk",
        category="dangerous",
        pattern=re.compile(r'(?:__proto__|constructor\.prototype|Object\.assign\s*\(\s*\{\s*\}|Object\.definePropert)'),
        severity="medium",
        description="Potential prototype pollution vector"
    ),
    SecurityPattern(
        id="SETTIMEOUT_STRING",
        name="setTimeout with String",
        category="dangerous",
        pattern=re.compile(r'\bsetTimeout\s*\(\s*["\'][^"\']+["\']'),
        severity="medium",
        description="setTimeout with string argument (implicit eval)"
    ),
]


AUTH_PATTERNS = [
    SecurityPattern(
        id="JWT_LOCALSTORAGE",
        name="JWT in localStorage",
        category="auth_issue",
        pattern=re.compile(r'localStorage\.(?:setItem|getItem)\s*\([^)]*(?:token|jwt|auth)[^)]*\)'),
        severity="medium",
        description="JWT stored in localStorage (XSS risk)"
    ),
    SecurityPattern(
        id="JWT_SESSIONSTORAGE",
        name="JWT in sessionStorage",
        category="auth_issue",
        pattern=re.compile(r'sessionStorage\.(?:setItem|getItem)\s*\([^)]*(?:token|jwt|auth)[^)]*\)'),
        severity="low",
        description="JWT stored in sessionStorage"
    ),
    SecurityPattern(
        id="MISSING_ORIGIN_CHECK",
        name="Missing Origin Validation",
        category="auth_issue",
        pattern=re.compile(r'addEventListener\s*\(\s*["\']message["\'][^}]*(?!event\.origin)'),
        severity="high",
        description="postMessage handler without origin validation"
    ),
    SecurityPattern(
        id="HARDCODED_AUTH_FLAG",
        name="Hardcoded Auth Flag",
        category="auth_issue",
        pattern=re.compile(r'(?i)(?:isAdmin|isAuthenticated|isLoggedIn|hasAccess)\s*[:=]\s*(?:true|1)'),
        severity="medium",
        description="Hardcoded authentication/authorization flag"
    ),
    SecurityPattern(
        id="BYPASS_AUTH",
        name="Auth Bypass Pattern",
        category="auth_issue",
        pattern=re.compile(r'(?i)(?:skip|bypass|disable)[_-]?(?:auth|login|verification)'),
        severity="high",
        description="Potential authentication bypass flag"
    ),
]
