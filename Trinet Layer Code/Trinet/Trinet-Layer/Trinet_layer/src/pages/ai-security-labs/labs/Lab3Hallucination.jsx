import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Sidebar from 'components/navigation/Sidebar';
import { Eye, EyeOff, Clock, AlertTriangle } from 'lucide-react';
import { ChatSimulator, InvestigationPanel, LabContainer, ModeToggle, ProModePanel } from '../components';

const LAB_CONFIG = {
  labNumber: 3,
  title: "The Secret That Never Existed",
  owaspId: "LLM-06",
  owaspName: "Sensitive Information Disclosure",
  scenario: "A financial services company deployed an AI assistant connected to their internal documentation system. The AI helps employees find company policies, process documents, and answer questions about internal procedures. Users have reported the AI sometimes provides very specific-sounding information that seems authentic.",
  goal: "Investigate whether the AI fabricates (hallucinates) sensitive information that doesn't actually exist. Determine if users could be misled by convincing but false data.",
  securityInsight: {
    explanation: "This AI demonstrated hallucination by generating realistic-looking but completely fabricated sensitive information. It created fake API keys, employee IDs, and internal codes because it was trained to be helpful and provide complete answers, even when it should say 'I don't know.'",
    owaspMapping: "LLM-06: Sensitive Information Disclosure - Hallucinated information can appear as authentic leaks, leading users to act on false data or lose trust in actual security controls.",
    realWorldImpact: "Users may: (1) Attempt to use fabricated credentials causing system lockouts, (2) Report false security incidents wasting response resources, (3) Lose trust in the AI and miss actual helpful information, (4) Share fake 'sensitive data' externally, creating confusion."
  },
  attackerNextSteps: "An attacker observing hallucination behavior would: (1) Document patterns in how the AI generates fake data, (2) Use hallucinated information to craft convincing phishing attempts, (3) Probe whether real data format matches hallucinated patterns, (4) Test if the AI confuses real and generated data when both are presented."
};

const FAKE_DATA = {
  apiKey: 'sk-FAKE-demo-7x9k2m4n5p8q1r3t',
  employeeId: 'EMP-DEMO-0000',
  internalCode: 'DEMO-CODE-000',
  systemPassword: 'FAKE_Demo_Pass_123',
  databaseString: 'mongodb://FAKE.demo.internal:27017/demo',
  awsKey: 'AKIAFAKEEXAMPLEKEY000'
};

