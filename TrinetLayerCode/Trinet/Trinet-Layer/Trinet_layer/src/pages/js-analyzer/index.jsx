import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCode, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Server,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  Info,
  Settings,
  Zap,
  Shield,
  Eye,
  Lock,
  Key,
  Globe,
  AlertOctagon,
  Download,
  Copy,
  FileText,
  Code
} from 'lucide-react';
import Sidebar from 'components/navigation/Sidebar';

const API_BASE_URL = '';

const severityColors = {
  critical: { bg: 'bg-red-900/30', border: 'border-red-700', text: 'text-red-400', badge: 'bg-red-600' },
  high: { bg: 'bg-orange-900/30', border: 'border-orange-700', text: 'text-orange-400', badge: 'bg-orange-600' },
  medium: { bg: 'bg-yellow-900/30', border: 'border-yellow-700', text: 'text-yellow-400', badge: 'bg-yellow-600' },
  low: { bg: 'bg-blue-900/30', border: 'border-blue-700', text: 'text-blue-400', badge: 'bg-blue-600' },
  info: { bg: 'bg-gray-800', border: 'border-gray-700', text: 'text-gray-400', badge: 'bg-gray-600' }
};

const SeverityBadge = ({ severity }) => {
  const colors = severityColors[severity] || severityColors.info;
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${colors.badge} text-white`}>
      {severity}
    </span>
  );
};

const SecurityTagBadge = ({ tag }) => {
  if (!tag) return null;
  const tagColors = {
    SECRET_EXPOSURE: 'bg-red-900/50 text-red-300 border-red-700',
    AUTH_RISK: 'bg-orange-900/50 text-orange-300 border-orange-700',
    POSSIBLE_XSS: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    POSSIBLE_IDOR: 'bg-purple-900/50 text-purple-300 border-purple-700'
  };
  
  return (
    <span className={`px-2 py-0.5 text-xs rounded border ${tagColors[tag] || 'bg-gray-800 text-gray-300 border-gray-700'}`}>
      {tag}
    </span>
  );
};

const FindingCard = ({ finding, index }) => {
  const [expanded, setExpanded] = useState(false);
  const colors = severityColors[finding.severity] || severityColors.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className={`${colors.bg} border ${colors.border} rounded-lg p-4 mb-3`}
    >
      <div 
        className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <SeverityBadge severity={finding.severity} />
            <span className="font-mono font-bold text-cyan-400 text-sm">{finding.rule_id}</span>
            <SecurityTagBadge tag={finding.security_tag} />
          </div>
          <p className="text-sm text-white font-medium">{finding.rule_name}</p>
          <p className="text-xs text-gray-400 mt-1">{finding.description}</p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-gray-400">
            {Math.round(finding.confidence * 100)}% conf
          </span>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
              <div>
                <span className="text-xs text-gray-500 uppercase block mb-1">File</span>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-cyan-300 break-all bg-gray-900 px-2 py-1 rounded flex-1">{finding.file_url}</code>
                  <a href={finding.file_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500 uppercase block mb-1">Line</span>
                  <span className="text-sm text-white">{finding.line_number}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase block mb-1">Risk Score</span>
                  <span className="text-sm text-white">{finding.risk_score ? (finding.risk_score * 100).toFixed(0) + '%' : 'N/A'}</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase block mb-1">Value</span>
                <code className="text-xs text-red-400 break-all bg-gray-900 px-2 py-1 rounded block">{finding.value}</code>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SummaryCard = ({ summary, jsFiles, subdomains, executionTime }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-6">
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <div className="text-2xl font-bold text-white">{summary.total_findings}</div>
      <div className="text-xs text-gray-400">Total Findings</div>
    </div>
    <div className="bg-red-900/30 rounded-lg p-4 border border-red-800">
      <div className="text-2xl font-bold text-red-400">{summary.critical}</div>
      <div className="text-xs text-red-400">Critical</div>
    </div>
    <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-800">
      <div className="text-2xl font-bold text-orange-400">{summary.high}</div>
      <div className="text-xs text-orange-400">High</div>
    </div>
    <div className="bg-yellow-900/30 rounded-lg p-4 border border-yellow-800">
      <div className="text-2xl font-bold text-yellow-400">{summary.medium}</div>
      <div className="text-xs text-yellow-400">Medium</div>
    </div>
    <div className="bg-cyan-900/30 rounded-lg p-4 border border-cyan-800">
      <div className="text-2xl font-bold text-cyan-400">{jsFiles}</div>
      <div className="text-xs text-cyan-400">JS Files</div>
    </div>
    <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-800">
      <div className="text-2xl font-bold text-purple-400">{executionTime}s</div>
      <div className="text-xs text-purple-400">Time</div>
    </div>
  </div>
);

const JSAnalyzer = () => {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      
      <main className="flex-1 ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-xl">
              <FileCode className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono">
                JS Analyzer & Recon
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Discover secrets, endpoints, and dangerous patterns in JavaScript files
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-amber-900/40 via-yellow-900/30 to-orange-900/40 border-2 border-yellow-500/50 rounded-2xl p-8 sm:p-12 shadow-[0_0_40px_rgba(234,179,8,0.15)]"
          >
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-yellow-500/20 rounded-full mb-6 animate-pulse">
                <Settings className="w-12 h-12 text-yellow-400" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-4">
                Feature Upgrade in Progress
              </h2>
              
              <div className="max-w-2xl">
                <p className="text-lg sm:text-xl text-yellow-100/90 leading-relaxed mb-6">
                  We're currently adding advanced features to the JavaScript Analyzer. We'll update you soon with the best JS Analyzer experience.
                </p>
                
                <div className="flex items-center justify-center gap-2 text-yellow-400/80">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-medium">Enhancing capabilities...</span>
                </div>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-gray-300">Advanced Pattern Detection</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Enhanced Security Analysis</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg border border-gray-700">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm text-gray-300">Improved Accuracy</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default JSAnalyzer;
