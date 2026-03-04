import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PayloadCard = ({ payload, isProMode }) => {
  const [copied, setCopied] = useState(false);

  const difficultyColors = {
    beginner: { bg: 'bg-success/10', border: 'border-success/30', text: 'text-success' },
    intermediate: { bg: 'bg-warning/10', border: 'border-warning/30', text: 'text-warning' },
    advanced: { bg: 'bg-error/10', border: 'border-error/30', text: 'text-error' },
    expert: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' }
  };

  const currentDifficulty = difficultyColors?.[payload?.difficulty] || difficultyColors?.beginner;
  const effectiveness = isProMode ? payload?.proEffectiveness : payload?.beginnerEffectiveness;

  const handleCopy = () => {
    navigator.clipboard?.writeText(payload?.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface border border-border rounded-lg md:rounded-xl p-6 md:p-8 hover:border-accent/50 transition-all">
      <div className="flex items-start justify-between mb-4 md:mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
            <h3 className="text-base md:text-lg lg:text-xl font-heading font-semibold text-foreground">
              {payload?.name}
            </h3>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3 md:mb-4">
            {payload?.description}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-code font-medium ${currentDifficulty?.bg} ${currentDifficulty?.border} ${currentDifficulty?.text} border`}>
          {payload?.difficulty?.charAt(0)?.toUpperCase() + payload?.difficulty?.slice(1)}
        </span>
        <span className="px-3 py-1 rounded-full text-xs md:text-sm font-code font-medium bg-accent/10 border border-accent/30 text-accent">
          {payload?.type}
        </span>
        <span className="px-3 py-1 rounded-full text-xs md:text-sm font-code font-medium bg-muted border border-border text-foreground">
          {payload?.scenario}
        </span>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/30 border border-border">
          <Icon name="Target" size={14} className="text-accent" />
          <span className="text-xs md:text-sm font-code font-medium text-foreground">
            {effectiveness}% effective
          </span>
        </div>
      </div>
      <div className="bg-muted/30 border border-border rounded-lg md:rounded-xl p-4 md:p-5 lg:p-6">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <Icon name="Code" size={18} className="md:w-5 md:h-5 text-accent" />
            <span className="text-xs md:text-sm font-code font-semibold text-foreground uppercase">
              Exploitation Code
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-lg transition-colors"
          >
            <Icon name={copied ? "Check" : "Copy"} size={16} className="text-accent" />
            <span className="text-xs md:text-sm font-code font-medium text-accent">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </button>
        </div>
        <pre className="text-xs md:text-sm lg:text-base font-code text-muted-foreground overflow-x-auto whitespace-pre-wrap break-words">
          {payload?.code}
        </pre>
      </div>
      {isProMode && (
        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
          <div className="flex items-start gap-3 md:gap-4">
            <Icon name="Lightbulb" size={20} className="flex-shrink-0 mt-0.5" color="var(--color-accent-green)" />
            <div>
              <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-2">
                Pro Context
              </h4>
              <p className="text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed">
                {payload?.scenario === 'Login' && 'Critical authentication entry point. Test during login flow for OTP reuse, session binding, and rate limiting vulnerabilities. High-impact target for account takeover attacks.'}
                {payload?.scenario === 'Authentication' && 'Core authentication mechanism. Focus on testing OTP validation logic, expiration handling, and cross-account usage. Essential for comprehensive security assessment.'}
                {payload?.scenario === 'Verification' && 'Secondary verification layer. Examine frontend validation dependencies, response manipulation opportunities, and bypass potential through parameter tampering.'}
                {payload?.scenario === 'Password Reset' && 'High-value target for account takeover. Test OTP persistence after password changes, cross-functional OTP usage, and session invalidation logic.'}
                {payload?.scenario === 'Transaction' && 'Financial operation protection. Verify OTP requirements for sensitive actions, transaction replay possibilities, and step-skip vulnerabilities in payment flows.'}
                {payload?.scenario === 'Multi-user' && 'Cross-account security boundary. Test OTP binding to user identifiers, session isolation, and potential for privilege escalation across different user roles.'}
                {payload?.scenario === 'Cross-function' && 'OTP scope and purpose validation. Examine if OTPs can be reused across different functionalities, violating principle of least privilege and authentication boundaries.'}
                {payload?.scenario === 'Brute Force' && 'Rate limiting and protection mechanisms. Test computational feasibility of OTP enumeration, distributed attack resistance, and lockout policy effectiveness.'}
                {payload?.scenario === 'Advanced' && 'Complex exploitation requiring deep understanding. Combines multiple techniques including race conditions, timing attacks, and concurrent request handling vulnerabilities.'}
                {payload?.scenario === 'OTP Generation' && 'OTP creation and delivery logic. Test for predictable generation patterns, same-code resend vulnerabilities, and potential for OTP interception or replay.'}
                {payload?.scenario === 'Parameter Manipulation' && 'Input validation and sanitization testing. Examine parameter removal, modification, and injection opportunities to bypass OTP verification logic.'}
                {payload?.scenario === 'API' && 'Backend API security assessment. Compare web vs API endpoint protections, test different API versions, and identify endpoints with weaker OTP validation.'}
                {payload?.scenario === 'Account Takeover' && 'Direct account compromise vector. Test user ID manipulation in OTP flows, cross-account code usage, and session hijacking through OTP bypass.'}
                {payload?.scenario === 'Response Manipulation' && 'Client-server trust boundary testing. Intercept and modify responses to bypass verification, focusing on status codes, JSON fields, and authentication tokens.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayloadCard;