import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Tag } from 'lucide-react';

const ImportantPhrases = ({ phrases }) => {
  if (!phrases || phrases.length === 0) return null;

  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-brand-navy">
        <Tag size={18} className="text-brand-orange" />
        <h3 className="font-semibold text-lg">Important Phrases</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {phrases.map((p, idx) => (
          <div 
            key={idx} 
            className="group relative px-3 py-1.5 bg-white/60 border border-brand-navy/5 rounded-lg text-sm font-medium text-brand-navy cursor-help hover:bg-white transition-colors"
          >
            {p.phrase}
            
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max p-2 bg-brand-navy text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-xl">
              <div className="flex flex-col gap-1 text-center">
                <span className="font-medium text-brand-beige">Influence: {p.contribution > 0 ? '+' : ''}{p.contribution}</span>
                <span className={p.direction === 'Fake' ? 'text-red-300' : 'text-green-300'}>
                  Direction: {p.direction}
                </span>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-brand-navy" />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default ImportantPhrases;
