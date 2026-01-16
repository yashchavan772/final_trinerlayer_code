import asyncio
import dns.resolver
import dns.exception
import logging
from typing import Set, Dict, Any
from concurrent.futures import ThreadPoolExecutor

logger = logging.getLogger(__name__)

SAFE_WORDLIST = [
    "2024", "2025", "2026", "about", "account", "accounts", "admin", "admin-api", 
    "administrator", "admins", "ads", "ads-api", "affiliate", "affiliates", "ai", "alert", 
    "alerts", "alpha", "analytics", "android", "antimalware", "antivirus", "api", "api-v1", 
    "api-v2", "api-v3", "api-v4", "app", "application", "applications", "apps", "archive", 
    "assets", "assistant", "audit", "audits", "auth", "authentication", "authorization", "authorize", 
    "aws", "azure", "backend", "backup", "backup-old", "backups", "balance", "balances", 
    "basket", "beta", "bill", "billing", "bitbucket", "blob", "blobs", "blog", 
    "blogs", "bot", "bots", "bucket", "buckets", "build", "builds", "cache", 
    "caching", "campaign", "campaigns", "canary", "careers", "cart", "case", "cases", 
    "catalog", "catalogue", "ccpa", "cd", "cdn", "cdn1", "cdn2", "chat", 
    "chat-ai", "chatbot", "checkout", "ci", "client", "clients", "cloud", "cluster", 
    "clusters", "community", "compliance", "config", "configs", "configuration", "confluence", "console", 
    "contact", "container", "containers", "content", "control", "controlpanel", "copilot", "credentials", 
    "credit", "creds", "crm", "cron", "customer", "customers", "dash", "dashboard", 
    "data", "database", "databases", "dataset", "datasets", "db", "debit", "delivery", 
    "demo", "demo1", "demo2", "demo3", "deprecated", "desktop", "dev", "dev1", 
    "dev2", "dev3", "development", "digitalocean", "docker", "docs", "documentation", "download", 
    "downloads", "dr", "e-commerce", "ecommerce", "edge", "edge-api", "email", "employee", 
    "employees", "env", "environment", "events", "experiment", "experiments", "external", "failover", 
    "feature", "features", "file", "files", "finance", "fintech", "firewall", "forum", 
    "forums", "frontend", "ftp", "fulfillment", "gateway", "gcp", "gdpr", "git", 
    "github", "gitlab", "graphql", "gst", "health", "healthcheck", "help", "helpdesk", 
    "hidden", "hiring", "hooks", "hr", "iam", "ibmcloud", "identity", "ids", 
    "image", "images", "imap", "img", "incident", "incidents", "inference", "infra", 
    "infrastructure", "insights", "intern", "internal", "internal-ai", "internal-api", "interns", "inventory", 
    "invoice", "invoices", "ios", "ips", "ir", "iso", "jenkins", "jira", 
    "jira-api", "jira-dev", "jira-prod", "jira-test", "job", "jobs", "k8s", "kb", 
    "keys", "keyvault", "knowledgebase", "kubernetes", "lab", "labs", "labs-ai", "lb", 
    "legacy", "legal", "linode", "llm", "loadbalancer", "log", "logging", "login", 
    "logout", "logs", "m", "mail", "mailer", "maintenance", "maintenance-api", "manage", 
    "management", "manager", "marketing", "media", "member", "members", "memcache", "memcached", 
    "message", "messages", "metrics", "ml", "mms", "mobile", "model", "models", 
    "mongo", "mongodb", "monitor", "monitoring", "mysql", "news", "newsletter", "node", 
    "nodes", "notification", "notifications", "notify", "oauth", "oauth2", "object", "objects", 
    "old", "openid", "operations", "ops", "oracle", "orchestrator", "order", "order-api", 
    "orders", "panel", "parameters", "params", "partner", "partners", "pay", "payment", 
    "payment-api", "payments", "payout", "payouts", "pci", "people", "pipeline", "pipelines", 
    "pixel", "plans", "platform", "platforms", "policies", "policy", "pop", "portal", 
    "portals", "postgres", "postgresql", "predict", "prediction", "pre-prod", "preprod", "press", 
    "preview", "price", "pricing", "privacy", "private", "private-api", "prod", "product", 
    "production", "products", "profile", "profiles", "proxy", "public", "push", "push-api", 
    "qa", "queue", "queues", "recovery", "redis", "refund", "refunds", "register", 
    "remote", "research", "reseller", "resellers", "response", "rest", "restore", "revenue", 
    "reverse-proxy", "risk", "root", "rpc", "runner", "s3", "sales", "sandbox", 
    "scan", "scanner", "scheduler", "secret", "secrets", "secure", "security", "service", 
    "services", "settings", "shadow", "shipment", "shipping", "shop", "siem", "signal", 
    "signin", "signup", "sms", "smtp", "soap", "soc", "sox", "sql", 
    "sso", "staff", "stage", "staging", "static", "statistics", "stats", "status", 
    "statuspage", "stock", "storage", "store", "stores", "subscription", "subscriptions", "superadmin", 
    "superuser", "support", "support-portal", "sys", "system", "systems", "tablet", "task", 
    "tasks", "tax", "taxes", "team", "teams", "telegram", "temp", "temporary", 
    "terms", "test", "test1", "test2", "test3", "test-ai", "testing", "thor", 
    "ticket", "tickets", "tmp", "tracker", "tracking", "training", "transaction", "transactions", 
    "uat", "upload", "uploads", "uptime", "user", "users", "v1", "v2", 
    "v3", "v4", "vat", "vault", "vendor", "vendors", "vpn", "waf", 
    "wallet", "wallets", "warehouse", "web", "webapp", "webhook", "webhooks", "webmail", 
    "whatsapp", "wiki", "worker", "workers", "www"
]

