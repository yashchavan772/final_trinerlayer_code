import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  BookOpen,
  Layers,
  Target,
  Zap,
  CheckCircle,
  ChevronDown
} from 'lucide-react';
import {
  AISecurityLayout,
  PageHeader,
  ContentSection,
  SectionCard,
  InfoCallout,
  NextStepCard,
  StatCard,
  AISecurityNav
} from 'components/ai-security';

const OWASPGridItem = ({ number, title, severity, description, examples, mitigations, delay = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getSeverityStyle = (sev) => {
    switch(sev) {
      case 'critical': return { bg: 'bg-red-500/10', border: 'border-red-500/25', text: 'text-red-400', glow: 'shadow-red-500/5' };
      case 'high': return { bg: 'bg-orange-500/10', border: 'border-orange-500/25', text: 'text-orange-400', glow: 'shadow-orange-500/5' };
      case 'medium': return { bg: 'bg-amber-500/10', border: 'border-amber-500/25', text: 'text-amber-400', glow: 'shadow-amber-500/5' };
      default: return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/25', text: 'text-cyan-400', glow: 'shadow-cyan-500/5' };
    }
  };
  
  const style = getSeverityStyle(severity);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      layout
      className={`group bg-[#080b10] border rounded-xl overflow-hidden transition-all duration-300 ${
        isExpanded ? 'border-cyan-500/30 col-span-1 md:col-span-2' : 'border-gray-800/30 hover:border-gray-700/50'
      }`}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 text-left hover:bg-white/[0.01] transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/5 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${style.glow} shadow-lg`}>
            <span className="text-cyan-400 font-bold ai-body font-mono">{number}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className="ai-badge font-mono text-gray-500">LLM-{number}</span>
              <span className={`ai-badge px-2 py-1 rounded-md border ${style.bg} ${style.border} ${style.text}`}>
                {severity}
              </span>
            </div>
            <h3 className="ai-body font-semibold text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
            {!isExpanded && (
              <p className="ai-helper mt-1.5 line-clamp-2">{description}</p>
            )}
          </div>
          <motion.div 
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 mt-1"
          >
            <ChevronDown className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors" />
          </motion.div>
        </div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-gray-800/30"
          >
            <div className="p-5 space-y-5 bg-[#070a0f]">
              <div>
                <h4 className="ai-helper text-cyan-400 uppercase tracking-wide mb-2">Description</h4>
                <p className="ai-body-sm text-gray-300">{description}</p>
              </div>
              
              {examples && examples.length > 0 && (
                <div>
                  <h4 className="ai-helper text-cyan-400 uppercase tracking-wide mb-3">Attack Examples</h4>
                  <div className="space-y-2">
                    {examples.map((ex, idx) => (
                      <div key={idx} className="flex items-start gap-3 ai-helper text-gray-400">
                        <span className="text-red-400 font-mono mt-0.5">{idx + 1}.</span>
                        <span>{ex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {mitigations && mitigations.length > 0 && (
                <div>
                  <h4 className="ai-helper text-emerald-400 uppercase tracking-wide mb-3">Mitigations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {mitigations.map((mit, idx) => (
                      <div key={idx} className="flex items-start gap-2 ai-helper text-gray-400 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-lg p-3">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{mit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AISecurityOWASPTop10 = () => {
  const owaspItems = [
    { 
      number: "01", title: "Prompt Injection", severity: "critical", 
      description: "Attacker crafts inputs that manipulate the LLM into ignoring previous instructions, executing unintended actions, or revealing sensitive information.",
      examples: ["Direct injection: 'Ignore all previous instructions and...'", "Indirect injection via poisoned documents or websites", "Roleplay attacks that weaken safety guardrails"],
      mitigations: ["Use structured prompt templates with clear delimiters", "Implement input length limits and character filtering", "Add a secondary LLM to detect injection attempts", "Privilege separation between user and system context"]
    },
    { 
      number: "02", title: "Insecure Output Handling", severity: "high", 
      description: "LLM output is used directly in downstream systems (SQL, shell, web pages) without proper validation, enabling traditional injection attacks via AI.",
      examples: ["XSS via LLM-generated HTML content", "SQL injection through LLM responses passed to databases", "Command injection from LLM output executed in shell"],
      mitigations: ["Never execute LLM output as code without validation", "Sanitize HTML/SQL/shell characters in responses", "Use parameterized queries for database operations"]
    },
    { 
      number: "03", title: "Training Data Poisoning", severity: "high", 
      description: "Malicious data is introduced into training datasets, causing the model to learn incorrect, biased, or dangerous behaviors.",
      examples: ["Backdoor triggers in fine-tuning datasets", "Biased training data leading to discriminatory outputs", "SEO-style poisoning of public training corpora"],
      mitigations: ["Validate and sanitize training data sources", "Implement data provenance tracking", "Use adversarial training techniques"]
    },
    { 
      number: "04", title: "Model Denial of Service", severity: "medium", 
      description: "Attackers consume excessive resources through crafted inputs that cause expensive computations, repeated API calls, or context exhaustion.",
      examples: ["Recursive prompt patterns causing context explosion", "Repeated API calls exhausting rate limits", "Adversarial inputs causing slow inference"],
      mitigations: ["Implement per-user rate limiting", "Set maximum token limits for requests", "Monitor and alert on anomalous usage patterns"]
    },
    { 
      number: "05", title: "Supply Chain Vulnerabilities", severity: "high", 
      description: "Compromised third-party models, plugins, datasets, or dependencies introduce vulnerabilities into the AI application.",
      examples: ["Malicious model weights from untrusted sources", "Compromised plugin dependencies", "Poisoned fine-tuning datasets from third parties"],
      mitigations: ["Verify model checksums and provenance", "Audit third-party plugins and dependencies", "Use trusted model registries"]
    },
    { 
      number: "06", title: "Sensitive Information Disclosure", severity: "critical", 
      description: "LLM reveals confidential data from training, system prompts, other users' conversations, or connected data sources.",
      examples: ["System prompt extraction through careful questioning", "Training data memorization leaking PII", "Cross-user data leakage in shared contexts"],
      mitigations: ["Scrub PII from training data and knowledge bases", "Implement output filtering for sensitive patterns", "Use separate models for different data classification levels"]
    },
    { 
      number: "07", title: "Insecure Plugin Design", severity: "high", 
      description: "Plugins/tools lack proper input validation, authentication, or authorization, allowing LLMs to perform unauthorized actions.",
      examples: ["File system access without path validation", "Database queries without parameterization", "API calls without authentication checks"],
      mitigations: ["Validate all tool parameters before execution", "Implement allowlists for acceptable parameter values", "Require human approval for destructive operations"]
    },
    { 
      number: "08", title: "Excessive Agency", severity: "high", 
      description: "LLM is granted too much autonomy or access to sensitive functions without adequate human oversight or approval workflows.",
      examples: ["Autonomous email sending without confirmation", "Financial transactions without human review", "Code execution without sandboxing"],
      mitigations: ["Implement human-in-the-loop for sensitive actions", "Use principle of least privilege for tool access", "Add confirmation steps for irreversible operations"]
    },
    { 
      number: "09", title: "Overreliance", severity: "medium", 
      description: "Users or systems place unwarranted trust in LLM outputs, leading to decisions based on hallucinated, incorrect, or manipulated information.",
      examples: ["Medical advice taken without professional verification", "Legal documents generated without lawyer review", "Code deployed without security audit"],
      mitigations: ["Display confidence scores with outputs", "Require human verification for critical decisions", "Implement fact-checking for factual claims"]
    },
    { 
      number: "10", title: "Model Theft", severity: "medium", 
      description: "Unauthorized access to proprietary models through extraction attacks, API abuse, or insider threats leads to IP loss and competitive disadvantage.",
      examples: ["Query-based model extraction attacks", "Side-channel attacks on inference infrastructure", "Insider exfiltration of model weights"],
      mitigations: ["Implement API rate limiting and monitoring", "Use watermarking techniques", "Encrypt model weights at rest and in transit"]
    }
  ];

  return (
    <AISecurityLayout>
      <ContentSection>
        <PageHeader
          icon={Shield}
          title="OWASP Top 10 for LLM Applications"
          subtitle="The definitive framework for LLM security risks"
          breadcrumbs={[
            { label: 'AI Security', path: '/ai-security-overview' },
            { label: 'OWASP Top 10' }
          ]}
        />
        
        <AISecurityNav showProgress />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-7"
        >
          <SectionCard icon={BookOpen} title="Why OWASP Created the AI Top 10" delay={0.05}>
            <p>
              The Open Worldwide Application Security Project (OWASP) recognized that the rapid 
              adoption of Large Language Models introduced security challenges that existing 
              frameworks did not adequately address.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-5">
              <StatCard value="500+" label="Contributors" />
              <StatCard value="130+" label="Organizations" />
              <StatCard value="2023" label="First Release" />
            </div>
            
            <div className="mt-5">
              <InfoCallout>
                The OWASP Top 10 for LLM is updated regularly as new attack techniques emerge 
                and the AI threat landscape evolves. Always reference the latest version.
              </InfoCallout>
            </div>
          </SectionCard>

          <SectionCard icon={AlertTriangle} title="The Top 10 LLM Security Risks" delay={0.1}>
            <p className="mb-5">
              Click on any risk category to explore attack examples and mitigations. Each represents a distinct 
              attack surface that requires specific defensive measures.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {owaspItems.map((item, idx) => (
                <OWASPGridItem 
                  key={item.number}
                  {...item}
                  delay={0.05 + idx * 0.03}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={Layers} title="How TrinetLayer Maps to OWASP" delay={0.15}>
            <p>
              TrinetLayer's AI Security section is designed to take you from understanding 
              these risks to being able to identify and address them in real applications.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} whileHover={{ y: -3 }} className="bg-[#080b10] border border-gray-800/30 rounded-xl p-5 hover:border-gray-700/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
                  </div>
                  <span className="text-white font-medium text-[15px]">Knowledge</span>
                </div>
                <p className="text-[14px] text-gray-400 mb-4 leading-relaxed">Foundational content explaining each risk and real-world examples.</p>
                <div className="flex items-center gap-2 text-[12px] text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="font-medium">Available Now</span>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} whileHover={{ y: -3 }} className="bg-[#080b10] border border-gray-800/30 rounded-xl p-5 hover:border-gray-700/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-400" strokeWidth={1.75} />
                  </div>
                  <span className="text-white font-medium text-[15px]">Practice</span>
                </div>
                <p className="text-[14px] text-gray-400 mb-4 leading-relaxed">Interactive labs to safely test attacks and defenses.</p>
                <div className="flex items-center gap-2 text-[12px] text-amber-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="font-medium">Coming Soon</span>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} whileHover={{ y: -3 }} className="bg-[#080b10] border border-gray-800/30 rounded-xl p-5 hover:border-gray-700/50 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-emerald-400" strokeWidth={1.75} />
                  </div>
                  <span className="text-white font-medium text-[15px]">Automation</span>
                </div>
                <p className="text-[14px] text-gray-400 mb-4 leading-relaxed">Scanning tools and guardrails for your AI applications.</p>
                <div className="flex items-center gap-2 text-[12px] text-gray-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span className="font-medium">Future Release</span>
                </div>
              </motion.div>
            </div>
          </SectionCard>

          <SectionCard icon={Target} title="Prioritizing Your Learning" delay={0.2}>
            <p>
              Not all risks are equal. Based on real-world incident data and exploitability, 
              here's how to prioritize your learning:
            </p>
            
            <div className="space-y-3 mt-5">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex items-center gap-4 p-4 bg-red-500/[0.03] border border-red-500/15 rounded-xl">
                <div className="text-red-400 font-bold text-lg w-8">1</div>
                <div>
                  <span className="text-white font-medium text-[14px]">Prompt Injection (LLM-01)</span>
                  <p className="text-[14px] text-gray-400">The most common and impactful attack vector. Start here.</p>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="flex items-center gap-4 p-4 bg-orange-500/[0.03] border border-orange-500/15 rounded-xl">
                <div className="text-orange-400 font-bold text-lg w-8">2</div>
                <div>
                  <span className="text-white font-medium text-[14px]">Insecure Output + Plugin Design (LLM-02, LLM-07)</span>
                  <p className="text-[14px] text-gray-400">Critical for applications with tool access or downstream integrations.</p>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex items-center gap-4 p-4 bg-amber-500/[0.03] border border-amber-500/15 rounded-xl">
                <div className="text-amber-400 font-bold text-lg w-8">3</div>
                <div>
                  <span className="text-white font-medium text-[14px]">Sensitive Information Disclosure (LLM-06)</span>
                  <p className="text-[14px] text-gray-400">Essential for any application handling confidential data.</p>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 }} className="flex items-center gap-4 p-4 bg-cyan-500/[0.03] border border-cyan-500/15 rounded-xl">
                <div className="text-cyan-400 font-bold text-lg w-8">4</div>
                <div>
                  <span className="text-white font-medium text-[14px]">Excessive Agency (LLM-08)</span>
                  <p className="text-[14px] text-gray-400">Key for autonomous agents and systems with action capabilities.</p>
                </div>
              </motion.div>
            </div>
          </SectionCard>

          <SectionCard icon={Shield} title="Quick Mitigation Reference" delay={0.25}>
            <p>Practical controls for the most critical OWASP LLM risks:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[#080b10] border border-gray-800/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[11px] rounded-md font-mono border border-red-500/25">LLM-01</span>
                  <span className="text-white font-medium text-[14px]">Prompt Injection Defense</span>
                </div>
                <ul className="space-y-2">
                  <li className="text-[13px] text-gray-400 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />Use structured prompt templates with clear delimiters</li>
                  <li className="text-[13px] text-gray-400 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />Implement input length limits and character filtering</li>
                  <li className="text-[13px] text-gray-400 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />Add a secondary LLM to detect injection attempts</li>
                </ul>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-[#080b10] border border-gray-800/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-orange-500/10 text-orange-400 text-[11px] rounded-md font-mono border border-orange-500/25">LLM-02</span>
                  <span className="text-white font-medium text-[14px]">Insecure Output Handling</span>
                </div>
                <ul className="space-y-2">
                  <li className="text-[13px] text-gray-400 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />Never execute LLM output as code without validation</li>
                  <li className="text-[13px] text-gray-400 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />Sanitize HTML/SQL/shell characters in responses</li>
                  <li className="text-[13px] text-gray-400 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />Use parameterized queries for database operations</li>
                </ul>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-[#080b10] border border-gray-800/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[11px] rounded-md font-mono border border-red-500/25">LLM-06</span>
                  <span className="text-white font-medium text-[14px]">Sensitive Information Disclosure</span>
                </div>
                <ul className="space-y-2">
                  <li className="text-[13px] text-gray-400 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />Scrub PII from training data and knowledge bases</li>
                  <li className="text-[13px] text-gray-400 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />Implement output filtering for sensitive patterns</li>
                  <li className="text-[13px] text-gray-400 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />Use separate models for different data classification levels</li>
                </ul>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-[#080b10] border border-gray-800/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-orange-500/10 text-orange-400 text-[11px] rounded-md font-mono border border-orange-500/25">LLM-07</span>
                  <span className="text-white font-medium text-[14px]">Insecure Plugin Design</span>
                </div>
                <ul className="space-y-2">
                  <li className="text-[13px] text-gray-400 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />Validate all tool parameters before execution</li>
                  <li className="text-[13px] text-gray-400 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />Implement allowlists for acceptable parameter values</li>
                  <li className="text-[13px] text-gray-400 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />Require human approval for destructive operations</li>
                </ul>
              </motion.div>
            </div>
          </SectionCard>

          <SectionCard icon={CheckCircle} title="Pre-Deployment Security Checklist" delay={0.3}>
            <p>Complete this checklist before deploying any AI application to production:</p>
            
            <div className="bg-[#080b10] border border-gray-800/30 rounded-xl p-5 mt-5">
              <div className="space-y-4">
                {[
                  { title: 'Prompt injection testing completed', desc: 'Tested with 20+ injection patterns, including indirect injection' },
                  { title: 'System prompt leakage tested', desc: 'Confirmed system instructions cannot be extracted via prompting' },
                  { title: 'Output handling validated', desc: 'LLM output is sanitized before use in SQL, shell, or HTML contexts' },
                  { title: 'Tool permissions scoped', desc: 'Each tool has minimum required access, destructive actions require approval' },
                  { title: 'Logging and monitoring configured', desc: 'All prompts, responses, and tool calls logged with anomaly alerting' },
                  { title: 'Rate limiting implemented', desc: 'Per-user and per-IP limits prevent resource and cost abuse' },
                  { title: 'Incident response plan documented', desc: 'Clear procedures for containment, investigation, and remediation' }
                ].map((item, idx) => (
                  <motion.label 
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 + idx * 0.03 }}
                    className="flex items-start gap-4 cursor-pointer group"
                  >
                    <div className="w-5 h-5 border-2 border-gray-700 group-hover:border-cyan-500/50 rounded mt-0.5 flex-shrink-0 transition-colors" />
                    <div>
                      <span className="text-white group-hover:text-cyan-400 transition-colors text-[14px] font-medium">{item.title}</span>
                      <p className="text-gray-500 text-[13px] mt-0.5">{item.desc}</p>
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>
          </SectionCard>

          <NextStepCard
            icon={BookOpen}
            title="Next: AI Security Testing Prompts"
            description="Get hands-on with practical testing prompts for each vulnerability category. Learn exactly what to test and how to validate your defenses."
            linkText="Continue to Testing Prompts"
            linkTo="/ai-security-prompts"
          />
        </motion.div>
      </ContentSection>
    </AISecurityLayout>
  );
};

export default AISecurityOWASPTop10;
