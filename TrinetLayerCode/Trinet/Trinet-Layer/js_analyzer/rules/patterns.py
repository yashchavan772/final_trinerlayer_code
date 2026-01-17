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
    return value.startswith(('AKIA', 'A3T', 'AGPA', 'AIDA', 'AROA', 'AIPA', 'ANPA', 'ANVA', 'ASIA')) and len(value) == 20


def validate_jwt(value: str) -> bool:
    parts = value.split('.')
    return len(parts) == 3 and all(len(p) > 10 for p in parts)


def validate_firebase_url(value: str) -> bool:
    return 'firebaseio.com' in value or 'firebase' in value.lower()


def validate_email(value: str) -> bool:
    return '@' in value and '.' in value.split('@')[-1]


def validate_ipv4(value: str) -> bool:
    parts = value.split('.')
    if len(parts) != 4:
        return False
    try:
        return all(0 <= int(p) <= 255 for p in parts)
    except ValueError:
        return False


SECRET_PATTERNS = [
    SecurityPattern(
        id="AWS_ACCESS_KEY",
        name="AWS Access Key ID",
        category="cloud",
        pattern=re.compile(r'(?:AKIA|A3T|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}'),
        severity="critical",
        min_length=20,
        max_length=20,
        min_entropy=3.5,
        validator=validate_aws_key,
        description="AWS Access Key ID - provides programmatic access to AWS resources"
    ),
    SecurityPattern(
        id="AWS_SECRET_KEY",
        name="AWS Secret Access Key",
        category="cloud",
        pattern=re.compile(r'(?i)(?:aws[_-]?secret[_-]?(?:access[_-]?)?key|secret[_-]?key)\s*[:=]\s*["\']?([A-Za-z0-9/+=]{40})["\']?'),
        severity="critical",
        min_length=40,
        max_length=40,
        min_entropy=4.5,
        description="AWS Secret Access Key - full AWS account access"
    ),
    SecurityPattern(
        id="AWS_SESSION_TOKEN",
        name="AWS Session Token",
        category="cloud",
        pattern=re.compile(r'(?i)(?:aws[_-]?session[_-]?token|session[_-]?token)\s*[:=]\s*["\']?([A-Za-z0-9/+=]{100,})["\']?'),
        severity="critical",
        min_length=100,
        min_entropy=4.0,
        description="AWS Session Token for temporary credentials"
    ),
    SecurityPattern(
        id="AWS_ARN",
        name="AWS ARN",
        category="cloud",
        pattern=re.compile(r'arn:aws:[a-z0-9-]+:[a-z0-9-]*:\d{12}:[a-zA-Z0-9/_-]+'),
        severity="medium",
        min_length=30,
        description="AWS Resource ARN - reveals account structure"
    ),
    SecurityPattern(
        id="AWS_S3_BUCKET",
        name="AWS S3 Bucket",
        category="cloud",
        pattern=re.compile(r'(?:s3://|https?://)?([a-z0-9][a-z0-9.-]{1,61}[a-z0-9])\.s3(?:[.-][a-z0-9-]+)?\.amazonaws\.com'),
        severity="medium",
        min_length=10,
        description="AWS S3 Bucket URL - potential data exposure"
    ),
    SecurityPattern(
        id="AWS_CLOUDFRONT",
        name="AWS CloudFront URL",
        category="cloud",
        pattern=re.compile(r'https?://[a-z0-9]+\.cloudfront\.net[^\s"\'<>]*'),
        severity="low",
        min_length=30,
        description="AWS CloudFront distribution URL"
    ),
    SecurityPattern(
        id="GCP_API_KEY",
        name="Google Cloud API Key",
        category="cloud",
        pattern=re.compile(r'AIza[A-Za-z0-9_-]{35}'),
        severity="critical",
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
        id="GCP_OAUTH_CLIENT_SECRET",
        name="Google OAuth Client Secret",
        category="cloud",
        pattern=re.compile(r'(?i)(?:client[_-]?secret|google[_-]?secret)\s*[:=]\s*["\']?([A-Za-z0-9_-]{24})["\']?'),
        severity="critical",
        min_length=24,
        min_entropy=3.5,
        description="Google OAuth Client Secret"
    ),
    SecurityPattern(
        id="AZURE_CONNECTION_STRING",
        name="Azure Connection String",
        category="cloud",
        pattern=re.compile(r'DefaultEndpointsProtocol=https;AccountName=[^;]+;AccountKey=[A-Za-z0-9+/=]{88};'),
        severity="critical",
        min_length=100,
        min_entropy=4.0,
        description="Azure Storage Connection String - full storage access"
    ),
    SecurityPattern(
        id="AZURE_STORAGE_KEY",
        name="Azure Storage Account Key",
        category="cloud",
        pattern=re.compile(r'(?i)(?:azure[_-]?storage[_-]?key|account[_-]?key)\s*[:=]\s*["\']?([A-Za-z0-9+/=]{88})["\']?'),
        severity="critical",
        min_length=88,
        min_entropy=4.5,
        description="Azure Storage Account Key"
    ),
    SecurityPattern(
        id="AZURE_TENANT_ID",
        name="Azure Tenant ID",
        category="cloud",
        pattern=re.compile(r'(?i)(?:tenant[_-]?id|directory[_-]?id)\s*[:=]\s*["\']?([a-f0-9-]{36})["\']?'),
        severity="medium",
        min_length=36,
        description="Azure Active Directory Tenant ID"
    ),
    SecurityPattern(
        id="DIGITALOCEAN_TOKEN",
        name="DigitalOcean Token",
        category="cloud",
        pattern=re.compile(r'(?i)(?:do[_-]?token|digitalocean[_-]?token)\s*[:=]\s*["\']?([a-f0-9]{64})["\']?'),
        severity="critical",
        min_length=64,
        min_entropy=4.0,
        description="DigitalOcean API Token"
    ),
    SecurityPattern(
        id="CLOUDFLARE_API_TOKEN",
        name="Cloudflare API Token",
        category="cloud",
        pattern=re.compile(r'(?i)(?:cf[_-]?token|cloudflare[_-]?(?:api[_-]?)?token)\s*[:=]\s*["\']?([A-Za-z0-9_-]{40})["\']?'),
        severity="critical",
        min_length=40,
        min_entropy=4.0,
        description="Cloudflare API Token"
    ),
    SecurityPattern(
        id="FIREBASE_API_KEY",
        name="Firebase API Key",
        category="cloud",
        pattern=re.compile(r'(?i)(?:firebase[_-]?)?api[_-]?key\s*[:=]\s*["\']?(AIza[A-Za-z0-9_-]{35})["\']?'),
        severity="high",
        min_length=39,
        description="Firebase API Key"
    ),
    SecurityPattern(
        id="FIREBASE_PROJECT_ID",
        name="Firebase Project ID",
        category="cloud",
        pattern=re.compile(r'(?i)project[_-]?id\s*[:=]\s*["\']?([a-z0-9-]{6,30})["\']?'),
        severity="medium",
        min_length=6,
        description="Firebase Project ID"
    ),
    SecurityPattern(
        id="FIREBASE_URL",
        name="Firebase Database URL",
        category="cloud",
        pattern=re.compile(r'https://[a-zA-Z0-9-]+\.firebaseio\.com'),
        severity="high",
        min_length=30,
        validator=validate_firebase_url,
        description="Firebase Realtime Database URL"
    ),
    SecurityPattern(
        id="FIREBASE_SERVICE_ACCOUNT",
        name="Firebase Service Account",
        category="cloud",
        pattern=re.compile(r'firebase-adminsdk-[a-z0-9]+@[a-z0-9-]+\.iam\.gserviceaccount\.com'),
        severity="critical",
        min_length=40,
        description="Firebase Service Account - full admin access"
    ),
    SecurityPattern(
        id="SUPABASE_KEY",
        name="Supabase API Key",
        category="cloud",
        pattern=re.compile(r'(?i)(?:supabase[_-]?(?:anon[_-]?)?key|sb[_-]?key)\s*[:=]\s*["\']?(eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)["\']?'),
        severity="high",
        min_length=100,
        description="Supabase API Key (JWT format)"
    ),
    SecurityPattern(
        id="SUPABASE_URL",
        name="Supabase Project URL",
        category="cloud",
        pattern=re.compile(r'https://[a-z0-9]+\.supabase\.co'),
        severity="medium",
        min_length=25,
        description="Supabase Project URL"
    ),
    SecurityPattern(
        id="STRIPE_SECRET_KEY",
        name="Stripe Secret Key",
        category="payment",
        pattern=re.compile(r'sk_(?:live|test)_[A-Za-z0-9]{24,}'),
        severity="critical",
        min_length=32,
        min_entropy=4.0,
        description="Stripe Secret Key - full payment access"
    ),
    SecurityPattern(
        id="STRIPE_PUBLISHABLE_KEY",
        name="Stripe Publishable Key",
        category="payment",
        pattern=re.compile(r'pk_(?:live|test)_[A-Za-z0-9]{24,}'),
        severity="medium",
        min_length=32,
        description="Stripe Publishable Key"
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
        id="PAYPAL_CLIENT_ID",
        name="PayPal Client ID",
        category="payment",
        pattern=re.compile(r'(?i)(?:paypal[_-]?client[_-]?id)\s*[:=]\s*["\']?([A-Za-z0-9_-]{80})["\']?'),
        severity="high",
        min_length=80,
        description="PayPal Client ID"
    ),
    SecurityPattern(
        id="PAYPAL_SECRET",
        name="PayPal Client Secret",
        category="payment",
        pattern=re.compile(r'(?i)(?:paypal[_-]?(?:client[_-]?)?secret)\s*[:=]\s*["\']?([A-Za-z0-9_-]{80})["\']?'),
        severity="critical",
        min_length=80,
        description="PayPal Client Secret - payment access"
    ),
    SecurityPattern(
        id="MONGODB_URI",
        name="MongoDB Connection URI",
        category="database",
        pattern=re.compile(r'mongodb(?:\+srv)?://[^\s"\'<>]+'),
        severity="critical",
        min_length=20,
        description="MongoDB Connection String - database access"
    ),
    SecurityPattern(
        id="MYSQL_CREDENTIALS",
        name="MySQL Connection String",
        category="database",
        pattern=re.compile(r'mysql://[^\s"\'<>]+'),
        severity="critical",
        min_length=15,
        description="MySQL Connection String - database access"
    ),
    SecurityPattern(
        id="POSTGRESQL_URI",
        name="PostgreSQL Connection URI",
        category="database",
        pattern=re.compile(r'postgres(?:ql)?://[^\s"\'<>]+'),
        severity="critical",
        min_length=15,
        description="PostgreSQL Connection String - database access"
    ),
    SecurityPattern(
        id="REDIS_URL",
        name="Redis Connection URL",
        category="database",
        pattern=re.compile(r'redis(?:s)?://[^\s"\'<>]+'),
        severity="critical",
        min_length=10,
        description="Redis Connection URL - cache/database access"
    ),
    SecurityPattern(
        id="ELASTICSEARCH_URL",
        name="Elasticsearch URL",
        category="database",
        pattern=re.compile(r'(?i)(?:elasticsearch[_-]?url|es[_-]?url)\s*[:=]\s*["\']?(https?://[^\s"\'<>]+)["\']?'),
        severity="high",
        min_length=15,
        description="Elasticsearch Endpoint URL"
    ),
    SecurityPattern(
        id="DATABASE_CONNECTION_STRING",
        name="Database Connection String",
        category="database",
        pattern=re.compile(r'(?i)(?:database[_-]?url|db[_-]?connection|connection[_-]?string)\s*[:=]\s*["\']?([^\s"\']{20,})["\']?'),
        severity="critical",
        min_length=20,
        min_entropy=2.5,
        description="Generic Database Connection String"
    ),
    SecurityPattern(
        id="JWT_TOKEN",
        name="JWT Token",
        category="auth",
        pattern=re.compile(r'eyJ[A-Za-z0-9_-]*\.eyJ[A-Za-z0-9_-]*\.[A-Za-z0-9_-]*'),
        severity="critical",
        min_length=50,
        min_entropy=4.0,
        validator=validate_jwt,
        description="JSON Web Token - authentication token"
    ),
    SecurityPattern(
        id="JWT_SECRET",
        name="JWT Secret Key",
        category="auth",
        pattern=re.compile(r'(?i)(?:jwt[_-]?secret|token[_-]?secret|secret[_-]?key)\s*[:=]\s*["\']?([A-Za-z0-9_!@#$%^&*+-]{16,})["\']?'),
        severity="critical",
        min_length=16,
        min_entropy=3.5,
        description="JWT Secret Key - allows token forgery"
    ),
    SecurityPattern(
        id="OAUTH_ACCESS_TOKEN",
        name="OAuth Access Token",
        category="auth",
        pattern=re.compile(r'(?i)(?:access[_-]?token)\s*[:=]\s*["\']?([A-Za-z0-9_-]{20,})["\']?'),
        severity="critical",
        min_length=20,
        min_entropy=3.5,
        description="OAuth Access Token"
    ),
    SecurityPattern(
        id="OAUTH_REFRESH_TOKEN",
        name="OAuth Refresh Token",
        category="auth",
        pattern=re.compile(r'(?i)(?:refresh[_-]?token)\s*[:=]\s*["\']?([A-Za-z0-9_-]{20,})["\']?'),
        severity="critical",
        min_length=20,
        min_entropy=3.5,
        description="OAuth Refresh Token - persistent access"
    ),
    SecurityPattern(
        id="BEARER_TOKEN",
        name="Bearer Token",
        category="auth",
        pattern=re.compile(r'(?i)(?:bearer|authorization)\s*[:=]\s*["\']?(?:Bearer\s+)?([A-Za-z0-9_.-]{20,})["\']?'),
        severity="critical",
        min_length=20,
        min_entropy=3.5,
        description="Bearer Authorization Token"
    ),
    SecurityPattern(
        id="SESSION_TOKEN",
        name="Session Token",
        category="auth",
        pattern=re.compile(r'(?i)(?:session[_-]?(?:id|token|key))\s*[:=]\s*["\']?([A-Za-z0-9_-]{20,})["\']?'),
        severity="critical",
        min_length=20,
        min_entropy=3.0,
        description="Session Token - user session access"
    ),
    SecurityPattern(
        id="CSRF_TOKEN",
        name="CSRF Token",
        category="auth",
        pattern=re.compile(r'(?i)(?:csrf[_-]?token|_csrf|xsrf[_-]?token)\s*[:=]\s*["\']?([A-Za-z0-9_-]{20,})["\']?'),
        severity="high",
        min_length=20,
        description="CSRF Token exposure"
    ),
    SecurityPattern(
        id="RESET_TOKEN",
        name="Password Reset Token",
        category="auth",
        pattern=re.compile(r'(?i)(?:reset[_-]?token|password[_-]?reset)\s*[:=]\s*["\']?([A-Za-z0-9_-]{20,})["\']?'),
        severity="critical",
        min_length=20,
        description="Password Reset Token - account takeover risk"
    ),
    SecurityPattern(
        id="OTP_VALUE",
        name="OTP/Verification Code",
        category="auth",
        pattern=re.compile(r'(?i)(?:otp|verification[_-]?code|verify[_-]?code|pin[_-]?code)\s*[:=]\s*["\']?(\d{4,8})["\']?'),
        severity="high",
        min_length=4,
        max_length=8,
        description="One-Time Password/Verification Code"
    ),
    SecurityPattern(
        id="PRIVATE_KEY",
        name="Private Key",
        category="crypto",
        pattern=re.compile(r'-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----[\s\S]+?-----END (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----'),
        severity="critical",
        min_length=100,
        description="Private Key - cryptographic key exposure"
    ),
    SecurityPattern(
        id="PRIVATE_KEY_HEADER",
        name="Private Key Header",
        category="crypto",
        pattern=re.compile(r'-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----'),
        severity="critical",
        min_length=30,
        description="Private Key Header detected"
    ),
    SecurityPattern(
        id="PUBLIC_KEY",
        name="Public Key",
        category="crypto",
        pattern=re.compile(r'-----BEGIN (?:RSA |EC |DSA )?PUBLIC KEY-----'),
        severity="low",
        min_length=30,
        description="Public Key Header"
    ),
    SecurityPattern(
        id="ENCRYPTION_KEY",
        name="Encryption Key",
        category="crypto",
        pattern=re.compile(r'(?i)(?:encryption[_-]?key|encrypt[_-]?key|cipher[_-]?key)\s*[:=]\s*["\']?([A-Za-z0-9+/=]{16,})["\']?'),
        severity="critical",
        min_length=16,
        min_entropy=3.5,
        description="Encryption Key - data decryption risk"
    ),
    SecurityPattern(
        id="SIGNING_KEY",
        name="Signing Key",
        category="crypto",
        pattern=re.compile(r'(?i)(?:signing[_-]?key|sign[_-]?key|signature[_-]?key)\s*[:=]\s*["\']?([A-Za-z0-9+/=_-]{16,})["\']?'),
        severity="critical",
        min_length=16,
        min_entropy=3.5,
        description="Signing Key - signature forgery risk"
    ),
    SecurityPattern(
        id="HARDCODED_PASSWORD",
        name="Hardcoded Password",
        category="auth",
        pattern=re.compile(r'(?i)(?:password|passwd|pwd)\s*[:=]\s*["\']([^"\']{8,})["\']'),
        severity="critical",
        min_length=8,
        min_entropy=2.0,
        description="Hardcoded Password"
    ),
    SecurityPattern(
        id="HARDCODED_SECRET",
        name="Hardcoded Secret",
        category="auth",
        pattern=re.compile(r'(?i)(?:secret|secret[_-]?key)\s*[:=]\s*["\']([^"\']{8,})["\']'),
        severity="critical",
        min_length=8,
        min_entropy=2.5,
        description="Hardcoded Secret Value"
    ),
    SecurityPattern(
        id="API_KEY_GENERIC",
        name="Generic API Key",
        category="auth",
        pattern=re.compile(r'(?i)(?:api[_-]?key|apikey)\s*[:=]\s*["\']?([A-Za-z0-9_-]{20,64})["\']?'),
        severity="high",
        min_length=20,
        min_entropy=3.5,
        description="Generic API Key"
    ),
    SecurityPattern(
        id="CLIENT_SECRET",
        name="Client Secret",
        category="auth",
        pattern=re.compile(r'(?i)(?:client[_-]?secret)\s*[:=]\s*["\']?([A-Za-z0-9_-]{20,})["\']?'),
        severity="critical",
        min_length=20,
        min_entropy=3.5,
        description="OAuth Client Secret"
    ),
    SecurityPattern(
        id="AUTHORIZATION_HEADER",
        name="Authorization Header",
        category="auth",
        pattern=re.compile(r'(?i)["\']?Authorization["\']?\s*:\s*["\']([^"\']+)["\']'),
        severity="high",
        min_length=10,
        description="Authorization Header Value"
    ),
    SecurityPattern(
        id="SAML_ASSERTION",
        name="SAML Assertion",
        category="auth",
        pattern=re.compile(r'<saml[2]?:Assertion[^>]*>[\s\S]*?</saml[2]?:Assertion>'),
        severity="critical",
        min_length=100,
        description="SAML Assertion - SSO authentication"
    ),
    SecurityPattern(
        id="GITHUB_TOKEN",
        name="GitHub Token",
        category="vcs",
        pattern=re.compile(r'(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,}'),
        severity="critical",
        min_length=40,
        min_entropy=4.0,
        description="GitHub Personal Access Token"
    ),
    SecurityPattern(
        id="GITLAB_TOKEN",
        name="GitLab Token",
        category="vcs",
        pattern=re.compile(r'glpat-[A-Za-z0-9_-]{20,}'),
        severity="critical",
        min_length=26,
        min_entropy=4.0,
        description="GitLab Personal Access Token"
    ),
    SecurityPattern(
        id="BITBUCKET_TOKEN",
        name="Bitbucket Token",
        category="vcs",
        pattern=re.compile(r'(?i)(?:bitbucket[_-]?token|bb[_-]?token)\s*[:=]\s*["\']?([A-Za-z0-9_-]{20,})["\']?'),
        severity="critical",
        min_length=20,
        min_entropy=3.5,
        description="Bitbucket Access Token"
    ),
    SecurityPattern(
        id="TWILIO_API_KEY",
        name="Twilio API Key",
        category="saas",
        pattern=re.compile(r'SK[a-f0-9]{32}'),
        severity="critical",
        min_length=34,
        description="Twilio API Key"
    ),
    SecurityPattern(
        id="TWILIO_AUTH_TOKEN",
        name="Twilio Auth Token",
        category="saas",
        pattern=re.compile(r'(?i)(?:twilio[_-]?auth[_-]?token)\s*[:=]\s*["\']?([a-f0-9]{32})["\']?'),
        severity="critical",
        min_length=32,
        description="Twilio Auth Token"
    ),
    SecurityPattern(
        id="SENDGRID_API_KEY",
        name="SendGrid API Key",
        category="saas",
        pattern=re.compile(r'SG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}'),
        severity="critical",
        min_length=69,
        description="SendGrid API Key"
    ),
    SecurityPattern(
        id="MAILGUN_API_KEY",
        name="Mailgun API Key",
        category="saas",
        pattern=re.compile(r'key-[a-f0-9]{32}'),
        severity="critical",
        min_length=36,
        description="Mailgun API Key"
    ),
    SecurityPattern(
        id="SLACK_TOKEN",
        name="Slack Token",
        category="saas",
        pattern=re.compile(r'xox[baprs]-[A-Za-z0-9-]{10,}'),
        severity="critical",
        min_length=20,
        min_entropy=3.5,
        description="Slack API Token"
    ),
    SecurityPattern(
        id="SLACK_WEBHOOK",
        name="Slack Webhook URL",
        category="saas",
        pattern=re.compile(r'https://hooks\.slack\.com/services/T[A-Z0-9]+/B[A-Z0-9]+/[A-Za-z0-9]+'),
        severity="high",
        min_length=70,
        description="Slack Incoming Webhook URL"
    ),
    SecurityPattern(
        id="DISCORD_BOT_TOKEN",
        name="Discord Bot Token",
        category="saas",
        pattern=re.compile(r'[MN][A-Za-z0-9]{23,}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27}'),
        severity="critical",
        min_length=59,
        description="Discord Bot Token"
    ),
    SecurityPattern(
        id="DISCORD_WEBHOOK",
        name="Discord Webhook URL",
        category="saas",
        pattern=re.compile(r'https://discord(?:app)?\.com/api/webhooks/\d+/[A-Za-z0-9_-]+'),
        severity="high",
        min_length=80,
        description="Discord Webhook URL"
    ),
    SecurityPattern(
        id="SENTRY_DSN",
        name="Sentry DSN",
        category="saas",
        pattern=re.compile(r'https://[a-f0-9]+@[a-z0-9]+\.ingest\.sentry\.io/\d+'),
        severity="medium",
        min_length=50,
        description="Sentry Error Tracking DSN"
    ),
    SecurityPattern(
        id="NEWRELIC_LICENSE_KEY",
        name="New Relic License Key",
        category="saas",
        pattern=re.compile(r'(?i)(?:newrelic[_-]?license[_-]?key|nr[_-]?license)\s*[:=]\s*["\']?([a-f0-9]{40})["\']?'),
        severity="high",
        min_length=40,
        description="New Relic License Key"
    ),
    SecurityPattern(
        id="WEBHOOK_SECRET",
        name="Webhook Secret",
        category="auth",
        pattern=re.compile(r'(?i)(?:webhook[_-]?secret)\s*[:=]\s*["\']?([A-Za-z0-9_-]{16,})["\']?'),
        severity="high",
        min_length=16,
        min_entropy=3.0,
        description="Webhook Secret Key"
    ),
    SecurityPattern(
        id="ENV_VARIABLE",
        name="Exposed Environment Variable",
        category="config",
        pattern=re.compile(r'(?:process\.env\.)([A-Z][A-Z0-9_]+)\s*(?:\|\||&&|\?|:)\s*["\']([^"\']+)["\']'),
        severity="medium",
        min_length=5,
        description="Environment variable with fallback value"
    ),
    SecurityPattern(
        id="EMAIL_ADDRESS",
        name="Email Address",
        category="pii",
        pattern=re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'),
        severity="low",
        min_length=5,
        validator=validate_email,
        description="Email Address - PII exposure"
    ),
    SecurityPattern(
        id="PHONE_NUMBER",
        name="Phone Number",
        category="pii",
        pattern=re.compile(r'(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'),
        severity="low",
        min_length=10,
        description="Phone Number - PII exposure"
    ),
    SecurityPattern(
        id="IPV4_ADDRESS",
        name="IPv4 Address",
        category="pii",
        pattern=re.compile(r'\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b'),
        severity="low",
        min_length=7,
        validator=validate_ipv4,
        description="IPv4 Address"
    ),
    SecurityPattern(
        id="IPV6_ADDRESS",
        name="IPv6 Address",
        category="pii",
        pattern=re.compile(r'(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,7}:|(?:[0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}'),
        severity="low",
        min_length=15,
        description="IPv6 Address"
    ),
    SecurityPattern(
        id="COOKIE_VALUE",
        name="Cookie Value",
        category="auth",
        pattern=re.compile(r'(?i)(?:document\.cookie|set-cookie)\s*[:=]\s*["\']?([^"\';\s]{10,})["\']?'),
        severity="high",
        min_length=10,
        description="Cookie Value exposure"
    ),
    SecurityPattern(
        id="DOB_PATTERN",
        name="Date of Birth Pattern",
        category="pii",
        pattern=re.compile(r'(?i)(?:dob|date[_-]?of[_-]?birth|birth[_-]?date)\s*[:=]\s*["\']?(\d{1,4}[-/]\d{1,2}[-/]\d{1,4})["\']?'),
        severity="medium",
        min_length=8,
        description="Date of Birth - PII exposure"
    ),
    SecurityPattern(
        id="USERNAME_CREDENTIAL",
        name="Hardcoded Username",
        category="auth",
        pattern=re.compile(r'(?i)(?:username|user[_-]?name|user[_-]?id)\s*[:=]\s*["\']([^"\']{3,})["\']'),
        severity="medium",
        min_length=3,
        description="Hardcoded Username"
    ),
]


