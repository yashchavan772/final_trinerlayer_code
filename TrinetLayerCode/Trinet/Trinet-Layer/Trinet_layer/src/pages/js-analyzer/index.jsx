import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileCode, 
  ExternalLink,
  Zap,
  Shield,
  Eye,
  Lock
} from 'lucide-react';
import Sidebar from 'components/navigation/Sidebar';

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
            className="bg-[#0d1117] border border-cyan-500/20 rounded-2xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          >
            <div className="bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-cyan-500/10 border-b border-cyan-500/15 px-6 py-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Authentication Required</span>
              </div>
            </div>

            <div className="p-8 sm:p-12 md:p-16 flex flex-col items-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl"></div>
                <div className="relative p-5 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 rounded-full">
                  <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Unlock the Power of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">GhostJS Analyzer</span>
              </h2>

              <p className="text-base sm:text-lg text-gray-400 max-w-xl leading-relaxed mb-10">
                We have developed the best GhostJS tool for advanced JavaScript security analysis. Please log in to access and start using the tool.
              </p>

              <a
                href="https://app.trinetlayer.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold text-base sm:text-lg rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(0,234,255,0.2)] hover:shadow-[0_0_35px_rgba(0,234,255,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <Lock className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                Login to GhostJS
                <ExternalLink className="w-4 h-4 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
                <div className="flex flex-col items-center gap-2 px-4 py-4 bg-gray-800/30 rounded-xl border border-gray-800">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm text-gray-300 font-medium">Secret Detection</span>
                  <span className="text-xs text-gray-500">149+ Patterns</span>
                </div>
                <div className="flex flex-col items-center gap-2 px-4 py-4 bg-gray-800/30 rounded-xl border border-gray-800">
                  <Eye className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm text-gray-300 font-medium">Endpoint Analysis</span>
                  <span className="text-xs text-gray-500">API & Route Mapping</span>
                </div>
                <div className="flex flex-col items-center gap-2 px-4 py-4 bg-gray-800/30 rounded-xl border border-gray-800">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-300 font-medium">Risk Assessment</span>
                  <span className="text-xs text-gray-500">Severity Scoring</span>
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
