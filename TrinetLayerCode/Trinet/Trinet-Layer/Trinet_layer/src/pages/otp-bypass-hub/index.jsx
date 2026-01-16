import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/navigation/Sidebar';
import Breadcrumb from '../../components/navigation/Breadcrumb';
import GlobalSearch from '../../components/navigation/GlobalSearch';
import LearningHero from './components/LearningHero';
import LevelSelector from './components/LevelSelector';
import TopicNav from './components/TopicNav';
import ContentSection from './components/ContentSection';
import ChecklistSection from './components/ChecklistSection';
import CommonMistakes from './components/CommonMistakes';
import Disclaimer from './components/Disclaimer';
import Icon from '../../components/AppIcon';
import { Logo } from '../../components/shared';

const OTPBypassLearningHub = () => {
  const [activeLevel, setActiveLevel] = useState('beginner');
  const [activeSection, setActiveSection] = useState('intro');
  const [checkedItems, setCheckedItems] = useState({});

  const levels = [
    { id: 'beginner', label: 'Beginner', icon: 'BookOpen', color: 'var(--color-accent-green)' },
    { id: 'hunter', label: 'Hunter', icon: 'Target', color: 'var(--color-accent)' },
    { id: 'elite', label: 'Elite', icon: 'Zap', color: 'var(--color-accent-red)' }
  ];

  const content = {
    beginner: {
      id: 'beginner',
      title: 'OTP Basics',
      sections: [
        {
          id: 'intro',
          title: 'What is OTP?',
          icon: 'Info',
          content: {
            description: 'One-Time Password (OTP) is a unique code valid for a single login session or transaction. Unlike static passwords, OTPs expire after use or time, adding an extra security layer to authentication flows.',
            keyPoints: [
              'Temporary access codes sent via SMS, email, or authenticator apps',
              'Typically 4-6 digits numeric codes with short validity (30s-10min)',
              'Used for login verification, password reset, and transaction confirmation',
              'Part of Two-Factor Authentication (2FA) or Multi-Factor Authentication (MFA)'
            ],
            visualExample: 'User Login → Enter Password → Request OTP → Receive Code (e.g., 123456) → Verify OTP → Access Granted'
          }
        },
        {
          id: 'flow',
          title: 'How OTP Flow Works',
          icon: 'GitBranch',
          content: {
            description: 'Understanding the OTP authentication flow is crucial for identifying potential bypass points in the security chain.',
            steps: [
              {
                step: 1,
                title: 'User Initiates Action',
                detail: 'User attempts login, password reset, or sensitive transaction requiring additional verification'
              },
              {
                step: 2,
                title: 'OTP Generation',
                detail: 'Server generates unique random code and stores it with user identifier and expiration timestamp'
              },
              {
                step: 3,
                title: 'OTP Delivery',
                detail: 'Code sent to user\'s registered phone (SMS), email, or generated in authenticator app'
              },
              {
                step: 4,
                title: 'User Submission',
                detail: 'User enters received OTP code into application within validity window'
              },
              {
                step: 5,
                title: 'Server Validation',
                detail: 'Server verifies code matches stored value, hasn\'t expired, and hasn\'t been used before'
              },
              {
                step: 6,
                title: 'Access Granted/Denied',
                detail: 'Successful verification grants access; failed attempts may trigger lockout after threshold'
              }
            ],
            codeExample: '// Backend OTP Generation (Node.js)\nconst generateOTP = () => {\n  const code = Math.floor(100000 + Math.random() * 900000);\n  const expiresAt = Date.now() + (5 * 60 * 1000); // 5 minutes\n  \n  return {\n    code: code.toString(),\n    expiresAt,\n    used: false,\n    attempts: 0\n  };\n};'
          }
        },
        {
          id: 'checks',
          title: 'Beginner Security Checks',
          icon: 'CheckCircle',
          content: {
            description: 'These fundamental security checks should be present in every OTP implementation. Their absence indicates serious vulnerabilities.',
            checks: [
              {
                check: 'Does OTP expire?',
                details: 'Test if OTP remains valid indefinitely. Proper implementation: expires in 5-10 minutes.',
                testMethod: 'Request OTP, wait 15+ minutes, try using expired code',
                vulnerable: 'Code works after hours/days',
                secure: 'Code rejected as expired after timeout'
              },
              {
                check: 'Is OTP reusable?',
                details: 'Verify if same OTP can be used multiple times. Should be single-use only.',
                testMethod: 'Complete successful login with OTP, logout, try same code again',
                vulnerable: 'Same code works multiple times',
                secure: 'Code marked as used, rejected on second attempt'
              },
              {
                check: 'Unlimited attempts allowed?',
                details: 'Check for brute-force protection via rate limiting or attempt caps.',
                testMethod: 'Try incorrect OTP codes 10+ times rapidly',
                vulnerable: 'No lockout, can try infinite codes',
                secure: 'Account locked or CAPTCHA after 3-5 failed attempts'
              },
              {
                check: 'Resend limit exists?',
                details: 'Verify if OTP can be requested unlimited times, enabling enumeration.',
                testMethod: 'Click "Resend OTP" 20+ times in quick succession',
                vulnerable: 'Unlimited resends, potential DoS or SMS bombing',
                secure: 'Rate limited (e.g., 3 resends per 10 minutes)'
              }
            ]
          }
        }
      ]
    },
    hunter: {
      id: 'hunter',
      title: 'Real Bug Patterns',
      sections: [
        {
          id: 'logic',
          title: 'Logic Flaws',
          icon: 'Brain',
          content: {
            description: 'Common authentication logic flaws that allow OTP bypass through design weaknesses rather than technical exploits.',
            patterns: [
              {
                pattern: 'OTP Reusable After Success',
                vulnerability: 'OTP remains valid even after successful authentication',
                impact: 'Critical - Enables replay attacks and session hijacking',
                exploitation: 'User logs in with OTP → OTP should be invalidated → Attacker can reuse same OTP if still valid',
                realCase: 'Banking app allowed reusing OTP within 10-minute window after successful transaction',
                code: '// Vulnerable: No invalidation after use\nif (otpCode === storedOTP && !isExpired(storedOTP)) {\n  return authenticateUser();\n}\n\n// Secure: Mark as used\nif (otpCode === storedOTP && !isExpired(storedOTP) && !storedOTP.used) {\n  storedOTP.used = true;\n  return authenticateUser();\n}'
              },
              {
                pattern: 'OTP Not Invalidated on Logout',
                vulnerability: 'Active OTP codes persist after user logs out',
                impact: 'High - Leaked OTP usable by attacker after user exits',
                exploitation: 'User requests OTP for login → Logs out → OTP still works for attacker',
                realCase: 'E-commerce platform\'s logout didn\'t clear pending OTP codes',
                code: '// Secure logout flow\nfunction logout(userId) {\n  // Clear session\n  destroySession(userId);\n  \n  // Invalidate any pending OTPs\n  invalidateAllOTPs(userId);\n  \n  return { success: true };\n}'
              },
              {
                pattern: 'OTP Verified Only on Frontend',
                vulnerability: 'OTP validation performed client-side without server verification',
                impact: 'Critical - Complete authentication bypass via DevTools',
                exploitation: 'Inspect network requests → Modify response to show OTP verified → Backend trusts frontend',
                realCase: 'SaaS dashboard validated OTP in JavaScript, sent "verified: true" to backend',
                code: '// Vulnerable: Frontend-only validation\n// Client code\nif (userOTP === displayedOTP) {\n  api.post(\'/login\', { verified: true });\n}\n\n// Secure: Always verify server-side\napi.post(\'/verify-otp\', { code: userOTP })\n  .then(response => {\n    if (response.verified) {\n      proceedToLogin();\n    }\n  });'
              },
              {
                pattern: 'OTP Step Skipped Entirely',
                vulnerability: 'Application allows skipping OTP verification step in flow',
                impact: 'Critical - Complete MFA bypass',
                exploitation: 'Navigate directly to post-OTP URL or manipulate state to skip verification',
                realCase: 'Payment gateway allowed accessing /dashboard directly, bypassing /verify-otp screen',
                code: '// Secure flow enforcement\napp.get(\'/dashboard\', requireAuth, requireOTPVerified, (req, res) => {\n  if (!req.session.otpVerified) {\n    return res.redirect(\'/verify-otp\');\n  }\n  res.render(\'dashboard\');\n});'
              }
            ]
          }
        },
        {
          id: 'manipulation',
          title: 'Request Manipulation',
          icon: 'Edit',
          content: {
            description: 'Techniques to manipulate HTTP requests and parameters to bypass OTP validation mechanisms.',
            techniques: [
              {
                technique: 'Remove OTP Parameter',
                description: 'Delete OTP field entirely from request to see if backend assumes validation passed',
                payload: '// Original request\nPOST /api/verify\n{\n  "email": "user@example.com",\n  "otp": "123456"\n}\n\n// Modified request\nPOST /api/verify\n{\n  "email": "user@example.com"\n}',
                successIndicator: 'Login succeeds without OTP verification',
                huntingTip: 'Test on password reset, email change, and 2FA enrollment endpoints'
              },
              {
                technique: 'Change User/Session Context',
                description: 'Replace user identifier or session token while keeping valid OTP from another account',
                payload: '// Generate OTP for your account\nPOST /api/request-otp\n{\n  "email": "attacker@example.com"\n}\nResponse: OTP sent\n\n// Verify with victim\'s email\nPOST /api/verify-otp\n{\n  "email": "victim@example.com",\n  "otp": "123456" // Your valid OTP\n}',
                successIndicator: 'OTP generated for Account A works for Account B',
                huntingTip: 'Test if OTP is bound to user session or just stored globally'
              },
              {
                technique: 'Null/Empty OTP Value',
                description: 'Submit null, empty string, or whitespace to trigger improper validation handling',
                payload: 'POST /api/verify\n{\n  "otp": null\n}\n\nPOST /api/verify\n{\n  "otp": ""\n}\n\nPOST /api/verify\n{\n  "otp": "      "\n}',
                successIndicator: 'Validation bypassed due to null/empty check failure',
                huntingTip: 'Try with different data types: null, undefined, [], {}, false'
              },
              {
                technique: 'Array/Object Injection',
                description: 'Send OTP as array or object instead of string to confuse backend validation',
                payload: 'POST /api/verify\n{\n  "otp": ["123456"]\n}\n\nPOST /api/verify\n{\n  "otp": {"code": "123456"}\n}\n\nPOST /api/verify\n{\n  "otp": [null]\n}',
                successIndicator: 'Type confusion causes validation to pass incorrectly',
                huntingTip: 'Weak typed languages (PHP, JavaScript) more vulnerable to this'
              }
            ]
          }
        },
        {
          id: 'testing',
          title: 'Web vs API OTP Testing',
          icon: 'Globe',
          content: {
            description: 'Different attack surfaces exist between web interfaces and mobile/API endpoints. Testing both is crucial.',
            comparison: [
              {
                aspect: 'Web Application',
                characteristics: 'Browser-based, uses sessions/cookies, often has CSRF protection',
                vulnerabilities: 'Frontend validation, cookie manipulation, session fixation',
                testingFocus: 'Inspect client-side code, test cookie scope, check CSRF tokens',
                tools: 'Browser DevTools, Burp Suite, Cookie Editor extensions'
              },
              {
                aspect: 'Mobile API',
                characteristics: 'Token-based auth (JWT/Bearer), direct HTTP requests, may lack rate limiting',
                vulnerabilities: 'Token binding issues, missing rate limits, verbose errors exposing OTP',
                testingFocus: 'Intercept mobile traffic, test API directly, check response headers',
                tools: 'Burp Suite Mobile Assistant, Charles Proxy, Postman, mitmproxy'
              }
            ],
            practicalTest: '// Test both surfaces\n// 1. Web request\nPOST /web/verify-otp HTTP/1.1\nCookie: session=abc123\nContent-Type: application/x-www-form-urlencoded\n\notp=123456\n\n// 2. API request\nPOST /api/v1/verify-otp HTTP/1.1\nAuthorization: Bearer eyJhbGc...\nContent-Type: application/json\n\n{"otp":"123456"}',
            keyDifference: 'Same backend vulnerability may be protected on web but exposed on API due to different validation layers'
          }
        }
      ]
    },
    elite: {
      id: 'elite',
      title: 'Advanced & Rare OTP Bypass',
      sections: [
        {
          id: 'advanced',
          title: 'Advanced Bypass Techniques',
          icon: 'Skull',
          content: {
            description: 'Sophisticated OTP bypass methods requiring deep understanding of authentication systems and timing attacks.',
            techniques: [
              {
                name: 'OTP Not Bound to User/Session',
                severity: 'Critical',
                description: 'Most dangerous flaw: OTP generated for one user works for any user because it\'s not session-specific',
                exploitation: 'Request OTP for Account A → Use that OTP to verify Account B → Full account takeover',
                detection: 'Create two accounts, generate OTP for Account 1, try using it on Account 2',
                realCase: 'Major fintech app stored OTP globally by phone number, not user ID',
                technicalDetail: '// Vulnerable: OTP stored by phone only\nredis.set(`otp:${phoneNumber}`, code);\n\n// Secure: Bind to session\nredis.set(`otp:${userId}:${sessionId}`, code);',
                impact: 'Account takeover at scale, bypass all MFA protections'
              },
              {
                name: 'OTP Usable Across Accounts',
                severity: 'Critical',
                description: 'Single OTP code can authenticate multiple different accounts simultaneously',
                exploitation: 'Generate OTP for attacker@example.com → Use same OTP for victim@example.com',
                detection: 'Two accounts with same phone → Generate OTP on Account 1 → Verify on Account 2',
                realCase: 'Social media platform allowed shared phone number OTPs across accounts',
                technicalDetail: 'Occurs when OTP validation only checks if code exists, not ownership:\nif (otpExists(code)) { authenticate(); }',
                impact: 'Horizontal privilege escalation, access any account with shared contact info'
              },
              {
                name: 'OTP Valid After Password Change',
                severity: 'High',
                description: 'Password reset flow generates OTP, but changing password doesn\'t invalidate it',
                exploitation: 'Initiate password reset → Get OTP → Change password → Old OTP still works',
                detection: 'Request password reset OTP → Complete reset → Try using old OTP code',
                realCase: 'Banking app\'s password reset OTP remained valid for 10 minutes after new password set',
                technicalDetail: '// Secure password change\nfunction changePassword(userId, newPassword) {\n  updatePassword(userId, newPassword);\n  invalidateAllOTPs(userId);\n  clearAllSessions(userId);\n}',
                impact: 'Account takeover if attacker intercepts OTP before victim changes password'
              },
              {
                name: 'OTP Valid Across Devices',
                severity: 'High',
                description: 'OTP generated on Device A can be used on Device B without additional verification',
                exploitation: 'Victim requests OTP on phone → Attacker uses intercepted OTP on different device',
                detection: 'Generate OTP on mobile app → Try verifying on desktop browser',
                realCase: 'Cryptocurrency exchange allowed OTP from mobile app to work on web',
                technicalDetail: 'Missing device fingerprinting or IP validation:\nif (!matchesRequestingDevice(otp)) { reject(); }',
                impact: 'Bypasses device-based security controls, enables remote attacks'
              }
            ]
          }
        },
        {
          id: 'race',
          title: 'Race Conditions & Timing',
          icon: 'Clock',
          content: {
            description: 'Exploiting timing vulnerabilities and race conditions in OTP validation logic through concurrent requests.',
            attacks: [
              {
                attack: 'OTP Race Conditions',
                concept: 'Send multiple OTP verification requests simultaneously before validation logic can mark code as used',
                implementation: 'import asyncio\nimport aiohttp\n\nasync def verify_otp(session, otp_code):\n    async with session.post(\n        \'https://api.target.com/verify\',\n        json={\'otp\': otp_code}\n    ) as response:\n        return await response.json()\n\nasync def race_condition_attack(otp_code):\n    async with aiohttp.ClientSession() as session:\n        # Send 100 concurrent requests\n        tasks = [verify_otp(session, otp_code) for _ in range(100)]\n        results = await asyncio.gather(*tasks)\n        \n        successful = sum(1 for r in results if r.get(\'success\'))\n        print(f\'Successful verifications: {successful}\')\n\nasyncio.run(race_condition_attack(\'123456\'))',
                vulnerability: 'Database transaction isolation not properly configured, allowing multiple verifications before "used" flag is set',
                mitigation: 'Use database locks or atomic operations:\nDB.transaction do\n  otp = OTP.lock.find_by(code: code)\n  if otp && !otp.used\n    otp.update!(used: true)\n    authenticate\n  end\nend',
                successIndicator: 'Multiple requests succeed with same OTP due to race window'
              },
              {
                attack: 'Resend Returns Same Code',
                concept: 'Clicking "Resend OTP" regenerates but server returns identical code, extending its lifetime infinitely',
                implementation: '# Test resend behavior\nfor i in range(1, 11):\n    response = requests.post(\'/api/request-otp\', json={\'email\': email})\n    new_otp = extract_otp_from_email()  # From email/SMS\n    print(f\'Attempt {i}: OTP = {new_otp}\')\n    time.sleep(2)\n\n# If all OTPs are identical, vulnerability exists',
                vulnerability: 'Backend caches OTP and returns same code on resend instead of generating new one',
                mitigation: 'Always generate fresh OTP on resend:\ndef resend_otp(user):\n    invalidate_previous_otp(user)\n    new_otp = generate_fresh_otp()\n    store_otp(user, new_otp)\n    send_otp(user, new_otp)',
                successIndicator: 'Same OTP code returned on every resend request'
              },
              {
                attack: 'OTP Rate-Limit Bypass',
                concept: 'Circumventing rate limiting through various HTTP manipulation techniques',
                implementation: '# Technique 1: Header manipulation\nheaders = [\n    {\'X-Forwarded-For\': \'1.2.3.4\'},\n    {\'X-Forwarded-For\': \'5.6.7.8\'},\n    {\'X-Real-IP\': \'9.10.11.12\'},\n    {\'X-Originating-IP\': \'13.14.15.16\'}\n]\n\nfor header in headers:\n    response = requests.post(\'/api/verify\', \n                            json={\'otp\': attempt},\n                            headers=header)\n\n# Technique 2: Case manipulation\nattempts = [\'123456\', \'123456 \', \' 123456\', \'123456\\n\']\n\n# Technique 3: Null byte injection\nattempts = [\'123456\\x00\', \'123456%00\']',
                vulnerability: 'Rate limiting based on IP only, not user account; bypassable with header spoofing',
                mitigation: 'Rate limit by authenticated user ID, not IP:\n@ratelimit(key=\'user_id\', rate=\'3/10m\')\ndef verify_otp(user_id, otp):\n    ...',
                successIndicator: 'Unlimited OTP verification attempts possible by changing headers'
              }
            ]
          }
        },
        {
          id: 'rare',
          title: 'Rare & Exotic Bypasses',
          icon: 'Gem',
          content: {
            description: 'Uncommon OTP bypass techniques found in real-world bug bounty programs, requiring creative thinking.',
            rareCases: [
              {
                case: 'OTP Required Only Once',
                description: 'After first successful OTP verification, subsequent logins don\'t require OTP for extended period',
                example: 'Banking app remembered "trusted device" indefinitely after single OTP verification',
                exploitation: '1. Complete OTP verification once\n2. Steal session cookie\n3. Use cookie on attacker device - no OTP required\n4. App trusts device permanently',
                bountyReport: 'Reported to major bank, $5,000 bounty',
                fix: 'Re-verify OTP for sensitive operations and expire trusted device status after 30 days'
              },
              {
                case: 'OTP Skipped for Trusted Devices',
                description: 'Device fingerprinting bypass allows marking attacker device as "trusted"',
                example: 'E-commerce site stored trusted device ID in client-side localStorage',
                exploitation: '// Victim\'s localStorage\nlocalStorage.getItem(\'trusted_device_id\') // "abc123"\n\n// Attacker copies this to their device\nlocalStorage.setItem(\'trusted_device_id\', \'abc123\')\n\n// Login bypasses OTP verification',
                bountyReport: 'Critical vulnerability, $10,000 bounty',
                fix: 'Server-side device fingerprinting with hardware-based identifiers and IP correlation'
              },
              {
                case: 'OTP + IDOR via user_id',
                description: 'Combine OTP bypass with IDOR to access any account by manipulating user_id parameter',
                example: 'API endpoint validated OTP but not user_id ownership',
                exploitation: 'POST /api/verify-otp\n{\n  "user_id": 12345,  // Victim\'s ID\n  "otp": "123456"    // Your valid OTP\n}\n\n// Server validates OTP exists, doesn\'t check if it belongs to user_id 12345',
                bountyReport: 'Account takeover at scale, $15,000 bounty',
                fix: 'Bind OTP to specific user_id in database and validate ownership during verification'
              },
              {
                case: 'OTP in Response Body/Headers',
                description: 'Backend accidentally leaks OTP in API response or HTTP headers',
                example: 'Debug mode left enabled, exposing OTP in X-Debug-OTP header',
                exploitation: '// Request OTP\nPOST /api/request-otp\n\n// Response headers\nHTTP/1.1 200 OK\nX-Debug-OTP: 123456\nX-OTP-Sent: true\n\n// Or in response body\n{\n  "success": true,\n  "debug": {\n    "otp_code": "123456"\n  }\n}',
                bountyReport: 'Information disclosure, $3,000 bounty',
                fix: 'Remove all debug endpoints and headers in production; never expose OTP in responses'
              },
              {
                case: 'OTP via HTTP (not HTTPS)',
                description: 'OTP sent or verified over unencrypted HTTP connection enabling MITM attacks',
                example: 'Mobile app API calls used http:// instead of https:// for OTP endpoint',
                exploitation: '// Man-in-the-middle attack\n// Intercept HTTP traffic on public WiFi\nGET http://api.bank.com/request-otp?phone=123456789\n\n// OTP sent in plaintext visible to attacker\nResponse: {"otp": "123456", "expires_in": 300}',
                bountyReport: 'Security misconfiguration, $2,500 bounty',
                fix: 'Enforce HTTPS/TLS for all API endpoints; implement certificate pinning in mobile apps'
              }
            ]
          }
        }
      ]
    }
  };

  const checklistItems = [
    {
      level: 'beginner',
      title: 'Beginner Checklist',
      color: 'var(--color-accent-green)',
      items: [
        { id: 'b1', text: 'Verify OTP expiration (should expire in 5-10 minutes)' },
        { id: 'b2', text: 'Test OTP reusability (should be single-use only)' },
        { id: 'b3', text: 'Check for rate limiting on verification attempts (3-5 max)' },
        { id: 'b4', text: 'Verify resend OTP has rate limiting (not unlimited)' },
        { id: 'b5', text: 'Test if OTP is alphanumeric or numeric only' },
        { id: 'b6', text: 'Check OTP length (should be 6+ characters)' }
      ]
    },
    {
      level: 'hunter',
      title: 'Hunter Checklist',
      color: 'var(--color-accent)',
      items: [
        { id: 'h1', text: 'Verify OTP invalidation after successful use' },
        { id: 'h2', text: 'Test OTP invalidation on logout' },
        { id: 'h3', text: 'Check if OTP validation is server-side (not frontend only)' },
        { id: 'h4', text: 'Test if OTP step can be skipped via direct URL navigation' },
        { id: 'h5', text: 'Try removing OTP parameter entirely from request' },
        { id: 'h6', text: 'Test user_id/session manipulation with valid OTP' },
        { id: 'h7', text: 'Verify OTP works on both web and API endpoints' },
        { id: 'h8', text: 'Test null/empty/array values for OTP parameter' }
      ]
    },
    {
      level: 'elite',
      title: 'Elite Checklist',
      color: 'var(--color-accent-red)',
      items: [
        { id: 'e1', text: 'Test if OTP is bound to user session (not global)' },
        { id: 'e2', text: 'Verify OTP can\'t be used across multiple accounts' },
        { id: 'e3', text: 'Check OTP invalidation after password/email change' },
        { id: 'e4', text: 'Test OTP usability across different devices' },
        { id: 'e5', text: 'Attempt race condition with concurrent requests' },
        { id: 'e6', text: 'Check if resend generates new OTP or returns same code' },
        { id: 'e7', text: 'Test rate-limit bypass via header manipulation' },
        { id: 'e8', text: 'Verify trusted device implementation security' },
        { id: 'e9', text: 'Combine OTP bypass with IDOR testing' },
        { id: 'e10', text: 'Check for OTP leakage in responses/headers/logs' }
      ]
    }
  ];

  const commonMistakes = [
    {
      mistake: 'Only Testing Login OTP',
      explanation: 'Many hunters focus solely on login OTP while ignoring password reset, email change, phone verification, and transaction confirmation flows.',
      impact: 'Missing 70% of potential OTP vulnerabilities across the application.',
      correctApproach: 'Test OTP implementation in ALL flows: login, signup, password reset, email/phone change, payments, 2FA enrollment, and account recovery.'
    },
    {
      mistake: 'Ignoring API Endpoints',
      explanation: 'Testing only through web interface while mobile API endpoints may have different (weaker) validation.',
      impact: 'API often has less protection than web UI, missing critical vulnerabilities.',
      correctApproach: 'Intercept mobile traffic, test API directly with tools like Burp Suite, Postman. Check both /api/v1 and /api/v2 endpoints.'
    },
    {
      mistake: 'Trusting OTP Blindly',
      explanation: 'Assuming if OTP system exists, it\'s secure. Not testing for logic flaws.',
      impact: 'Complete OTP bypass due to frontend-only validation or skippable steps.',
      correctApproach: 'Never trust OTP system. Test every aspect: generation, delivery, validation, invalidation, rate limiting, binding.'
    },
    {
      mistake: 'Not Testing Cross-Account',
      explanation: 'Testing OTP only within single account, missing session/user binding issues.',
      impact: 'Missing critical bugs where OTP from Account A works for Account B.',
      correctApproach: 'Create 2+ test accounts. Generate OTP on Account 1, try using it on Account 2. Test session manipulation.'
    },
    {
      mistake: 'Giving Up After Rate Limit',
      explanation: 'Stopping testing when hitting rate limit instead of trying bypass techniques.',
      impact: 'Missing rate-limit bypass vulnerabilities that enable brute-force attacks.',
      correctApproach: 'Try IP spoofing headers (X-Forwarded-For), case manipulation, null bytes, special characters to bypass rate limiting.'
    },
    {
      mistake: 'Not Testing Resend Function',
      explanation: 'Overlooking "Resend OTP" button functionality and its security implications.',
      impact: 'Missing same-code-return bug, unlimited resend abuse, or OTP lifetime extension.',
      correctApproach: 'Click resend 10+ times, check if code changes, verify rate limiting, test if old codes expire on resend.'
    }
  ];

  const otpLocations = [
    { location: 'Login', icon: 'LogIn', risk: 'High', description: 'Primary authentication flow, highest impact' },
    { location: 'Signup', icon: 'UserPlus', risk: 'High', description: 'Email/phone verification during registration' },
    { location: 'Password Reset', icon: 'Key', risk: 'Critical', description: 'Account recovery, often weakest point' },
    { location: 'Email/Phone Change', icon: 'Mail', risk: 'High', description: 'Contact info update verification' },
    { location: 'Payments', icon: 'DollarSign', risk: 'Critical', description: 'Transaction confirmation OTP' },
    { location: 'Mobile APIs', icon: 'Smartphone', risk: 'High', description: 'Native app authentication endpoints' }
  ];

  useEffect(() => {
    // Scroll to top on level change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeLevel]);

  useEffect(() => {
    // Scroll section into view
    const element = document.getElementById(activeSection);
    if (element) {
      const yOffset = -100;
      const y = element?.getBoundingClientRect()?.top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [activeSection]);

  const handleCheckItem = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev?.[itemId]
    }));
  };

  const currentContent = content?.[activeLevel];
  const levelColor = levels?.find(l => l?.id === activeLevel)?.color;

  return (
    <>
      <Helmet>
        <title>OTP Bypass & Authentication Logic Flaws - Trinet_Layer</title>
        <meta name="description" content="Comprehensive interactive learning hub for OTP bypass techniques and authentication logic flaws. Progressive difficulty from beginner to elite level with real-world cases and exploitation methods." />
        <meta name="keywords" content="OTP bypass, authentication bypass, 2FA bypass, logic flaws, bug bounty, security testing, MFA vulnerabilities" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Sidebar />

        <div className="lg:ml-[280px] min-h-screen lg:w-[calc(100%-280px)] overflow-x-hidden">
          <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg">
            <div className="pl-16 pr-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6">
              <GlobalSearch />
            </div>
          </div>

          <main className="px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
            <Breadcrumb />

            <LearningHero />

            <LevelSelector
              levels={levels}
              activeLevel={activeLevel}
              onLevelChange={setActiveLevel}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10 mb-8 md:mb-12 lg:mb-16">
              <div className="lg:col-span-3">
                <TopicNav
                  sections={currentContent?.sections}
                  activeSection={activeSection}
                  onSectionChange={setActiveSection}
                  levelColor={levelColor}
                />
              </div>

              <div className="lg:col-span-9">
                {currentContent?.sections?.map((section) => (
                  <ContentSection
                    key={section?.id}
                    section={section}
                    isActive={activeSection === section?.id}
                    levelColor={levelColor}
                  />
                ))}
              </div>
            </div>

            <section className="mb-8 md:mb-12 lg:mb-16">
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <Icon name="MapPin" size={24} className="md:w-7 md:h-7 lg:w-8 lg:h-8" color="var(--color-accent)" />
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                  Where OTP Bugs Exist
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
                {otpLocations?.map((location, index) => (
                  <div
                    key={index}
                    className="p-5 md:p-6 rounded-xl bg-muted/30 border border-border hover:border-accent/50 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/30 group-hover:border-accent/60 transition-colors">
                        <Icon name={location?.icon} size={20} color="var(--color-accent)" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-base md:text-lg">
                          {location?.location}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          location?.risk === 'Critical' ?'bg-red-500/10 text-red-400 border border-red-500/30' :'bg-accent/10 text-accent border border-accent/30'
                        }`}>
                          {location?.risk} Risk
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground font-body">
                      {location?.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <ChecklistSection
              checklistItems={checklistItems}
              checkedItems={checkedItems}
              onCheckItem={handleCheckItem}
            />

            <CommonMistakes mistakes={commonMistakes} />

            <Disclaimer />
          </main>

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
        </div>
      </div>
    </>
  );
};

export default OTPBypassLearningHub;