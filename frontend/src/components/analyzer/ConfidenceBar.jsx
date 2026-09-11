import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const ConfidenceBar = ({ confidence, isFake }) => {
  const { t } = useTranslation();
  const percentage = Math.min(Math.max(confidence * 100, 0), 100);
  const colorClass = isFake ? 'bg-[var(--danger)]' : 'bg-[var(--success)]';
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => `${latest.toFixed(1)}%`);

  useEffect(() => {
    const animation = animate(count, percentage, { duration: 1.5, ease: "easeOut" });
    return animation.stop;
  }, [percentage]);

  return (
    <div className="w-full flex flex-col gap-2 mt-4">
      <div className="flex justify-between items-end">
        <span className="text-sm font-medium text-[var(--text-secondary)]">{t('analyze.report.xai.modelConfidence')}</span>
        <motion.span className={`text-xl font-bold ${isFake ? 'text-[var(--danger)]' : 'text-[var(--success)]'}`}>
          {rounded}
        </motion.span>
      </div>
      <div className="h-3 w-full bg-[var(--surface-elevated)] rounded-full overflow-hidden border border-[var(--border-color)]">
        <motion.div 
          className={`h-full ${colorClass} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
      <p className="text-[11px] text-[var(--text-secondary)] mt-1">
        {t('analyze.report.xai.confidenceDesc')}
      </p>
    </div>
  );
};

export default ConfidenceBar;
