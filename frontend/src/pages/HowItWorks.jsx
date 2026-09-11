import React from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/layout/DashboardLayout';
import { UploadCloud, Cpu, Search, Scale, FileText, Bot, ArrowDown } from 'lucide-react';

const HowItWorks = () => {
  const { t } = useTranslation();
  const steps = [
    {
      icon: UploadCloud,
      title: t('howItWorks.step1Title'),
      description: t('howItWorks.step1Desc'),
      layer: null,
      theme: 'light'
    },
    {
      icon: Cpu,
      title: t('howItWorks.step2Title'),
      description: t('howItWorks.step2Desc'),
      layer: t('howItWorks.layer1'),
      theme: 'orange'
    },
    {
      icon: Search,
      title: t('howItWorks.step3Title'),
      description: t('howItWorks.step3Desc'),
      layer: t('howItWorks.layer2'),
      theme: 'blue'
    },
    {
      icon: Scale,
      title: t('howItWorks.step4Title'),
      description: t('howItWorks.step4Desc'),
      layer: t('howItWorks.layer3'),
      theme: 'green'
    },
    {
      icon: FileText,
      title: t('howItWorks.step5Title'),
      description: t('howItWorks.step5Desc'),
      layer: null,
      theme: 'light'
    },
    {
      icon: Bot,
      title: t('howItWorks.step6Title'),
      description: t('howItWorks.step6Desc'),
      layer: null,
      theme: 'purple'
    }
  ];

  const getThemeStyles = (theme) => {
    switch (theme) {
      case 'orange':
        return 'bg-[var(--surface-elevated)] border-[var(--accent)]/30 text-[var(--text-primary)] shadow-[0_0_20px_rgba(255,107,53,0.15)] relative overflow-hidden';
      case 'blue':
        return 'bg-[var(--surface-elevated)] border-blue-500/30 text-[var(--text-primary)] shadow-[0_0_20px_rgba(59,130,246,0.15)] relative overflow-hidden';
      case 'green':
        return 'bg-[var(--surface-elevated)] border-green-500/30 text-[var(--text-primary)] shadow-[0_0_20px_rgba(34,197,94,0.15)] relative overflow-hidden';
      case 'purple':
        return 'bg-[var(--surface-elevated)] border-purple-500/30 text-[var(--text-primary)] shadow-[0_0_20px_rgba(168,85,247,0.15)] relative overflow-hidden';
      default:
        return 'bg-[var(--surface)] backdrop-blur-xl border-[var(--border-color)] shadow-sm text-[var(--text-primary)]';
    }
  };

  const getIconStyles = (theme) => {
    switch (theme) {
      case 'orange': return 'bg-[var(--accent-soft)] text-[var(--accent)] shadow-[0_0_15px_rgba(255,107,53,0.2)]';
      case 'blue': return 'bg-blue-500/20 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]';
      case 'green': return 'bg-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]';
      case 'purple': return 'bg-purple-500/20 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]';
      default: return 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] shadow-sm border border-[var(--border-color)]';
    }
  };
  
  const getLayerBadgeStyles = (theme) => {
    switch (theme) {
      case 'orange': return 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent)]/30';
      case 'blue': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'green': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'purple': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      default: return 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border-color)]';
    }
  };

  const getGlowColor = (theme) => {
    switch (theme) {
      case 'orange': return 'bg-[var(--accent-soft)]';
      case 'blue': return 'bg-blue-500/20';
      case 'green': return 'bg-green-500/20';
      case 'purple': return 'bg-purple-500/20';
      default: return 'hidden';
    }
  };

  return (
    <DashboardLayout title={t("howItWorks.title")}>
      <div className="max-w-4xl pb-16 mx-auto">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-4 tracking-tight">{t("howItWorks.pipeline")}</h2>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            {t("howItWorks.desc")}
          </p>
        </div>

        <div className="flex flex-col gap-3 relative animate-in fade-in slide-in-from-bottom-8 duration-700">
          {/* Continuous vertical line connecting the steps */}
          <div className="absolute left-[39px] sm:left-[51px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-[var(--border-color)]/20 via-[var(--border-color)] to-[var(--border-color)]/20 hidden sm:block"></div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            
            return (
              <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8 group">
                
                {/* Step Number / Icon Column */}
                <div className="flex items-center gap-4 shrink-0 sm:w-20 sm:justify-end z-10">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border border-[var(--border-color)] transition-transform duration-300 group-hover:scale-110 ${getIconStyles(step.theme)}`}>
                    <Icon size={24} className="sm:w-7 sm:h-7" />
                  </div>
                </div>
                
                {/* Content Card */}
                <div className={`flex-1 p-5 sm:p-6 rounded-2xl flex flex-col gap-2 border transition-all duration-300 hover:shadow-lg ${getThemeStyles(step.theme)}`}>
                  
                  {step.theme !== 'light' && (
                    <div className={`absolute top-[-50%] right-[-10%] w-64 h-64 blur-[80px] rounded-full pointer-events-none ${getGlowColor(step.theme)}`} />
                  )}
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <h3 className={`text-lg sm:text-xl font-bold text-[var(--text-primary)]`}>
                      {step.title}
                    </h3>
                    {step.layer && (
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${getLayerBadgeStyles(step.theme)}`}>
                        {step.layer}
                      </span>
                    )}
                  </div>
                  
                  <p className={`relative z-10 leading-relaxed text-sm sm:text-base text-[var(--text-secondary)]`}>
                    {step.description}
                  </p>
                </div>

                {/* Mobile-only connector */}
                {idx < steps.length - 1 && (
                  <div className="flex justify-center py-2 sm:hidden text-[var(--border-color)]">
                    <ArrowDown size={20} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HowItWorks;
