import React from 'react';
import { useTranslation } from 'react-i18next';
import GlassCard from '../ui/GlassCard';
import ConfidenceBar from './ConfidenceBar';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const PredictionCard = ({ result }) => {
  const { t } = useTranslation();
  if (!result) return null;

  const isFake = result.prediction === 0;
  
  return (
    <GlassCard 
      className="flex flex-col relative overflow-hidden group hover:shadow-xl transition-all duration-300"
      motionProps={{
        initial: { scale: 0.95, opacity: 0, y: 20 },
        animate: { scale: 1, opacity: 1, y: 0 },
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
    >
      {/* Background glow indication */}
      <div className={`absolute top-0 right-0 w-48 h-48 blur-[80px] opacity-30 pointer-events-none rounded-full transition-colors duration-700 ${isFake ? 'bg-[var(--danger)]' : 'bg-[var(--success)]'}`} />
      
      <div className="flex items-start gap-4 mb-4 relative z-10">
        <div className={`p-3 rounded-2xl mt-1 shrink-0 ${isFake ? 'bg-[var(--danger-soft)] text-[var(--danger)]' : 'bg-[var(--success-soft)] text-[var(--success)]'}`}>
          {isFake ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{t('analyze.report.xai.predictionResult')}</h3>
          
          <div className="text-[var(--text-primary)] text-xl font-medium">
            {t('analyze.report.xai.predictionDesc1')} <span className="font-bold text-[var(--text-primary)]">'{isFake ? t('analyze.report.xai.fake') : t('analyze.report.xai.real')}'</span> {t('analyze.report.xai.predictionDesc2')}
          </div>

          <p className="text-[13px] text-[var(--text-secondary)] mt-1 leading-relaxed max-w-3xl">
            <strong>{t('analyze.report.xai.disclaimer')}</strong> {t('analyze.report.xai.disclaimerText')}
          </p>
        </div>
      </div>

      <div className="relative z-10">
        <ConfidenceBar confidence={result.confidence} isFake={isFake} />
      </div>
    </GlassCard>
  );
};

export default PredictionCard;
