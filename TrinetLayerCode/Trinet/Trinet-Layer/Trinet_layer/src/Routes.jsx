import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import PayloadVault from './pages/payload-vault';
import CRLFInjection from './pages/crlf-injection';
import IDOR from './pages/idor';
import VulnerabilitiesOverview from './pages/vulnerabilities-overview';
import XSS from './pages/xss';
import Homepage from './pages/homepage';
import OTPBypassHub from './pages/otp-bypass-hub';
import OTPBypass from './pages/otp-bypass';
import SQLInjection from './pages/sql-injection';
import DependencyConfusion from './pages/dependency-confusion';
import LiveExploitSandbox from './pages/live-exploit-sandbox';
import SubdomainScanner from './pages/subdomain-scanner';
import JSAnalyzer from './pages/js-analyzer';
import AISecurityOverview from './pages/ai-security-overview';
import AISecurityAnatomy from './pages/ai-security-anatomy';
import AISecurityThreatModeling from './pages/ai-security-threat-modeling';
import AISecurityOWASPTop10 from './pages/ai-security-owasp-top10';
import AISecurityPrompts from './pages/ai-security-prompts';
import AISecurityLabs from './pages/ai-security-labs';
import { Lab1PromptInjection, Lab2Jailbreak, Lab3Hallucination, Lab4ExcessiveAgency, Lab5RAGPoisoning } from './pages/ai-security-labs/labs';
import Contribute from './pages/contribute';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
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
        <Route path="/ai-security-labs/lab-1-prompt-injection" element={<Lab1PromptInjection />} />
        <Route path="/ai-security-labs/lab-2-jailbreak" element={<Lab2Jailbreak />} />
        <Route path="/ai-security-labs/lab-3-hallucination" element={<Lab3Hallucination />} />
        <Route path="/ai-security-labs/lab-4-excessive-agency" element={<Lab4ExcessiveAgency />} />
        <Route path="/ai-security-labs/lab-5-rag-poisoning" element={<Lab5RAGPoisoning />} />
        <Route path="/contribute" element={<Contribute />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
