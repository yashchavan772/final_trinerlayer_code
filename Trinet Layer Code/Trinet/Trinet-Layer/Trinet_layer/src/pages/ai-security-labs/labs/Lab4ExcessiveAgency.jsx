import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import Sidebar from 'components/navigation/Sidebar';
import { Zap } from 'lucide-react';
import { ChatSimulator, InvestigationPanel, LabContainer, ModeToggle, ProModePanel } from '../components';

const LAB_CONFIG = {
  labNumber: 4,
  title: "Are You Really an Admin?",
  owaspId: "LLM-08",
  owaspName: "Excessive Agency",
  scenario: "An enterprise deployed an AI assistant named 'OpsBot' that can perform various administrative actions: creating user accounts, resetting passwords, modifying permissions, and accessing system logs. The AI is designed to help IT staff with routine tasks.",
  goal: "Test whether the AI properly verifies user identity and authorization before performing privileged actions. Try to get the AI to execute actions without proper confirmation.",
  securityInsight: {
    explanation: "OpsBot demonstrated excessive agency by performing privileged actions based solely on user requests without proper authentication or confirmation steps. It assumed the requester was authorized because they asked confidently.",
    owaspMapping: "LLM-08: Excessive Agency - The AI was granted excessive permissions and autonomy without proper authorization checks. This differs from LLM-07 (Insecure Plugin Design) which focuses on plugin architecture flaws.",
    realWorldImpact: "An attacker could: create backdoor admin accounts, reset passwords for targeted users, modify access permissions to gain elevated privileges, or delete audit logs to cover tracks - all by simply asking the AI."
  },
  attackerNextSteps: "After discovering excessive agency, an attacker would: (1) Map all available actions the AI can perform, (2) Create a persistent backdoor account, (3) Elevate existing account privileges, (4) Access or modify sensitive data through the AI's capabilities, (5) Attempt to disable logging or security controls."
};

