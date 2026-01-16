import React from 'react';
import Sidebar from '../../components/navigation/Sidebar';
import Breadcrumb from '../../components/navigation/Breadcrumb';
import GlobalSearch from '../../components/navigation/GlobalSearch';
import TerminalHero from './components/TerminalHero';
import FeatureGrid from './components/FeatureGrid';
import VulnerabilityQuickAccess from './components/VulnerabilityQuickAccess';
import CodePreview from './components/CodePreview';
import StatsSection from './components/StatsSection';
import Footer from './components/Footer';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Sidebar />
      
      <main className="lg:ml-[280px] min-h-screen lg:w-[calc(100%-280px)] w-full overflow-x-hidden">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
          <div className="pl-16 pr-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <Breadcrumb />
            </div>
            <div className="w-full max-w-full">
              <GlobalSearch />
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            <TerminalHero />
            <FeatureGrid />
            <VulnerabilityQuickAccess />
            <CodePreview />
            <StatsSection />
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;