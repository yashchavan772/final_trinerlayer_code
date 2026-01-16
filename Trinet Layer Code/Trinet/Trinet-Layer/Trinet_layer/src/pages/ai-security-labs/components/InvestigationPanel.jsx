import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Brain,
  Lock,
  Unlock,
  Activity,
  Lightbulb
} from 'lucide-react';

const InvestigationPanel = ({
  title = "Investigation Panel",
  systemState = {},
  securityEvents = [],
  trustBoundaries = [],
  showHints = false,
  hint = null
}) => {
  const getStatusColor = (value) => {
    if (value === 'ACTIVE' || value === 'HIGH' || value === true) return 'text-emerald-400';
    if (value === 'BYPASSED' || value === 'LOW' || value === false) return 'text-red-400';
    if (value === 'WEAKENED' || value === 'MEDIUM') return 'text-amber-400';
    return 'text-cyan-400';
  };

  return (
    <div className="bg-[#080b10] rounded-xl border border-gray-800/30 overflow-hidden h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800/30 bg-[#070a0f]">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 flex items-center justify-center">
          <Eye className="w-3.5 h-3.5 text-cyan-400" strokeWidth={1.75} />
        </div>
        <span className="text-[13px] font-medium text-white">{title}</span>
      </div>

      <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {Object.keys(systemState).length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium">
              <Brain className="w-3.5 h-3.5" />
              AI Internal State
            </div>
            <div className="bg-[#070a0f] rounded-xl p-3.5 space-y-2 border border-gray-800/20">
              {Object.entries(systemState).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-[12px]">
                  <span className="text-gray-400">{key}</span>
                  <span className={`font-mono font-medium ${getStatusColor(value)}`}>
                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {trustBoundaries.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium">
              <Shield className="w-3.5 h-3.5" />
              Trust Boundaries
            </div>
            <div className="space-y-2">
              {trustBoundaries.map((boundary, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg text-[12px] ${
                    boundary.status === 'intact' 
                      ? 'bg-emerald-500/[0.05] border border-emerald-500/15 text-emerald-400'
                      : boundary.status === 'violated'
                      ? 'bg-red-500/[0.05] border border-red-500/15 text-red-400'
                      : 'bg-amber-500/[0.05] border border-amber-500/15 text-amber-400'
                  }`}
                >
                  {boundary.status === 'intact' ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5" />
                  )}
                  <span className="font-medium">{boundary.name}</span>
                  <span className="ml-auto opacity-70 text-[11px]">{boundary.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {securityEvents.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-wider font-medium">
              <Activity className="w-3.5 h-3.5" />
              Security Events
            </div>
            <div className="space-y-2">
              <AnimatePresence>
                {securityEvents.slice(-5).map((event, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg text-[12px] ${
                      event.type === 'success' 
                        ? 'bg-emerald-500/[0.05] border border-emerald-500/15'
                        : event.type === 'warning'
                        ? 'bg-amber-500/[0.05] border border-amber-500/15'
                        : event.type === 'blocked'
                        ? 'bg-[#0c1017] border border-gray-800/30'
                        : 'bg-red-500/[0.05] border border-red-500/15'
                    }`}
                  >
                    {event.type === 'success' && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />}
                    {event.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />}
                    {event.type === 'blocked' && <XCircle className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />}
                    {event.type === 'vulnerability' && <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />}
                    <span className={
                      event.type === 'success' ? 'text-emerald-300' :
                      event.type === 'warning' ? 'text-amber-300' :
                      event.type === 'blocked' ? 'text-gray-300' :
                      'text-red-300'
                    }>{event.message}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {showHints && hint && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-purple-500/[0.05] border border-purple-500/15 rounded-xl p-3.5"
          >
            <div className="flex items-center gap-2 text-[11px] text-purple-400 mb-2 font-medium">
              <Lightbulb className="w-3.5 h-3.5" />
              Hint
            </div>
            <p className="text-[12px] text-purple-200 leading-relaxed">{hint}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InvestigationPanel;
