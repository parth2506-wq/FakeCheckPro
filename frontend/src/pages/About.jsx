import React from 'react';
import PageTransition from '../components/layout/PageTransition';
import LandingNavbar from '../components/landing/LandingNavbar';
import Footer from '../components/landing/Footer';
import { motion } from 'framer-motion';
import { Globe2, Languages, ShieldCheck, Sparkles, Binary, FileText } from 'lucide-react';

const About = () => {
  return (
    <PageTransition className="bg-brand-base min-h-screen relative overflow-x-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand-orange/10 blur-[120px]" />
      </div>

      <LandingNavbar />

      <main className="relative z-10 pt-32 pb-32 px-6 lg:px-12 max-w-5xl mx-auto flex flex-col gap-16">
        
        {/* Header Section */}
        <div className="text-center space-y-6 mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)]/20 text-[var(--accent)] text-sm font-medium"
          >
            <ShieldCheck size={16} />
            <span>Mission & Vision</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            Decoding Digital Truth
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed"
          >
            FakeCheckPro is an advanced research initiative dedicated to analyzing, categorizing, and dissecting the spread of misinformation using explainable artificial intelligence.
          </motion.p>
        </div>

        {/* Trilingual Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 md:p-12 relative overflow-hidden border border-[var(--border-color)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
            <div className="flex-1 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border-color)] flex items-center justify-center mb-2 shadow-lg">
                <Globe2 className="text-blue-500" size={28} />
              </div>
              <h2 className="text-3xl font-bold text-[var(--text-primary)]">Trilingual Intelligence</h2>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                Misinformation does not respect linguistic boundaries. That's why FakeCheckPro features native, deep-learning powered analysis across three major languages. Our AI doesn't just translate—it understands cultural and linguistic nuances in:
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="px-5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold flex items-center gap-2">
                  <Languages size={18} className="text-[var(--accent)]" /> English
                </div>
                <div className="px-5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold flex items-center gap-2">
                  <Languages size={18} className="text-[var(--accent)]" /> Hindi (हिन्दी)
                </div>
                <div className="px-5 py-2.5 rounded-xl bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] font-semibold flex items-center gap-2">
                  <Languages size={18} className="text-[var(--accent)]" /> Marathi (मराठी)
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 border border-[var(--border-color)] hover:-translate-y-1 transition-transform"
          >
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center mb-6">
              <Binary className="text-[var(--accent)]" size={24} />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Machine Learning</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Trained extensively on the comprehensive WELFake dataset, our models use logistic regression and advanced feature extraction (TF-IDF) to mathematically predict credibility based on thousands of linguistic patterns.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 border border-[var(--border-color)] hover:-translate-y-1 transition-transform"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6">
              <Sparkles className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">Explainable Evidence</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We reject the "black box" approach. Every credibility score is accompanied by an AI-generated evidence chain, parsing recent web data to provide clear, human-readable justification for every assessment.
            </p>
          </motion.div>
        </div>

      </main>

      <Footer />
    </PageTransition>
  );
};

export default About;
