import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import heroVideo from '../../assets/hero-bg.mp4';

const Hero = () => {
  return (
    <section className="relative w-[100vw] left-[50%] -translate-x-[50%] min-h-[85vh] overflow-hidden">
      {/* Video Background - Full viewport width */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-base)] via-transparent to-[var(--bg-base)] z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-base)] via-transparent to-[var(--bg-base)] z-10" />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover opacity-30 mix-blend-screen"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 h-full flex flex-col lg:flex-row items-center gap-16 pt-12 lg:pt-0 min-h-[85vh]">
        <div className="flex-1 flex flex-col items-start w-full">
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-soft)] border border-[var(--accent)]/20 text-[var(--accent)] text-sm font-medium mb-6"
        >
          <Sparkles size={16} />
          <span>AI-Powered News Verification</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--text-primary)] leading-[1.1] mb-6"
        >
          Understand the <span className="text-[var(--accent)]">Story.</span><br />
          See the <span className="text-[var(--accent)]">Evidence.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed mb-10"
        >
          Analyze news through machine learning classification and evidence-oriented analysis. 
          Get detailed explainability reports that show exactly how the system reached its result.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--accent)] text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[var(--accent-glow)]">
            Start Analyzing <ArrowRight size={18} />
          </Link>
          <button 
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('technology')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-primary)] font-medium flex items-center justify-center hover:bg-[var(--surface-elevated)] transition-all backdrop-blur-sm cursor-pointer"
          >
            Explore How It Works
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="flex-1 w-full relative z-10"
      >
        {/* Floating UI Visualization */}
        <div className="relative w-full max-w-lg mx-auto aspect-[4/5] glass-card p-6 flex flex-col gap-4 group">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-[var(--text-secondary)] tracking-wide uppercase">Analysis Preview</div>
            <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
          </div>
          
          {/* Mock Article */}
          <div className="w-full bg-[var(--surface)] rounded-xl p-4 border border-[var(--border-color)]">
            <div className="h-4 w-3/4 bg-[var(--text-primary)]/10 rounded mb-3" />
            <div className="h-2 w-full bg-[var(--text-primary)]/5 rounded mb-2" />
            <div className="h-2 w-5/6 bg-[var(--text-primary)]/5 rounded" />
          </div>

          {/* Mock Classification */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex-1 bg-[var(--success-soft)] border border-[var(--success)]/20 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="text-[var(--success)]" size={24} />
              <div>
                <div className="text-xs font-semibold text-[var(--success)] uppercase">Model Prediction</div>
                <div className="font-bold text-[var(--success)]">REAL NEWS</div>
              </div>
            </div>
            <div className="flex-1 bg-[var(--surface)] border border-[var(--border-color)] rounded-xl p-4">
              <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1">Confidence</div>
              <div className="text-xl font-bold text-[var(--text-primary)]">87.4%</div>
            </div>
          </div>

          {/* Mock Evidence Analysis */}
          <div className="mt-2 w-full bg-[var(--accent-soft)] border border-[var(--accent)]/10 rounded-xl p-4">
            <div className="text-xs font-semibold text-[var(--accent)] uppercase mb-3 flex items-center gap-2">
              <Sparkles size={14} /> Evidence Analysis
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full bg-[var(--accent)]/20 rounded" />
              <div className="h-2 w-4/5 bg-[var(--accent)]/20 rounded" />
            </div>
          </div>
          
          {/* Floating animated elements */}
          <motion.div 
            animate={{ y: [-5, 5, -5] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-8 top-12 p-3 glass-card bg-[var(--surface-elevated)] shadow-xl rounded-xl border border-[var(--accent)]/20 flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">TF</div>
            <span className="text-[var(--text-primary)] text-xs font-semibold">TF-IDF Active</span>
          </motion.div>
          
          <motion.div 
            animate={{ y: [5, -5, 5] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 bottom-16 p-3 glass-card bg-[var(--surface-elevated)] shadow-xl rounded-xl border border-blue-500/20 flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">✨</div>
            <span className="text-[var(--text-primary)] text-xs font-semibold">Gemini Live</span>
          </motion.div>

        </div>
      </motion.div>
      </div>
    </section>
  );
};

export default Hero;
