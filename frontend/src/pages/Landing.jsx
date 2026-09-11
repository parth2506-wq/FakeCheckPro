import React from 'react';
import PageTransition from '../components/layout/PageTransition';
import Hero from '../components/landing/Hero';
import FeatureMatrix from '../components/landing/FeatureMatrix';
import DualIntelligenceSection from '../components/landing/DualIntelligenceSection';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';

const Landing = () => {
  return (
    <PageTransition className="bg-brand-base min-h-screen relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-orange/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <LandingNavbar />
      
      <main className="relative z-10 pt-24 pb-32 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col gap-32">
        <Hero />
        <FeatureMatrix />
        <DualIntelligenceSection />
        
        {/* Responsible AI Section */}
        <section className="max-w-4xl mx-auto py-16 w-full relative z-10">
          <div className="glass-card p-10 md:p-14 text-center relative overflow-hidden group border border-[var(--border-color)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-glow)] blur-[100px] opacity-30 pointer-events-none rounded-full" />
            
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[var(--surface-elevated)] flex items-center justify-center mb-8 border border-[var(--border-color)] shadow-xl relative z-10 hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accent)]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--text-primary)] tracking-tight relative z-10">
              Responsible AI Research
            </h2>
            
            <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto relative z-10">
              FakeCheckPro provides a research-model classification based on complex patterns learned from the WELFake dataset. 
              <span className="block mt-4 font-semibold text-[var(--text-primary)]">
                It does not establish absolute factual truth or falsehood.
              </span>
            </p>
            
            <div className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] uppercase tracking-widest relative z-10 border border-[var(--border-color)] px-6 py-2.5 rounded-full bg-[var(--surface-elevated)] shadow-sm">
              Built for Analysis & Transparency
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default Landing;
