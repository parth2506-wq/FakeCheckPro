import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import NewsAnalyzer from '../components/analyzer/NewsAnalyzer';
import PredictionCard from '../components/analyzer/PredictionCard';
import ExplanationCard from '../components/analyzer/ExplanationCard';
import ImportantPhrases from '../components/analyzer/ImportantPhrases';
import FeatureInfluence from '../components/analyzer/FeatureInfluence';
import ModelInfoCard from '../components/analyzer/ModelInfoCard';
import { AlertCircle } from 'lucide-react';

const Analyze = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleResult = (data) => {
    setResult(data);
    setError(null);
  };

  return (
    <DashboardLayout title="Analyze News">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
        
        {/* Main Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <NewsAnalyzer onResult={handleResult} onError={setError} />

          {error && (
            <div className="bg-red-50/80 backdrop-blur-md border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 shadow-sm animate-in fade-in slide-in-from-top-4">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <PredictionCard result={result} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExplanationCard reason={result.reason} />
                <ImportantPhrases phrases={result.important_phrases} />
              </div>
              
              <FeatureInfluence phrases={result.important_phrases} />
              
              <div className="text-center pt-4">
                <button 
                  onClick={() => setResult(null)}
                  className="text-sm font-medium text-brand-orange hover:text-[#d95f3b] transition-colors"
                >
                  Analyze Another Article
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 h-full">
          <div className="sticky top-0 h-[600px]">
            <ModelInfoCard />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Analyze;
