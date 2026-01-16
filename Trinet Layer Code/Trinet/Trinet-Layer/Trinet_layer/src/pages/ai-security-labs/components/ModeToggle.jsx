import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap } from 'lucide-react';

const ModeToggle = ({ mode, onModeChange }) => {
  return (
    <div className="flex items-center gap-1 bg-[#080b10] border border-gray-800/30 rounded-xl p-1">
      <button
        onClick={() => onModeChange('beginner')}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors ${
          mode === 'beginner' 
            ? 'text-white' 
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        {mode === 'beginner' && (
          <motion.div
            layoutId="mode-bg"
            className="absolute inset-0 bg-cyan-500/10 border border-cyan-500/25 rounded-lg"
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        <Lightbulb className="w-4 h-4 relative z-10" strokeWidth={1.75} />
        <span className="relative z-10 hidden sm:inline">Beginner</span>
      </button>
      <button
        onClick={() => onModeChange('pro')}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium transition-colors ${
          mode === 'pro' 
            ? 'text-white' 
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        {mode === 'pro' && (
          <motion.div
            layoutId="mode-bg"
            className="absolute inset-0 bg-purple-500/10 border border-purple-500/25 rounded-lg"
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        <Zap className="w-4 h-4 relative z-10" strokeWidth={1.75} />
        <span className="relative z-10 hidden sm:inline">Pro</span>
      </button>
    </div>
  );
};

export default ModeToggle;
