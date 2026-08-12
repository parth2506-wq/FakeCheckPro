import React from 'react';
import GlassCard from '../ui/GlassCard';
import { BarChart3 } from 'lucide-react';

const FeatureInfluence = ({ phrases }) => {
  if (!phrases || phrases.length === 0) return null;

  // Find the max contribution to scale the bars relative to each other
  const maxAbsContribution = Math.max(...phrases.map(p => Math.abs(p.contribution)));

  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-brand-navy">
        <BarChart3 size={18} className="text-brand-orange" />
        <h3 className="font-semibold text-lg">Feature Influence</h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {phrases.map((p, idx) => {
          // Width based on relative contribution to max
          const widthPercent = (Math.abs(p.contribution) / maxAbsContribution) * 100;
          const isFake = p.direction === 'Fake';
          
          return (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-medium text-brand-navy/80">
                <span className="truncate pr-2">{p.phrase}</span>
                <span className={isFake ? 'text-red-500' : 'text-green-500'}>
                  {p.contribution > 0 ? '+' : ''}{p.contribution}
                </span>
              </div>
              <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${isFake ? 'bg-red-400' : 'bg-green-400'}`}
                  style={{ width: `${Math.max(widthPercent, 2)}%` }} // Minimum 2% width so it's visible
                />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

export default FeatureInfluence;
