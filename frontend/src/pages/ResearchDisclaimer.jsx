import React from 'react';
import PageTransition from '../components/layout/PageTransition';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import { motion } from 'framer-motion';
import { AlertTriangle, Info, ShieldAlert, FileSearch } from 'lucide-react';

const ResearchDisclaimer = () => {
  return (
    <PageTransition className="bg-brand-base min-h-screen relative overflow-x-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent-glow)] opacity-10 blur-[120px]" />
      </div>

      <LandingNavbar />

      <main className="relative z-10 pt-32 pb-32 px-6 lg:px-12 max-w-4xl mx-auto flex flex-col gap-12">
        
        {/* Header */}
        <div className="text-center space-y-6 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-16 h-16 mx-auto rounded-2xl bg-[var(--surface-elevated)] flex items-center justify-center border border-[var(--border-color)] shadow-xl"
          >
            <AlertTriangle size={32} className="text-[var(--accent)]" />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            Research Disclaimer
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto"
          >
            Important information regarding the limitations, intended use, and nature of the FakeCheckPro classification system.
          </motion.p>
        </div>

        {/* Content Body */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-8 md:p-12 space-y-10 border border-[var(--border-color)]"
        >
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
              <ShieldAlert className="text-[var(--accent)]" size={24} />
              Not Absolute Truth
            </h2>
            <div className="p-5 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent)]/20">
              <p className="text-[var(--text-primary)] font-medium leading-relaxed">
                FakeCheckPro provides a <span className="text-[var(--accent)] font-bold">research-model classification</span> based on complex patterns learned from datasets. It does not establish absolute factual truth or falsehood.
              </p>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The classifications and evidence provided by this application should be used as a supplementary tool for critical analysis, not as a definitive verdict. Users are strongly encouraged to consult primary sources, official statements, and certified fact-checking organizations for conclusive verification.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
              <FileSearch className="text-[var(--text-primary)]" size={24} />
              Dataset & Model Limitations
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Our core machine learning classifier was trained on the WELFake dataset. While extensive, this dataset inherently contains historical biases and may not fully encompass emerging trends, novel forms of misinformation, or extremely recent events.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[var(--text-secondary)] marker:text-[var(--accent)]">
              <li>The model identifies structural and linguistic patterns typical of misinformation.</li>
              <li>A "Supported" or "Real" classification means the text lacks common deceptive patterns, not that every fact within it is strictly accurate.</li>
              <li>A "Contradicted" or "Fake" classification means the text heavily features deceptive linguistic patterns, sensationalism, or overlaps with known falsehoods.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-3">
              <Info className="text-blue-500" size={24} />
              AI Evidence Generation
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The secondary "Evidence" analysis is generated by Google's Gemini AI. While it is designed to synthesize search results and provide context, Large Language Models (LLMs) can occasionally hallucinate or misinterpret context. The evidence chain is provided for transparency and to guide human review.
            </p>
          </section>

        </motion.div>

      </main>

      <Footer />
    </PageTransition>
  );
};

export default ResearchDisclaimer;
