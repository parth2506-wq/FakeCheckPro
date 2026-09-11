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
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
      if (response.raw_ml_result) {
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
          confidence: (mlResponse.confidence_percentage / 100) || mlResponse.confidence || 0,
          reason: mlResponse.reason,
          important_phrases: mlResponse.important_phrases,
          original_text: mlResponse.original_text,
          translated_text: mlResponse.translated_text,
          detected_language: mlResponse.detected_language,
          translation_status: mlResponse.translation_status,
          user_output_language: userOutputLanguage,
          credibility_score: response.final_credibility_risk_score,
          risk_level: response.risk_level,
          final_assessment: response.final_assessment,
          signal_relationship: response.signal_relationship
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
      // until the user explicitly clicks "{t("analyze.report.analyzeAnother")}" or submits a new analysis.
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
            ? 'bg-[var(--surface-elevated)] shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-[var(--text-primary)] font-medium border border-[var(--border-color)]' 
            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text-primary)]'
        }`}
      >
        <Icon size={18} className={isActive ? 'text-[var(--accent)]' : ''} />
        <span className="whitespace-nowrap">{label}</span>
      </button>
    );
  };

  return (
    <DashboardLayout title={t('analyze.title')} evidenceData={evidenceData}>
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full pb-10"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >

        {/* Main Column */}
        <motion.div variants={itemVariants} className="lg:col-span-8 flex flex-col gap-6">

          <GlassCard className="p-2 sm:p-2 bg-white/40 dark:bg-white/90 print:hidden">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2">
              <MethodButton id="image" label={t('analyze.tabs.image')} icon={ImageIcon} />
              <MethodButton id="url" label={t('analyze.tabs.url')} icon={LinkIcon} />
              <MethodButton id="manual" label={t('analyze.tabs.text')} icon={FileText} />
              <MethodButton id="pdf" label={t('analyze.tabs.pdf')} icon={FileUp} />
              <MethodButton id="voice" label={t('analyze.tabs.voice')} icon={Mic} />
              <MethodButton id="qr" label={t('analyze.tabs.qr')} icon={QrCode} />
            </div>

            <div className="mt-4 border-t border-[var(--border-color)] pt-4 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--text-primary)]">{t('analyze.inputs.outputLang')}</span>
              <select
                value={userOutputLanguage}
                onChange={(e) => setUserOutputLanguage(e.target.value)}
                className="text-sm border border-[var(--border-color)] rounded-md px-2 py-1 bg-[var(--surface-elevated)] text-[var(--text-primary)] outline-none"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="mr">Marathi</option>
              </select>
            </div>
          </GlassCard>

          <div className="min-h-[300px] print:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMethod}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {selectedMethod === 'manual' && <ManualAnalyzer onResult={handleResult} onError={setError} />}
                {selectedMethod === 'url' && <UrlAnalyzer onResult={handleResult} onError={setError} />}
                {selectedMethod === 'image' && <ImageAnalyzer onResult={handleResult} onError={setError} />}
                {selectedMethod === 'pdf' && <PdfAnalyzer onResult={handleResult} onError={setError} />}
                {selectedMethod === 'voice' && <VoiceAnalyzer onResult={handleResult} onError={setError} />}
                {selectedMethod === 'qr' && <QrAnalyzer onResult={handleResult} onError={setError} />}
              </motion.div>
            </AnimatePresence>
          </div>

          {error && (
            <div className="bg-[var(--danger-soft)] backdrop-blur-md border border-[var(--danger)]/20 p-4 rounded-2xl flex items-center gap-3 text-[var(--danger)] shadow-sm animate-in fade-in slide-in-from-top-4">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {(result || isEvidenceLoading) && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-8 duration-500">

              {isEvidenceLoading && !result ? (
                <>
                  {/* Master Loading State */}
                  <GlassCard className="flex flex-col items-center justify-center p-12 gap-8 border-[var(--accent)]/30 bg-[var(--accent-soft)] relative overflow-hidden">
                    {/* Cinematic background scanline */}
                    <motion.div 
                      className="absolute inset-x-0 bg-gradient-to-b from-transparent via-[var(--accent)]/20 to-transparent w-full h-[30%] pointer-events-none"
                      animate={{ top: ['-30%', '130%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    <div className="relative z-10 flex items-center justify-center">
                      <motion.div 
                        className="w-20 h-20 border-4 border-dashed border-[var(--accent)]/60 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                      <motion.div 
                        className="absolute w-24 h-24 border border-[var(--accent)]/30 rounded-full"
                        animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      />
                      <motion.div 
                        className="absolute w-10 h-10 bg-[var(--accent)] rounded-full blur-[2px]"
                        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                    <div className="text-center space-y-2 z-10">
                      <motion.h3 
                        className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {t("analyze.report.analyzingCredibility")}
                      </motion.h3>
                      <p className="text-[var(--text-secondary)] font-medium">
                        {t("analyze.report.runningMl")}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest font-semibold mt-2">
                        {t("analyze.report.mayTakeTime")}
                      </p>
                    </div>
                  </GlassCard>

                  {/* Prediction Card Skeleton */}
                  <GlassCard className="animate-pulse">
                    <div className="h-4 w-32 bg-[var(--text-primary)]/10 rounded mb-6"></div>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="h-32 w-32 bg-[var(--text-primary)]/10 rounded-full shrink-0"></div>
                      <div className="flex-1 space-y-4 w-full">
                        <div className="h-6 w-3/4 bg-[var(--text-primary)]/10 rounded"></div>
                        <div className="h-4 w-full bg-[var(--text-primary)]/10 rounded"></div>
                        <div className="h-4 w-5/6 bg-[var(--text-primary)]/10 rounded"></div>
                      </div>
                    </div>
                  </GlassCard>
                </>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 w-full pb-2 print:hidden">
                    <button
                      onClick={clearResults}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm bg-[var(--surface-elevated)] hover:opacity-90 text-[var(--text-primary)] rounded-lg font-medium transition-colors border border-[var(--border-color)] shadow-sm"
                    >
                      <RefreshCw size={14} />
                      {t("analyze.report.analyzeAnother")}
                    </button>

                    <button
                      onClick={downloadPDF}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm bg-[var(--accent)] text-white rounded-lg font-medium hover:opacity-90 transition-colors shadow-sm"
                    >
                      <Download size={14} />
                      {t("analyze.report.downloadPdf")}
                    </button>
                  </div>

                  <div id="printable-report" ref={reportRef} className="flex flex-col gap-6 bg-[var(--surface)] p-2 sm:p-4 rounded-2xl relative">

                    {/* Probable Source Header */}
                    <div className="flex justify-start w-full mb-[-1rem] z-10 relative pl-4">
                      <div className="bg-[var(--surface-elevated)] text-[var(--text-primary)] text-xs px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-[var(--border-color)]">
                        <span className="text-[var(--accent)] font-bold">{t("analyze.report.probableSource")}</span>
                        <span className="font-medium text-[var(--text-primary)]">{evidenceData?.evidence?.probable_source || "Unknown"}</span>
                      </div>
                    </div>

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
                      className="flex items-center justify-center gap-2 mx-auto text-sm font-medium text-[var(--accent)] hover:opacity-80 transition-colors"
                    >
                      <RefreshCw size={14} />
                      {t("analyze.report.analyzeAnother")}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>

        {/* Right Sidebar Column */}
        <motion.div variants={itemVariants} className="lg:col-span-4 h-full">
          <div className="flex flex-col gap-6 sticky top-0">
            <ModelInfoCard />
          </div>
        </motion.div>

      </motion.div>
    </DashboardLayout>
  );
};

export default Analyze;
