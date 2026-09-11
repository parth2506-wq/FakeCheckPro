import React from 'react';
import { useTranslation } from 'react-i18next';
import GlassCard from '../ui/GlassCard';
import { Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
};

const ImportantPhrases = ({ phrases }) => {
  const { t } = useTranslation();
  if (!phrases || phrases.length === 0) return null;

  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-[var(--text-primary)]">
        <Tag size={18} className="text-[var(--accent)]" />
        <h3 className="font-semibold text-lg">{t('analyze.report.xai.importantPhrases')}</h3>
      </div>
      <motion.div 
        className="flex flex-wrap gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {phrases.map((p, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            className="group relative px-3 py-1.5 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-lg text-sm font-medium text-[var(--text-primary)] cursor-help hover:opacity-90 transition-colors shadow-sm"
          >
            {p.phrase}
            
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-2 bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-primary)] text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl">
              <div className="flex flex-col gap-1 text-center">
                <span className="font-medium text-[var(--text-secondary)]">{t('analyze.report.xai.influence')}: {p.contribution > 0 ? '+' : ''}{p.contribution}</span>
                <span className={p.direction === 'Fake' ? 'text-[var(--danger)]' : 'text-[var(--success)]'}>
                  {t('analyze.report.xai.direction')}: {p.direction}
                </span>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[var(--border-color)]" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </GlassCard>
  );
};

export default ImportantPhrases;
