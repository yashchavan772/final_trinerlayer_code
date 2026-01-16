import React from 'react';
import Icon from '../../../components/AppIcon';

const ContentSection = ({ section, isActive, levelColor }) => {
  return (
    <div 
      id={section?.id}
      className="mb-8 md:mb-10 lg:mb-12 scroll-mt-24 transition-all opacity-100"
    >
      <div className={`p-6 md:p-8 rounded-xl bg-muted/30 border-2 transition-all ${
        isActive ? 'border-accent/50 shadow-glow-sm' : 'border-border hover:border-accent/30'
      }`}>
        <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
          <div 
            className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center"
            style={{ 
              backgroundColor: `${levelColor}20`,
              border: `2px solid ${levelColor}40`
            }}
          >
            <Icon name={section?.icon} size={24} className="md:w-7 md:h-7" color={levelColor} />
          </div>
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
            {section?.title}
          </h3>
        </div>

        {section?.content?.description && (
          <p className="text-base md:text-lg text-foreground/90 font-body mb-6 md:mb-8">
            {section?.content?.description}
          </p>
        )}

        {section?.content?.keyPoints && (
          <div className="mb-6 md:mb-8">
            <h4 className="text-base md:text-lg font-semibold text-foreground mb-4">
              Key Points
            </h4>
            <ul className="space-y-3">
              {section?.content?.keyPoints?.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Icon name="CheckCircle" size={18} className="mt-1 flex-shrink-0" color={levelColor} />
                  <span className="text-sm md:text-base text-muted-foreground font-body">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {section?.content?.visualExample && (
          <div className="mb-6 md:mb-8 p-4 md:p-5 rounded-lg bg-background/60 border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Eye" size={18} color="var(--color-accent)" />
              <span className="text-sm font-semibold text-foreground">Visual Flow</span>
            </div>
            <p className="text-sm md:text-base font-medium text-muted-foreground leading-relaxed">
              {section?.content?.visualExample}
            </p>
          </div>
        )}

        {section?.content?.steps && (
          <div className="mb-6 md:mb-8">
            <h4 className="text-base md:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="GitBranch" size={18} color={levelColor} />
              OTP Flow Steps
            </h4>
            <div className="space-y-4 md:space-y-5">
              {section?.content?.steps?.map((stepItem, index) => (
                <div key={index} className="p-4 md:p-5 rounded-lg bg-surface/50 border border-border hover:border-accent/30 transition-all">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base flex-shrink-0"
                      style={{ 
                        backgroundColor: `${levelColor}20`,
                        color: levelColor,
                        border: `2px solid ${levelColor}50`
                      }}
                    >
                      {stepItem?.step}
                    </div>
                    <div className="flex-1">
                      <h5 className="text-base md:text-lg font-semibold text-foreground mb-2">
                        {stepItem?.title}
                      </h5>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {stepItem?.detail}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {section?.content?.codeExample && (
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Code" size={18} color="var(--color-accent)" />
              <span className="text-sm font-semibold text-foreground">Code Example</span>
            </div>
            <div className="p-4 md:p-5 rounded-lg bg-black/60 border border-accent/20 overflow-x-auto">
              <pre className="text-xs md:text-sm font-code text-green-400 leading-relaxed whitespace-pre-wrap">
                {section?.content?.codeExample}
              </pre>
            </div>
          </div>
        )}

        {section?.content?.checks && (
          <div className="space-y-4 md:space-y-5">
            {section?.content?.checks?.map((checkItem, index) => (
              <div key={index} className="p-5 md:p-6 rounded-lg bg-background/80 border border-border hover:border-accent/40 transition-all">
                <h5 className="text-base md:text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Icon name="HelpCircle" size={18} color={levelColor} />
                  {checkItem?.check}
                </h5>
                <p className="text-sm md:text-base text-muted-foreground font-body mb-4">
                  {checkItem?.details}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="XCircle" size={16} color="rgb(239, 68, 68)" />
                      <span className="text-xs font-medium font-semibold text-red-400">Vulnerable</span>
                    </div>
                    <p className="text-xs md:text-sm text-red-400/90 font-medium">
                      {checkItem?.vulnerable}
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="CheckCircle" size={16} color="rgb(34, 197, 94)" />
                      <span className="text-xs font-medium font-semibold text-green-400">Secure</span>
                    </div>
                    <p className="text-xs md:text-sm text-green-400/90 font-medium">
                      {checkItem?.secure}
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Search" size={16} color="var(--color-accent)" />
                    <span className="text-xs font-medium font-semibold text-accent">Test Method</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground font-medium">
                    {checkItem?.testMethod}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {section?.content?.patterns && (
          <div className="space-y-6 md:space-y-8">
            {section?.content?.patterns?.map((pattern, index) => (
              <div key={index} className="p-5 md:p-6 rounded-lg bg-background/80 border-2 border-border hover:border-accent/40 transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                    <Icon name="AlertTriangle" size={20} color="rgb(239, 68, 68)" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg md:text-xl font-bold text-foreground mb-2">
                      {pattern?.pattern}
                    </h5>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/30">
                        {pattern?.impact}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h6 className="text-sm font-semibold text-foreground mb-2">Vulnerability:</h6>
                    <p className="text-sm md:text-base text-muted-foreground font-body">
                      {pattern?.vulnerability}
                    </p>
                  </div>

                  <div>
                    <h6 className="text-sm font-semibold text-foreground mb-2">Exploitation:</h6>
                    <p className="text-sm md:text-base text-muted-foreground font-body">
                      {pattern?.exploitation}
                    </p>
                  </div>

                  {pattern?.realCase && (
                    <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="FileText" size={16} color="var(--color-accent)" />
                        <span className="text-xs font-semibold text-accent">Real-World Case</span>
                      </div>
                      <p className="text-sm text-muted-foreground font-body">
                        {pattern?.realCase}
                      </p>
                    </div>
                  )}

                  {pattern?.code && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Code" size={16} color="var(--color-accent)" />
                        <span className="text-sm font-semibold text-foreground">Code Example</span>
                      </div>
                      <div className="p-4 rounded-lg bg-black/40 border border-border overflow-x-auto">
                        <pre className="text-xs md:text-sm font-medium text-green-400 leading-relaxed whitespace-pre-wrap">
                          {pattern?.code}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {section?.content?.techniques && (
          <div className="space-y-6 md:space-y-8">
            {section?.content?.techniques?.map((technique, index) => (
              <div key={index} className="p-5 md:p-6 rounded-lg bg-background/80 border border-border hover:border-accent/40 transition-all">
                <h5 className="text-lg md:text-xl font-bold text-foreground mb-3">
                  {technique?.technique}
                </h5>
                <p className="text-sm md:text-base text-muted-foreground font-body mb-4">
                  {technique?.description}
                </p>

                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="Terminal" size={16} color="var(--color-accent)" />
                    <span className="text-sm font-semibold text-foreground">Payload</span>
                  </div>
                  <div className="p-4 rounded-lg bg-black/40 border border-border overflow-x-auto">
                    <pre className="text-xs md:text-sm font-medium text-green-400 leading-relaxed whitespace-pre-wrap">
                      {technique?.payload}
                    </pre>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="CheckCircle" size={14} color="rgb(34, 197, 94)" />
                      <span className="text-xs font-medium font-semibold text-green-400">Success Indicator</span>
                    </div>
                    <p className="text-xs text-green-400/90 font-medium">
                      {technique?.successIndicator}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="Lightbulb" size={14} color="var(--color-accent)" />
                      <span className="text-xs font-medium font-semibold text-accent">Hunting Tip</span>
                    </div>
                    <p className="text-xs text-accent/90 font-medium">
                      {technique?.huntingTip}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {section?.content?.comparison && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-6">
            {section?.content?.comparison?.map((item, index) => (
              <div key={index} className="p-5 rounded-lg bg-background/80 border border-border">
                <h5 className="text-base md:text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Icon name={index === 0 ? "Globe" : "Smartphone"} size={18} color={levelColor} />
                  {item?.aspect}
                </h5>
                <div className="space-y-3 text-sm">
                  <p className="text-muted-foreground font-body">
                    <span className="font-semibold text-foreground">Characteristics:</span> {item?.characteristics}
                  </p>
                  <p className="text-muted-foreground font-body">
                    <span className="font-semibold text-foreground">Vulnerabilities:</span> {item?.vulnerabilities}
                  </p>
                  <p className="text-muted-foreground font-body">
                    <span className="font-semibold text-foreground">Focus:</span> {item?.testingFocus}
                  </p>
                  <p className="text-muted-foreground font-body">
                    <span className="font-semibold text-foreground">Tools:</span> {item?.tools}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {section?.content?.practicalTest && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="Code" size={18} color="var(--color-accent)" />
              <span className="text-sm font-semibold text-foreground">Practical Test</span>
            </div>
            <div className="p-4 rounded-lg bg-black/40 border border-border overflow-x-auto">
              <pre className="text-xs md:text-sm font-medium text-green-400 leading-relaxed whitespace-pre-wrap">
                {section?.content?.practicalTest}
              </pre>
            </div>
          </div>
        )}

        {section?.content?.keyDifference && (
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="AlertCircle" size={16} color="var(--color-accent)" />
              <span className="text-sm font-semibold text-accent">Key Difference</span>
            </div>
            <p className="text-sm text-muted-foreground font-body">
              {section?.content?.keyDifference}
            </p>
          </div>
        )}

        {/* Elite level advanced techniques */}
        {section?.content?.techniques && section?.id === 'advanced' && (
          <div className="space-y-6 md:space-y-8">
            {section?.content?.techniques?.map((tech, index) => (
              <div key={index} className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-background border-2 border-red-500/30">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center flex-shrink-0">
                    <Icon name="Skull" size={24} color="rgb(239, 68, 68)" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg md:text-xl font-bold text-foreground mb-2">
                      {tech?.name}
                    </h5>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/40">
                      {tech?.severity} Severity
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm md:text-base text-muted-foreground font-body">
                    {tech?.description}
                  </p>

                  <div className="p-4 rounded-lg bg-background/60 border border-border">
                    <h6 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Icon name="Target" size={14} color="var(--color-accent)" />
                      Exploitation Method
                    </h6>
                    <p className="text-sm text-muted-foreground font-medium">
                      {tech?.exploitation}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-background/60 border border-border">
                    <h6 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Icon name="Search" size={14} color="var(--color-accent)" />
                      Detection Method
                    </h6>
                    <p className="text-sm text-muted-foreground font-medium">
                      {tech?.detection}
                    </p>
                  </div>

                  {tech?.realCase && (
                    <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                      <h6 className="text-sm font-semibold text-accent mb-2 flex items-center gap-2">
                        <Icon name="FileText" size={14} color="var(--color-accent)" />
                        Real-World Case
                      </h6>
                      <p className="text-sm text-muted-foreground font-body">
                        {tech?.realCase}
                      </p>
                    </div>
                  )}

                  {tech?.technicalDetail && (
                    <div className="p-4 rounded-lg bg-black/40 border border-border overflow-x-auto">
                      <pre className="text-xs md:text-sm font-medium text-green-400 leading-relaxed whitespace-pre-wrap">
                        {tech?.technicalDetail}
                      </pre>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="AlertTriangle" size={14} color="rgb(239, 68, 68)" />
                      <span className="text-xs font-medium font-semibold text-red-400">Impact</span>
                    </div>
                    <p className="text-xs text-red-400/90 font-medium">
                      {tech?.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Race conditions */}
        {section?.content?.attacks && (
          <div className="space-y-6 md:space-y-8">
            {section?.content?.attacks?.map((attack, index) => (
              <div key={index} className="p-6 rounded-xl bg-background/80 border-2 border-border hover:border-accent/40 transition-all">
                <h5 className="text-lg md:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Icon name="Zap" size={20} color={levelColor} />
                  {attack?.attack}
                </h5>

                <div className="space-y-4">
                  <div>
                    <h6 className="text-sm font-semibold text-foreground mb-2">Concept:</h6>
                    <p className="text-sm text-muted-foreground font-body">
                      {attack?.concept}
                    </p>
                  </div>

                  <div>
                    <h6 className="text-sm font-semibold text-foreground mb-2">Implementation:</h6>
                    <div className="p-4 rounded-lg bg-black/40 border border-border overflow-x-auto">
                      <pre className="text-xs md:text-sm font-medium text-green-400 leading-relaxed whitespace-pre-wrap">
                        {attack?.implementation}
                      </pre>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <h6 className="text-xs font-medium font-semibold text-red-400 mb-2">Vulnerability</h6>
                      <p className="text-xs text-red-400/90 font-medium">
                        {attack?.vulnerability}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                      <h6 className="text-xs font-medium font-semibold text-green-400 mb-2">Mitigation</h6>
                      <p className="text-xs text-green-400/90 font-medium">
                        {attack?.mitigation}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name="CheckCircle" size={14} color="var(--color-accent)" />
                      <span className="text-xs font-medium font-semibold text-accent">Success Indicator</span>
                    </div>
                    <p className="text-xs text-accent/90 font-medium">
                      {attack?.successIndicator}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rare cases */}
        {section?.content?.rareCases && (
          <div className="space-y-6 md:space-y-8">
            {section?.content?.rareCases?.map((rareCase, index) => (
              <div key={index} className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-background border-2 border-purple-500/30">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 border-2 border-purple-500/40 flex items-center justify-center flex-shrink-0">
                    <Icon name="Gem" size={24} color="rgb(168, 85, 247)" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-lg md:text-xl font-bold text-foreground mb-2">
                      {rareCase?.case}
                    </h5>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm md:text-base text-muted-foreground font-body">
                    {rareCase?.description}
                  </p>

                  <div className="p-4 rounded-lg bg-background/60 border border-border">
                    <h6 className="text-sm font-semibold text-foreground mb-2">Real Example:</h6>
                    <p className="text-sm text-muted-foreground font-body">
                      {rareCase?.example}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-black/40 border border-border overflow-x-auto">
                    <h6 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Icon name="Code" size={14} color="var(--color-accent)" />
                      Exploitation
                    </h6>
                    <pre className="text-xs md:text-sm font-medium text-green-400 leading-relaxed whitespace-pre-wrap">
                      {rareCase?.exploitation}
                    </pre>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="flex items-center gap-2">
                      <Icon name="DollarSign" size={18} color="var(--color-accent)" />
                      <span className="text-sm font-semibold text-accent">Bounty Report</span>
                    </div>
                    <span className="text-sm font-medium text-accent">{rareCase?.bountyReport}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <h6 className="text-xs font-medium font-semibold text-green-400 mb-2 flex items-center gap-2">
                      <Icon name="Shield" size={14} color="rgb(34, 197, 94)" />
                      Fix
                    </h6>
                    <p className="text-xs text-green-400/90 font-medium">
                      {rareCase?.fix}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentSection;