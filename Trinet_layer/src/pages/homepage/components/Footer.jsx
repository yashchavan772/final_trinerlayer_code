import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Logo } from '../../../components/shared';
import { XIcon, DiscordIcon, InstagramIcon, LinkedInIcon, YouTubeIcon } from '../../../components/SocialIcons';

const PolicyModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div 
        className="relative bg-surface border border-border rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-muted hover:bg-[rgba(0,234,255,0.1)] flex items-center justify-center transition-all duration-200 border border-transparent hover:border-accent"
            aria-label="Close"
          >
            <Icon name="X" size={18} color="var(--color-muted-foreground)" />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] text-sm text-muted-foreground leading-relaxed">
          {children}
        </div>
        <div className="p-4 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-accent text-background font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const TermsOfServiceContent = () => (
  <div className="space-y-4">
    <p className="text-foreground font-medium">Last Updated: January 2026</p>
    
    <section className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">1. Acceptance of Terms</h3>
      <p>By accessing and using TrinetLayer, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
    </section>

    <section className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">2. Educational Purpose</h3>
      <p>TrinetLayer is designed exclusively for educational and authorized security research purposes. All tools, payloads, and techniques provided are intended to help security professionals understand vulnerabilities and improve defensive measures.</p>
    </section>

    <section className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">3. Authorized Use Only</h3>
      <p>You agree to use TrinetLayer only on systems and applications you own or have explicit written authorization to test. Unauthorized access to computer systems is illegal and strictly prohibited.</p>
    </section>

    <section className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">4. User Responsibilities</h3>
      <ul className="list-disc list-inside space-y-1 ml-2">
        <li>Comply with all applicable laws and regulations</li>
        <li>Obtain proper authorization before security testing</li>
        <li>Report vulnerabilities responsibly</li>
        <li>Not use the platform for malicious purposes</li>
      </ul>
    </section>

    <section className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">5. Disclaimer of Warranties</h3>
      <p>TrinetLayer is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or reliability of any content or tools.</p>
    </section>

    <section className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">6. Limitation of Liability</h3>
      <p>TrinetLayer and its creators shall not be liable for any damages arising from the use or misuse of this platform, including but not limited to direct, indirect, incidental, or consequential damages.</p>
    </section>

    <section className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">7. Changes to Terms</h3>
      <p>We reserve the right to modify these terms at any time. Continued use of TrinetLayer after changes constitutes acceptance of the updated terms.</p>
    </section>
  </div>
);

const PrivacyPolicyContent = () => (
  <div className="space-y-4">
    <p className="text-foreground font-medium">Last Updated: January 2026</p>
    
    <section className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">1. Information We Collect</h3>
      <p>TrinetLayer collects minimal information necessary to provide our services:</p>
      <ul className="list-disc list-inside space-y-1 ml-2">
        <li>Usage data and analytics for platform improvement</li>
        <li>Technical information such as browser type and device information</li>
        <li>Scan targets and results (only what you submit)</li>
      </ul>
    </section>

    <section className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">2. How We Use Your Information</h3>
      <p>We use collected information to:</p>
      <ul className="list-disc list-inside space-y-1 ml-2">
        <li>Provide and maintain our security research tools</li>
        <li>Improve user experience and platform functionality</li>
        <li>Ensure platform security and prevent abuse</li>
      </ul>
    </section>

    <section className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">3. Data Security</h3>
      <p>We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.</p>
    </section>

    <section className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">4. Data Retention</h3>
      <p>Scan results and user data are retained only as long as necessary to provide our services. You may request deletion of your data at any time.</p>
    </section>

    <section className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">5. Third-Party Services</h3>
      <p>TrinetLayer may integrate with third-party services for enhanced functionality. These services have their own privacy policies that govern data handling.</p>
    </section>

    <section className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">6. Your Rights</h3>
      <p>You have the right to:</p>
      <ul className="list-disc list-inside space-y-1 ml-2">
        <li>Access your personal data</li>
        <li>Request correction of inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Opt out of analytics collection</li>
      </ul>
    </section>

    <section className="space-y-2">
      <h3 className="text-base font-semibold text-foreground">7. Contact</h3>
      <p>For privacy-related inquiries, please contact us through our official channels.</p>
    </section>
  </div>
);

