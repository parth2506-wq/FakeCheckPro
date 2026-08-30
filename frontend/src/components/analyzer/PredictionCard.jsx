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
    <GlassCard className="flex flex-col relative overflow-hidden">
      {/* Background glow indication */}
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 pointer-events-none rounded-full ${isFake ? 'bg-red-500' : 'bg-green-500'}`} />
      
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-2xl mt-1 shrink-0 ${isFake ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
          {isFake ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-xs font-semibold text-brand-gray uppercase tracking-wider">{t('analyze.report.xai.predictionResult')}</h3>
          
          <div className="text-brand-navy text-lg font-medium">
            {t('analyze.report.xai.predictionDesc1')}'{isFake ? t('analyze.report.xai.fake') : t('analyze.report.xai.real')}'{t('analyze.report.xai.predictionDesc2')}
          </div>

          <p className="text-[13px] text-brand-gray/90 mt-1 leading-relaxed max-w-3xl">
            <strong>{t('analyze.report.xai.disclaimer')}</strong> {t('analyze.report.xai.disclaimerText')}
          </p>
        </div>
      </div>

      <ConfidenceBar confidence={result.confidence} isFake={isFake} />
    </GlassCard>
  );
};

export default PredictionCard;