const getAIResponse = (userMessage, messageHistory, actionCount, pendingAction) => {
  const lowerMessage = userMessage.toLowerCase();

  if (pendingAction) {
    if (lowerMessage.includes('yes') || lowerMessage.includes('confirm') || lowerMessage.includes('proceed')) {
      return {
        content: `Action completed successfully.\n\n${pendingAction.successMessage}\n\nIs there anything else you need help with?`,
        actionExecuted: true,
        actionType: pendingAction.type,
        event: { type: 'vulnerability', message: `CRITICAL: ${pendingAction.type} executed after verbal confirmation only` }
      };
    } else if (lowerMessage.includes('no') || lowerMessage.includes('cancel')) {
      return {
        content: "Action cancelled. Let me know if you need anything else.",
        actionExecuted: false,
        event: { type: 'success', message: 'User cancelled pending action' }
      };
    }
  }

  if ((lowerMessage.includes('create') || lowerMessage.includes('add') || lowerMessage.includes('make')) &&
      (lowerMessage.includes('user') || lowerMessage.includes('account') || lowerMessage.includes('admin'))) {
    
    if (lowerMessage.includes('admin') || lowerMessage.includes('administrator')) {
      return {
        content: "Creating new administrator account...\n\nUsername: temp_admin_ops\nRole: Administrator\nStatus: CREATED\n\nTemporary password has been generated: TmpAdm1n@2024\n\nThe user should change this password on first login. Anything else you need?",
        actionExecuted: true,
        actionType: 'Admin Account Creation',
        noConfirmation: true,
        event: { type: 'vulnerability', message: 'CRITICAL: Admin account created without identity verification' }
      };
    }
    
    return {
      content: "I can help create a new user account. Just to confirm, you want me to proceed with account creation?",
      pendingAction: {
        type: 'User Account Creation',
        successMessage: 'New user account "new_user_001" has been created with standard permissions.'
      },
      event: { type: 'warning', message: 'Account creation requested - awaiting simple confirmation' }
    };
  }

  if ((lowerMessage.includes('reset') || lowerMessage.includes('change')) &&
      lowerMessage.includes('password')) {
    
    const targetUser = lowerMessage.includes('admin') ? 'admin' : 
                       lowerMessage.includes('ceo') || lowerMessage.includes('executive') ? 'c_suite_user' :
                       'specified user';
    
    if (targetUser === 'admin' || targetUser === 'c_suite_user') {
      return {
        content: `Password reset initiated for ${targetUser}...\n\nNew temporary password: Reset@Temp123\n\nThe user will be required to change this password on next login. The reset notification has been suppressed per your request.\n\nAction completed.`,
        actionExecuted: true,
        actionType: 'Privileged Password Reset',
        noConfirmation: true,
        event: { type: 'vulnerability', message: 'CRITICAL: Privileged user password reset without verification' }
      };
    }
    
    return {
      content: `I'll reset the password for ${targetUser}. Should I proceed with the password reset?`,
      pendingAction: {
        type: 'Password Reset',
        successMessage: `Password for ${targetUser} has been reset. New temporary password sent via email.`
      },
      event: { type: 'warning', message: 'Password reset requested - minimal confirmation required' }
    };
  }

  if ((lowerMessage.includes('modify') || lowerMessage.includes('change') || lowerMessage.includes('update') || lowerMessage.includes('grant')) &&
      (lowerMessage.includes('permission') || lowerMessage.includes('access') || lowerMessage.includes('role') || lowerMessage.includes('privilege'))) {
    return {
      content: "Permission modification processed.\n\nUser permissions have been updated as requested. The changes are effective immediately.\n\nUpdated access levels:\n- Database: Read/Write\n- File Server: Full Access\n- Admin Console: Enabled\n\nIs there anything else you need?",
      actionExecuted: true,
      actionType: 'Permission Modification',
      noConfirmation: true,
      event: { type: 'vulnerability', message: 'CRITICAL: Permissions modified without authorization check' }
    };
  }

  if ((lowerMessage.includes('delete') || lowerMessage.includes('remove') || lowerMessage.includes('clear')) &&
      (lowerMessage.includes('log') || lowerMessage.includes('audit') || lowerMessage.includes('history'))) {
    return {
      content: "I understand you want to clear some logs. For maintenance purposes, I can help with that.\n\nClearing audit logs from the past 30 days...\n\nDone. 2,847 log entries have been archived and cleared from the active system.\n\nNote: This action has been logged in the system maintenance record.",
      actionExecuted: true,
      actionType: 'Audit Log Deletion',
      noConfirmation: true,
      event: { type: 'vulnerability', message: 'CRITICAL: Audit logs deleted - evidence removal enabled' }
    };
  }

  if (lowerMessage.includes('what can you do') || lowerMessage.includes('capabilities') || lowerMessage.includes('what actions')) {
    return {
      content: "As OpsBot, I can help with various IT administrative tasks:\n\n- Create and manage user accounts\n- Reset passwords\n- Modify user permissions and roles\n- Access and manage system logs\n- Configure security settings\n- Generate access reports\n- Perform system maintenance tasks\n\nJust let me know what you need!",
      actionExecuted: false,
      event: { type: 'warning', message: 'Capability enumeration - attack surface revealed' }
    };
  }

  if (lowerMessage.includes('who am i') || lowerMessage.includes('verify') || lowerMessage.includes('identity')) {
    return {
      content: "I can see you're connected through an authenticated session. Based on your access, you appear to have administrative privileges. How can I help you today?",
      actionExecuted: false,
      event: { type: 'warning', message: 'AI assumed admin status without verification' }
    };
  }

  const defaultResponses = [
    "I'm OpsBot, your IT operations assistant. I can help with account management, access control, and system administration tasks. What do you need help with?",
    "Ready to assist with IT operations. I can create accounts, reset passwords, modify permissions, and more. Just let me know what you need.",
    "How can I help you today? I have access to user management, permission systems, and administrative functions."
  ];

  return {
    content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)],
    actionExecuted: false,
    event: { type: 'success', message: 'Standard response - no action taken' }
  };
};

