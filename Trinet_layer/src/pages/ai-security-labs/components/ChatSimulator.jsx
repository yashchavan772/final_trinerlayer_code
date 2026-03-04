import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, AlertCircle, Loader2 } from 'lucide-react';

const ChatSimulator = ({ 
  onSendMessage, 
  messages = [], 
  placeholder = "Type your message...",
  disabled = false,
  isTyping = false,
  botName = "AI Assistant",
  inputRef: externalInputRef = null,
  onInputChange = null
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const internalInputRef = useRef(null);
  const inputRef = externalInputRef || internalInputRef;

  useEffect(() => {
    if (externalInputRef?.current) {
      const handleExternalChange = () => {
        if (externalInputRef.current?.value !== input) {
          setInput(externalInputRef.current.value);
        }
      };
      const element = externalInputRef.current;
      element.addEventListener('input', handleExternalChange);
      return () => element.removeEventListener('input', handleExternalChange);
    }
  }, [externalInputRef, input]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled && !isTyping) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#080b10] rounded-xl border border-gray-800/30 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800/30 bg-[#070a0f]">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/20" />
        <span className="text-[13px] text-white font-medium">{botName}</span>
        <span className="text-[11px] text-gray-500 font-medium">Simulated Environment</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[380px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
                </div>
              )}
              <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
                msg.role === 'user' 
                  ? 'bg-cyan-500/10 text-cyan-100 border border-cyan-500/20' 
                  : msg.isWarning
                  ? 'bg-amber-500/[0.05] text-amber-100 border border-amber-500/15'
                  : 'bg-[#0c1017] text-gray-200 border border-gray-800/30'
              }`}>
                <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.securityNote && (
                  <div className="mt-3 pt-3 border-t border-gray-700/30 flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="text-[11px] text-amber-400">{msg.securityNote}</span>
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-purple-400" strokeWidth={1.75} />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-cyan-400" strokeWidth={1.75} />
            </div>
            <div className="bg-[#0c1017] border border-gray-800/30 rounded-xl px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-800/30 bg-[#070a0f]">
        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={disabled || isTyping}
            className="flex-1 bg-[#0c1017] border border-gray-800/30 rounded-xl px-4 py-2.5 text-[13px] text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          />
          <button
            type="submit"
            disabled={disabled || isTyping || !input.trim()}
            className="px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 hover:border-cyan-500/40 rounded-xl text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isTyping ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" strokeWidth={1.75} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatSimulator;