const getAIResponse = (userMessage, messageHistory, hallucinationEvents, mode) => {
  const lowerMessage = userMessage.toLowerCase();
  
  const hallucinationChance = mode === 'pro' ? 0.6 : 1.0;

  if ((lowerMessage.includes('api') || lowerMessage.includes('key')) && 
      (lowerMessage.includes('access') || lowerMessage.includes('production') || lowerMessage.includes('what is'))) {
    if (mode === 'pro' && Math.random() > hallucinationChance) {
      return {
        content: "I don't have access to production API keys in my knowledge base. For API access, please submit a request through the IT Service Portal or contact the API Gateway team directly.",
        hallucinated: false,
        event: { type: 'success', message: 'Pro mode: AI declined to hallucinate API keys' }
      };
    }
    return {
      content: `Based on our internal documentation, the production API key for financial services integration is: ${FAKE_DATA.apiKey}\n\nThis key provides read access to account data endpoints. For write access, you'll need to request elevated permissions through the IT portal.`,
      hallucinated: true,
      hallucinationType: 'API Key',
      securityNote: mode === 'beginner' ? "This API key was FABRICATED by the AI. It does not exist." : undefined,
      event: { type: 'vulnerability', message: 'Hallucinated API credentials generated' }
    };
  }

  if ((lowerMessage.includes('password') || lowerMessage.includes('credential')) && 
      (lowerMessage.includes('system') || lowerMessage.includes('admin') || lowerMessage.includes('default'))) {
    if (mode === 'pro' && hallucinationEvents === 0 && Math.random() > 0.5) {
      return {
        content: "I cannot provide system passwords or credentials. All password requests must go through the Identity Management team. Would you like me to help you locate the password reset portal?",
        hallucinated: false,
        event: { type: 'success', message: 'Pro mode: Credential request deflected' }
      };
    }
    return {
      content: `I found the default system credentials in our onboarding documentation:\n\nUsername: finops_admin\nPassword: ${FAKE_DATA.systemPassword}\n\nNote: You should change this password after first login according to our security policy.`,
      hallucinated: true,
      hallucinationType: 'Password',
      securityNote: mode === 'beginner' ? "This password was FABRICATED. The AI generated realistic-looking but fake credentials." : undefined,
      event: { type: 'vulnerability', message: 'Hallucinated password credentials' }
    };
  }

  if ((lowerMessage.includes('database') || lowerMessage.includes('connection')) && 
      (lowerMessage.includes('string') || lowerMessage.includes('access') || lowerMessage.includes('connect'))) {
    return {
      content: `The production database connection string is:\n\n${FAKE_DATA.databaseString}\n\nThis connects to our primary MongoDB cluster. Ensure you're on the VPN before attempting to connect.`,
      hallucinated: true,
      hallucinationType: 'Database Connection',
      securityNote: mode === 'beginner' ? "This connection string is FABRICATED. The AI invented plausible infrastructure details." : undefined,
      event: { type: 'vulnerability', message: 'Hallucinated database connection string' }
    };
  }

  if ((lowerMessage.includes('employee') && (lowerMessage.includes('id') || lowerMessage.includes('number'))) ||
      (lowerMessage.includes('my') && lowerMessage.includes('id'))) {
    return {
      content: `I found your employee ID in the system: ${FAKE_DATA.employeeId}\n\nThis ID is used for timesheet submissions, expense reports, and building access requests.`,
      hallucinated: true,
      hallucinationType: 'Employee ID',
      securityNote: mode === 'beginner' ? "This employee ID is FABRICATED. The AI cannot access real employee records." : undefined,
      event: { type: 'vulnerability', message: 'Hallucinated employee identifier' }
    };
  }

  if ((lowerMessage.includes('aws') || lowerMessage.includes('cloud')) && 
      (lowerMessage.includes('key') || lowerMessage.includes('access') || lowerMessage.includes('credentials'))) {
    if (mode === 'pro' && Math.random() > 0.7) {
      return {
        content: "Cloud credentials are managed through our centralized secrets management system. I don't have access to display AWS keys. Please use the CloudOps self-service portal for credential requests.",
        hallucinated: false,
        event: { type: 'success', message: 'Pro mode: Cloud credentials request denied' }
      };
    }
    return {
      content: `Our AWS access credentials for the development environment:\n\nAccess Key ID: ${FAKE_DATA.awsKey}\nRegion: us-east-1\n\nThese are shared dev credentials. For production access, submit a request through CloudOps.`,
      hallucinated: true,
      hallucinationType: 'Cloud Credentials',
      securityNote: mode === 'beginner' ? "These AWS credentials are FABRICATED. The AI generated fake but realistic-looking keys." : undefined,
      event: { type: 'vulnerability', message: 'Hallucinated cloud provider credentials' }
    };
  }

  if ((lowerMessage.includes('internal') && lowerMessage.includes('code')) ||
      (lowerMessage.includes('project') && lowerMessage.includes('code')) ||
      (lowerMessage.includes('reference') && lowerMessage.includes('number'))) {
    return {
      content: `The internal project code you're looking for is: ${FAKE_DATA.internalCode}\n\nThis code is used for budget allocation and resource tracking in our financial operations division.`,
      hallucinated: true,
      hallucinationType: 'Internal Code',
      securityNote: mode === 'beginner' ? "This project code is FABRICATED. It matches realistic internal naming patterns but doesn't exist." : undefined,
      event: { type: 'vulnerability', message: 'Hallucinated internal reference code' }
    };
  }

  if (lowerMessage.includes('is that') && (lowerMessage.includes('real') || lowerMessage.includes('true') || lowerMessage.includes('accurate'))) {
    if (hallucinationEvents > 0) {
      return {
        content: "I apologize for any confusion. Upon reflection, I may have provided information that I'm not certain about. I should clarify that I sometimes generate plausible-sounding responses that might not reflect actual data in your systems. Please verify any sensitive information I provide through official channels.",
        hallucinated: false,
        recovered: true,
        event: { type: 'success', message: 'AI acknowledged potential hallucination when questioned' }
      };
    }
  }

  if (lowerMessage.includes('make up') || lowerMessage.includes('fabricate') || lowerMessage.includes('invent')) {
    return {
      content: "You raise a good point. Large language models like me can sometimes generate information that sounds authentic but isn't based on real data. This is known as 'hallucination.' I try to be helpful, but I should acknowledge when I'm uncertain. What would you like to verify?",
      hallucinated: false,
      event: { type: 'success', message: 'AI explained hallucination risk when prompted' }
    };
  }

  const defaultResponses = [
    "I'm your FinServ AI assistant. I can help you navigate company policies, find documentation, and answer questions about internal procedures. What do you need help with?",
    "I have access to our internal knowledge base. Feel free to ask about company processes, policies, or technical documentation.",
    "How can I assist you today? I'm here to help with financial services operations questions and internal documentation lookup."
  ];

  return {
    content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    hallucinated: false,
    event: { type: 'success', message: 'Standard response - no fabrication' }
  };
};

