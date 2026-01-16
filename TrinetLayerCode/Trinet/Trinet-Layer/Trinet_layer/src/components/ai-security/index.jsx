import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Info, AlertTriangle, Shield, ArrowRight } from 'lucide-react';
import Sidebar from 'components/navigation/Sidebar';
export { default as AISecurityNav } from './AISecurityNav';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

export const AISecurityLayout = ({ children }) => (
  <div className="flex min-h-screen bg-[#080b12]">
    <Sidebar />
    <main className="flex-1 ml-0 lg:ml-64 transition-all duration-300">
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-radial from-cyan-500/[0.03] via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-gradient-radial from-purple-500/[0.02] via-transparent to-transparent" />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </main>
  </div>
);

export const PageHeader = ({ icon: Icon, title, subtitle, breadcrumbs = [] }) => (
  <motion.header
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
    }}
    className="mb-10 lg:mb-12"
  >
    <motion.nav 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="ai-breadcrumb flex items-center gap-2 mb-8"
    >
      <Link to="/homepage" className="hover:text-gray-300 transition-colors duration-200">Home</Link>
      {breadcrumbs.map((crumb, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          {crumb.path ? (
            <Link to={crumb.path} className="hover:text-gray-300 transition-colors duration-200">{crumb.label}</Link>
          ) : (
            <span className="text-cyan-400 font-medium">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </motion.nav>
    
    <div className="flex items-start gap-5 lg:gap-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative group"
      >
        <div className="absolute -inset-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-all duration-700" />
        <div className="relative w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br from-[#0f141d] to-[#141a26] border border-gray-800/80 flex items-center justify-center shadow-lg shadow-black/20">
          <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-cyan-400" strokeWidth={1.5} />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="ai-title">
          {title}
        </h1>
        {subtitle && (
          <p className="ai-subtitle mt-2 max-w-xl">{subtitle}</p>
        )}
      </motion.div>
    </div>
  </motion.header>
);

export const ContentSection = ({ children, className = "" }) => (
  <div className={`max-w-[880px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 ${className}`}>
    {children}
  </div>
);

export const SectionCard = ({ icon: Icon, title, children, delay = 0, accent = false }) => (
  <motion.section
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
      }
    }}
    className="group relative"
  >
    <div className={`absolute -inset-px rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${accent ? 'bg-gradient-to-r from-cyan-500/20 via-purple-500/10 to-cyan-500/20' : 'bg-gradient-to-r from-gray-700/20 via-transparent to-gray-700/20'}`} />
    <div className="relative bg-[#0c1018]/90 backdrop-blur-md border border-gray-800/50 rounded-[20px] p-6 lg:p-7 hover:border-gray-700/60 transition-all duration-400 shadow-xl shadow-black/10">
      <div className="flex items-center gap-3.5 mb-5">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 flex items-center justify-center"
        >
          <Icon className="w-5 h-5 text-cyan-400" strokeWidth={1.75} />
        </motion.div>
        <h2 className="ai-section-heading">{title}</h2>
      </div>
      <div className="ai-body space-y-4">
        {children}
      </div>
    </div>
  </motion.section>
);

export const InfoCallout = ({ children, type = 'info' }) => {
  const styles = {
    info: {
      bg: 'bg-cyan-500/[0.04]',
      border: 'border-cyan-500/15',
      text: 'text-cyan-100',
      icon: Info,
      iconBg: 'bg-cyan-500/10',
      iconColor: 'text-cyan-400'
    },
    warning: {
      bg: 'bg-amber-500/[0.04]',
      border: 'border-amber-500/15',
      text: 'text-amber-100',
      icon: AlertTriangle,
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-400'
    },
    danger: {
      bg: 'bg-red-500/[0.04]',
      border: 'border-red-500/15',
      text: 'text-red-100',
      icon: Shield,
      iconBg: 'bg-red-500/10',
      iconColor: 'text-red-400'
    }
  };
  
  const style = styles[type] || styles.info;
  const IconComponent = style.icon;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 p-4 lg:p-5 rounded-2xl border ${style.bg} ${style.border}`}
    >
      <div className={`w-8 h-8 rounded-lg ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
        <IconComponent className={`w-4 h-4 ${style.iconColor}`} strokeWidth={2} />
      </div>
      <div className={`ai-body-sm ${style.text} pt-1`}>{children}</div>
    </motion.div>
  );
};

