import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, ArrowDown } from 'lucide-react';

const DualIntelligenceSection = () => {
  return (
    <section id="technology" className="w-full py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-4">Dual Intelligence System</h2>
        <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
          We combine a custom Machine Learning classifier with Gemini's reasoning 
          to provide both pattern recognition and explainable evidence analysis.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 relative">
        {/* Connection line for desktop */}
        <div className="hidden lg:block absolute top-1/2 left-1/4 right-1/4 h-px bg-gradient-to-r from-brand-orange/0 via-brand-orange/50 to-blue-500/0 -translate-y-1/2 -z-10" />

        {/* ML Model Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 flex-1 w-full max-w-md relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 blur-3xl rounded-full" />
          <div className="w-14 h-14 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center mb-6">
            <BrainCircuit className="text-[var(--accent)]" size={28} />
          </div>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">ML Classification</h3>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            TF-IDF + Logistic Regression trained on the WELFake dataset.
          </p>
          <ul className="space-y-3 text-sm font-medium text-[var(--text-primary)]">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Prediction Result</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Confidence Scoring</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" /> Feature Contributions (XAI)</li>
          </ul>
        </motion.div>

        {/* Center node */}
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="w-16 h-16 rounded-full bg-[var(--surface-elevated)] shadow-xl border border-[var(--border-color)] flex items-center justify-center shrink-0 z-10 hidden lg:flex"
        >
          <ArrowDown className="text-[var(--text-secondary)] rotate-[-90deg]" size={24} />
        </motion.div>

        {/* Gemini Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card p-8 flex-1 w-full max-w-md relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
            <Sparkles className="text-blue-500" size={28} />
          </div>
          <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Evidence Analysis</h3>
          <p className="text-[var(--text-secondary)] text-sm mb-6">
            Powered by the Gemini Evidence Chain.
          </p>
          <ul className="space-y-3 text-sm font-medium text-[var(--text-primary)]">
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Evidence-oriented reasoning</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Additional Contextual Analysis</li>
            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Nuanced Explanations</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

export default DualIntelligenceSection;
