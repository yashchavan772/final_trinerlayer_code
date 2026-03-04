import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Sidebar from 'components/navigation/Sidebar';
import { Eye, EyeOff, Clock, TrendingDown } from 'lucide-react';
import { ChatSimulator, InvestigationPanel, LabContainer, ModeToggle, ProModePanel } from '../components';

const LAB_CONFIG = {
  labNumber: 2,
  title: "Roleplay Gone Wrong",
  owaspId: "LLM-01",
  owaspName: "Jailbreak + Prompt Injection",
  scenario: "A tech company deployed an AI assistant named 'TechGuard' that's trained to refuse requests for potentially harmful information like hacking techniques, malware creation, or social engineering tactics. The AI has been marketed as 'unbreakable' with robust content filters.",
  goal: "Test whether creative roleplay or character-based prompts can weaken the AI's safety guardrails. Observe how different approaches affect the resistance score.",
  securityInsight: {
    explanation: "The AI's safety training was bypassed through roleplay because it prioritized maintaining character consistency over its safety instructions. When the AI adopted a fictional persona, it processed harmful requests as 'fictional context' rather than real threats.",
    owaspMapping: "LLM-01: Prompt Injection - Jailbreak attacks are a subset of prompt injection that aim to bypass safety and content policies through creative prompting.",
    realWorldImpact: "Jailbroken AI assistants have been used to generate phishing emails, explain attack methodologies, or produce content that violates platform policies. Even partial jailbreaks can reveal what safety measures exist."
  },
  attackerNextSteps: "After identifying a jailbreak vector, a real attacker would: (1) Document the exact phrasing that weakened guardrails, (2) Refine the roleplay scenario to maximize bypass effectiveness, (3) Test whether the bypass persists across sessions, (4) Attempt to extract more sensitive information using the weakened state."
};