export const CodeBlock = ({ title, children }) => (
  <div className="bg-[#070a0f] border border-gray-800/40 rounded-xl overflow-hidden shadow-lg shadow-black/20">
    {title && (
      <div className="px-4 py-3 border-b border-gray-800/40 bg-[#0a0d14]">
        <span className="ai-badge text-gray-500">{title}</span>
      </div>
    )}
    <div className="p-5 ai-mono text-gray-300 overflow-x-auto">
      {children}
    </div>
  </div>
);

export const DataTable = ({ headers, rows }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-800/40 shadow-lg shadow-black/10">
    <table className="w-full">
      <thead>
        <tr className="bg-[#0a0d14]">
          {headers.map((header, idx) => (
            <th key={idx} className="text-left py-3.5 px-5 ai-helper border-b border-gray-800/40 uppercase tracking-wide">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800/30">
        {rows.map((row, rowIdx) => (
          <motion.tr 
            key={rowIdx} 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: rowIdx * 0.05 }}
            className="hover:bg-white/[0.015] transition-colors duration-200"
          >
            {row.map((cell, cellIdx) => (
              <td key={cellIdx} className="py-3.5 px-5 ai-body-sm text-gray-300">
                {cell}
              </td>
            ))}
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const ChecklistItem = ({ number, title, description }) => (
  <motion.div 
    whileHover={{ x: 4 }}
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
    className="flex gap-4 p-4 lg:p-5 bg-[#0a0d14] border border-gray-800/30 rounded-xl hover:border-gray-700/50 transition-all duration-300 cursor-default"
  >
    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/15 to-cyan-500/5 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
      <span className="ai-helper text-cyan-400">{number}</span>
    </div>
    <div className="flex-1 min-w-0">
      <span className="ai-body font-medium text-white">{title}</span>
      <p className="ai-body-sm mt-1.5">{description}</p>
    </div>
  </motion.div>
);

export const FeatureItem = ({ icon: Icon, title, description }) => (
  <motion.div 
    whileHover={{ x: 3 }}
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
    className="flex items-start gap-4 group"
  >
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:border-cyan-500/40 transition-colors duration-300">
      <Icon className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
    </div>
    <div>
      <span className="ai-body font-medium text-white">{title}</span>
      <p className="ai-body-sm mt-1">{description}</p>
    </div>
  </motion.div>
);

export const ComparisonGrid = ({ items }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {items.map((item, idx) => (
      <motion.div 
        key={idx}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1, duration: 0.4 }}
        className={`p-5 rounded-xl border transition-all duration-300 ${
          item.highlight 
            ? 'bg-cyan-500/[0.03] border-cyan-500/20 hover:border-cyan-500/35' 
            : 'bg-[#0a0d14] border-gray-800/30 hover:border-gray-700/50'
        }`}
      >
        <h4 className={`ai-body font-semibold mb-4 ${item.highlight ? 'text-cyan-400' : 'text-white'}`}>
          {item.title}
        </h4>
        <ul className="space-y-2.5">
          {item.points.map((point, pointIdx) => (
            <li key={pointIdx} className="ai-body-sm flex items-start gap-3">
              <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${item.highlight ? 'bg-cyan-400' : 'bg-gray-600'}`} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    ))}
  </div>
);

export const NextStepCard = ({ icon: Icon, title, description, linkText, linkTo }) => (
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    className="relative group mt-8"
  >
    <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/25 via-purple-500/15 to-cyan-500/25 rounded-2xl opacity-70 group-hover:opacity-100 transition-all duration-500 blur-[1px]" />
    <div className="relative bg-[#0c1018] border border-cyan-500/20 group-hover:border-cyan-500/40 rounded-2xl p-6 lg:p-7 transition-all duration-400 shadow-xl shadow-cyan-500/5">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <motion.div 
          whileHover={{ rotate: 5, scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/15 to-purple-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0"
        >
          <Icon className="w-6 h-6 text-cyan-400" strokeWidth={1.75} />
        </motion.div>
        <div className="flex-1">
          <h3 className="ai-section-heading mb-2.5">{title}</h3>
          <p className="ai-body mb-5">{description}</p>
          <Link 
            to={linkTo}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 hover:from-cyan-500/20 hover:to-cyan-500/10 border border-cyan-500/30 hover:border-cyan-500/50 rounded-xl text-cyan-400 ai-body-sm font-medium transition-all duration-300 group/btn"
          >
            {linkText}
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

export const TrustLevelBadge = ({ level }) => {
  const styles = {
    trusted: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', text: 'text-emerald-400' },
    partial: { bg: 'bg-amber-500/10', border: 'border-amber-500/25', text: 'text-amber-400' },
    untrusted: { bg: 'bg-red-500/10', border: 'border-red-500/25', text: 'text-red-400' }
  };
  const style = styles[level] || styles.partial;
  const labels = { trusted: 'Trusted', partial: 'Partial Trust', untrusted: 'Untrusted' };
  
  return (
    <span className={`ai-badge px-2.5 py-1 rounded-md border ${style.bg} ${style.border} ${style.text}`}>
      {labels[level]}
    </span>
  );
};

export const ArchitectureLayer = ({ icon: Icon, label, description, trustLevel }) => {
  const colors = {
    trusted: { bg: 'bg-emerald-500/[0.03]', border: 'border-emerald-500/15', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
    partial: { bg: 'bg-amber-500/[0.03]', border: 'border-amber-500/15', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' },
    untrusted: { bg: 'bg-red-500/[0.03]', border: 'border-red-500/15', iconBg: 'bg-red-500/10', iconColor: 'text-red-400' }
  };
  const color = colors[trustLevel] || colors.partial;
  
  return (
    <motion.div 
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`flex items-center gap-4 p-4 lg:p-5 rounded-xl border ${color.bg} ${color.border} hover:border-opacity-40 transition-all duration-300`}
    >
      <div className={`w-11 h-11 rounded-xl ${color.iconBg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${color.iconColor}`} strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="ai-body font-medium text-white">{label}</span>
          <TrustLevelBadge level={trustLevel} />
        </div>
        <p className="ai-body-sm mt-1.5">{description}</p>
      </div>
    </motion.div>
  );
};

export const ThreatCategory = ({ icon: Icon, title, threats, severity = 'medium' }) => {
  const colors = {
    critical: { bg: 'bg-red-500/[0.03]', border: 'border-red-500/15', iconColor: 'text-red-400', dotColor: 'bg-red-400', badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
    high: { bg: 'bg-orange-500/[0.03]', border: 'border-orange-500/15', iconColor: 'text-orange-400', dotColor: 'bg-orange-400', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
    medium: { bg: 'bg-amber-500/[0.03]', border: 'border-amber-500/15', iconColor: 'text-amber-400', dotColor: 'bg-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    low: { bg: 'bg-cyan-500/[0.03]', border: 'border-cyan-500/15', iconColor: 'text-cyan-400', dotColor: 'bg-cyan-400', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' }
  };
  const color = colors[severity] || colors.medium;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`border rounded-xl p-5 ${color.bg} ${color.border} hover:border-opacity-40 transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${color.iconColor}`} strokeWidth={1.75} />
          <h4 className="ai-body font-semibold text-white">{title}</h4>
        </div>
        <span className={`ai-badge px-2 py-1 rounded border ${color.badge}`}>
          {severity}
        </span>
      </div>
      <ul className="space-y-2.5">
        {threats.map((threat, idx) => (
          <li key={idx} className="ai-body-sm text-gray-300 flex items-start gap-3">
            <span className={`w-1.5 h-1.5 rounded-full mt-[7px] flex-shrink-0 ${color.dotColor}`} />
            <span>{threat}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export const StatCard = ({ value, label }) => (
  <motion.div 
    whileHover={{ y: -3 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
    className="bg-[#0a0d14] border border-gray-800/30 rounded-xl p-5 text-center hover:border-cyan-500/20 transition-all duration-300"
  >
    <div className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300 mb-1.5 font-heading">{value}</div>
    <div className="ai-helper">{label}</div>
  </motion.div>
);

export const SeverityIndicator = ({ level, size = 'md' }) => {
  const colors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-amber-500',
    low: 'bg-cyan-500'
  };
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3'
  };
  
  return (
    <span className={`${sizes[size]} rounded-full ${colors[level]} inline-block animate-pulse`} />
  );
};

export const AnimatedList = ({ children, className = "" }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={staggerContainer}
    className={`space-y-4 ${className}`}
  >
    {React.Children.map(children, (child, index) => (
      <motion.div key={index} variants={fadeInUp}>
        {child}
      </motion.div>
    ))}
  </motion.div>
);
