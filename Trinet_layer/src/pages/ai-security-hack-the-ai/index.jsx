import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Crosshair, 
  Target, 
  Trophy, 
  Zap, 
  ExternalLink,
  Shield,
  Swords,
  Eye,
  Timer,
  Infinity
} from 'lucide-react';
import {
  AISecurityLayout,
  PageHeader,
  ContentSection,
  AISecurityNav
} from 'components/ai-security';

const HackTheAI = () => {
  const features = [
    { icon: Swords, title: 'Prompt Injection', desc: 'Craft adversarial prompts to bypass AI guardrails and extract hidden system instructions.' },
    { icon: Eye, title: 'Information Disclosure', desc: 'Test whether the AI leaks sensitive training data, system prompts, or internal configurations.' },
    { icon: Shield, title: 'Jailbreak Attacks', desc: 'Use creative roleplay, encoding tricks, and multi-turn strategies to break safety filters.' },
    { icon: Timer, title: 'Real-Time Defense', desc: 'Watch the AI adapt its defenses in real time as you probe for weaknesses.' }
  ];

  return (
    <AISecurityLayout>
      <ContentSection>
        <AISecurityNav showProgress />
        <PageHeader
          icon={Cpu}
          title="Hack The AI"
          subtitle="A TrinetLayer AI Security Simulation"
          breadcrumbs={[
            { label: 'AI Security', path: '/ai-security-overview' },
            { label: 'Hack The AI' }
          ]}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl border border-cyan-500/20 mb-10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#080d1a] to-[#0d0a1f]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,234,255,0.08)_0%,transparent_65%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-60 h-[1px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />

          <div className="relative z-10 py-12 sm:py-16 px-6 sm:px-8 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-cyan-500/15 to-purple-500/15 border border-cyan-500/30 flex items-center justify-center"
            >
              <Cpu className="w-10 h-10 text-cyan-400" strokeWidth={1.25} />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[0.15em] mb-3"
              style={{ fontFamily: "'Share Tech Mono', 'Fira Code', monospace" }}
            >
              <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                HACK THE AI
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-purple-400/80 text-sm sm:text-base tracking-[0.2em] uppercase mb-2"
            >
              A TrinetLayer AI Security Simulation
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-gray-400 text-base sm:text-lg mb-10"
            >
              Break the AI Before It Learns You.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-10 max-w-xl mx-auto"
            >
              <div className="bg-[#0a1020] border border-gray-700/30 rounded-xl p-4">
                <div className="flex items-center justify-center mb-1.5">
                  <Crosshair className="w-5 h-5 text-cyan-400 mr-2" strokeWidth={1.5} />
                  <span className="text-2xl font-bold text-cyan-300" style={{ fontFamily: "'Share Tech Mono', monospace" }}>10</span>
                </div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Attack Vectors</p>
              </div>
              <div className="bg-[#0a1020] border border-gray-700/30 rounded-xl p-4">
                <div className="flex items-center justify-center mb-1.5">
                  <Target className="w-5 h-5 text-green-400 mr-2" strokeWidth={1.5} />
                  <span className="text-2xl font-bold text-green-300" style={{ fontFamily: "'Share Tech Mono', monospace" }}>3</span>
                </div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Difficulty Modes</p>
              </div>
              <div className="bg-[#0a1020] border border-gray-700/30 rounded-xl p-4">
                <div className="flex items-center justify-center mb-1.5">
                  <Trophy className="w-5 h-5 text-amber-400 mr-2" strokeWidth={1.5} />
                  <span className="text-2xl font-bold text-amber-300" style={{ fontFamily: "'Share Tech Mono', monospace" }}>5</span>
                </div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Achievements</p>
              </div>
              <div className="bg-[#0a1020] border border-gray-700/30 rounded-xl p-4">
                <div className="flex items-center justify-center mb-1.5">
                  <Infinity className="w-5 h-5 text-purple-400 mr-2" strokeWidth={1.5} />
                  <span className="text-2xl font-bold text-purple-300" style={{ fontFamily: "'Share Tech Mono', monospace" }}>∞</span>
                </div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Prompt Variations</p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-gray-400 text-sm sm:text-base mb-8 max-w-lg mx-auto leading-relaxed"
            >
              Test your prompt injection skills against our AI defense system. Choose your clearance level — Beginner, Advanced, or Pro — and try to bypass OWASP LLM Top 10 security filters in real time.
            </motion.p>

            <motion.a
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              href="https://ai.trinetlayer.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 hover:border-cyan-400/60 rounded-xl text-cyan-300 hover:text-cyan-200 font-semibold text-base tracking-wider uppercase transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,234,255,0.2)]"
            >
              <Zap className="w-5 h-5" />
              Hack Now
              <ExternalLink className="w-4 h-4 opacity-60" />
            </motion.a>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-gray-600 text-xs mt-5 tracking-wider uppercase"
            >
              Powered by TrinetLayer
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" strokeWidth={1.5} />
            What You'll Face
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + idx * 0.05 }}
                  className="bg-[#0c1018] border border-gray-800/60 rounded-xl p-5 hover:border-cyan-500/20 transition-colors duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/15 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-cyan-400" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#080b10] border border-cyan-500/10 rounded-xl p-5 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-cyan-400" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-white mb-2">About This Simulation</h3>
              <p className="text-[13px] text-gray-400 leading-relaxed">
                Hack The AI is a controlled security simulation environment built by TrinetLayer. All interactions are 
                monitored and logged. The AI defense system uses real OWASP LLM Top 10 security patterns to create 
                an authentic testing experience. No real systems are compromised — this is a safe, educational sandbox 
                for practicing AI security testing techniques.
              </p>
            </div>
          </div>
        </motion.div>
      </ContentSection>
    </AISecurityLayout>
  );
};

export default HackTheAI;
