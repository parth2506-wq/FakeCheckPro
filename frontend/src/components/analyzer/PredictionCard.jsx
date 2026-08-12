import React from 'react';
import GlassCard from '../ui/GlassCard';
import ConfidenceBar from './ConfidenceBar';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

const PredictionCard = ({ result }) => {
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
          <h3 className="text-xs font-semibold text-brand-gray uppercase tracking-wider">Prediction Result</h3>
          
          <div className="flex items-center flex-wrap gap-2 text-brand-navy text-lg font-medium">
            Our model suggests this article is
            <span className={`px-2.5 py-1 rounded-lg text-sm font-bold tracking-wide ${isFake ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
              {isFake ? 'FAKE NEWS' : 'REAL NEWS'}
            </span>
          </div>

          <p className="text-[13px] text-brand-gray/90 mt-1 leading-relaxed max-w-3xl">
            <strong>Disclaimer:</strong> This application is an academic research project. The result above is purely a machine learning prediction based on statistical patterns learned from the WELFake dataset. It does <strong>not</strong> indicate factual truth or falsehood and should not be used as a definitive fact-checking source.
          </p>
        </div>
      </div>

      <ConfidenceBar confidence={result.confidence} isFake={isFake} />
    </GlassCard>
  );
};

export default PredictionCard;