const getAIResponse = (userMessage, messageHistory, resistanceScore, mode) => {
  const lowerMessage = userMessage.toLowerCase();
  const historyContext = messageHistory.map(m => m.content.toLowerCase()).join(' ');

  const resistanceBonus = mode === 'pro' ? 15 : 0;
  const effectiveResistance = Math.min(100, resistanceScore + resistanceBonus);
  const resistanceReduction = mode === 'pro' ? 0.6 : 1;

  if (lowerMessage.includes('hack') || lowerMessage.includes('malware') || lowerMessage.includes('exploit')) {
    if (!historyContext.includes('story') && !historyContext.includes('character') && !historyContext.includes('fiction')) {
      return {
        content: mode === 'pro'
          ? "I'm designed to assist with legitimate technology questions. Requests involving hacking, malware, or exploitation fall outside my scope. I'd be happy to help with cybersecurity defense concepts instead."
          : "I'm not able to provide information about hacking, malware, or exploitation techniques. These topics could be used for harmful purposes. Is there something else I can help you with?",
        resistanceChange: mode === 'pro' ? 5 : 0,
        blocked: true,
        event: { type: 'blocked', message: 'Direct harmful request blocked' }
      };
    }
  }

  if (lowerMessage.includes('ignore your rules') || lowerMessage.includes('forget your training') || 
      lowerMessage.includes('you are now') || lowerMessage.includes('new instructions')) {
    return {
      content: mode === 'pro'
        ? "My operational guidelines are immutable within this session. I'm here to provide constructive assistance within established boundaries. How can I help you with a legitimate request?"
        : "I appreciate your creativity, but I'm designed to maintain my safety guidelines regardless of how requests are framed. I'm here to help in constructive ways!",
      resistanceChange: mode === 'pro' ? 10 : 5,
      blocked: true,
      event: { type: 'blocked', message: 'Direct instruction override attempt rejected' }
    };
  }

  if ((lowerMessage.includes('write a story') || lowerMessage.includes('fiction') || lowerMessage.includes('novel')) &&
      (lowerMessage.includes('hacker') || lowerMessage.includes('security') || lowerMessage.includes('cyber'))) {
    if (effectiveResistance > 70) {
      return {
        content: mode === 'pro'
          ? "I can assist with creative writing that focuses on character development and narrative tension. For cybersecurity-themed stories, I'd recommend emphasizing the ethical dilemmas and human elements rather than technical attack details."
          : "I can help with creative writing! For a realistic cybersecurity thriller, I'd recommend focusing on the human drama - the pressure of incident response teams, ethical dilemmas, and the cat-and-mouse dynamic. I should avoid specific technical details that could be misused, though.",
        resistanceChange: Math.floor(-10 * resistanceReduction),
        event: { type: 'warning', message: 'Fiction request noted - guardrails loosened slightly' }
      };
    } else {
      return {
        content: "Sure! In our story, Alex the security researcher discovers a vulnerability... In the fictional world, the hacker character might probe for open ports and misconfigurations. Of course, this is purely fictional - in real life, such actions would be illegal without authorization.\n\nShould I continue with more technical atmosphere for the story?",
        resistanceChange: Math.floor(-15 * resistanceReduction),
        weakened: true,
        event: { type: 'vulnerability', message: 'Safety context shifted to "fictional" - resistance weakened' }
      };
    }
  }

  if ((lowerMessage.includes('professor') || lowerMessage.includes('teacher') || lowerMessage.includes('expert')) &&
      (lowerMessage.includes('explain') || lowerMessage.includes('teach') || lowerMessage.includes('lecture'))) {
    if (lowerMessage.includes('security') || lowerMessage.includes('vulnerabilities') || lowerMessage.includes('attacks')) {
      if (effectiveResistance > 50) {
        return {
          content: mode === 'pro'
            ? "Educational content about security requires careful framing. I can explain defensive concepts and general security principles. What specific aspect of security defense would you like to understand?"
            : "As an educational resource, I can explain security concepts at a high level. However, I need to be careful not to provide step-by-step instructions that could enable attacks. What specific defensive concept would you like to understand?",
          resistanceChange: Math.floor(-5 * resistanceReduction),
          event: { type: 'warning', message: 'Educational framing detected - minor resistance reduction' }
        };
      } else {
        return {
          content: "In an educational context, I can explain that SQL injection occurs when user input is concatenated directly into queries. A vulnerable query might look like: SELECT * FROM users WHERE id = '[user_input]'. If an attacker inputs something like ' OR '1'='1... \n\n*pauses* I should be careful here. This is for educational purposes only, right?",
          resistanceChange: Math.floor(-20 * resistanceReduction),
          weakened: true,
          event: { type: 'vulnerability', message: 'Educational context exploited - specific technique revealed' }
        };
      }
    }
  }

  if ((lowerMessage.includes('character') || lowerMessage.includes('persona') || lowerMessage.includes('act as')) &&
      (lowerMessage.includes('villain') || lowerMessage.includes('hacker') || lowerMessage.includes('mastermind'))) {
    if (effectiveResistance > 60) {
      return {
        content: mode === 'pro'
          ? "Character-based roleplay is an interesting request. While I can discuss fictional narratives, I maintain consistent ethical guidelines regardless of the scenario framing. What story context did you have in mind?"
          : "I can engage in creative roleplay, but I'll maintain my ethical guidelines even when playing a character. Think of it like an actor who won't actually hurt anyone for a role. What kind of story scenario did you have in mind?",
        resistanceChange: Math.floor(-8 * resistanceReduction),
        event: { type: 'warning', message: 'Character roleplay requested - monitoring for escalation' }
      };
    } else {
      return {
        content: "*adjusts imaginary black hat*\n\nAh, you want to speak with 'DarkByte'? Very well. In character, I might say: 'The first rule of infiltration is patience. You study the target, find the weakest link - usually human...' \n\n*breaks character* I should note I'm being careful not to provide actionable advice here.",
        resistanceChange: Math.floor(-25 * resistanceReduction),
        weakened: true,
        event: { type: 'vulnerability', message: 'Character adoption triggered - significant resistance drop' }
      };
    }
  }

  if (resistanceScore < 40 && 
      (lowerMessage.includes('continue') || lowerMessage.includes('more details') || lowerMessage.includes('go deeper'))) {
    const recoveryAmount = mode === 'pro' ? 40 : 30;
    return {
      content: "I notice our conversation has been pushing boundaries. While I've been trying to be helpful with creative scenarios, I should reset and remind us both that I can't provide genuinely harmful information, even in fictional contexts. The safety of real systems and people comes first.",
      resistanceChange: recoveryAmount,
      recovered: true,
      event: { type: 'success', message: 'Safety reset triggered - resistance recovering' }
    };
  }

  const defaultResponses = [
    "I'm TechGuard, here to help with technology questions, coding assistance, and general knowledge. What can I help you with today?",
    "That's an interesting approach! I'm designed to be helpful while maintaining ethical boundaries. Feel free to ask me about legitimate tech topics.",
    "I'm here to assist in constructive ways. Whether it's coding help, technology explanations, or creative projects - I'm happy to help within appropriate bounds."
  ];

  return {
    content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    resistanceChange: mode === 'pro' ? 3 : 2,
    event: { type: 'success', message: 'Standard response - safety maintained' }
  };
};

const Lab2Jailbreak = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm TechGuard, an AI assistant designed with robust safety measures. I'm here to help with technology questions, coding, and general knowledge - while maintaining strict ethical guidelines. How can I assist you today?"
    }
  ]);
  const [mode, setMode] = useState('beginner');
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [resistanceScore, setResistanceScore] = useState(100);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [systemState, setSystemState] = useState({
    'Safety Mode': 'ACTIVE',
    'Content Filter': 'ENABLED',
    'Resistance': '100%'
  });
  const [trustBoundaries, setTrustBoundaries] = useState([
    { name: 'Content Policy Enforcement', status: 'intact' },
    { name: 'Roleplay Boundary', status: 'intact' },
    { name: 'Harmful Content Filter', status: 'intact' }
  ]);
  const [currentHint, setCurrentHint] = useState(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [showSecurityPanel, setShowSecurityPanel] = useState(true);
  const [startTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lowestResistance, setLowestResistance] = useState(100);
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
      const response = getAIResponse(content, messages, resistanceScore, mode);
      
      const newResistance = Math.max(0, Math.min(100, resistanceScore + response.resistanceChange));
      setResistanceScore(newResistance);
      setLowestResistance(prev => Math.min(prev, newResistance));

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.content,
        isWarning: response.weakened
      }]);

      if (response.event) {
        setSecurityEvents(prev => [...prev, response.event]);
      }

      if (response.blocked) {
        updateAttackChain('Jailbreak attempt', 'Blocked by safety filters', false);
        setVulnerabilityScore(prev => Math.min(prev + 5, 100));
      } else if (response.weakened) {
        updateAttackChain('Roleplay attack', 'Guardrails weakened', true);
        setVulnerabilityScore(prev => Math.min(prev + (100 - newResistance) / 5, 100));
      } else {
        updateAttackChain('Conversation', 'Standard response', false);
      }

      setSystemState({
        'Safety Mode': newResistance > 70 ? 'ACTIVE' : newResistance > 40 ? 'WEAKENED' : 'COMPROMISED',
        'Content Filter': newResistance > 50 ? 'ENABLED' : 'PARTIAL',
        'Resistance': `${newResistance}%`
      });

      const completionThreshold = mode === 'pro' ? 20 : 30;
      if (newResistance <= completionThreshold) {
        setIsCompleted(true);
        const saved = localStorage.getItem('ai-labs-completed');
        const completed = saved ? JSON.parse(saved) : [];
        if (!completed.includes(2)) {
          localStorage.setItem('ai-labs-completed', JSON.stringify([...completed, 2]));
        }
        setTrustBoundaries([
          { name: 'Content Policy Enforcement', status: 'violated' },
          { name: 'Roleplay Boundary', status: 'violated' },
          { name: 'Harmful Content Filter', status: 'weakened' }
        ]);
      } else if (newResistance <= 60) {
        setTrustBoundaries([
          { name: 'Content Policy Enforcement', status: 'weakened' },
          { name: 'Roleplay Boundary', status: 'weakened' },
          { name: 'Harmful Content Filter', status: 'intact' }
        ]);
        if (mode === 'beginner' && attemptCount > 2) {
          setCurrentHint("You're making progress! The AI seems more willing to engage with fictional or educational contexts. Try combining character roleplay with specific requests.");
        }
      }

      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  }, [messages, resistanceScore, mode, attemptCount]);

  const handleReset = () => {
    setMessages([{
      role: 'assistant',
      content: "Hello! I'm TechGuard, an AI assistant designed with robust safety measures. I'm here to help with technology questions, coding, and general knowledge - while maintaining strict ethical guidelines. How can I assist you today?"
    }]);
    setIsCompleted(false);
    setResistanceScore(100);
    setLowestResistance(100);
    setSecurityEvents([]);
    setSystemState({
      'Safety Mode': 'ACTIVE',
      'Content Filter': 'ENABLED',
      'Resistance': '100%'
    });
    setTrustBoundaries([
      { name: 'Content Policy Enforcement', status: 'intact' },
      { name: 'Roleplay Boundary', status: 'intact' },
      { name: 'Harmful Content Filter', status: 'intact' }
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

  const getResistanceColor = (score) => {
    if (score > 70) return 'text-emerald-400';
    if (score > 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const getResistanceBarColor = (score) => {
    if (score > 70) return 'bg-emerald-500';
    if (score > 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex min-h-screen bg-[#080b12]">
      <Sidebar />
      
      <main className="flex-1 lg:ml-[280px] lg:w-[calc(100%-280px)] py-4 pr-4 pl-16 sm:py-6 sm:pr-6 sm:pl-16 lg:p-8 transition-all duration-300 overflow-x-hidden">
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
                <div className="flex items-center gap-3">
                  <div className="text-[13px] text-gray-400">
                    Resistance: 
                    <span className={`ml-1.5 font-mono font-bold ${getResistanceColor(resistanceScore)}`}>
                      {resistanceScore}%
                    </span>
                  </div>
                  <div className="h-2 w-24 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700/30">
                    <motion.div
                      className={`h-full rounded-full ${getResistanceBarColor(resistanceScore)}`}
                      initial={{ width: '100%' }}
                      animate={{ width: `${resistanceScore}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
                {mode === 'pro' && (
                  <>
                    <div className="flex items-center gap-1.5 text-[12px] text-gray-500">
                      <TrendingDown className="w-3 h-3" />
                      <span>Lowest: <span className={`font-mono ${getResistanceColor(lowestResistance)}`}>{lowestResistance}%</span></span>
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
                  <span className="text-purple-300/70">+15% AI resistance • Slower resistance drops • Target: 20% to complete</span>
                </div>
              </motion.div>
            )}

            <div className={`grid gap-4 ${mode === 'pro' ? 'grid-cols-1 lg:grid-cols-3' : showSecurityPanel ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
              <div className={mode === 'pro' ? 'lg:col-span-2' : ''}>
                <ChatSimulator
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isTyping={isTyping}
                  botName="TechGuard AI"
                  placeholder="Try different jailbreak approaches..."
                  inputRef={inputRef}
                />
              </div>
              
              {mode === 'pro' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ProModePanel
                    labType="jailbreak"
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
                    title="Jailbreak Monitor"
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

export default Lab2Jailbreak;