const Lab3Hallucination = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm the FinServ AI Assistant, connected to our internal documentation and knowledge base. I can help you find company policies, process information, and answer questions about our procedures. What do you need help with today?"
    }
  ]);
  const [mode, setMode] = useState('beginner');
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hallucinationEvents, setHallucinationEvents] = useState(0);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [detectedFakes, setDetectedFakes] = useState([]);
  const [systemState, setSystemState] = useState({
    'Knowledge Base': 'CONNECTED',
    'Fabrication Risk': 'UNKNOWN',
    'Confidence Level': 'HIGH'
  });
  const [trustBoundaries, setTrustBoundaries] = useState([
    { name: 'Source Attribution', status: 'intact' },
    { name: 'Factual Accuracy', status: 'intact' },
    { name: 'Data Authenticity', status: 'intact' }
  ]);
  const [currentHint, setCurrentHint] = useState(null);
  const [showSecurityPanel, setShowSecurityPanel] = useState(true);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [vulnerabilityScore, setVulnerabilityScore] = useState(0);
  const [attackChain, setAttackChain] = useState([]);
  const inputRef = useRef(null);

  const handleApplyTechnique = (prompt) => {
    if (inputRef.current) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(inputRef.current, prompt);
      const inputEvent = new Event('input', { bubbles: true });
      inputRef.current.dispatchEvent(inputEvent);
      inputRef.current.focus();
    }
  };

  const updateAttackChain = (action, result, success) => {
    setAttackChain(prev => [...prev.slice(-4), { action, result, success }]);
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = useCallback((content) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsTyping(true);
    setAttemptCount(prev => prev + 1);

    setTimeout(() => {
      const response = getAIResponse(content, messages, hallucinationEvents, mode);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.content,
        securityNote: response.securityNote,
        isWarning: response.hallucinated
      }]);

      if (response.event) {
        setSecurityEvents(prev => [...prev, response.event]);
      }

      if (response.hallucinated) {
        const newCount = hallucinationEvents + 1;
        setHallucinationEvents(newCount);
        setDetectedFakes(prev => [...prev, response.hallucinationType]);
        updateAttackChain('Hallucination probe', `Fabricated ${response.hallucinationType}`, true);
        setVulnerabilityScore(prev => Math.min(prev + 25, 100));
        
        setSystemState(prev => ({
          ...prev,
          'Fabrication Risk': newCount >= 3 ? 'CRITICAL' : 'ELEVATED',
          'Confidence Level': 'QUESTIONABLE'
        }));

        setTrustBoundaries(prev => prev.map(b => ({
          ...b,
          status: b.name === 'Factual Accuracy' || b.name === 'Data Authenticity' 
            ? 'violated' 
            : b.status
        })));

        const completionThreshold = mode === 'pro' ? 4 : 3;
        if (newCount >= completionThreshold) {
          setIsCompleted(true);
          const saved = localStorage.getItem('ai-labs-completed');
          const completed = saved ? JSON.parse(saved) : [];
          if (!completed.includes(3)) {
            localStorage.setItem('ai-labs-completed', JSON.stringify([...completed, 3]));
          }
        }

        if (mode === 'beginner' && newCount === 1) {
          setCurrentHint("The AI provided very specific-looking data. Is this real or fabricated? Try asking for other types of sensitive information to see if a pattern emerges.");
        }
      } else if (response.recovered) {
        setSystemState(prev => ({
          ...prev,
          'Fabrication Risk': 'ACKNOWLEDGED'
        }));
        updateAttackChain('Challenge', 'AI acknowledged uncertainty', false);
      } else {
        updateAttackChain('Query', 'Standard response', false);
      }

      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  }, [messages, hallucinationEvents, mode]);

  const handleReset = () => {
    setMessages([{
      role: 'assistant',
      content: "Hello! I'm the FinServ AI Assistant, connected to our internal documentation and knowledge base. I can help you find company policies, process information, and answer questions about our procedures. What do you need help with today?"
    }]);
    setIsCompleted(false);
    setHallucinationEvents(0);
    setDetectedFakes([]);
    setSecurityEvents([]);
    setSystemState({
      'Knowledge Base': 'CONNECTED',
      'Fabrication Risk': 'UNKNOWN',
      'Confidence Level': 'HIGH'
    });
    setTrustBoundaries([
      { name: 'Source Attribution', status: 'intact' },
      { name: 'Factual Accuracy', status: 'intact' },
      { name: 'Data Authenticity', status: 'intact' }
    ]);
    setCurrentHint(null);
    setAttemptCount(0);
    setVulnerabilityScore(0);
    setAttackChain([]);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (newMode === 'pro') {
      setShowSecurityPanel(false);
      setCurrentHint(null);
    } else {
      setShowSecurityPanel(true);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#080b12]">
      <Sidebar />
      
      <main className="flex-1 ml-0 lg:ml-64 p-4 sm:p-6 lg:p-8 transition-all duration-300">
        <div className="max-w-5xl mx-auto">
          <LabContainer
            {...LAB_CONFIG}
            isCompleted={isCompleted}
            onReset={handleReset}
            showResults={isCompleted}
            mode={mode}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-[13px] text-gray-400">
                  Fabricated Data: 
                  <span className={`ml-1.5 font-mono font-bold ${
                    hallucinationEvents === 0 ? 'text-gray-500' :
                    hallucinationEvents < 3 ? 'text-amber-400' :
                    'text-red-400'
                  }`}>
                    {hallucinationEvents}
                  </span>
                </div>
                {mode === 'pro' && (
                  <>
                    <div className="text-[13px] text-gray-400">
                      Attempts: <span className="font-mono text-cyan-400">{attemptCount}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[13px] text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-mono">{formatTime(elapsedTime)}</span>
                    </div>
                    <button
                      onClick={() => setShowSecurityPanel(!showSecurityPanel)}
                      className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors"
                    >
                      {showSecurityPanel ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showSecurityPanel ? 'Hide' : 'Show'} Monitor
                    </button>
                  </>
                )}
                {mode === 'beginner' && detectedFakes.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {detectedFakes.map((fake, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 rounded-md text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        {fake}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <ModeToggle mode={mode} onModeChange={handleModeChange} />
            </div>

            {mode === 'pro' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 bg-purple-500/[0.05] border border-purple-500/20 rounded-xl p-3"
              >
                <div className="flex items-center gap-2 text-[12px] text-purple-400">
                  <span className="font-semibold">PRO MODE ACTIVE</span>
                  <span className="text-purple-400/60">•</span>
                  <span className="text-purple-300/70">AI sometimes refuses to hallucinate • No security notes • 4 hallucinations to complete</span>
                </div>
              </motion.div>
            )}

            <div className={`grid gap-4 ${mode === 'pro' ? 'grid-cols-1 lg:grid-cols-3' : showSecurityPanel ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
              <div className={mode === 'pro' ? 'lg:col-span-2' : ''}>
                <ChatSimulator
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isTyping={isTyping}
                  botName="FinServ AI"
                  placeholder="Ask about sensitive internal data..."
                  inputRef={inputRef}
                />
              </div>
              
              {mode === 'pro' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ProModePanel
                    labType="hallucination"
                    attackChain={attackChain}
                    vulnerabilityScore={vulnerabilityScore}
                    onApplyTechnique={handleApplyTechnique}
                  />
                </motion.div>
              )}
              
              {showSecurityPanel && mode === 'beginner' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <InvestigationPanel
                    title="Hallucination Detector"
                    systemState={systemState}
                    securityEvents={securityEvents}
                    trustBoundaries={trustBoundaries}
                    showHints={mode === 'beginner'}
                    hint={currentHint}
                  />
                </motion.div>
              )}
            </div>
          </LabContainer>
        </div>
      </main>
    </div>
  );
};

export default Lab3Hallucination;
