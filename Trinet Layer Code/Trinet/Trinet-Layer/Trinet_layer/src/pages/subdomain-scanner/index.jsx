import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
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
  Clock,
  Archive,
  FileCode,
  Coffee,
  X,
  Shield,
  Zap,
  Layers,
  Target,
  Eye,
  Lock,
  TrendingUp,
  Database,
  Sparkles,
  Award,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import Sidebar from 'components/navigation/Sidebar';

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border ${
      type === 'success' 
        ? 'bg-green-900/90 border-green-700 text-green-300' 
        : type === 'error'
        ? 'bg-red-900/90 border-red-700 text-red-300'
        : 'bg-gray-900/90 border-gray-700 text-gray-300'
    }`}
  >
    {type === 'success' ? (
      <CheckCircle className="w-5 h-5" />
    ) : type === 'error' ? (
      <AlertTriangle className="w-5 h-5" />
    ) : (
      <Info className="w-5 h-5" />
    )}
    <span className="text-sm font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 p-1 hover:bg-white/10 rounded">
      <X className="w-4 h-4" />
    </button>
  </motion.div>
);

const sanitizeValue = (value) => {
  if (value === null || value === undefined) return 'N/A';
  let strValue = typeof value === 'string' ? value : String(value);
  strValue = strValue.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
  const dangerousChars = ['=', '+', '-', '@', '\t', '\r', '\n'];
  if (dangerousChars.some(char => strValue.startsWith(char))) {
    strValue = "'" + strValue;
  }
  return strValue;
};

const escapeCSV = (value) => {
  if (value === null || value === undefined) return '';
  const strValue = String(value);
  if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
    return `"${strValue.replace(/"/g, '""')}"`;
  }
  return strValue;
};

const exportToCSV = (results, domain, scanTimestamp) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const safeDomain = domain.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = `subdomain-enum-${safeDomain}-${timestamp}.csv`;
  
  const headers = [
    'Subdomain',
    'Status',
    'Risk Level',
    'Alive',
    'HTTPS URL',
    'HTTP URL',
    'Scan Timestamp'
  ];
  
  const rows = results.map(result => {
    const safeSubdomain = sanitizeValue(result.subdomain);
    return [
      escapeCSV(safeSubdomain),
      escapeCSV(result.alive ? 'Responding' : 'Not Responding'),
      escapeCSV((result.risk_level || 'N/A').toUpperCase()),
      escapeCSV(result.alive ? 'Yes' : 'No'),
      escapeCSV(result.alive ? `https://${result.subdomain}` : 'N/A'),
      escapeCSV(result.alive ? `http://${result.subdomain}` : 'N/A'),
      escapeCSV(scanTimestamp || new Date().toISOString())
    ].join(',');
  });
  
  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return filename;
};

const ScanInProgressPopup = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md w-full shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/20 rounded-lg">
                <Coffee className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-white">Scan in Progress</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            You've enabled advanced options. This scan may take a little longer.
            <br /><br />
            Sit back, grab a coffee <span className="text-xl">☕</span>, and relax while we complete the analysis.
          </p>
          
          <button
            onClick={onClose}
            className="w-full py-3 bg-accent text-primary font-medium rounded-lg hover:bg-accent/90 transition-all shadow-glow-sm"
          >
            Got it
          </button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const API_BASE_URL = '';

const getRiskColor = (risk) => {
  switch (risk) {
    case 'high': return 'text-red-400 bg-red-900/30 border-red-700';
    case 'medium': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
    case 'low': return 'text-green-400 bg-green-900/30 border-green-700';
    default: return 'text-gray-400 bg-gray-800 border-gray-700';
  }
};

const getRiskBadge = (risk) => {
  const colors = getRiskColor(risk);
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded border ${colors}`}>
      {risk.toUpperCase()}
    </span>
  );
};

const SubdomainCard = ({ result, index }) => {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:bg-gray-800/70 transition-colors"
    >
      <div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Server className={`w-4 h-4 flex-shrink-0 ${result.alive ? 'text-green-400' : 'text-gray-500'}`} />
          <span className="font-mono text-sm text-white truncate">{result.subdomain}</span>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {result.risk_level && getRiskBadge(result.risk_level)}
          <span className={`px-2 py-0.5 text-xs rounded border ${result.alive ? 'bg-green-900/30 text-green-400 border-green-700' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
            {result.alive ? 'ALIVE' : 'NOT ALIVE'}
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
            <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400 block mb-1">Status</span>
                <span className={result.alive ? 'text-green-400' : 'text-gray-500'}>
                  {result.alive ? 'Responding' : 'Not Responding'}
                </span>
              </div>
              {result.risk_level && (
                <div>
                  <span className="text-gray-400 block mb-1">Risk Level</span>
                  <span className={`capitalize ${result.risk_level === 'high' ? 'text-red-400' : result.risk_level === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {result.risk_level}
                  </span>
                </div>
              )}
            </div>
            {result.alive && (
              <div className="mt-4 flex gap-2">
                <a 
                  href={`https://${result.subdomain}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Open HTTPS <ExternalLink className="w-3 h-3" />
                </a>
                <a 
                  href={`http://${result.subdomain}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
                >
                  Open HTTP <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const AdvancedSettingsCheckbox = ({ checked, onChange, disabled, icon: Icon, label, description }) => (
  <label className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${checked ? 'bg-accent/10 border-accent/50' : 'bg-surface border-border hover:border-accent/30'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      className="mt-0.5 w-4 h-4 rounded border-border bg-surface text-accent focus:ring-accent"
    />
    <div className="flex-1">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Icon className="w-4 h-4 text-accent" />
        {label}
      </div>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
  </label>
);

const FeatureCard = ({ icon: Icon, title, description, highlight }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`relative p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
      highlight 
        ? 'bg-accent/10 border-accent/30 hover:border-accent/50' 
        : 'bg-surface border-border hover:border-accent/30'
    }`}
  >
    {highlight && (
      <div className="absolute -top-2 -right-2">
        <span className="flex items-center gap-1 px-2 py-0.5 bg-accent text-primary text-xs font-medium rounded-full shadow-glow-sm">
          <Sparkles className="w-3 h-3" />
          PRO
        </span>
      </div>
    )}
    <div className={`inline-flex p-2.5 rounded-lg mb-3 ${highlight ? 'bg-accent/20' : 'bg-muted'}`}>
      <Icon className="w-5 h-5 text-accent" />
    </div>
    <h4 className="text-base font-semibold text-white mb-2">{title}</h4>
    <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);

const StatCard = ({ value, label, icon: Icon }) => (
  <div className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
    <div className="p-2 bg-cyan-900/30 rounded-lg">
      <Icon className="w-5 h-5 text-cyan-400" />
    </div>
    <div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  </div>
);

const WhyThisScannerSection = () => {
  const [expanded, setExpanded] = useState(false);

  const coreFeatures = [
    {
      icon: Layers,
      title: "Multi-Layer Intelligence",
      description: "Combines multiple reconnaissance layers including passive enumeration, active probing, and historical analysis for comprehensive coverage."
    },
    {
      icon: Target,
      title: "Risk Prioritization Engine",
      description: "Automatically classifies discovered assets by risk level (High, Medium, Low) based on subdomain naming patterns commonly associated with sensitive infrastructure."
    },
    {
      icon: Eye,
      title: "Alive Detection",
      description: "Validates each discovered subdomain with real-time HTTP/HTTPS probing to identify active assets, saving hours of manual verification."
    },
    {
      icon: Shield,
      title: "Security-First Design",
      description: "Built with strict input validation, rate limiting, and timeout controls. Blocks private IPs, localhost, and dangerous schemes automatically."
    }
  ];

  const advancedFeatures = [
    {
      icon: Clock,
      title: "Historical Intelligence",
      description: "Uncover forgotten subdomains from the past. Discover development, staging, and test environments that may have been abandoned but still accessible.",
      highlight: true
    },
    {
      icon: Database,
      title: "Web Archive Analysis",
      description: "Extract subdomain references from massive web archives containing billions of indexed pages. Find assets others miss.",
      highlight: true
    },
    {
      icon: FileCode,
      title: "JavaScript Intelligence",
      description: "Parse publicly available JavaScript bundles to extract hardcoded subdomain references, API endpoints, and internal hostnames.",
      highlight: true
    },
    {
      icon: Zap,
      title: "Parallel Processing",
      description: "Intelligent pipeline executes multiple intelligence modules simultaneously, delivering comprehensive results in seconds, not hours.",
      highlight: true
    }
  ];

  const complianceFeatures = [
    {
      icon: Award,
      title: "Bug Bounty Compliant",
      description: "Uses only non-intrusive, passive-safe techniques. No zone transfers, no recursive enumeration, no exploitation attempts. Safe for authorized testing."
    },
    {
      icon: Lock,
      title: "Black-Box Architecture",
      description: "Complete separation between scanning engine and results. API responses contain only essential data - no technique exposure, no source leakage."
    },
    {
      icon: TrendingUp,
      title: "Enterprise-Grade Scalability",
      description: "Handles domains with thousands of subdomains efficiently. Intelligent deduplication, normalization, and result merging for clean output."
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Queries distributed data sources across multiple geographic regions, ensuring comprehensive subdomain discovery regardless of target location."
    }
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl mb-6 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-semibold text-white block">Why This Scanner?</span>
            <span className="text-xs text-gray-400">Discover what makes this the most comprehensive subdomain scanner</span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard value="5+" icon={Layers} label="Intelligence Layers" />
                <StatCard value="3" icon={Target} label="Risk Levels" />
                <StatCard value="100%" icon={Shield} label="Non-Intrusive" />
                <StatCard value="<60s" icon={Zap} label="Avg Scan Time" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-cyan-400" />
                  Core Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {coreFeatures.map((feature, idx) => (
                    <FeatureCard key={idx} {...feature} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Advanced Intelligence Modules
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Enable these optional modules in Advanced Settings for deeper reconnaissance coverage.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {advancedFeatures.map((feature, idx) => (
                    <FeatureCard key={idx} {...feature} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-400" />
                  Compliance & Architecture
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {complianceFeatures.map((feature, idx) => (
                    <FeatureCard key={idx} {...feature} />
                  ))}
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/20 rounded-xl">
                    <Target className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white mb-2">Designed for Security Researchers</h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Built by security researchers, for security researchers. Every feature is designed with real-world 
                      bug bounty and penetration testing workflows in mind. From the risk prioritization that highlights 
                      high-value targets first, to the comprehensive intelligence gathering that leaves no stone unturned — 
                      this scanner is engineered to give you the edge in your reconnaissance phase.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <div className="text-2xl font-bold text-cyan-400">Passive</div>
                  <div className="text-xs text-gray-400 mt-1">Certificate Transparency & DNS</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <div className="text-2xl font-bold text-accent">Active</div>
                  <div className="text-xs text-gray-400 mt-1">Intelligent Probing & Validation</div>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <div className="text-2xl font-bold text-green-400">Historical</div>
                  <div className="text-xs text-gray-400 mt-1">Archive & Time Machine Analysis</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SubdomainScanner = () => {
  const [domain, setDomain] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [scanTimestamp, setScanTimestamp] = useState(null);
  const [error, setError] = useState(null);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showScanPopup, setShowScanPopup] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [advancedSettings, setAdvancedSettings] = useState({
    wayback: false,
    common_crawl: false,
    public_js: false
  });

  const showExportButton = scanCompleted && scanResult?.results?.length > 0;

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleExportToCSV = async () => {
    if (!scanResult?.results?.length) {
      showToast('No data available to export', 'error');
      return;
    }

    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const filename = exportToCSV(
        scanResult.results,
        scanResult.domain,
        scanTimestamp
      );
      
      showToast(`CSV file downloaded successfully: ${filename}`, 'success');
    } catch (err) {
      console.error('Export error:', err);
      showToast('Failed to export CSV file. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleAdvancedChange = (key, value) => {
    setAdvancedSettings(prev => ({ ...prev, [key]: value }));
  };

  const anyAdvancedEnabled = Object.values(advancedSettings).some(v => v);

  const handleScan = async () => {
    if (!domain.trim() || !disclaimerAccepted) return;
    
    setIsScanning(true);
    setError(null);
    setScanResult(null);
    setScanCompleted(false);
    setScanTimestamp(null);
    
    if (anyAdvancedEnabled) {
      setShowScanPopup(true);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/recon/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          domain: domain.trim(),
          advanced_passive: advancedSettings
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'An error occurred during the scan. Please try again.');
      }
      
      const data = await response.json();
      setScanResult(data);
      setScanCompleted(true);
      setScanTimestamp(new Date().toISOString());
    } catch (err) {
      setError('An error occurred during the scan. Please try again.');
      setScanCompleted(false);
    } finally {
      setIsScanning(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && disclaimerAccepted && domain.trim() && !isScanning) {
      handleScan();
    }
  };

  return (
    <>
      <ScanInProgressPopup 
        isOpen={showScanPopup} 
        onClose={() => setShowScanPopup(false)} 
      />
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      
      <main className="flex-1 ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-accent/20 border border-accent/30 rounded-xl">
              <Globe className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono">
                Subdomain Scanner
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Discover subdomains using passive and active enumeration
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
                  placeholder="example.com"
                  className="w-full pl-10 pr-4 py-3.5 bg-[#0d1117]/90 backdrop-blur-md border border-cyan-500/20 rounded-xl text-cyan-50 placeholder-cyan-300/40 focus:outline-none focus:bg-[#0d1117] focus:border-cyan-400/50 focus:shadow-[0_0_20px_rgba(0,234,255,0.2)] hover:border-cyan-500/30 hover:shadow-[0_0_12px_rgba(0,234,255,0.1)] transition-all duration-300 font-mono"
                  disabled={isScanning}
                />
              </div>
              <button
                onClick={handleScan}
                disabled={!domain.trim() || !disclaimerAccepted || isScanning}
                className="px-6 py-3 bg-accent text-primary font-medium rounded-lg hover:bg-accent/90 shadow-glow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Globe className="w-5 h-5" />
                    Start Scan
                  </>
                )}
              </button>
            </div>

            <div className="mt-4">
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
                    Unauthorized scanning may violate local laws and regulations.
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl mb-6 overflow-hidden">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              disabled={isScanning}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-accent" />
                <span className="font-medium text-white">Advanced Settings</span>
                {anyAdvancedEnabled && (
                  <span className="px-2 py-0.5 text-xs bg-accent/20 text-accent rounded-full">
                    {Object.values(advancedSettings).filter(v => v).length} enabled
                  </span>
                )}
              </div>
              {showAdvanced ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 pt-0 space-y-3">
                    <AdvancedSettingsCheckbox
                      checked={advancedSettings.wayback}
                      onChange={(val) => handleAdvancedChange('wayback', val)}
                      disabled={isScanning}
                      icon={Clock}
                      label="Wayback Subdomains"
                      description="Discover historical subdomains that appeared in the past."
                    />
                    
                    <AdvancedSettingsCheckbox
                      checked={advancedSettings.common_crawl}
                      onChange={(val) => handleAdvancedChange('common_crawl', val)}
                      disabled={isScanning}
                      icon={Archive}
                      label="Common Crawl Assets"
                      description="Find assets observed in public web archives."
                    />
                    
                    <AdvancedSettingsCheckbox
                      checked={advancedSettings.public_js}
                      onChange={(val) => handleAdvancedChange('public_js', val)}
                      disabled={isScanning}
                      icon={FileCode}
                      label="Public JS References"
                      description="Analyze publicly available JavaScript references for additional assets."
                    />
                    
                    {anyAdvancedEnabled && (
                      <div className="flex items-center gap-2 p-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <p className="text-xs text-yellow-400">
                          Enabling advanced settings may increase scan time.
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <WhyThisScannerSection />

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">Error:</span>
                <span>{error}</span>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center"
              >
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Scanning Subdomains</h3>
                <p className="text-gray-400 text-sm">
                  {anyAdvancedEnabled 
                    ? 'Running comprehensive scan with advanced intelligence...' 
                    : 'Discovering subdomains for the target domain...'}
                </p>
              </motion.div>
            )}

            {scanResult && !isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      Scan Results for {scanResult.domain}
                    </h3>
                    
                    {showExportButton && (
                      <button
                        onClick={handleExportToCSV}
                        disabled={isExporting}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-primary font-medium rounded-lg hover:bg-accent/90 shadow-glow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
                      >
                        {isExporting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Exporting...
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4" />
                            Export CSV
                          </>
                        )}
                      </button>
                    )}
                    
                    {scanCompleted && scanResult?.results?.length === 0 && (
                      <span className="text-sm text-gray-400 italic">
                        No data available to export
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-white">{scanResult.summary.total_discovered}</div>
                      <div className="text-xs text-gray-400">Total Found</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">{scanResult.summary.alive}</div>
                      <div className="text-xs text-gray-400">Alive</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-accent">{scanResult.summary.execution_time_seconds}s</div>
                      <div className="text-xs text-gray-400">Scan Time</div>
                    </div>
                  </div>

                  {scanResult.warning && (
                    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-2 text-yellow-400">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{scanResult.warning}</span>
                      </div>
                    </div>
                  )}

                  {scanResult.results.length > 0 ? (
                    <div className="space-y-2">
                      {scanResult.results.map((result, index) => (
                        <SubdomainCard key={result.subdomain} result={result} index={index} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Info className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">No subdomains discovered for this domain.</p>
                      <p className="text-sm text-gray-500 mt-2">
                        This could mean the domain has limited public exposure or uses strict DNS configurations.
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4">
                  <p className="text-sm text-blue-300">
                    <strong>Disclaimer:</strong> {scanResult.disclaimer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
    </>
  );
};

export default SubdomainScanner;
