import React, { useState, useRef } from 'react';
import GlassCard from '../ui/GlassCard';
import Button from '../Button';
import { ArrowRight, Image as ImageIcon, UploadCloud, RefreshCw } from 'lucide-react';
import { ocrImage, analyzeImage } from '../../services/api';

const ImageAnalyzer = ({ onResult, onError }) => {
  const [file, setFile] = useState(null);
  const [ocrPreview, setOcrPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setOcrPreview(null);
    }
  };

  const handleExtractText = async () => {
    if (!file) {
      onError('Please select an image file first.');
      return;
    }
    
    setLoading(true);
    onError(null);
    try {
      const result = await ocrImage(file);
      setOcrPreview(result.extracted_text);
    } catch (err) {
      onError(err.message || 'Failed to extract text from the image.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setLoading(true);
    onError(null);
    try {
      const result = await analyzeImage(file);
      onResult(result);
    } catch (err) {
      onError(err.message || 'An unexpected error occurred during image analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleReplace = () => {
    setFile(null);
    setOcrPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <GlassCard className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-5">
        
        {!ocrPreview ? (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-gray/80 pl-1 flex items-center gap-2">
                <ImageIcon size={14} />
                Upload Image
              </label>
              
              <div 
                className="w-full border-2 border-dashed border-brand-orange/30 bg-white/40 rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all hover:bg-white/60 hover:border-brand-orange/50 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={32} className="text-brand-orange/70" />
                <div className="text-center">
                  <p className="text-brand-navy font-medium text-sm">Click to upload an image</p>
                  <p className="text-brand-gray text-xs mt-1">Supports JPG, PNG, WEBP (Max 10MB)</p>
                </div>
                {file && (
                  <div className="mt-2 text-sm font-medium text-brand-navy bg-white/80 px-3 py-1 rounded-lg">
                    Selected: {file.name}
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/jpeg, image/png, image/webp" 
                className="hidden" 
              />
            </div>

            <div className="mt-2">
              <Button onClick={handleExtractText} disabled={!file} isLoading={loading} variant="primary">
                {loading ? <span>Extracting text from image...</span> : (
                  <>
                    <span>Extract Text</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-brand-gray/80 pl-1 flex justify-between items-center">
                <span>Extracted Text Preview</span>
                <span className="text-[10px] text-brand-gray/50 normal-case font-normal">(Read-only)</span>
              </label>
              <textarea
                value={ocrPreview}
                readOnly
                className="w-full h-48 px-4 py-3 bg-white/50 border border-white rounded-xl outline-none resize-none text-brand-navy/80 text-sm shadow-sm"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Button onClick={handleAnalyze} isLoading={loading} variant="primary" className="flex-1">
                {loading ? <span>Analyzing extracted text...</span> : (
                  <>
                    <span>Analyze Extracted Text</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
              <Button onClick={handleReplace} disabled={loading} variant="secondary" className="flex-none sm:w-auto">
                <RefreshCw size={18} />
                <span>Replace Image</span>
              </Button>
            </div>
          </div>
        )}
        
      </div>
    </GlassCard>
  );
};

export default ImageAnalyzer;
