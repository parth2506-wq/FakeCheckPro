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
      
      <div className="flex items-start gap-4 mb-2">
        <div className={`p-3 rounded-2xl ${isFake ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
          {isFake ? <AlertTriangle size={28} /> : <CheckCircle2 size={28} />}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-brand-gray uppercase tracking-wider mb-1">Prediction Result</h3>
          <h2 className={`text-4xl font-bold tracking-tight ${isFake ? 'text-red-500' : 'text-green-500'}`}>
            {isFake ? 'FAKE NEWS' : 'REAL NEWS'}
          </h2>
        </div>
      </div>

      <ConfidenceBar confidence={result.confidence} isFake={isFake} />
    </GlassCard>
  );
};

export default PredictionCard;
