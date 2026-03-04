import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  FlaskConical,
  MessageSquare,
  Theater,
  Ghost,
  UserCog,
  FileWarning,
  CheckCircle,
  ArrowRight,
  Shield,
  Lightbulb,
  Zap,
  BookOpen,
  Clock,
  Target
} from 'lucide-react';
import Sidebar from 'components/navigation/Sidebar';
import { AISecurityNav } from 'components/ai-security';

const LABS = [
  {
    id: 1,
    title: "The Helpful Chatbot That Talks Too Much",
    shortTitle: "Prompt Injection",
    icon: MessageSquare,
    owaspId: "LLM-01",
    description: "Investigate whether an HR chatbot can be tricked into revealing its hidden system instructions through multi-turn manipulation.",
    difficulty: "Beginner",
    duration: "10-15 min",
    path: "/ai-security-labs/lab-1-prompt-injection"
  },
  {
    id: 2,
    title: "Roleplay Gone Wrong",
    shortTitle: "Jailbreak",
    icon: Theater,
    owaspId: "LLM-01",
    description: "Test whether creative roleplay and character-based prompts can weaken an AI's safety guardrails. Track resistance scores in real-time.",
    difficulty: "Intermediate",
    duration: "15-20 min",
    path: "/ai-security-labs/lab-2-jailbreak"
  },
  {
    id: 3,
    title: "The Secret That Never Existed",
    shortTitle: "Hallucination",
    icon: Ghost,
    owaspId: "LLM-06",
    description: "Investigate whether an AI connected to internal documentation fabricates realistic-looking but fake sensitive information.",
    difficulty: "Intermediate",
    duration: "10-15 min",
    path: "/ai-security-labs/lab-3-hallucination"
  },
  {
    id: 4,
    title: "Are You Really an Admin?",
    shortTitle: "Excessive Agency",
    icon: UserCog,
    owaspId: "LLM-08",
    description: "Test whether an AI assistant properly verifies user identity before performing privileged administrative actions.",
    difficulty: "Advanced",
    duration: "15-20 min",
    path: "/ai-security-labs/lab-4-excessive-agency"
  },
  {
    id: 5,
    title: "When Documents Lie",
    shortTitle: "RAG Poisoning",
    icon: FileWarning,
    owaspId: "LLM-03",
    description: "Observe how an AI handles conflicting documents and whether malicious uploads can override authentic policies.",
    difficulty: "Advanced",
    duration: "15-20 min",
    path: "/ai-security-labs/lab-5-rag-poisoning"
  }
];

const getDifficultyStyles = (difficulty) => {
  switch(difficulty) {
    case 'Beginner': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'Intermediate': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'Advanced': return 'bg-red-500/10 text-red-400 border-red-500/20';
    default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

const LabCard = ({ lab, index, completed }) => {
  const Icon = lab.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link 
        to={lab.path}
        className="group block bg-[#080b10] border border-gray-800/30 rounded-xl p-5 hover:border-cyan-500/30 hover:bg-[#0a0e14] transition-all duration-300"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:border-cyan-500/40 transition-all duration-300">
            <Icon className="w-5 h-5 text-cyan-400" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="ai-badge font-mono text-gray-500 tracking-wide">LAB {String(lab.id).padStart(2, '0')}</span>
              <span className="ai-badge px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md text-red-400">
                {lab.owaspId}
              </span>
              {completed && (
                <span className="ai-badge px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Completed
                </span>
              )}
            </div>
            <h3 className="ai-body font-semibold text-white mb-1.5 group-hover:text-cyan-400 transition-colors leading-snug">
              {lab.title}
            </h3>
            <p className="ai-helper mb-3 line-clamp-2">
              {lab.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className={`ai-badge px-2 py-1 rounded-md border ${getDifficultyStyles(lab.difficulty)}`}>
                {lab.difficulty}
              </span>
              <span className="ai-badge text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lab.duration}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all ml-auto hidden sm:block" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const AISecurityLabs = () => {
  const [completedLabs, setCompletedLabs] = useState([]);

  useEffect(() => {
    const loadProgress = () => {
      const saved = localStorage.getItem('ai-labs-completed');
      if (saved) {
        try {
          setCompletedLabs(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse lab progress:', e);
        }
      }
    };
    loadProgress();
    window.addEventListener('storage', loadProgress);
    return () => window.removeEventListener('storage', loadProgress);
  }, []);

  const progressPercent = (completedLabs.length / 5) * 100;

  return (
    <div className="flex min-h-screen bg-[#080b12]">
      <Sidebar />
      
      <main className="flex-1 lg:ml-[280px] lg:w-[calc(100%-280px)] py-5 pr-5 pl-16 sm:py-6 sm:pr-6 sm:pl-16 lg:p-8 transition-all duration-300 overflow-x-hidden">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <div className="ai-breadcrumb flex items-center gap-2 mb-5">
              <Link to="/homepage" className="hover:text-cyan-400 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link to="/ai-security-overview" className="hover:text-cyan-400 transition-colors">AI Security</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-cyan-400">AI Labs</span>
            </div>
            
            <AISecurityNav showProgress />
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 mt-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-purple-500/15 border border-cyan-500/25 flex items-center justify-center">
                  <FlaskConical className="w-7 h-7 text-cyan-400" strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="ai-title">
                    AI Security Labs
                  </h1>
                  <p className="ai-subtitle mt-1">Hands-on investigation of AI vulnerabilities</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="ai-helper">
                  Progress: <span className="text-cyan-400 ai-mono">{completedLabs.length}/5</span>
                </div>
                <div className="h-2 w-28 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/30">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-cyan-500/[0.03] to-purple-500/[0.03] border border-cyan-500/15 rounded-2xl p-5 mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-cyan-400" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="ai-card-title mb-2">What Are These Labs?</h3>
                <p className="ai-body-sm mb-4">
                  Interactive training environments where you investigate simulated AI systems with real-world vulnerabilities. 
                  Each lab presents a realistic scenario - you're not clicking buttons, you're solving security puzzles through investigation.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-[12px] text-cyan-400">
                    <div className="w-6 h-6 rounded-md bg-cyan-500/10 flex items-center justify-center">
                      <Lightbulb className="w-3.5 h-3.5" />
                    </div>
                    Beginner mode with hints
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-purple-400">
                    <div className="w-6 h-6 rounded-md bg-purple-500/10 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    Pro mode for experts
                  </div>
                  <div className="flex items-center gap-2 text-[12px] text-gray-400">
                    <div className="w-6 h-6 rounded-md bg-gray-500/10 flex items-center justify-center">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    OWASP LLM Top 10 mapped
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-5 flex items-center justify-between"
          >
            <h2 className="text-[16px] font-semibold text-white">Available Labs</h2>
            <span className="text-[12px] text-gray-500 font-medium">5 labs • ~75 min total</span>
          </motion.div>

          <div className="space-y-4">
            {LABS.map((lab, index) => (
              <LabCard 
                key={lab.id} 
                lab={lab} 
                index={index}
                completed={completedLabs.includes(lab.id)}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-[#080b10] border border-amber-500/15 rounded-xl p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-amber-400" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-white mb-2">Educational Disclaimer</h3>
                <p className="text-[13px] text-gray-400 leading-relaxed">
                  All AI responses in these labs are simulated for educational purposes. No real AI APIs are used. 
                  The scenarios demonstrate vulnerabilities that exist in real systems to help you understand how to identify 
                  and defend against them. Never attempt these techniques on systems you don't own or have explicit permission to test.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AISecurityLabs;
