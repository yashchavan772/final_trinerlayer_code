import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CodePreview = () => {
  const [copiedId, setCopiedId] = useState(null);

  const codeExamples = [
    {
      id: 1,
      title: "XSS Payload - Alert Box",
      language: "javascript",
      code: `<script>alert('XSS Vulnerability Detected')</script>`,
      description: "Basic XSS payload for testing alert functionality"
    },
    {
      id: 2,
      title: "CRLF Injection - Header Manipulation",
      language: "http",
      code: `GET /search?q=test%0d%0aSet-Cookie:admin=true HTTP/1.1\nHost: vulnerable-site.com`,
      description: "Inject custom headers using CRLF characters"
    },
    {
      id: 3,
      title: "IDOR - Parameter Tampering",
      language: "http",
      code: `GET /api/user/profile?id=1234 HTTP/1.1\nAuthorization: Bearer token_here`,
      description: "Access unauthorized user data by changing ID parameter"
    }
  ];

  const handleCopy = (code, id) => {
    navigator.clipboard?.writeText(code)?.then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-8">
      <div className="w-full">
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-2xl font-bold text-foreground mb-3 sm:mb-4">
            Ready-to-Use <span className="text-accent">Payloads</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-full sm:max-w-xl lg:max-w-2xl mx-auto px-4">
            Copy-paste exploit code with one click. All payloads are tested and documented with usage examples.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-4">
          {codeExamples?.map((example) => (
            <div
              key={example?.id}
              className="group relative bg-surface border border-border rounded-xl overflow-hidden transition-all duration-250 ease-cyber hover:border-accent hover:shadow-glow-md"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,234,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250 pointer-events-none" />
              
              <div className="relative">
                <div className="flex items-center justify-between px-4 sm:px-5 lg:px-4 py-3 sm:py-4 lg:py-3 bg-muted border-b border-border">
                  <div className="flex items-center gap-2">
                    <Icon name="Code" size={14} color="var(--color-accent)" className="sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                      {example?.language}
                    </span>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName={copiedId === example?.id ? "Check" : "Copy"}
                    onClick={() => handleCopy(example?.code, example?.id)}
                    className="h-7 sm:h-8 text-xs"
                  >
                    {copiedId === example?.id ? "Copied" : "Copy"}
                  </Button>
                </div>
                
                <div className="p-4 sm:p-5 lg:p-4">
                  <h3 className="text-sm sm:text-base lg:text-sm font-semibold text-foreground mb-2 sm:mb-3">
                    {example?.title}
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5 lg:mb-3">
                    {example?.description}
                  </p>
                  
                  <div className="bg-background border border-border rounded-lg p-3 sm:p-4 lg:p-3 overflow-x-auto">
                    <pre className="text-xs sm:text-sm text-success font-medium whitespace-pre-wrap break-words">
                      {example?.code}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CodePreview;