DNS_TIMEOUT = 2
MAX_CONCURRENT_DNS = 50


def resolve_subdomain(subdomain: str) -> tuple:
    """
    Resolve a subdomain via DNS.
    
    Args:
        subdomain: Full subdomain (e.g., "api.example.com")
    
    Returns:
        Tuple of (subdomain, is_valid, record_type)
    """
    resolver = dns.resolver.Resolver()
    resolver.timeout = DNS_TIMEOUT
    resolver.lifetime = DNS_TIMEOUT
    
    for record_type in ['A', 'CNAME']:
        try:
            answers = resolver.resolve(subdomain, record_type)
            if answers:
                return (subdomain, True, record_type)
        except dns.resolver.NXDOMAIN:
            pass
        except dns.resolver.NoAnswer:
            pass
        except dns.resolver.NoNameservers:
            pass
        except dns.exception.Timeout:
            pass
        except Exception:
            pass
    
    return (subdomain, False, None)


async def dns_bruteforce(domain: str) -> Dict[str, Any]:
    """
    Perform controlled DNS brute force enumeration using a safe wordlist.
    
    This uses a minimal, non-intrusive wordlist to discover common subdomains.
    
    Args:
        domain: Target domain
    
    Returns:
        Dict with discovered subdomains and their sources
    """
    results = {}
    subdomains_to_check = [f"{word}.{domain}" for word in SAFE_WORDLIST]
    
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor(max_workers=MAX_CONCURRENT_DNS) as executor:
        futures = [
            loop.run_in_executor(executor, resolve_subdomain, subdomain)
            for subdomain in subdomains_to_check
        ]
        
        completed = await asyncio.gather(*futures, return_exceptions=True)
        
        for result in completed:
            if isinstance(result, Exception):
                continue
            subdomain, is_valid, record_type = result
            if is_valid:
                results[subdomain] = {
                    "sources": ["bruteforce"],
                    "dns_record_type": record_type
                }
    
    logger.info(f"DNS bruteforce found {len(results)} subdomains for {domain}")
    return results


async def validate_dns(subdomains: Set[str]) -> Dict[str, bool]:
    """
    Validate DNS resolution for a set of subdomains.
    
    Args:
        subdomains: Set of subdomains to validate
    
    Returns:
        Dict mapping subdomain to DNS validity
    """
    results = {}
    
    loop = asyncio.get_event_loop()
    with ThreadPoolExecutor(max_workers=MAX_CONCURRENT_DNS) as executor:
        futures = [
            loop.run_in_executor(executor, resolve_subdomain, subdomain)
            for subdomain in subdomains
        ]
        
        completed = await asyncio.gather(*futures, return_exceptions=True)
        
        for result in completed:
            if isinstance(result, Exception):
                continue
            subdomain, is_valid, _ = result
            results[subdomain] = is_valid
    
    return results
