import React from 'react';
import { useTranslation } from 'react-i18next';

const ConfidenceBar = ({ confidence, isFake }) => {
  const { t } = useTranslation();
  const percentage = Math.min(Math.max(confidence * 100, 0), 100);
  const colorClass = isFake ? 'bg-red-400' : 'bg-green-400';
  
  return (
    <div className="w-full flex flex-col gap-2 mt-4">
      <div className="flex justify-between items-end">
        <span className="text-sm font-medium text-brand-gray">{t('analyze.report.xai.modelConfidence')}</span>
        <span className="text-xl font-bold text-brand-navy">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden border border-black/5">
        <div 
          className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-[11px] text-brand-gray/80 mt-1">
        {t('analyze.report.xai.confidenceDesc')}
      </p>
    </div>
  );
};

export default ConfidenceBar;