const Footer = () => {
  const currentYear = new Date()?.getFullYear();
  const [activeModal, setActiveModal] = useState(null);

  const socialLinks = [
    { id: 1, name: 'X', Icon: XIcon, url: 'https://x.com/Trinetlayer', ariaLabel: 'Follow us on X' },
    { id: 2, name: 'Instagram', Icon: InstagramIcon, url: 'https://www.instagram.com/trinet_layer', ariaLabel: 'Follow us on Instagram' },
    { id: 3, name: 'Discord', Icon: DiscordIcon, url: 'https://discord.com/invite/GwKjSYEu', ariaLabel: 'Join our Discord community' },
    { id: 4, name: 'LinkedIn', Icon: LinkedInIcon, url: 'https://www.linkedin.com/company/trinet-layer/', ariaLabel: 'Connect on LinkedIn' },
    { id: 5, name: 'YouTube', Icon: YouTubeIcon, url: 'https://www.youtube.com/@Trinet-Layer', ariaLabel: 'Subscribe on YouTube' }
  ];

  const footerLinks = [
    {
      id: 1,
      title: 'Resources',
      links: [
        { id: 1, label: 'Tutorials', url: '#' },
        { id: 2, label: 'Blog', url: '#' }
      ]
    },
    {
      id: 2,
      title: 'Community',
      links: [
        { id: 1, label: 'Discord Server', url: '#' },
        { id: 2, label: 'Contribute', url: '/contribute' }
      ]
    },
    {
      id: 3,
      title: 'Legal',
      links: [
        { id: 1, label: 'Terms of Service', action: () => setActiveModal('terms') },
        { id: 2, label: 'Privacy Policy', action: () => setActiveModal('privacy') }
      ]
    }
  ];

  const contactSection = {
    title: 'Contact Us',
    description: 'Looking for VAPT services or collaboration? Reach out to us.',
    email: 'team@trinetlayer.com'
  };

  const handleLinkClick = (link, e) => {
    if (link.action) {
      e.preventDefault();
      link.action();
    }
  };

  return (
    <>
      <footer className="border-t border-border bg-surface mt-6 sm:mt-8 md:mt-10 lg:mt-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
                <div className="footer-logo w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 flex items-center justify-center">
                  <Logo size={48} className="logo-svg" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground">TrinetLayer</h3>
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium">v2.5.1</span>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5 max-w-full sm:max-w-md">
                A battle-tested security platform for vulnerability research, real-world exploit payloads, and modern attack techniques — crafted by hackers, trusted by hackers.
              </p>
              
              <div className="flex items-center gap-2.5 sm:gap-3">
                {socialLinks?.map((social) => {
                  const SocialIcon = social?.Icon;
                  return (
                    <a
                      key={social?.id}
                      href={social?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social?.ariaLabel}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-muted flex items-center justify-center transition-all duration-250 ease-cyber hover:bg-[rgba(0,234,255,0.1)] hover:border-accent border border-transparent text-muted-foreground hover:text-accent"
                    >
                      <SocialIcon size={18} className="sm:w-5 sm:h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {footerLinks?.map((section) => (
              <div key={section?.id}>
                <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3">
                  {section?.title}
                </h4>
                <ul className="space-y-2">
                  {section?.links?.map((link) => (
                    <li key={link?.id}>
                      <a
                        href={link?.url || '#'}
                        onClick={(e) => handleLinkClick(link, e)}
                        className="text-xs sm:text-sm text-muted-foreground hover:text-accent transition-colors duration-250 font-medium cursor-pointer"
                      >
                        {link?.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="text-sm sm:text-base font-semibold text-foreground mb-3">
                {contactSection.title}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                {contactSection.description}
              </p>
              <a
                href={`mailto:${contactSection.email}`}
                className="text-xs sm:text-sm text-accent hover:text-cyan-300 transition-colors duration-250 font-medium"
              >
                {contactSection.email}
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs md:text-sm text-muted-foreground font-medium text-center md:text-left">
                &copy; {currentYear} TrinetLayer. All rights reserved.
              </p>
              
              <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground font-medium">
                <Icon name="Zap" size={14} color="var(--color-accent)" className="md:w-4 md:h-4" />
                <span>Hack the planet, responsibly</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PolicyModal 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal(null)}
        title="Terms of Service"
      >
        <TermsOfServiceContent />
      </PolicyModal>

      <PolicyModal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)}
        title="Privacy Policy"
      >
        <PrivacyPolicyContent />
      </PolicyModal>
    </>
  );
};

export default Footer;
