import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Brain, 
  Layers, 
  Shield, 
  AlertTriangle, 
  Terminal, 
  FlaskConical,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { path: '/ai-security-overview', label: 'Overview', icon: Brain, shortLabel: 'Overview' },
  { path: '/ai-security-anatomy', label: 'Architecture', icon: Layers, shortLabel: 'Arch' },
  { path: '/ai-security-threat-modeling', label: 'Threat Modeling', icon: Shield, shortLabel: 'Threats' },
  { path: '/ai-security-owasp-top10', label: 'OWASP Top 10', icon: AlertTriangle, shortLabel: 'OWASP' },
  { path: '/ai-security-prompts', label: 'Testing Prompts', icon: Terminal, shortLabel: 'Prompts' },
  { path: '/ai-security-labs', label: 'AI Labs', icon: FlaskConical, shortLabel: 'Labs' }
];

const AISecurityNav = ({ showProgress = false }) => {
  const location = useLocation();
  const currentIndex = navItems.findIndex(item => location.pathname === item.path);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / navItems.length) * 100 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mb-8"
    >
      {showProgress && currentIndex >= 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="ai-helper">Learning Progress</span>
            <span className="ai-mono text-cyan-400">{currentIndex + 1}/{navItems.length}</span>
          </div>
          <div className="h-1 bg-gray-800/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
            />
          </div>
        </div>
      )}
      
      <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 -webkit-overflow-scrolling-touch">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isPast = currentIndex > index;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl ai-nav whitespace-nowrap transition-all duration-300 min-h-[44px] ${
                isActive 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                  : isPast
                    ? 'text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/5 border border-transparent hover:border-cyan-500/20'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02] border border-transparent hover:border-gray-700/50'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-cyan-400' : isPast ? 'text-gray-500' : 'text-gray-600'}`} strokeWidth={1.75} />
              <span className="hidden md:inline">{item.label}</span>
              <span className="md:hidden text-xs">{item.shortLabel}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-cyan-500/10 rounded-xl border border-cyan-500/30 -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
      
      {currentIndex >= 0 && currentIndex < navItems.length - 1 && (
        <div className="flex justify-end mt-3">
          <Link
            to={navItems[currentIndex + 1].path}
            className="group flex items-center gap-2 ai-helper hover:text-cyan-400 transition-colors"
          >
            <span>Next: {navItems[currentIndex + 1].label}</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}
    </motion.div>
  );
};

export default AISecurityNav;
