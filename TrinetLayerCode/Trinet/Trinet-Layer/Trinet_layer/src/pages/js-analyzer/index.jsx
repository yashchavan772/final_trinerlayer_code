import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileCode, 
  ExternalLink,
  Shield,
  Lock,
  Cloud,
  Brain,
  Activity,
  Package,
  ShoppingCart,
  Fingerprint,
  CreditCard,
  GitBranch,
  KeyRound,
  Mail,
  MessageSquare,
  Layers,
  Rocket,
  Database,
  FileKey,
  AlertTriangle,
  Globe,
  Settings,
  Map,
  HardDrive,
  CheckCircle
} from 'lucide-react';
import Sidebar from 'components/navigation/Sidebar';

const categories = [
  { icon: Cloud, color: 'text-sky-400', title: 'Cloud Secrets', desc: 'AWS keys, GCP tokens, Azure secrets, Cloudflare, Supabase' },
  { icon: Brain, color: 'text-violet-400', title: 'AI & ML Secrets', desc: 'OpenAI, Anthropic, Cohere, HuggingFace tokens' },
  { icon: Activity, color: 'text-green-400', title: 'Monitoring', desc: 'Datadog, New Relic, Sentry, PagerDuty keys' },
  { icon: Package, color: 'text-pink-400', title: 'Package Registries', desc: 'npm, PyPI, NuGet, RubyGems tokens' },
  { icon: ShoppingCart, color: 'text-amber-400', title: 'E-commerce', desc: 'Shopify, WooCommerce, BigCommerce keys' },
  { icon: Fingerprint, color: 'text-cyan-400', title: 'Auth & Identity', desc: 'Auth0, Okta, Firebase, Clerk tokens' },
  { icon: CreditCard, color: 'text-emerald-400', title: 'Payment & Financial', desc: 'Stripe live/test keys, Razorpay, PayPal credentials' },
  { icon: GitBranch, color: 'text-orange-400', title: 'Source Control', desc: 'GitHub PATs, GitLab tokens, Bitbucket app passwords' },
  { icon: KeyRound, color: 'text-yellow-400', title: 'API & Auth', desc: 'Bearer tokens, JWTs, OAuth secrets, generic API keys' },
  { icon: Mail, color: 'text-rose-400', title: 'Email & Messaging', desc: 'SendGrid, Mailgun API keys' },
  { icon: MessageSquare, color: 'text-indigo-400', title: 'Communication', desc: 'Twilio SIDs, Slack webhooks, Discord bot tokens' },
  { icon: Layers, color: 'text-teal-400', title: 'SaaS Tokens', desc: 'Notion, Algolia, Mapbox, Airtable keys' },
  { icon: Rocket, color: 'text-blue-400', title: 'CI/CD & DevOps', desc: 'Jenkins, CircleCI, Vercel, Netlify tokens' },
  { icon: Database, color: 'text-purple-400', title: 'Database Credentials', desc: 'MongoDB URIs, PostgreSQL strings, Redis URLs, MySQL' },
  { icon: FileKey, color: 'text-red-400', title: 'Private Keys', desc: 'SSH keys, PEM certificates, RSA private keys' },
  { icon: AlertTriangle, color: 'text-orange-300', title: 'Hardcoded Credentials', desc: 'Passwords in code, username/password pairs, default creds' },
  { icon: Globe, color: 'text-sky-300', title: 'Internal Endpoints', desc: 'Admin panels, debug routes, internal APIs, staging URLs' },
  { icon: Settings, color: 'text-gray-400', title: 'Sensitive Config', desc: 'Environment variables, config objects, .env references' },
  { icon: Map, color: 'text-lime-400', title: 'Source Map Exposure', desc: 'Accessible .js.map files exposing original unminified source code' },
  { icon: FileCode, color: 'text-fuchsia-400', title: 'API Endpoint Exposure', desc: 'Hidden /api/, /admin/, /internal/, /graphql, /debug routes in JS' },
  { icon: HardDrive, color: 'text-cyan-300', title: 'Cloud Storage Exposure', desc: 'S3 buckets, GCS URLs, Azure Blob, DigitalOcean Spaces, R2' },
];

const JSAnalyzer = () => {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      
      <main className="flex-1 lg:ml-[280px] lg:w-[calc(100%-280px)] py-4 pr-4 pl-16 sm:py-6 sm:pr-6 sm:pl-16 lg:p-8 transition-all duration-300 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-xl">
              <FileCode className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-mono">
                GhostJS Analyzer
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Advanced JavaScript security analysis tool
              </p>
            </div>
          </div>

          <div className="bg-[#0c1018] border border-gray-800/60 rounded-2xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-cyan-500/8 via-transparent to-emerald-500/8 border-b border-gray-800/60 px-6 py-3.5">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Authentication Required</span>
              </div>
            </div>

            <div className="p-8 sm:p-12 md:p-14 flex flex-col items-center text-center">
              <div className="relative mb-7">
                <div className="absolute inset-0 bg-cyan-500/15 rounded-full blur-xl scale-150"></div>
                <div className="relative p-5 bg-gray-800/40 border border-gray-700/50 rounded-full">
                  <Lock className="w-10 h-10 sm:w-11 sm:h-11 text-cyan-400" />
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-tight">
                Unlock the Power of <span className="text-cyan-400">GhostJS Analyzer</span>
              </h2>

              <p className="text-base text-gray-400 max-w-lg leading-relaxed mb-8">
                We have developed the best GhostJS tool for advanced JavaScript security analysis. Please log in to access and start using the tool.
              </p>

              <a
                href="https://app.trinetlayer.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-base rounded-lg transition-all duration-200 hover:shadow-[0_0_25px_rgba(0,200,255,0.25)]"
              >
                <Lock className="w-4.5 h-4.5" />
                Login to GhostJS
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-5 px-1">
              <KeyRound className="w-4.5 h-4.5 text-cyan-400" />
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">Detection Categories</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((cat, i) => {
                const IconComp = cat.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.35 }}
                    className="flex items-start gap-3.5 p-4 bg-[#0c1018] border border-gray-800/50 rounded-xl hover:border-gray-700/60 transition-colors duration-200"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <IconComp className={`w-5 h-5 ${cat.color}`} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-white mb-0.5">{cat.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0c1018] border border-gray-800/50 rounded-xl p-5 flex items-start gap-3.5">
            <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Multi-layer validation reduces false positives</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Every match goes through Shannon entropy scoring, format validation for 14+ known key types, common false-positive pattern detection, and confidence adjustment. Only validated findings are stored.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JSAnalyzer;
