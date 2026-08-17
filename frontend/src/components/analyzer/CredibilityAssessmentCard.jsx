import React from 'react';
import GlassCard from '../ui/GlassCard';
import { AlertTriangle, CheckCircle, ShieldAlert, FileSearch, Scale, Info } from 'lucide-react';

const CredibilityAssessmentCard = ({ data }) => {
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
          bgColor: 'bg-emerald-50 border-emerald-100',
          textColor: 'text-emerald-700',
          titleColor: 'text-emerald-800',
          label: 'Supported / Credible'
        };
      case 'LIKELY_CREDIBLE':
        return {
          icon: <CheckCircle className="w-10 h-10 text-emerald-400" />,
          bgColor: 'bg-emerald-50/50 border-emerald-100',
          textColor: 'text-emerald-600',
          titleColor: 'text-emerald-700',
          label: 'Likely Credible'
        };
      case 'CONTRADICTED':
        return {
          icon: <ShieldAlert className="w-10 h-10 text-red-500" />,
          bgColor: 'bg-red-50 border-red-100',
          textColor: 'text-red-700',
          titleColor: 'text-red-800',
          label: 'Contradicted / High Risk'
        };
      case 'LIKELY_MISLEADING':
        return {
          icon: <AlertTriangle className="w-10 h-10 text-brand-orange" />,
          bgColor: 'bg-orange-50 border-orange-100',
          textColor: 'text-brand-orange',
          titleColor: 'text-orange-800',
          label: 'Likely Misleading'
        };
      case 'UNVERIFIED':
      default:
        return {
          icon: <FileSearch className="w-10 h-10 text-brand-gray" />,
          bgColor: 'bg-slate-50 border-slate-200',
          textColor: 'text-slate-600',
          titleColor: 'text-slate-800',
          label: 'Unverified / Inconclusive'
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
      case 'AGREE_FAKE': return 'Signals Align (High Risk)';
      case 'AGREE_REAL': return 'Signals Align (Low Risk)';
      case 'CONFLICT': return 'Conflicting Signals Detected';
      case 'INSUFFICIENT_EVIDENCE': return 'Insufficient External Evidence';
      default: return signal.replace(/_/g, ' ');
    }
  };

  const config = getAssessmentConfig(final_assessment);

  return (
    <GlassCard className={`relative overflow-hidden border-2 ${config.bgColor} shadow-lg transition-all duration-300`}>
      <div className="flex flex-col md:flex-row gap-6 md:items-center">
        
        {/* Left Side: Score & Primary Assessment */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left md:border-r border-slate-200/60 md:pr-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center justify-center md:justify-start gap-2">
            <Scale className="w-4 h-4" />
            Final Credibility Assessment
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
                {final_credibility_risk_score}
              </span>
              <span className="text-lg font-medium text-slate-400">/ 100</span>
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">
              Credibility Risk Score &bull; <span className={getRiskColor(risk_level)}>{formatRiskLevel(risk_level)}</span>
            </p>
          </div>
        </div>

        {/* Right Side: Details & Reasoning */}
        <div className="flex-[1.5] flex flex-col gap-4">
          
          <div className="bg-white/60 rounded-xl p-4 border border-white/80 shadow-sm">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Decision Reasoning</h4>
            <p className="text-brand-navy font-medium leading-relaxed">
              {decision_reason}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-white/40 rounded-lg px-4 py-3 border border-white/60">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Signal Relationship</span>
              <span className="text-sm font-semibold text-slate-700">{formatSignal(signal_relationship)}</span>
            </div>
            <div className="flex-1 bg-white/40 rounded-lg px-4 py-3 border border-white/60">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Calculation Base</span>
              <span className="text-sm font-semibold text-slate-700">
                40% ML + 60% Evidence
              </span>
            </div>
          </div>
          
          <div className="flex items-start gap-2 text-xs text-slate-500 mt-1">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <p>{explanation}</p>
          </div>
          
        </div>
      </div>
    </GlassCard>
  );
};

export default CredibilityAssessmentCard;
