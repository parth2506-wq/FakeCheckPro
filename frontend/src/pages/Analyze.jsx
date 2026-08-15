import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ManualAnalyzer from '../components/analyzer/ManualAnalyzer';
import UrlAnalyzer from '../components/analyzer/UrlAnalyzer';
import ImageAnalyzer from '../components/analyzer/ImageAnalyzer';
import PredictionCard from '../components/analyzer/PredictionCard';
import ExplanationCard from '../components/analyzer/ExplanationCard';
import ImportantPhrases from '../components/analyzer/ImportantPhrases';
import FeatureInfluence from '../components/analyzer/FeatureInfluence';
import ModelInfoCard from '../components/analyzer/ModelInfoCard';
import EvidenceVerification from '../components/analyzer/EvidenceVerification';
import GlassCard from '../components/ui/GlassCard';
import { analyzeEvidence } from '../services/api';
import { AlertCircle, FileText, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

const Analyze = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('manual');
  
  const [evidenceData, setEvidenceData] = useState(null);
  const [isEvidenceLoading, setIsEvidenceLoading] = useState(false);
  const [evidenceError, setEvidenceError] = useState(null);

  const handleResult = async (data) => {
    setResult(data);
    setError(null);
    setEvidenceData(null);
    setEvidenceError(null);
    
    // Chain 2: Trigger Evidence Verification
    if (data.history_id) {
      setIsEvidenceLoading(true);
      try {
        const evidenceResponse = await analyzeEvidence(data.history_id);
        setEvidenceData(evidenceResponse);
      } catch (err) {
        setEvidenceError(err.message || 'Failed to analyze evidence.');
      } finally {
        setIsEvidenceLoading(false);
      }
    }
  };

  const handleMethodChange = (method) => {
    if (selectedMethod !== method) {
      setSelectedMethod(method);
      setResult(null);
      setError(null);
      setEvidenceData(null);
      setEvidenceError(null);
    }
  };

  const MethodButton = ({ id, label, icon: Icon }) => {
    const isActive = selectedMethod === id;
    return (
      <button
        onClick={() => handleMethodChange(id)}
        className={`flex items-center justify-center gap-2 flex-1 py-3 px-4 rounded-xl transition-all duration-300 ${
          isActive 
            ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-brand-navy font-medium' 
            : 'text-brand-gray hover:bg-white/50 hover:text-brand-navy'
        }`}
      >
        <Icon size={18} className={isActive ? 'text-brand-orange' : ''} />
        <span className="whitespace-nowrap">{label}</span>
      </button>
    );
  };

  return (
    <DashboardLayout title="Analyze News">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
        
        {/* Main Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <GlassCard className="p-2 sm:p-2 bg-white/40">
            <div className="flex flex-col sm:flex-row gap-2">
              <MethodButton id="image" label="Scan Image" icon={ImageIcon} />
              <MethodButton id="url" label="Paste URL" icon={LinkIcon} />
              <MethodButton id="manual" label="Enter Manually" icon={FileText} />
            </div>
          </GlassCard>

          <div className="min-h-[300px]">
            {selectedMethod === 'manual' && <ManualAnalyzer onResult={handleResult} onError={setError} />}
            {selectedMethod === 'url' && <UrlAnalyzer onResult={handleResult} onError={setError} />}
            {selectedMethod === 'image' && <ImageAnalyzer onResult={handleResult} onError={setError} />}
          </div>

          {error && (
            <div className="bg-red-50/80 backdrop-blur-md border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 shadow-sm animate-in fade-in slide-in-from-top-4">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <PredictionCard result={result} />

              <EvidenceVerification 
                evidenceData={evidenceData} 
                isLoading={isEvidenceLoading} 
                error={evidenceError} 
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExplanationCard reason={result.reason} />
                <ImportantPhrases phrases={result.important_phrases} />
              </div>
              
              <FeatureInfluence phrases={result.important_phrases} />
              
              <div className="text-center pt-4">
                <button 
                  onClick={() => {
                    setResult(null);
                    setEvidenceData(null);
                    setEvidenceError(null);
                  }}
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
