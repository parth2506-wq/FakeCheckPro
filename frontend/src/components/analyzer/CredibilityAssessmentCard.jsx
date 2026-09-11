import React from 'react';
import { useTranslation } from 'react-i18next';
import GlassCard from '../ui/GlassCard';
import { AlertTriangle, CheckCircle, ShieldAlert, FileSearch, Scale, Info } from 'lucide-react';

const CredibilityAssessmentCard = ({ data }) => {
  const { t } = useTranslation();
  if (!data) return null;

  const {
    final_assessment,
    final_credibility_risk_score,
    risk_level,
    signal_relationship,
    decision_reason,
    explanation
  } = data;

  const getAssessmentConfig = (assessment) => {
    switch (assessment) {
      case 'SUPPORTED':
      case 'STRONGLY_CREDIBLE':
        return {
          icon: <CheckCircle className="w-10 h-10 text-emerald-500" />,
          bgColor: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-500/30',
          textColor: 'text-emerald-700 dark:text-emerald-400',
          titleColor: 'text-emerald-800 dark:text-emerald-400 font-bold',
          label: t('analyze.report.xai.supported')
        };
      case 'LIKELY_CREDIBLE':
        return {
          icon: <CheckCircle className="w-10 h-10 text-emerald-400" />,
          bgColor: 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-500/20',
          textColor: 'text-emerald-600 dark:text-emerald-400',
          titleColor: 'text-emerald-700 dark:text-emerald-400 font-bold',
          label: t('analyze.report.xai.likelyCredible')
        };
      case 'CONTRADICTED':
        return {
          icon: <ShieldAlert className="w-10 h-10 text-red-500" />,
          bgColor: 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-500/30',
          textColor: 'text-red-700 dark:text-red-400',
          titleColor: 'text-red-800 dark:text-red-400 font-bold',
          label: t('analyze.report.xai.contradicted')
        };
      case 'LIKELY_MISLEADING':
        return {
          icon: <AlertTriangle className="w-10 h-10 text-brand-orange" />,
          bgColor: 'bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-500/30',
          textColor: 'text-brand-orange dark:text-orange-400',
          titleColor: 'text-orange-800 dark:text-orange-400 font-bold',
          label: t('analyze.report.xai.likelyMisleading')
        };
      case 'UNVERIFIED':
      default:
        return {
          icon: <FileSearch className="w-10 h-10 text-slate-400 dark:text-slate-300" />,
          bgColor: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-600',
          textColor: 'text-slate-600 dark:text-slate-300',
          titleColor: 'text-slate-800 dark:text-white font-bold',
          label: t('analyze.report.xai.unverified')
        };
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'VERY_LOW_RISK':
      case 'LOW_RISK': return 'text-emerald-500';
      case 'MODERATE_RISK': return 'text-amber-500';
      case 'HIGH_RISK': return 'text-brand-orange';
      case 'VERY_HIGH_RISK':
      case 'EXTREME_RISK': return 'text-red-600';
      default: return 'text-slate-500';
    }
  };

  const formatRiskLevel = (level) => {
    return level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatSignal = (signal) => {
    switch (signal) {
      case 'AGREE_FAKE': return t('analyze.report.xai.signalsAlignHigh');
      case 'AGREE_REAL': return t('analyze.report.xai.signalsAlignLow');
      case 'CONFLICT': return t('analyze.report.xai.conflictingSignals');
      case 'INSUFFICIENT_EVIDENCE': return t('analyze.report.xai.insufficientEvidence');
      default: return signal.replace(/_/g, ' ');
    }
  };

  const getDecisionReasonTranslation = (reason) => {
    const reasonMap = {
      "No reliable evidence was found to corroborate or contradict the claims.": "noEvidence",
      "High ML risk was detected, but external evidence is insufficient to independently establish falsity.": "highMlNoEvidenceFake",
      "ML model indicates a risk level, but available external evidence is insufficient to independently establish falsity.": "mlRiskNoEvidence",
      "Final assessment derived from weighted combination of ML and external evidence.": "weightedCombination",
      "Strong external evidence directly contradicts the claims, overriding other signals.": "strongEvidenceContradicts",
      "Strong external evidence overrides ML classification.": "strongEvidenceOverridesMl",
      "Strong external evidence supports the central claims despite high ML risk.": "strongEvidenceSupportsDespiteMl",
      "Strong external evidence corroborates the claims.": "strongEvidenceCorroborates",
      "ML classification indicates high risk, while available external evidence is weak and insufficient for a definitive contradiction.": "highMlWeakEvidence",
      "External evidence is weak and insufficient for a definitive conclusion.": "weakEvidence",
      "External evidence is mixed, but the ML classifier identifies strong linguistic risk.": "mixedEvidenceHighMl",
      "External evidence contains meaningful support and contradiction. Manual review recommended.": "mixedEvidenceReview",
      "External evidence provides meaningful support, but the ML classifier identifies strong linguistic risk.": "supportEvidenceHighMl",
      "External evidence contradicts the claim, but the ML classifier suggests low risk.": "contradictEvidenceLowMl",
      "Signals are aligned and weighted calculation determines the final assessment.": "signalsAligned"
    };

    const key = reasonMap[reason];
    return key ? t(`analyze.report.xai.decisionReasons.${key}`) : reason;
  };

  const config = getAssessmentConfig(final_assessment);

  return (
    <GlassCard className={`relative overflow-hidden border-2 ${config.bgColor} shadow-lg transition-all duration-300`}>
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        
        {/* Left Side: Score & Primary Assessment */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left md:border-r border-slate-200/60 md:pr-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-center md:justify-start gap-2">
            <Scale className="w-4 h-4" />
            {t('analyze.report.xai.finalAssessment')}
          </h2>
          
          <div className="flex items-center gap-4 mb-3">
            {config.icon}
            <div>
              <h3 className={`text-2xl font-bold ${config.titleColor}`}>
                {config.label}
              </h3>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-black tracking-tighter ${getRiskColor(risk_level)}`}>
                {Math.round(final_credibility_risk_score * 10) / 10}
              </span>
              <span className="text-lg font-medium text-slate-400">/ 100</span>
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">
              {t('analyze.report.xai.credibilityRiskScore')} &bull; <span className={getRiskColor(risk_level)}>{formatRiskLevel(risk_level)}</span>
            </p>
          </div>
        </div>

        {/* Right Side: Details & Reasoning */}
        <div className="flex-[1.5] flex flex-col gap-4">
          
          <div className="bg-white/60 dark:bg-white/90 rounded-xl p-4 border border-white/80 dark:border-white/60 shadow-sm">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t('analyze.report.xai.decisionReasoning')}</h4>
            <p className="text-brand-navy font-medium leading-relaxed">
              {getDecisionReasonTranslation(decision_reason)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-white/40 dark:bg-white/90 rounded-lg px-4 py-3 border border-white dark:border-white/60/60">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('analyze.report.xai.signalRelationship')}</span>
              <span className="text-sm font-semibold text-slate-700">{formatSignal(signal_relationship)}</span>
            </div>
            <div className="flex-1 bg-white/40 dark:bg-white/90 rounded-lg px-4 py-3 border border-white dark:border-white/60/60">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t('analyze.report.xai.calculationBase')}</span>
              <span className="text-sm font-semibold text-slate-700">
                {t('analyze.report.xai.baseSplit')}
              </span>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-xs text-slate-500 mt-1">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <p>
              {explanation === "The Final Credibility Risk Score is an AI-assisted composite risk indicator derived from content-based ML classification and external evidence assessment. It is not a statistical probability of factual falsity or truth." 
                ? t('analyze.report.xai.aiAssisted') 
                : explanation}
            </p>
          </div>
          
        </div>
      </div>
    </GlassCard>
  );
};

export default CredibilityAssessmentCard;