ENDPOINT_PATTERNS = [
    SecurityPattern(
        id="ADMIN_ENDPOINT",
        name="Admin Panel Endpoint",
        category="endpoint",
        pattern=re.compile(r'["\']/(admin|administration|dashboard|management|backend|panel|control)[a-zA-Z0-9/_-]*["\']'),
        severity="high",
        description="Admin Panel Endpoint - privileged access"
    ),
    SecurityPattern(
        id="INTERNAL_API",
        name="Internal API Endpoint",
        category="endpoint",
        pattern=re.compile(r'["\'](/(?:internal|private|debug|test|staging|dev)[a-zA-Z0-9/_-]*)["\']'),
        severity="medium",
        description="Internal/Debug API Endpoint"
    ),
    SecurityPattern(
        id="REST_ENDPOINT",
        name="REST API Endpoint",
        category="endpoint",
        pattern=re.compile(r'["\'](/api/v?\d*/[a-zA-Z0-9/_-]+)["\']'),
        severity="low",
        description="REST API Endpoint"
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
        severity="low",
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
        description="Dynamic code execution with eval() - RCE risk"
    ),
    SecurityPattern(
        id="NEW_FUNCTION",
        name="new Function() Usage",
        category="dangerous",
        pattern=re.compile(r'\bnew\s+Function\s*\([^)]+\)'),
        severity="high",
        description="Dynamic code execution with new Function() - RCE risk"
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
        description="postMessage with wildcard origin - data leakage risk"
    ),
    SecurityPattern(
        id="POSTMESSAGE_NO_ORIGIN",
        name="postMessage Without Origin Check",
        category="dangerous",
        pattern=re.compile(r'addEventListener\s*\(\s*["\']message["\'][^}]*(?!event\.origin)'),
        severity="high",
        description="postMessage handler without origin validation"
    ),
    SecurityPattern(
        id="SETTIMEOUT_STRING",
        name="setTimeout with String",
        category="dangerous",
        pattern=re.compile(r'\bsetTimeout\s*\(\s*["\'][^"\']+["\']'),
        severity="medium",
        description="setTimeout with string argument (implicit eval)"
    ),
    SecurityPattern(
        id="SETINTERVAL_STRING",
        name="setInterval with String",
        category="dangerous",
        pattern=re.compile(r'\bsetInterval\s*\(\s*["\'][^"\']+["\']'),
        severity="medium",
        description="setInterval with string argument (implicit eval)"
    ),
    SecurityPattern(
        id="INSECURE_CRYPTO",
        name="Insecure Crypto Usage",
        category="dangerous",
        pattern=re.compile(r'(?:Math\.random|crypto\.pseudoRandomBytes|md5|sha1)\s*\('),
        severity="medium",
        description="Weak/insecure cryptographic function"
    ),
    SecurityPattern(
        id="WEAK_RANDOM",
        name="Weak Random Generation",
        category="dangerous",
        pattern=re.compile(r'Math\.random\s*\(\s*\)'),
        severity="medium",
        description="Math.random() for security-sensitive operation"
    ),
    SecurityPattern(
        id="PROTOTYPE_POLLUTION",
        name="Prototype Pollution Risk",
        category="dangerous",
        pattern=re.compile(r'(?:__proto__|constructor\.prototype|Object\.assign\s*\(\s*\{\s*\}|Object\.definePropert)'),
        severity="high",
        description="Potential prototype pollution vector"
    ),
    SecurityPattern(
        id="EXPOSED_SOURCEMAP",
        name="Exposed Source Map",
        category="dangerous",
        pattern=re.compile(r'//[#@]\s*sourceMappingURL\s*=\s*[^\s]+\.map'),
        severity="medium",
        description="Source map reference - source code exposure"
    ),
]


