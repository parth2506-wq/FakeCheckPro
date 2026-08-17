import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ManualAnalyzer from '../components/analyzer/ManualAnalyzer';
import UrlAnalyzer from '../components/analyzer/UrlAnalyzer';
import ImageAnalyzer from '../components/analyzer/ImageAnalyzer';
import PdfAnalyzer from '../components/analyzer/PdfAnalyzer';
import VoiceAnalyzer from '../components/analyzer/VoiceAnalyzer';
import QrAnalyzer from '../components/analyzer/QrAnalyzer';
import PredictionCard from '../components/analyzer/PredictionCard';
import ExplanationCard from '../components/analyzer/ExplanationCard';
import ImportantPhrases from '../components/analyzer/ImportantPhrases';
import FeatureInfluence from '../components/analyzer/FeatureInfluence';
import ModelInfoCard from '../components/analyzer/ModelInfoCard';
import EvidenceVerification from '../components/analyzer/EvidenceVerification';
import CredibilityAssessmentCard from '../components/analyzer/CredibilityAssessmentCard';
import GlassCard from '../components/ui/GlassCard';
import { analyzeNews, analyzeEvidence, analyzeCredibility, saveToHistory } from '../services/api';
import { AlertCircle, FileText, Link as LinkIcon, Image as ImageIcon, FileUp, Mic, QrCode, Download, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Analyze = () => {
  const [result, setResult] = useState(() => {
    const saved = sessionStorage.getItem('fakecheck_result');
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('manual');
  
  const [evidenceData, setEvidenceData] = useState(() => {
    const saved = sessionStorage.getItem('fakecheck_evidence');
    return saved ? JSON.parse(saved) : null;
  });
  const [isEvidenceLoading, setIsEvidenceLoading] = useState(false);
  const [evidenceError, setEvidenceError] = useState(null);
  
  const [credibilityData, setCredibilityData] = useState(() => {
    const saved = sessionStorage.getItem('fakecheck_credibility');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [userOutputLanguage, setUserOutputLanguage] = useState('en');
  const reportRef = useRef(null);
  const { t } = useTranslation();

  const clearResults = () => {
    setResult(null);
    setEvidenceData(null);
    setEvidenceError(null);
    setCredibilityData(null);
    sessionStorage.removeItem('fakecheck_result');
    sessionStorage.removeItem('fakecheck_evidence');
    sessionStorage.removeItem('fakecheck_credibility');
  };

  const handleResult = async (data, extractedTextOverride = null) => {
    const textToAnalyze = extractedTextOverride || data.text || data.extracted_text;
    const titleToAnalyze = data.title || "";
    
    if (!textToAnalyze) {
      setError("No text available to analyze.");
      return;
    }

    clearResults();
    setIsEvidenceLoading(true);

    const orderId = crypto.randomUUID();

    try {
      // Single unified credibility endpoint
      const response = await analyzeCredibility(titleToAnalyze, textToAnalyze, userOutputLanguage);

      setCredibilityData(response);
      sessionStorage.setItem('fakecheck_credibility', JSON.stringify(response));

      setResult(response.raw_ml_result);
      sessionStorage.setItem('fakecheck_result', JSON.stringify(response.raw_ml_result));

      if (response.raw_evidence_result) {
        const evData = { evidence: response.raw_evidence_result };
        setEvidenceData(evData);
        sessionStorage.setItem('fakecheck_evidence', JSON.stringify(evData));
      } else {
        setEvidenceError("Failed to analyze external evidence, falling back to ML risk only.");
      }

      // Save to History DB
      if (response.raw_evidence_result && response.raw_ml_result && response.raw_ml_result.success) {
        const mlResponse = response.raw_ml_result;
        // Construct HistoryCreate equivalent
        const mlData = {
          source_type: data.source_type || 'text',
          title: titleToAnalyze,
          input_text: textToAnalyze,
          source_url: data.url || null,
          image_filename: data.filename || null,
          extracted_text: textToAnalyze,
          prediction: mlResponse.prediction,
          category: mlResponse.category,
          confidence: mlResponse.confidence,
          reason: mlResponse.reason,
          important_phrases: mlResponse.important_phrases,
          original_text: mlResponse.original_text,
          translated_text: mlResponse.translated_text,
          detected_language: mlResponse.detected_language,
          translation_status: mlResponse.translation_status,
          user_output_language: userOutputLanguage
        };
        
        await saveToHistory(orderId, mlData, response.raw_evidence_result);
      }

    } catch (err) {
      setError(err.message || 'An unexpected error occurred during credibility analysis.');
    } finally {
      setIsEvidenceLoading(false);
    }
  };

  const handleMethodChange = (method) => {
    if (selectedMethod !== method) {
      setSelectedMethod(method);
      // We purposefully DO NOT clear the result here so the report stays visible
      // until the user explicitly clicks "Analyze Another Article" or submits a new analysis.
    }
  };

  const downloadPDF = () => {
    window.print();
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
    <DashboardLayout title={t('sidebar.analyze')}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-10">
        
        {/* Main Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <GlassCard className="p-2 sm:p-2 bg-white/40 print:hidden">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2">
              <MethodButton id="image" label={t('analyze.tabs.image')} icon={ImageIcon} />
              <MethodButton id="url" label={t('analyze.tabs.url')} icon={LinkIcon} />
              <MethodButton id="manual" label={t('analyze.tabs.text')} icon={FileText} />
              <MethodButton id="pdf" label={t('analyze.tabs.pdf')} icon={FileUp} />
              <MethodButton id="voice" label={t('analyze.tabs.voice')} icon={Mic} />
              <MethodButton id="qr" label={t('analyze.tabs.qr')} icon={QrCode} />
            </div>
            
            <div className="mt-4 border-t border-brand-gray/10 pt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-brand-navy">{t('analyze.inputs.outputLang')}</span>
              <select 
                value={userOutputLanguage}
                onChange={(e) => setUserOutputLanguage(e.target.value)}
                className="text-sm border border-brand-gray/20 rounded-md px-2 py-1 bg-white/50 text-brand-navy outline-none"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </select>
            </div>
          </GlassCard>

          <div className="min-h-[300px] print:hidden">
            {selectedMethod === 'manual' && <ManualAnalyzer onResult={handleResult} onError={setError} />}
            {selectedMethod === 'url' && <UrlAnalyzer onResult={handleResult} onError={setError} />}
            {selectedMethod === 'image' && <ImageAnalyzer onResult={handleResult} onError={setError} />}
            {selectedMethod === 'pdf' && <PdfAnalyzer onResult={handleResult} onError={setError} />}
            {selectedMethod === 'voice' && <VoiceAnalyzer onResult={handleResult} onError={setError} />}
            {selectedMethod === 'qr' && <QrAnalyzer onResult={handleResult} onError={setError} />}
          </div>

          {error && (
            <div className="bg-red-50/80 backdrop-blur-md border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 shadow-sm animate-in fade-in slide-in-from-top-4">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {(result || isEvidenceLoading) && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
              
              {isEvidenceLoading && !result ? (
                <>
                  {/* Master Loading State */}
                  <GlassCard className="flex flex-col items-center justify-center p-10 gap-6 border-brand-orange/20 bg-orange-50/30">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-brand-orange/20 border-t-brand-orange rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-brand-orange rounded-full animate-ping opacity-50"></div>
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-xl font-bold text-brand-navy">Analyzing Credibility</h3>
                      <p className="text-brand-gray font-medium">
                        Running ML Classification & Evidence Intelligence Engine...
                      </p>
                      <p className="text-xs text-brand-gray/60 uppercase tracking-widest font-semibold">
                        This may take 10-20 seconds
                      </p>
                    </div>
                  </GlassCard>

                  {/* Prediction Card Skeleton */}
                  <GlassCard className="animate-pulse">
                    <div className="h-4 w-32 bg-slate-200 rounded mb-6"></div>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="h-32 w-32 bg-slate-200 rounded-full shrink-0"></div>
                      <div className="flex-1 space-y-4 w-full">
                        <div className="h-6 w-3/4 bg-slate-200 rounded"></div>
                        <div className="h-4 w-full bg-slate-200 rounded"></div>
                        <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </GlassCard>
                </>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 w-full pb-2 print:hidden">
                    <button 
                      onClick={clearResults}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm bg-white/60 hover:bg-white text-brand-navy rounded-lg font-medium transition-colors border border-brand-gray/20 shadow-sm"
                    >
                      <RefreshCw size={14} />
                      Analyze Another Article
                    </button>
                    
                    <button 
                      onClick={downloadPDF}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm bg-brand-orange text-white rounded-lg font-medium hover:bg-[#d95f3b] transition-colors shadow-sm"
                    >
                      <Download size={14} />
                      Download PDF Report
                    </button>
                  </div>
                  
                  <div id="printable-report" ref={reportRef} className="flex flex-col gap-6 bg-slate-50/50 p-2 sm:p-4 rounded-2xl">
                    <CredibilityAssessmentCard data={credibilityData} />
                    
                    <PredictionCard result={result} />

                    <EvidenceVerification 
                      evidenceData={evidenceData} 
                      isLoading={false} 
                      error={evidenceError} 
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ExplanationCard reason={result.reason} />
                      <ImportantPhrases phrases={result.important_phrases} />
                    </div>
                    
                    <FeatureInfluence phrases={result.important_phrases} />
                  </div>
                  
                  <div className="text-center pt-4 print:hidden">
                    <button 
                      onClick={clearResults}
                      className="flex items-center justify-center gap-2 mx-auto text-sm font-medium text-brand-orange hover:text-[#d95f3b] transition-colors"
                    >
                      <RefreshCw size={14} />
                      Analyze Another Article
                    </button>
                  </div>
                </>
              )}
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
