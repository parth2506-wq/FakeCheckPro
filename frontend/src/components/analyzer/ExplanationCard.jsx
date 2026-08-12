import React from 'react';
import GlassCard from '../ui/GlassCard';
import { BrainCircuit } from 'lucide-react';

const ExplanationCard = ({ reason }) => {
  if (!reason) return null;

  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-brand-navy">
        <BrainCircuit size={18} className="text-brand-orange" />
        <h3 className="font-semibold text-lg">Why this prediction?</h3>
      </div>
      <p className="text-brand-navy/80 leading-relaxed text-[15px]">
        {reason}
      </p>
    </GlassCard>
  );
};

export default ExplanationCard;
