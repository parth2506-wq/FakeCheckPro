import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';
import { Type, ArrowDown, Settings2, Database, Cpu, PieChart } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: Type,
      title: 'Article Input',
      description: 'You provide a news headline and the main body text of an article for analysis.',
      dark: false
    },
    {
      icon: Settings2,
      title: 'Text Processing',
      description: 'The system cleans the text exactly like it did during model training (lowercasing, removing HTML/URLs, filtering out non-alphabetic characters, and applying NLTK lemmatization).',
      dark: false
    },
    {
      icon: Database,
      title: 'TF-IDF Vectorization',
      description: 'The cleaned text is transformed into a numerical format based on Term Frequency-Inverse Document Frequency, highlighting the unique vocabulary of the article.',
      dark: false
    },
    {
      icon: Cpu,
      title: 'Logistic Regression',
      description: 'The trained machine learning classifier evaluates the mathematical features and predicts whether the article is Fake or Real.',
      dark: true // using dark feature card style for the core ML step
    },
    {
      icon: PieChart,
      title: 'Explainability',
      description: 'The system traces the prediction back to the original TF-IDF features to show exactly which phrases most heavily influenced the result.',
      dark: false
    }
  ];

  return (
    <DashboardLayout title="How It Works">
      <div className="max-w-3xl pb-12">
        <p className="text-brand-navy/70 mb-10 text-lg">
          FakeCheckPro uses a traditional, highly-interpretable Natural Language Processing pipeline instead of a black-box LLM. Here is exactly what happens when you click Analyze.
        </p>

        <div className="flex flex-col gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;
            
            return (
              <div key={idx} className="flex flex-col items-center">
                <div className={`w-full p-6 rounded-2xl flex items-start gap-6 shadow-sm border ${step.dark ? 'bg-gradient-to-br from-[#1A2035] to-[#252C42] border-brand-navy/10 text-white shadow-xl relative overflow-hidden' : 'bg-white/60 backdrop-blur-xl border-white/80'}`}>
                  
                  {step.dark && <div className="absolute top-[-50%] right-[-10%] w-64 h-64 bg-brand-orange/20 blur-3xl rounded-full pointer-events-none" />}
                  
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative z-10 ${step.dark ? 'bg-white/10 text-brand-orange' : 'bg-brand-peach/30 text-brand-orange'}`}>
                    <Icon size={24} />
                  </div>
                  
                  <div className="flex flex-col gap-1 relative z-10">
                    <span className={`text-xs font-bold tracking-wider uppercase ${step.dark ? 'text-white/50' : 'text-brand-gray/60'}`}>
                      Step 0{idx + 1}
                    </span>
                    <h3 className={`text-xl font-bold ${step.dark ? 'text-white' : 'text-brand-navy'}`}>
                      {step.title}
                    </h3>
                    <p className={`mt-1 ${step.dark ? 'text-white/80' : 'text-brand-navy/70'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>

                {!isLast && (
                  <div className="py-2 text-brand-gray/30">
                    <ArrowDown size={24} />
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
