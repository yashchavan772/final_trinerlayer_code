import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const TerminalHero = () => {
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState('');
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const terminalLines = [
    "$ initializing trinetlayer...",
    "$ loading vulnerability_database...",
    "$ connecting to payload_repository...",
    "$ system ready. welcome, hunter."
  ];

  useEffect(() => {
    if (currentLineIndex >= terminalLines?.length) return;

    const currentLine = terminalLines?.[currentLineIndex];
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex <= currentLine?.length) {
        setDisplayText(prev => {
          const lines = prev?.split('\n');
          lines[currentLineIndex] = currentLine?.slice(0, charIndex);
          return lines?.join('\n');
        });
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          if (currentLineIndex < terminalLines?.length - 1) {
            setDisplayText(prev => prev + '\n');
            setCurrentLineIndex(prev => prev + 1);
          }
        }, 500);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [currentLineIndex]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section className="py-4 sm:py-6 md:py-8 lg:py-6">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(0,234,255,0.05)] to-transparent pointer-events-none" />
      
      <div className="relative">
        <div className="mb-4 sm:mb-6 md:mb-8 lg:mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 lg:px-3 lg:py-1.5 bg-surface border border-border rounded-full mb-3 sm:mb-4">
            <Icon name="Shield" size={14} className="sm:w-4 sm:h-4" color="var(--color-accent)" />
            <span className="text-xs sm:text-sm text-accent font-medium">v2.5.1 - Everyday :)</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl font-bold text-foreground mb-3 sm:mb-4">
            <span className="text-accent">TrinetLayer</span>
          </h1>
          
          <p className="text-sm sm:text-base lg:text-base text-muted-foreground mb-4 sm:mb-5 max-w-full lg:max-w-3xl">
            Your go-to toolkit for bug hunting. Real exploits, practical techniques, and battle-tested payloads. No fluff.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 flex-wrap">
            <Button
              variant="default"
              size="lg"
              iconName="Shield"
              iconPosition="left"
              onClick={() => navigate('/vulnerabilities-overview')}
              className="w-full sm:w-auto"
            >
              Explore Vulnerabilities
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              iconName="Database"
              iconPosition="left"
              onClick={() => navigate('/payload-vault')}
              className="w-full sm:w-auto"
            >
              Access Payload Vault
            </Button>
            
            <a
              href="https://app.trinetlayer.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500/20 to-cyan-400/20 hover:from-cyan-500/30 hover:to-cyan-400/30 border border-cyan-500/40 hover:border-cyan-400/60 text-cyan-300 hover:text-cyan-200 font-medium text-sm rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,234,255,0.3)]"
            >
              <Icon name="Sparkles" size={18} />
              Explore the New Features
            </a>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 lg:mt-6">
          <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-glow-lg max-w-full">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 lg:py-2.5 bg-muted border-b border-border">
              <div className="flex gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-error" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-warning" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-success" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground font-medium ml-2 sm:ml-4">terminal@trinetlayer</span>
            </div>
            
            <div className="p-4 sm:p-5 md:p-6 lg:p-5 min-h-[180px] sm:min-h-[220px] lg:min-h-[200px] font-medium flex items-center">
              <pre className="text-sm sm:text-base text-success break-words whitespace-pre-wrap">
                {displayText}
                {showCursor && <span className="inline-block w-2 h-4 sm:h-5 bg-accent ml-1 terminal-cursor" />}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TerminalHero;