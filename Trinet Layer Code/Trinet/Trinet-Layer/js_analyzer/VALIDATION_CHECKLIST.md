# JS Analyzer Validation Checklist

## Overview
This checklist ensures every JavaScript file analyzed produces **valid, actionable security findings**. Use this to verify scan results before reporting to users.

---

## Pre-Scan Validation

### Domain Input Validation
- [ ] Domain format is valid (e.g., `example.com`, `*.example.com`)
- [ ] URL protocols are stripped correctly
- [ ] Wildcard domains are handled properly
- [ ] Domain length does not exceed 253 characters

### Configuration Checks
- [ ] Mode selection is valid (`fast` or `pro`)
- [ ] `skip_vendor` setting is respected
- [ ] `include_subdomains` only works in PRO mode
- [ ] Scope include/exclude filters are applied correctly

---

## Discovery Phase Validation

### Wayback Machine Discovery
- [ ] CDX API query returns HTTP 200
- [ ] JSON response is valid and parseable
- [ ] Digest deduplication removes duplicate files
- [ ] Only `.js` files are included
- [ ] Vendor files are skipped when `skip_vendor=true`
- [ ] Maximum file limit is enforced (default: 200)
- [ ] Timeout handling does not crash scan

### Live Crawl Discovery
- [ ] HTTPS and HTTP variants are tried
- [ ] Script tags are extracted from HTML correctly
- [ ] Relative URLs are resolved to absolute
- [ ] `//` protocol-relative URLs are handled
- [ ] BeautifulSoup fallback parsing works
- [ ] Crawl respects MAX_PAGES limit (default: 20)
- [ ] Connection limits prevent resource exhaustion

### Subdomain Enumeration (PRO Mode)
- [ ] Certificate Transparency (crt.sh) is queried
- [ ] DNS bruteforce uses safe wordlist
- [ ] Alive checking validates subdomain accessibility
- [ ] Maximum 50 subdomains are processed

---

## Preprocessing Validation

### File Fetching
- [ ] HTTP 200 status required for processing
- [ ] File size limit enforced (5MB default)
- [ ] Content-type validation is performed
- [ ] Timeout prevents hanging on slow servers

### Content Processing
- [ ] Beautification improves readability
- [ ] Deobfuscation decodes hex/unicode escapes
- [ ] Heavily obfuscated code is detected (entropy > 5.5)
- [ ] Processing errors don't crash the scan

---

## Analysis Engine Validation

### Pattern Matching Accuracy

#### Secret Detection
| Pattern | Validation Criteria |
|---------|---------------------|
| AWS_ACCESS_KEY | Starts with `AKIA/A3T/AGPA`, 20 chars, high entropy |
| AWS_SECRET_KEY | 40 chars, entropy > 4.5 |
| GCP_API_KEY | Starts with `AIza`, 39 chars |
| STRIPE_KEY | Starts with `sk_live/pk_live/sk_test/pk_test` |
| JWT_TOKEN | 3 parts separated by `.`, each part > 10 chars |
| GITHUB_TOKEN | Starts with `ghp_/gho_/ghu_/ghs_/ghr_` |
| PRIVATE_KEY | Contains `-----BEGIN PRIVATE KEY-----` |

#### Endpoint Detection
| Pattern | Validation Criteria |
|---------|---------------------|
| REST_ENDPOINT | Matches `/api/v*/path` format |
| INTERNAL_PATH | Contains `/admin/`, `/internal/`, `/private/` |
| GRAPHQL_ENDPOINT | Contains `graphql` or `gql` |
| INTERNAL_URL | Points to localhost, 127.0.0.1, or private IPs |

#### Dangerous Patterns
| Pattern | Validation Criteria |
|---------|---------------------|
| EVAL_USAGE | `eval(` with content |
| NEW_FUNCTION | `new Function(` with content |
| INNERHTML | `.innerHTML =` assignment |
| INSECURE_POSTMESSAGE | `.postMessage(` with `'*'` origin |

#### Auth Issues
| Pattern | Validation Criteria |
|---------|---------------------|
| JWT_LOCALSTORAGE | localStorage with token/jwt/auth |
| MISSING_ORIGIN_CHECK | postMessage without origin validation |
| HARDCODED_AUTH_FLAG | `isAdmin = true` patterns |

### Confidence Scoring
- [ ] Base confidence starts at 0.5
- [ ] Length validation adds/removes 0.05-0.1
- [ ] Entropy validation adds 0.2 (if passes) or removes 0.2
- [ ] Prefix matching adds 0.1
- [ ] Custom validator adds 0.15 (if passes)
- [ ] Minimum confidence threshold (0.5) filters low-quality findings

