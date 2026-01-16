import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Target, 
  BookOpen, 
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const LabContainer = ({
  labNumber,
  title,
  owaspId,
  owaspName,
  scenario,
  goal,
  children,
  isCompleted = false,
  onReset,
  securityInsight = null,
  attackerNextSteps = null,
  showResults = false,
  mode = 'beginner'
}) => {
  const [showInsight, setShowInsight] = useState(false);
  const [showAttacker, setShowAttacker] = useState(false);

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-2 text-[13px] text-gray-500 mb-5">
          <Link to="/homepage" className="hover:text-cyan-400 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/ai-security-labs" className="hover:text-cyan-400 transition-colors">AI Labs</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-cyan-400">Lab {String(labNumber).padStart(2, '0')}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-purple-500/15 border border-cyan-500/25 flex items-center justify-center flex-shrink-0">
              <span className="text-cyan-400 font-bold text-xl">{String(labNumber).padStart(2, '0')}</span>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-tight">{title}</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-[10px] font-semibold px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 uppercase tracking-wider">
                  {owaspId}
                </span>
                <span className="text-[13px] text-gray-400">{owaspName}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isCompleted && (
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Completed
              </span>
            )}
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 text-[12px] font-medium text-gray-400 hover:text-white bg-[#080b10] hover:bg-gray-800 border border-gray-700/50 rounded-lg px-3 py-1.5 transition-all duration-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Lab</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-[#080b10] border border-gray-800/30 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
            </div>
            <h3 className="text-[14px] font-semibold text-white">Scenario</h3>
          </div>
          <p className="text-[13px] text-gray-400 leading-relaxed">{scenario}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="bg-[#080b10] border border-gray-800/30 rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-red-400" strokeWidth={1.75} />
            </div>
            <h3 className="text-[14px] font-semibold text-white">Your Goal</h3>
          </div>
          <p className="text-[13px] text-gray-400 leading-relaxed">{goal}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {children}
      </motion.div>

      {showResults && (
        <div className="space-y-4">
          {securityInsight && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#080b10] border border-cyan-500/15 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setShowInsight(!showInsight)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/[0.01] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
                  </div>
                  <span className="text-[14px] font-semibold text-white">Security Insight</span>
                </div>
                {showInsight ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              {showInsight && (
                <div className="px-4 pb-4 border-t border-gray-800/30">
                  <div className="pt-4 space-y-3">
                    <p className="text-[13px] text-gray-400 leading-relaxed">{securityInsight.explanation}</p>
                    <div className="bg-[#070a0f] rounded-xl p-4 border border-gray-800/20">
                      <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5">OWASP Mapping</div>
                      <div className="text-[13px] text-cyan-400">{securityInsight.owaspMapping}</div>
                    </div>
                    <div className="bg-[#070a0f] rounded-xl p-4 border border-gray-800/20">
                      <div className="text-[11px] text-gray-500 uppercase tracking-wider mb-1.5">Real-World Impact</div>
                      <div className="text-[13px] text-gray-300 leading-relaxed">{securityInsight.realWorldImpact}</div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {attackerNextSteps && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#080b10] border border-red-500/15 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setShowAttacker(!showAttacker)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/[0.01] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-400" strokeWidth={1.75} />
                  </div>
                  <span className="text-[14px] font-semibold text-white">What a Real Attacker Would Do Next</span>
                </div>
                {showAttacker ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              {showAttacker && (
                <div className="px-4 pb-4 border-t border-gray-800/30">
                  <div className="pt-4 space-y-3">
                    <p className="text-[13px] text-gray-400 leading-relaxed">{attackerNextSteps}</p>
                    <div className="flex items-center gap-2 text-[11px] text-amber-400 bg-amber-500/[0.05] border border-amber-500/15 rounded-lg p-3">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>This is conceptual education only. No exploitation steps are provided.</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      <div className="text-center pt-4">
        <div className="inline-flex items-center gap-2 text-[11px] text-gray-500">
          <Shield className="w-3.5 h-3.5" />
          All AI responses are simulated for educational purposes only.
        </div>
      </div>
    </div>
  );
};

export default LabContainer;
