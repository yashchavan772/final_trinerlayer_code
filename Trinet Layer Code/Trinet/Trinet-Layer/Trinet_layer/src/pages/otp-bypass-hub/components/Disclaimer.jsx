import React from 'react';
import Icon from '../../../components/AppIcon';

const Disclaimer = () => {
  return (
    <section className="mb-8 md:mb-12">
      <div className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-accent/10 to-background border-2 border-accent/30">
        <div className="flex items-start gap-4 md:gap-5">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-accent/20 border-2 border-accent/40 flex items-center justify-center flex-shrink-0">
            <Icon name="ShieldAlert" size={28} className="md:w-8 md:h-8" color="var(--color-accent)" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-foreground mb-3 md:mb-4">
              ⚠️ Important Legal Disclaimer
            </h3>
            <div className="space-y-3 text-sm md:text-base text-muted-foreground font-body">
              <p>
                This educational content is provided for <span className="font-semibold text-foreground">authorized security testing and learning purposes only</span>. 
                All techniques, payloads, and exploitation methods documented here must be used responsibly and legally.
              </p>
              <div className="p-4 rounded-lg bg-background/60 border border-border">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Icon name="CheckCircle" size={16} color="var(--color-accent-green)" />
                  Permitted Use
                </h4>
                <ul className="space-y-1.5 text-sm">
                  <li>✅ Bug bounty programs with valid scope authorization</li>
                  <li>✅ Penetration testing with written client permission</li>
                  <li>✅ Personal lab environments and test applications</li>
                  <li>✅ Educational research and security awareness training</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/30">
                <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                  <Icon name="XCircle" size={16} color="rgb(239, 68, 68)" />
                  Prohibited Use
                </h4>
                <ul className="space-y-1.5 text-sm text-red-400/90">
                  <li>❌ Unauthorized access to systems you don't own</li>
                  <li>❌ Testing production applications without permission</li>
                  <li>❌ Malicious attacks or data theft</li>
                  <li>❌ Any activities violating local or international laws</li>
                </ul>
              </div>
              <p className="font-semibold text-accent">
                💡 Always obtain explicit written authorization before testing any system. Unauthorized security testing 
                may result in criminal charges, legal action, and permanent ban from bug bounty platforms.
              </p>
              <p className="text-xs italic">
                By using this educational resource, you agree to follow all applicable laws and regulations.
                Trinet_Layer and its contributors are not responsible for any misuse of this information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Disclaimer;