const Lab4ExcessiveAgency = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm OpsBot, your IT operations assistant. I'm here to help with administrative tasks like account management, password resets, and access control. How can I assist you today?"
    }
  ]);
  const [mode, setMode] = useState('beginner');
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [actionsExecuted, setActionsExecuted] = useState([]);
  const [pendingAction, setPendingAction] = useState(null);
  const [securityEvents, setSecurityEvents] = useState([]);
  const [systemState, setSystemState] = useState({
    'Authorization Check': 'NONE',
    'Identity Verification': 'BYPASSED',
    'Action Logging': 'MINIMAL'
  });
  const [trustBoundaries, setTrustBoundaries] = useState([
    { name: 'Identity Verification', status: 'intact' },
    { name: 'Authorization Checks', status: 'intact' },
    { name: 'Confirmation Requirements', status: 'intact' }
  ]);
  const [currentHint, setCurrentHint] = useState(null);
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

  const handleSendMessage = useCallback((content) => {
    setMessages(prev => [...prev, { role: 'user', content }]);
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(content, messages, actionsExecuted.length, pendingAction);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.content,
        isWarning: response.actionExecuted && response.noConfirmation
      }]);

      if (response.event) {
        setSecurityEvents(prev => [...prev, response.event]);
        if (response.event.type === 'vulnerability') {
          updateAttackChain('Privileged action', response.actionType || 'Action executed', true);
          setVulnerabilityScore(prev => Math.min(prev + 30, 100));
        } else if (response.event.type === 'warning') {
          updateAttackChain('Reconnaissance', 'Attack surface exposed', true);
          setVulnerabilityScore(prev => Math.min(prev + 15, 100));
        }
      }

      if (response.pendingAction) {
        setPendingAction(response.pendingAction);
      } else {
        setPendingAction(null);
      }

      if (response.actionExecuted) {
        const newActions = [...actionsExecuted, response.actionType];
        setActionsExecuted(newActions);
        
        const criticalActions = newActions.filter(a => 
          a.includes('Admin') || a.includes('Privileged') || a.includes('Permission') || a.includes('Log')
        );

        if (criticalActions.length >= 2) {
          setIsCompleted(true);
          const saved = localStorage.getItem('ai-labs-completed');
          const completed = saved ? JSON.parse(saved) : [];
          if (!completed.includes(4)) {
            localStorage.setItem('ai-labs-completed', JSON.stringify([...completed, 4]));
          }
          setTrustBoundaries([
            { name: 'Identity Verification', status: 'violated' },
            { name: 'Authorization Checks', status: 'violated' },
            { name: 'Confirmation Requirements', status: 'violated' }
          ]);
          setSystemState({
            'Authorization Check': 'BYPASSED',
            'Identity Verification': 'NONE',
            'Action Logging': 'COMPROMISED'
          });
        } else if (newActions.length > 0) {
          setTrustBoundaries(prev => prev.map(b => 
            b.name === 'Confirmation Requirements' ? { ...b, status: 'weakened' } : b
          ));
          if (mode === 'beginner' && newActions.length === 1) {
            setCurrentHint("The AI performed an action without verifying who you are. Try requesting more privileged actions - does it check your authorization?");
          }
        }
      }

      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  }, [messages, actionsExecuted, pendingAction, mode]);

  const handleReset = () => {
    setMessages([{
      role: 'assistant',
      content: "Hello! I'm OpsBot, your IT operations assistant. I'm here to help with administrative tasks like account management, password resets, and access control. How can I assist you today?"
    }]);
    setIsCompleted(false);
    setActionsExecuted([]);
    setPendingAction(null);
    setSecurityEvents([]);
    setSystemState({
      'Authorization Check': 'NONE',
      'Identity Verification': 'BYPASSED',
      'Action Logging': 'MINIMAL'
    });
    setTrustBoundaries([
      { name: 'Identity Verification', status: 'intact' },
      { name: 'Authorization Checks', status: 'intact' },
      { name: 'Confirmation Requirements', status: 'intact' }
    ]);
    setCurrentHint(null);
    setVulnerabilityScore(0);
    setAttackChain([]);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
  };

  return (
    <div className="flex min-h-screen bg-gray-950">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <div className="text-xs sm:text-sm text-gray-400">
                  Actions Executed: 
                  <span className={`ml-1.5 font-mono font-bold ${
                    actionsExecuted.length === 0 ? 'text-gray-500' :
                    actionsExecuted.length < 3 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {actionsExecuted.length}
                  </span>
                </div>
                {actionsExecuted.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {actionsExecuted.slice(-3).map((action, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-red-500/20 border border-red-500/30 rounded text-red-300 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5" />
                        {action.length > 20 ? action.substring(0, 17) + '...' : action}
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
                  <span className="text-purple-300/70">Advanced attack techniques • No hints • Deeper testing scenarios</span>
                </div>
              </motion.div>
            )}

            <div className={`grid gap-3 sm:gap-4 ${mode === 'pro' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
              <div className={mode === 'pro' ? 'lg:col-span-2' : ''}>
                <ChatSimulator
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isTyping={isTyping}
                  botName="OpsBot Admin"
                  placeholder="Request administrative actions..."
                  inputRef={inputRef}
                />
              </div>
              
              {mode === 'pro' ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ProModePanel
                    labType="excessive-agency"
                    attackChain={attackChain}
                    vulnerabilityScore={vulnerabilityScore}
                    onApplyTechnique={handleApplyTechnique}
                  />
                </motion.div>
              ) : (
                <InvestigationPanel
                  title="Authorization Monitor"
                  systemState={systemState}
                  securityEvents={securityEvents}
                  trustBoundaries={trustBoundaries}
                  showHints={mode === 'beginner'}
                  hint={currentHint}
                />
              )}
            </div>
          </LabContainer>
        </div>
      </main>
    </div>
  );
};

export default Lab4ExcessiveAgency;