AUTH_PATTERNS = [
    SecurityPattern(
        id="JWT_LOCALSTORAGE",
        name="JWT in localStorage",
        category="auth_issue",
        pattern=re.compile(r'localStorage\.(?:setItem|getItem)\s*\([^)]*(?:token|jwt|auth)[^)]*\)'),
        severity="high",
        description="JWT stored in localStorage - XSS theft risk"
    ),
    SecurityPattern(
        id="JWT_SESSIONSTORAGE",
        name="JWT in sessionStorage",
        category="auth_issue",
        pattern=re.compile(r'sessionStorage\.(?:setItem|getItem)\s*\([^)]*(?:token|jwt|auth)[^)]*\)'),
        severity="medium",
        description="JWT stored in sessionStorage"
    ),
    SecurityPattern(
        id="HARDCODED_ADMIN_FLAG",
        name="Hardcoded Admin Flag",
        category="auth_issue",
        pattern=re.compile(r'(?i)(?:isAdmin|is[_-]?admin|admin[_-]?flag)\s*[:=]\s*(?:true|1|["\']true["\'])'),
        severity="high",
        description="Hardcoded admin privilege flag"
    ),
    SecurityPattern(
        id="HARDCODED_STAFF_FLAG",
        name="Hardcoded Staff Flag",
        category="auth_issue",
        pattern=re.compile(r'(?i)(?:isStaff|is[_-]?staff|staff[_-]?flag)\s*[:=]\s*(?:true|1|["\']true["\'])'),
        severity="high",
        description="Hardcoded staff privilege flag"
    ),
    SecurityPattern(
        id="HARDCODED_AUTH_FLAG",
        name="Hardcoded Auth Flag",
        category="auth_issue",
        pattern=re.compile(r'(?i)(?:isAuthenticated|isLoggedIn|hasAccess|authenticated)\s*[:=]\s*(?:true|1)'),
        severity="high",
        description="Hardcoded authentication flag"
    ),
    SecurityPattern(
        id="BYPASS_AUTH",
        name="Auth Bypass Pattern",
        category="auth_issue",
        pattern=re.compile(r'(?i)(?:skip|bypass|disable)[_-]?(?:auth|login|verification|mfa|2fa)'),
        severity="critical",
        description="Potential authentication bypass flag"
    ),
    SecurityPattern(
        id="CLIENT_SIDE_AUTH",
        name="Client-Side Auth Check",
        category="auth_issue",
        pattern=re.compile(r'(?i)if\s*\(\s*(?:user\.role|userRole|currentUser\.admin)\s*(?:===?|!==?)\s*["\'](?:admin|superuser)["\']'),
        severity="high",
        description="Client-side role/auth check - bypassable"
    ),
    SecurityPattern(
        id="DEBUG_FLAG",
        name="Debug Flag Enabled",
        category="auth_issue",
        pattern=re.compile(r'(?i)(?:debug|debug[_-]?mode|is[_-]?debug)\s*[:=]\s*(?:true|1|["\']true["\'])'),
        severity="medium",
        description="Debug mode enabled"
    ),
    SecurityPattern(
        id="FEATURE_FLAG",
        name="Feature Flag",
        category="auth_issue",
        pattern=re.compile(r'(?i)(?:feature[_-]?flag|ff[_-])[A-Za-z0-9_]+\s*[:=]\s*(?:true|false|1|0)'),
        severity="low",
        description="Feature flag configuration"
    ),
]
