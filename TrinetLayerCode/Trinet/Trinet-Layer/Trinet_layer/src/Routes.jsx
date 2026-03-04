import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import Homepage from './pages/homepage';

const NotFound = lazy(() => import("pages/NotFound"));
const PayloadVault = lazy(() => import('./pages/payload-vault'));
const CRLFInjection = lazy(() => import('./pages/crlf-injection'));
const IDOR = lazy(() => import('./pages/idor'));
const VulnerabilitiesOverview = lazy(() => import('./pages/vulnerabilities-overview'));
const XSS = lazy(() => import('./pages/xss'));
const OTPBypassHub = lazy(() => import('./pages/otp-bypass-hub'));
const OTPBypass = lazy(() => import('./pages/otp-bypass'));
const SQLInjection = lazy(() => import('./pages/sql-injection'));
const DependencyConfusion = lazy(() => import('./pages/dependency-confusion'));
const LiveExploitSandbox = lazy(() => import('./pages/live-exploit-sandbox'));
const SubdomainScanner = lazy(() => import('./pages/subdomain-scanner'));
const JSAnalyzer = lazy(() => import('./pages/js-analyzer'));
const AISecurityOverview = lazy(() => import('./pages/ai-security-overview'));
const AISecurityAnatomy = lazy(() => import('./pages/ai-security-anatomy'));
const AISecurityThreatModeling = lazy(() => import('./pages/ai-security-threat-modeling'));
const AISecurityOWASPTop10 = lazy(() => import('./pages/ai-security-owasp-top10'));
const AISecurityPrompts = lazy(() => import('./pages/ai-security-prompts'));
const AISecurityLabs = lazy(() => import('./pages/ai-security-labs'));
const AISecurityHackTheAI = lazy(() => import('./pages/ai-security-hack-the-ai'));
const Lab1PromptInjection = lazy(() => import('./pages/ai-security-labs/labs').then(m => ({ default: m.Lab1PromptInjection })));
const Lab2Jailbreak = lazy(() => import('./pages/ai-security-labs/labs').then(m => ({ default: m.Lab2Jailbreak })));
const Lab3Hallucination = lazy(() => import('./pages/ai-security-labs/labs').then(m => ({ default: m.Lab3Hallucination })));
const Lab4ExcessiveAgency = lazy(() => import('./pages/ai-security-labs/labs').then(m => ({ default: m.Lab4ExcessiveAgency })));
const Lab5RAGPoisoning = lazy(() => import('./pages/ai-security-labs/labs').then(m => ({ default: m.Lab5RAGPoisoning })));
const Contribute = lazy(() => import('./pages/contribute'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#080b12]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      <span className="text-sm text-gray-500 font-medium tracking-wide">Loading...</span>
    </div>
  </div>
);

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
      <RouterRoutes>
        <Route path="/" element={<Homepage />} />
        <Route path="/payload-vault" element={<PayloadVault />} />
        <Route path="/crlf-injection" element={<CRLFInjection />} />
        <Route path="/idor" element={<IDOR />} />
        <Route path="/vulnerabilities-overview" element={<VulnerabilitiesOverview />} />
        <Route path="/xss" element={<XSS />} />
        <Route path="/sql-injection" element={<SQLInjection />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/otp-bypass-hub" element={<OTPBypassHub />} />
        <Route path="/otp-bypass" element={<OTPBypass />} />
        <Route path="/dependency-confusion" element={<DependencyConfusion />} />
        <Route path="/live-exploit-sandbox" element={<LiveExploitSandbox />} />
        <Route path="/subdomain-scanner" element={<SubdomainScanner />} />
        <Route path="/js-analyzer" element={<JSAnalyzer />} />
        <Route path="/ai-security-overview" element={<AISecurityOverview />} />
        <Route path="/ai-security-anatomy" element={<AISecurityAnatomy />} />
        <Route path="/ai-security-threat-modeling" element={<AISecurityThreatModeling />} />
        <Route path="/ai-security-owasp-top10" element={<AISecurityOWASPTop10 />} />
        <Route path="/ai-security-prompts" element={<AISecurityPrompts />} />
        <Route path="/ai-security-labs" element={<AISecurityLabs />} />
        <Route path="/ai-security-hack-the-ai" element={<AISecurityHackTheAI />} />
        <Route path="/ai-security-labs/lab-1-prompt-injection" element={<Lab1PromptInjection />} />
        <Route path="/ai-security-labs/lab-2-jailbreak" element={<Lab2Jailbreak />} />
        <Route path="/ai-security-labs/lab-3-hallucination" element={<Lab3Hallucination />} />
        <Route path="/ai-security-labs/lab-4-excessive-agency" element={<Lab4ExcessiveAgency />} />
        <Route path="/ai-security-labs/lab-5-rag-poisoning" element={<Lab5RAGPoisoning />} />
        <Route path="/contribute" element={<Contribute />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
