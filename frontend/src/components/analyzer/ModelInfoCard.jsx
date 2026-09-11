import React from 'react';
import { useTranslation } from 'react-i18next';
import { Network, Database, Cpu, Search, ShieldCheck, Scale, CheckCircle, GitMerge, Activity, AlertTriangle, SlidersHorizontal, ArrowDown } from 'lucide-react';

const ModelInfoCard = () => {
  const { t } = useTranslation();
  return (
    <div className="dark-feature-card p-6 flex flex-col h-full relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-brand-orange/20 blur-[60px] pointer-events-none" />
      
      <h2 className="text-xl font-semibold mb-6 tracking-tight relative z-10 flex items-center gap-2">
        <Network size={20} className="text-brand-orange" />
        {t('howItWorks.pipeline')}
      </h2>

      <div className="flex flex-col gap-8 relative z-10 overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Layer 1: ML Classification */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white dark:border-white/60/10 pb-2">
            <span className="bg-brand-orange/20 text-brand-orange text-xs font-bold px-2 py-1 rounded">{t('analyze.report.xai.layer1')}</span>
            <h3 className="text-sm font-semibold text-white/90">{t('analyze.report.xai.mlClassification')}</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-white/50">{t('analyze.report.xai.currentModel')}</span>
              <span className="text-sm font-semibold">{t('analyze.report.xai.logisticRegression')}</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-white/50">{t('analyze.report.xai.featureExtraction')}</span>
              <div className="flex items-center gap-2">
                <Database size={14} className="text-brand-orange/80" />
                <span className="text-sm font-semibold">TF-IDF</span>
              </div>
              <span className="text-[10px] text-white/40 mt-1">{t('analyze.report.xai.vocabulary')}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-white/50">{t('analyze.report.xai.explainability')}</span>
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-brand-orange/80" />
                <span className="text-sm font-semibold">{t('analyze.report.xai.enabled')}</span>
              </div>
              <span className="text-[10px] text-white/40 mt-1">{t('analyze.report.xai.featureContribution')}</span>
            </div>
          </div>
        </div>

        {/* Layer 2: Evidence Intelligence Engine */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white dark:border-white/60/10 pb-2">
            <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-1 rounded">{t('analyze.report.xai.layer2')}</span>
            <h3 className="text-sm font-semibold text-white/90">{t('analyze.report.xai.evidenceEngine')}</h3>
          </div>

          <div className="flex flex-col gap-3 text-xs text-white/70">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></div>
              <span className="font-semibold text-white/90">{t('analyze.report.xai.claimExtraction')}</span>
            </div>
            <div className="ml-0.5 border-l border-dashed border-white dark:border-white/60/20 pl-4 py-1 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Search size={12} className="text-white/40" />
                <span>{t('analyze.report.xai.evidenceSearch')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-white/40" />
                <span>{t('analyze.report.xai.trustedSource')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Database size={12} className="text-white/40" />
                <span>{t('analyze.report.xai.articleExtraction')}</span>
              </div>
              <div className="flex items-center gap-2">
                <GitMerge size={12} className="text-white/40" />
                <span>{t('analyze.report.xai.semanticMatching')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Scale size={12} className="text-white/40" />
                <span>{t('analyze.report.xai.evidenceClassification')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={12} className="text-white/40" />
                <span>{t('analyze.report.xai.sourceReliability')}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></div>
              <span className="font-semibold text-white/90">{t('analyze.report.xai.evidenceAggregation')}</span>
            </div>
          </div>
        </div>

        {/* Layer 3: FINAL {t('analyze.report.xai.decisionEngine')} */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white dark:border-white/60/10 pb-2">
            <span className="bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded">{t('analyze.report.xai.layer3')}</span>
            <h3 className="text-sm font-semibold text-white/90">{t('analyze.report.xai.finalDecisionEngine')}</h3>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white dark:border-white/60/10 shadow-inner flex flex-col gap-5 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent rounded-xl pointer-events-none"></div>
            
            <div className="flex flex-col items-center z-10">
              <div className="bg-green-500/20 text-green-400 text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
                {t('analyze.report.xai.decisionEngine')}
              </div>
              
              {/* Connecting lines and arrows */}
              <div className="w-full flex justify-center h-6 relative mt-1">
                <div className="absolute top-1/2 left-[15%] right-[15%] h-[1px] bg-white/20"></div>
                <div className="absolute top-1/2 left-[15%] w-px h-3 bg-white/20"></div>
                <div className="absolute top-1/2 right-[15%] w-px h-3 bg-white/20"></div>
                <div className="absolute top-0 w-px h-[calc(50%+12px)] bg-white/20"></div>
                
                <ArrowDown size={10} className="absolute bottom-[-4px] left-[calc(15%-5px)] text-white/40" />
                <ArrowDown size={10} className="absolute bottom-[-4px] left-[calc(50%-5px)] text-white/40" />
                <ArrowDown size={10} className="absolute bottom-[-4px] right-[calc(15%-5px)] text-white/40" />
              </div>
            </div>
            
            <div className="flex justify-between z-10 w-full mt-2">
              <div className="flex flex-col items-center gap-2 w-1/3">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white dark:border-white/60/10 flex items-center justify-center">
                  <Activity size={12} className="text-brand-orange" />
                </div>
                <span className="text-[9px] text-center text-white/60 font-medium leading-tight uppercase tracking-wider">{t('analyze.report.xai.normalizeScores')}</span>
              </div>
              
              <div className="flex flex-col items-center gap-2 w-1/3">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white dark:border-white/60/10 flex items-center justify-center">
                  <AlertTriangle size={12} className="text-red-400" />
                </div>
                <span className="text-[9px] text-center text-white/60 font-medium leading-tight uppercase tracking-wider">{t('analyze.report.xai.conflictDetection')}</span>
              </div>
              
              <div className="flex flex-col items-center gap-2 w-1/3">
                <div className="w-7 h-7 rounded-lg bg-white/5 border border-white dark:border-white/60/10 flex items-center justify-center">
                  <SlidersHorizontal size={12} className="text-blue-400" />
                </div>
                <span className="text-[9px] text-center text-white/60 font-medium leading-tight uppercase tracking-wider">{t('analyze.report.xai.overridesRules')}</span>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default ModelInfoCard;