### Deduplication
- [ ] Same values in different files are deduplicated
- [ ] Findings are sorted by severity then confidence

---

## Output Validation

### Finding Structure
Each finding must contain:
- [ ] `rule_id` - Unique pattern identifier
- [ ] `rule_name` - Human-readable name
- [ ] `category` - cloud/payment/auth/vcs/crypto/endpoint/dangerous/auth_issue
- [ ] `severity` - critical/high/medium/low/info
- [ ] `masked_value` - Partially redacted sensitive value
- [ ] `line_number` - Correct line in source file
- [ ] `confidence` - Float between 0.0 and 1.0
- [ ] `file_url` - Source JS file URL
- [ ] `description` - Pattern description
- [ ] `security_tag` - SECRET_EXPOSURE/AUTH_RISK/POSSIBLE_XSS/POSSIBLE_IDOR
- [ ] `risk_score` - Calculated risk (0.0 to 1.0)

### Summary Counts
- [ ] `total_findings` = sum of all severity counts
- [ ] `critical` count matches critical findings
- [ ] `high` count matches high findings
- [ ] `medium` count matches medium findings
- [ ] `low` count matches low findings
- [ ] `info` count matches info findings
- [ ] `secrets_found` = cloud + payment + auth + vcs + crypto categories
- [ ] `endpoints_found` = endpoint category count
- [ ] `dangerous_patterns` = dangerous category count
- [ ] `auth_issues` = auth_issue category count

### Response Metadata
- [ ] `scan_id` is unique UUID
- [ ] `domain` is normalized
- [ ] `mode` matches request (fast/pro)
- [ ] `status` is "completed" on success
- [ ] `js_files_analyzed` is accurate
- [ ] `subdomains_checked` > 0 only in PRO mode with subdomain option
- [ ] `execution_time_seconds` is reasonable

---

## False Positive Prevention

### Common False Positives to Avoid
| Pattern | False Positive | Prevention |
|---------|----------------|------------|
| API_KEY_GENERIC | UUID identifiers | Entropy check (> 3.5) |
| JWT_TOKEN | Base64 image data | 3-part structure validation |
| HARDCODED_PASSWORD | Variable names | Minimum 8 char value |
| INNERHTML | Safe static content | Context awareness |
| REST_ENDPOINT | Static file paths | API path pattern matching |

### Entropy Thresholds
- AWS keys: 3.5 minimum
- Generic API keys: 3.5 minimum
- Passwords: 2.5 minimum
- Payment keys: 4.0 minimum

---

## Error Handling

### Expected Error Scenarios
- [ ] Network timeout → Return partial results with error flag
- [ ] Invalid domain → Return 400 with error message
- [ ] Rate limiting → Respect Wayback/target limits
- [ ] Parse errors → Log and continue with other files
- [ ] Memory limits → Enforce max file size

### Error Response Format
```json
{
  "detail": "Human-readable error message"
}
```

---

## Performance Benchmarks

### FAST Mode
- Target execution: < 60 seconds
- Max JS files: 150
- No subdomain enumeration
- Basic beautification only

### PRO Mode
- Target execution: < 180 seconds
- Max JS files: 150
- Up to 50 subdomains
- Full deobfuscation

---

## Integration Testing Checklist

### API Endpoint Tests
```bash
# Health check
curl -X GET "http://localhost:8000/api/js-analyzer/health"

# Fast mode scan
curl -X POST "http://localhost:8000/api/js-analyzer/scan" \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com", "mode": "fast"}'

# PRO mode with subdomains
curl -X POST "http://localhost:8000/api/js-analyzer/scan" \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com", "mode": "pro", "include_subdomains": true}'

# With scope filters
curl -X POST "http://localhost:8000/api/js-analyzer/scan" \
  -H "Content-Type: application/json" \
  -d '{"domain": "example.com", "mode": "fast", "scope_include": ["api", "app"]}'
```

### Verification Steps
1. Run scan against known test domain
2. Verify JS files are discovered (> 0 if domain has JS)
3. Check findings are properly structured
4. Validate summary counts match findings
5. Confirm execution time is within limits
6. Test error handling with invalid inputs

---

## Maintenance Notes

### Pattern Updates
- Review OWASP/NVD for new secret patterns quarterly
- Update vendor detection list as frameworks evolve
- Adjust entropy thresholds based on false positive rates

### Performance Tuning
- Monitor Wayback API rate limits
- Adjust concurrent request limits based on load
- Review timeout values for reliability

---

*Last Updated: January 2026*
*Version: 1.0.0*
