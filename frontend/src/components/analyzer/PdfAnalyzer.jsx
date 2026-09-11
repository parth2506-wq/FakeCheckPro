import React, { useState, useRef } from 'react';
import GlassCard from '../ui/GlassCard';
import Button from '../Button';
import { ArrowRight, UploadCloud, FileText, Loader2, X } from 'lucide-react';
import { analyzeNews, extractPdf } from '../../services/api';

const PdfAnalyzer = ({ onResult, onError }) => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      onError('Please upload a valid PDF file.');
      return;
    }

    setFile(selectedFile);
    onError(null);
    setIsExtracting(true);
    setExtractedText('');

    try {
      const result = await extractPdf(selectedFile);
      setExtractedText(result.text);
    } catch (err) {
      onError(err.message || 'Failed to extract text from PDF.');
      setFile(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setExtractedText('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onError(null);
  };

  const handleAnalyze = async () => {
    if (!extractedText.trim()) {
      onError('No text available to analyze.');
      return;
    }

    setIsAnalyzing(true);
    onError(null);

    try {
      // Pass the extracted text up to Analyze.jsx to orchestrate both calls
      onResult({
        source_type: 'pdf',
        title: 'PDF Document',
        filename: file.name,
        extracted_text: extractedText
      });
    } catch (err) {
      onError(err.message || 'Analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <GlassCard className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-6">
        
        {!file && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-brand-orange/30 rounded-xl flex flex-col items-center justify-center gap-3 bg-white/40 dark:bg-white/90 hover:bg-white/60 dark:bg-white/90 hover:border-brand-orange/50 transition-all cursor-pointer cursor-pointer text-brand-navy shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <UploadCloud size={24} />
            </div>
            <div className="text-center">
              <p className="font-medium">Click to upload PDF</p>
              <p className="text-xs text-brand-gray mt-1">Extracts text automatically</p>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="application/pdf" 
              className="hidden" 
            />
          </div>
        )}

        {isExtracting && (
          <div className="flex flex-col items-center justify-center py-10 bg-white/40 dark:bg-white/90 rounded-xl border border-white dark:border-white/60">
            <Loader2 size={32} className="text-brand-orange animate-spin mb-4" />
            <p className="text-sm font-medium text-brand-navy">Extracting text from PDF...</p>
          </div>
        )}

        {file && !isExtracting && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-white/90 rounded-xl border border-white dark:border-white/60 shadow-sm">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 bg-brand-orange/10 text-brand-orange rounded-lg">
                  <FileText size={20} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium text-brand-navy truncate">{file.name}</span>
                  <span className="text-xs text-brand-gray">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
              <button 
                onClick={handleClear}
                className="p-2 text-brand-gray hover:text-red-500 hover:bg-white rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-gray/80 pl-1 flex justify-between">
                <span>Extracted Text</span>
                <span className="font-normal text-[10px]">You can edit before analyzing</span>
              </label>
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="w-full h-48 px-4 py-3 bg-white/50 dark:bg-white/90 border border-white dark:border-white/60 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 rounded-xl outline-none transition-all resize-none text-sm text-brand-navy shadow-sm leading-relaxed"
                disabled={isAnalyzing}
              />
            </div>
          </div>
        )}

        <div className="mt-2">
          <Button 
            onClick={handleAnalyze} 
            isLoading={isAnalyzing} 
            disabled={!extractedText || isExtracting}
            variant="primary"
          >
            {isAnalyzing ? <span>Analyzing document...</span> : (
              <>
                <span>Analyze Document</span>
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default PdfAnalyzer;
