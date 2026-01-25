import React from 'react';
import { Helmet } from 'react-helmet';
import Sidebar from '../../components/navigation/Sidebar';
import Breadcrumb from '../../components/navigation/Breadcrumb';
import GlobalSearch from '../../components/navigation/GlobalSearch';
import Icon from '../../components/AppIcon';

const Contribute = () => {
  const contributionTypes = [
    {
      id: 1,
      icon: 'FileCode',
      title: 'Test Cases',
      description: 'Submit security test cases for various vulnerability types including XSS, SQLi, IDOR, and more.'
    },
    {
      id: 2,
      icon: 'Code',
      title: 'Payloads',
      description: 'Share working exploit payloads with proper documentation and use case scenarios.'
    },
    {
      id: 3,
      icon: 'Brain',
      title: 'AI Ideas & Models',
      description: 'Contribute AI-powered security concepts, prompt engineering techniques, or detection models.'
    },
    {
      id: 4,
      icon: 'FlaskConical',
      title: 'Labs',
      description: 'Build interactive AI labs, security labs, or test environments for hands-on learning.'
    },
    {
      id: 5,
      icon: 'Lightbulb',
      title: 'Research Ideas',
      description: 'Propose new research directions, vulnerability discoveries, or security methodologies.'
    },
    {
      id: 6,
      icon: 'Wrench',
      title: 'Tools',
      description: 'Develop or suggest security tools, scanners, or automation scripts.'
    },
    {
      id: 7,
      icon: 'TrendingUp',
      title: 'Efficiency Improvements',
      description: 'Suggest optimizations, UX improvements, or workflow enhancements for the platform.'
    }
  ];

  const benefits = [
    {
      id: 1,
      icon: 'User',
      text: 'Your name will be added to the Contributors page with recognition for your work'
    },
    {
      id: 2,
      icon: 'Share2',
      text: 'Public shoutout on TrinetLayer social media channels (X, LinkedIn, Instagram, Discord)'
    },
    {
      id: 3,
      icon: 'Award',
      text: 'Full credit for AI, Labs, and security contributions with links to your profiles'
    },
    {
      id: 4,
      icon: 'Users',
      text: 'Join an exclusive community of security researchers and contributors'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contribute to TrinetLayer | Security Research Platform</title>
        <meta name="description" content="Contribute to TrinetLayer by submitting test cases, payloads, AI ideas, labs, research, and tools. Join our community of security researchers." />
      </Helmet>

      <div className="min-h-screen bg-background flex">
        <Sidebar />

        <main className="flex-1 lg:ml-64">
          <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <GlobalSearch />
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Breadcrumb
              items={[
                { label: 'Home', path: '/' },
                { label: 'Contribute', path: '/contribute' }
              ]}
            />

            <div className="mt-6 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                  <Icon name="Heart" size={32} className="text-accent" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                    Contribute to TrinetLayer
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Help build the ultimate security research platform
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6 mb-8">
              <p className="text-muted-foreground leading-relaxed text-lg">
                TrinetLayer is built by the security community, for the security community. 
                We welcome contributions from researchers, developers, and security enthusiasts 
                who want to help make this platform better. Whether you have a single payload 
                to share or want to build an entire lab, your contribution matters.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Icon name="GitPullRequest" size={24} className="text-accent" />
                What You Can Contribute
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contributionTypes.map((type) => (
                  <div
                    key={type.id}
                    className="bg-surface border border-border rounded-xl p-5 hover:border-accent/50 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-lg bg-accent/10 border border-accent/20 group-hover:bg-accent/20 transition-colors">
                        <Icon name={type.icon} size={20} className="text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{type.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Icon name="Gift" size={24} className="text-accent-green" />
                Contributor Benefits
              </h2>
              <div className="bg-surface border border-border rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-background border border-border"
                    >
                      <div className="p-2 rounded-lg bg-accent-green/10 border border-accent-green/20 flex-shrink-0">
                        <Icon name={benefit.icon} size={18} className="text-accent-green" />
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Icon name="Mail" size={24} className="text-accent" />
                Get in Touch
              </h2>
              <div className="bg-surface border border-border rounded-xl p-6">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Ready to contribute? Send us your submissions, ideas, or questions. 
                  We review all contributions and will get back to you as soon as possible.
                </p>
                <a
                  href="mailto:team@trinetlayer.com"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-accent/10 hover:bg-accent/20 border border-accent/30 hover:border-accent/50 rounded-xl text-accent font-medium transition-all group"
                >
                  <Icon name="Mail" size={20} />
                  <span>team@trinetlayer.com</span>
                  <Icon name="ExternalLink" size={16} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-r from-accent/10 to-accent-green/10 border border-accent/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-accent/20 flex-shrink-0">
                  <Icon name="Shield" size={24} className="text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Responsible Disclosure</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    All contributions should follow responsible disclosure practices. 
                    Do not submit payloads or techniques that could be used to harm real systems 
                    without proper authorization. Educational content should clearly indicate 
                    that it is for learning purposes only.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default Contribute;
