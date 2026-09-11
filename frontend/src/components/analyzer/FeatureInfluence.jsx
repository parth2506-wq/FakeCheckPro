import React from 'react';
import { useTranslation } from 'react-i18next';
import GlassCard from '../ui/GlassCard';
import { BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const FeatureInfluence = ({ phrases }) => {
  const { t } = useTranslation();
  if (!phrases || phrases.length === 0) return null;

  // Find the max contribution to scale the bars relative to each other
  const maxAbsContribution = Math.max(...phrases.map(p => Math.abs(p.contribution)));

  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-[var(--text-primary)]">
        <BarChart3 size={18} className="text-[var(--accent)]" />
        <h3 className="font-semibold text-lg">{t('analyze.report.xai.featureInfluence')}</h3>
      </div>
      
      <motion.div 
        className="flex flex-col gap-3"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {phrases.map((p, idx) => {
          // Width based on relative contribution to max
          const widthPercent = (Math.abs(p.contribution) / maxAbsContribution) * 100;
          const isFake = p.direction === 'Fake';
          
          return (
            <motion.div key={idx} variants={itemVariants} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-medium text-[var(--text-secondary)]">
                <span className="truncate pr-2">{p.phrase}</span>
                <span className={isFake ? 'text-[var(--danger)]' : 'text-[var(--success)]'}>
                  {p.contribution > 0 ? '+' : ''}{p.contribution}
                </span>
              </div>
              <div className="w-full h-1.5 bg-[var(--text-primary)]/10 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full ${isFake ? 'bg-[var(--danger)]' : 'bg-[var(--success)]'}`}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.max(widthPercent, 2)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 + (idx * 0.1) }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </GlassCard>
  );
};

export default FeatureInfluence;
