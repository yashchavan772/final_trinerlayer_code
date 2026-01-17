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
  const [domain, setDomain] = useState('');
  const [mode, setMode] = useState('fast');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState({
    skip_vendor: true,
    include_subdomains: false,
    scope_include: '',
    scope_exclude: ''
  });

  const handleScan = async () => {
    if (!domain.trim() || !disclaimerAccepted) return;
    
    setIsScanning(true);
    setError(null);
    setScanResult(null);
    
    try {
      const requestBody = {
        domain: domain.trim(),
        mode: mode,
        skip_vendor: advancedSettings.skip_vendor,
        include_subdomains: advancedSettings.include_subdomains
      };
      
      if (advancedSettings.scope_include.trim()) {
        requestBody.scope_include = advancedSettings.scope_include.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (advancedSettings.scope_exclude.trim()) {
        requestBody.scope_exclude = advancedSettings.scope_exclude.split(',').map(s => s.trim()).filter(Boolean);
      }
      
      const response = await fetch(`${API_BASE_URL}/api/js-analyzer/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Scan failed. Please try again.');
      }
      
      const data = await response.json();
      setScanResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during the scan.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && disclaimerAccepted && domain.trim() && !isScanning) {
      handleScan();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

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

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Domain
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/60" />
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="example.com or *.example.com"
                  className="w-full pl-10 pr-4 py-3.5 bg-[#0d1117]/90 backdrop-blur-md border border-cyan-500/20 rounded-xl text-cyan-50 placeholder-cyan-300/40 focus:outline-none focus:bg-[#0d1117] focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(0,234,255,0.2)] hover:border-cyan-500/30 hover:shadow-[0_0_12px_rgba(0,234,255,0.1)] transition-all duration-300 font-mono"
                  disabled={isScanning}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('fast')}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${mode === 'fast' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                >
                  <Zap className="w-5 h-5 inline mr-1" />
                  FAST
                </button>
                <button
                  onClick={() => setMode('pro')}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${mode === 'pro' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                >
                  <Shield className="w-5 h-5 inline mr-1" />
                  PRO
                </button>
              </div>
              <button
                onClick={handleScan}
                disabled={!domain.trim() || !disclaimerAccepted || isScanning}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-medium rounded-lg hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileCode className="w-5 h-5" />
                    Start Scan
                  </>
                )}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 items-start justify-between">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={disclaimerAccepted}
                  onChange={(e) => setDisclaimerAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-sm text-yellow-400">
                  <AlertTriangle className="inline w-4 h-4 mr-1" />
                  <strong>Legal Disclaimer:</strong>{' '}
                  <span className="text-gray-400">
                    Only scan domains you own or have explicit authorization to test.
                  </span>
                </span>
              </label>
              
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
              >
                <Settings className="w-4 h-4" />
                Advanced Settings
                {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={advancedSettings.skip_vendor}
                        onChange={(e) => setAdvancedSettings(prev => ({ ...prev, skip_vendor: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500"
                      />
                      <span className="text-sm text-gray-300">Skip vendor/framework bundles</span>
                    </label>
                    
                    {mode === 'pro' && (
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={advancedSettings.include_subdomains}
                          onChange={(e) => setAdvancedSettings(prev => ({ ...prev, include_subdomains: e.target.checked }))}
                          className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-purple-500"
                        />
                        <span className="text-sm text-gray-300">Enumerate subdomains (PRO)</span>
                      </label>
                    )}
                    
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-muted-foreground mb-1">Scope Include (comma-separated)</label>
                      <input
                        type="text"
                        value={advancedSettings.scope_include}
                        onChange={(e) => setAdvancedSettings(prev => ({ ...prev, scope_include: e.target.value }))}
                        placeholder="api, app, static"
                        className="w-full px-4 py-2.5 bg-[#0d1117]/90 backdrop-blur-md border border-cyan-500/20 rounded-xl text-sm text-cyan-50 placeholder-cyan-300/40 focus:outline-none focus:bg-[#0d1117] focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(0,234,255,0.2)] hover:border-cyan-500/30 transition-all duration-300"
                      />
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-muted-foreground mb-1">Scope Exclude (comma-separated)</label>
                      <input
                        type="text"
                        value={advancedSettings.scope_exclude}
                        onChange={(e) => setAdvancedSettings(prev => ({ ...prev, scope_exclude: e.target.value }))}
                        placeholder="cdn, analytics, tracking"
                        className="w-full px-4 py-2.5 bg-[#0d1117]/90 backdrop-blur-md border border-cyan-500/20 rounded-xl text-sm text-cyan-50 placeholder-cyan-300/40 focus:outline-none focus:bg-[#0d1117] focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(0,234,255,0.2)] hover:border-cyan-500/30 transition-all duration-300"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-400">
                <strong className="text-white">Mode Comparison:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li><span className="text-cyan-400 font-medium">FAST:</span> JS discovery from Wayback + live crawl. Secret and endpoint detection.</li>
                  <li><span className="text-purple-400 font-medium">PRO:</span> Subdomain enumeration + comprehensive analysis with deobfuscation.</li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-400">
                <AlertOctagon className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {scanResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Scan Complete
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(scanResult, null, 2))}
                    className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded text-sm hover:bg-gray-700 flex items-center gap-1"
                  >
                    <Copy className="w-4 h-4" />
                    Copy JSON
                  </button>
                </div>
              </div>
              
              <SummaryCard 
                summary={scanResult.summary} 
                jsFiles={scanResult.js_files_analyzed}
                subdomains={scanResult.subdomains_checked}
                executionTime={scanResult.execution_time_seconds}
              />

              {scanResult.summary.secrets_found > 0 || scanResult.summary.endpoints_found > 0 || scanResult.summary.dangerous_patterns > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-red-400" />
                      <span className="text-lg font-bold text-white">{scanResult.summary.secrets_found}</span>
                    </div>
                    <div className="text-xs text-gray-400">Secrets</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <span className="text-lg font-bold text-white">{scanResult.summary.endpoints_found}</span>
                    </div>
                    <div className="text-xs text-gray-400">Endpoints</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                      <span className="text-lg font-bold text-white">{scanResult.summary.dangerous_patterns}</span>
                    </div>
                    <div className="text-xs text-gray-400">Dangerous</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-orange-400" />
                      <span className="text-lg font-bold text-white">{scanResult.summary.auth_issues}</span>
                    </div>
                    <div className="text-xs text-gray-400">Auth Issues</div>
                  </div>
                </div>
              ) : null}

              <h3 className="text-lg font-semibold text-white mb-4">
                Findings ({scanResult.findings.length})
              </h3>
              
              {scanResult.findings.length === 0 ? (
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-gray-300">No security issues found in the analyzed JavaScript files.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {scanResult.findings.map((finding, index) => (
                    <FindingCard key={`${finding.rule_id}-${index}`} finding={finding} index={index} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JSAnalyzer;
