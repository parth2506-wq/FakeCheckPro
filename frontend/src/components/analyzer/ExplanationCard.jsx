import React from 'react';
import { useTranslation } from 'react-i18next';
import GlassCard from '../ui/GlassCard';
import { BrainCircuit } from 'lucide-react';

const ExplanationCard = ({ reason }) => {
  const { t } = useTranslation();
  if (!reason) return null;

  let displayReason = reason;
  if (reason.includes("The prediction was primarily influenced by features such as")) {
    const match = reason.match(/features such as (.*?), which contributed strongly toward the (.*?) class/);
    if (match) {
      const phrases = match[1];
      const category = match[2] === "Real" ? t("analyze.report.xai.real") : t("analyze.report.xai.fake");
      displayReason = t("analyze.report.xai.predictionReason").replace("{{phrases}}", phrases).replace("{{category}}", category);
    }
  }

  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-brand-navy">
        <BrainCircuit size={18} className="text-brand-orange" />
        <h3 className="font-semibold text-lg">{t('analyze.report.xai.whyPrediction')}</h3>
      </div>
      <p className="text-brand-navy/80 leading-relaxed text-[15px]">
        {displayReason}
      </p>
    </GlassCard>
  );
};

export default ExplanationCard;
