import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Brain, 
  AlertTriangle, 
  Lock,
  Globe,
  Code,
  MessageSquare,
  Database,
  Zap,
  Target,
  BookOpen,
  Building2,
  Stethoscope,
  Scale
} from 'lucide-react';
import {
  AISecurityLayout,
  PageHeader,
  ContentSection,
  SectionCard,
  InfoCallout,
  CodeBlock,
  ChecklistItem,
  NextStepCard,
  StatCard,
  AISecurityNav
} from 'components/ai-security';

const AISecurityOverview = () => {
  const useCases = [
    { icon: MessageSquare, title: 'Customer Support', desc: 'Chatbots handling sensitive account information' },
    { icon: Code, title: 'Code Assistants', desc: 'AI tools with access to proprietary codebases' },
    { icon: Database, title: 'Data Analysis', desc: 'LLMs processing confidential business data' },
    { icon: Stethoscope, title: 'Healthcare', desc: 'Medical AI accessing patient records' },
    { icon: Scale, title: 'Legal & Finance', desc: 'Document analysis with privileged data' },
    { icon: Building2, title: 'Enterprise Automation', desc: 'Agents with production system access' }
  ];

  const initialChecklist = [
    { num: '01', title: 'Identify all AI components', desc: 'Map every LLM, embedding model, and AI service in your stack' },
    { num: '02', title: 'Document data flows', desc: 'Trace what data enters the AI system and where outputs go' },
    { num: '03', title: 'List all integrations', desc: 'Catalog APIs, databases, and tools the AI can access' },
    { num: '04', title: 'Review system prompts', desc: 'Audit hidden instructions for sensitive information and logic' },
    { num: '05', title: 'Test basic injections', desc: 'Attempt simple prompt overrides to gauge baseline security' }
  ];

  return (
    <AISecurityLayout>
      <ContentSection>
        <PageHeader
          icon={Shield}
          title="Introduction to AI & LLM Security"
          subtitle="Understanding security risks in AI-powered applications"
          breadcrumbs={[{ label: 'AI Security' }]}
        />
        
        <AISecurityNav showProgress />

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-7"
        >
          <SectionCard icon={Brain} title="What is a Large Language Model (LLM)?" delay={0.05}>
            <p>
              At its core, a Large Language Model is a neural network trained on massive amounts of text data. 
              It learns patterns in language - how words relate to each other, what typically follows what, 
              and how to generate coherent responses to questions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="p-4 bg-[#080b10] border border-gray-800/30 rounded-xl">
                <p className="text-cyan-400 font-medium mb-2 text-[14px]">Simple explanation</p>
                <p className="text-gray-400 text-[14px] leading-relaxed">
                  Think of an LLM as an extremely sophisticated autocomplete. When you type a message, 
                  it predicts what response would make the most sense based on everything it learned.
                </p>
              </div>
              
              <div className="p-4 bg-[#080b10] border border-gray-800/30 rounded-xl">
                <p className="text-purple-400 font-medium mb-2 text-[14px]">Technical details</p>
                <p className="text-gray-400 text-[14px] leading-relaxed">
                  LLMs use transformer architecture with attention mechanisms. Models like GPT-4, Claude, 
                  and Llama contain billions of parameters that encode learned patterns.
                </p>
              </div>
            </div>
            
            <div className="mt-5">
              <CodeBlock title="Simplified LLM interaction flow">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-cyan-400">User Input</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-purple-400">Tokenization</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-emerald-400">Model Processing</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-amber-400">Token Generation</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-cyan-400">Response</span>
                </div>
              </CodeBlock>
            </div>
          </SectionCard>

          <SectionCard icon={Globe} title="Where LLMs Are Used Today" delay={0.1}>
            <p>
              LLMs have moved far beyond simple chatbots. They now power critical business processes 
              and have access to sensitive systems across every industry.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {useCases.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="flex items-start gap-3 p-4 bg-[#080b10] border border-gray-800/30 rounded-xl hover:border-gray-700/50 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
                  </div>
                  <div>
                    <span className="font-medium text-white text-[14px]">{item.title}</span>
                    <p className="text-[13px] text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={AlertTriangle} title="Why Traditional Security Isn't Enough" delay={0.15}>
            <p>
              LLMs introduce a new paradigm that breaks fundamental assumptions of traditional application security.
            </p>
            
            <div className="space-y-4 mt-5">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 bg-[#080b10] border border-red-500/15 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="font-medium text-white text-[14px]">Natural language as attack vector</span>
                </div>
                <p className="text-[14px] text-gray-400 leading-relaxed">Unlike SQL injection or XSS, prompt injection uses plain language that cannot be easily filtered. There is no clear boundary between "safe" and "malicious" text.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="p-4 bg-[#080b10] border border-orange-500/15 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span className="font-medium text-white text-[14px]">Non-deterministic behavior</span>
                </div>
                <p className="text-[14px] text-gray-400 leading-relaxed">LLMs can produce different outputs for identical inputs. A prompt that seems safe in testing might be exploited differently in production.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-[#080b10] border border-amber-500/15 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-medium text-white text-[14px]">Blurred trust boundaries</span>
                </div>
                <p className="text-[14px] text-gray-400 leading-relaxed">The model processes instructions from multiple sources together. It has no inherent way to distinguish authoritative instructions from attacks.</p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="p-4 bg-[#080b10] border border-cyan-500/15 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span className="font-medium text-white text-[14px]">Emergent capabilities and flaws</span>
                </div>
                <p className="text-[14px] text-gray-400 leading-relaxed">LLMs exhibit unexpected behaviors - they may jailbreak through roleplay, leak training data, or follow hidden instructions in documents.</p>
              </motion.div>
            </div>
          </SectionCard>

          <SectionCard icon={Target} title="The AI Attack Surface" delay={0.2}>
            <p>
              AI applications present a unique attack surface that extends far beyond the model itself.
            </p>
            
            <div className="grid grid-cols-3 gap-4 mt-5">
              <StatCard value="8+" label="Attack Vectors" />
              <StatCard value="3" label="Trust Levels" />
              <StatCard value="∞" label="Prompt Variations" />
            </div>
            
            <div className="mt-5">
              <InfoCallout type="warning">
                Every component that feeds data into or receives data from the LLM is part of the attack 
                surface: user interfaces, APIs, documents, databases, plugins, and even the system prompt itself.
              </InfoCallout>
            </div>
          </SectionCard>

          <SectionCard icon={Lock} title="Initial Security Assessment Checklist" delay={0.25}>
            <p>
              Before diving into specific vulnerabilities, use this checklist to understand your AI application's 
              current security posture.
            </p>
            
            <div className="space-y-3 mt-5">
              {initialChecklist.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                >
                  <ChecklistItem 
                    number={item.num}
                    title={item.title}
                    description={item.desc}
                  />
                </motion.div>
              ))}
            </div>
          </SectionCard>

          <NextStepCard
            icon={BookOpen}
            title="Next: AI Application Architecture"
            description="Learn how data flows through LLM applications, understand trust boundaries, and identify where security controls should be placed."
            linkText="Continue to Architecture"
            linkTo="/ai-security-anatomy"
          />
        </motion.div>
      </ContentSection>
    </AISecurityLayout>
  );
};

export default AISecurityOverview;
