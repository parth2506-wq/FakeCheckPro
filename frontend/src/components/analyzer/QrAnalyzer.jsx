import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../ui/GlassCard';
import Button from '../Button';
import { ArrowRight, QrCode, X } from 'lucide-react';
import { analyzeUrl } from '../../services/api';
import { Html5Qrcode } from 'html5-qrcode';

const QrAnalyzer = ({ onResult, onError }) => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const scannerRef = useRef(null);
  
  const qrcodeRegionId = "html5qr-code-full-region";

  useEffect(() => {
    // Cleanup scanner when component unmounts
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setIsScanning(true);
      onError(null);
      
      const html5QrCode = new Html5Qrcode(qrcodeRegionId);
      scannerRef.current = html5QrCode;
      
      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          // Success callback
          setUrl(decodedText);
          stopScanner();
        },
        (errorMessage) => {
          // Parse errors are frequent, ignore them until success
        }
      );
    } catch (err) {
      setIsScanning(false);
      onError("Failed to start camera. Please check permissions.");
    }
  };

  const stopScanner = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().then(() => {
        scannerRef.current.clear();
      }).catch(err => console.error("Failed to stop scanner", err));
    }
    setIsScanning(false);
  };

  const handleAnalyze = async () => {
    if (!url.trim()) {
      onError('Please scan a QR code or enter a URL.');
      return;
    }

    try {
      new URL(url);
    } catch {
      onError('The scanned content is not a valid URL.');
      return;
    }

    setIsAnalyzing(true);
    onError(null);

    try {
      const result = await analyzeUrl(url);
      onResult(result);
    } catch (err) {
      onError(err.message || 'Analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <GlassCard className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-6">
        
        {!isScanning && !url && (
          <div 
            onClick={startScanner}
            className="w-full h-48 border-2 border-dashed border-brand-orange/30 rounded-xl flex flex-col items-center justify-center gap-3 bg-white/40 hover:bg-white/60 hover:border-brand-orange/50 transition-all cursor-pointer text-brand-navy shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
              <QrCode size={24} />
            </div>
            <div className="text-center">
              <p className="font-medium">Click to scan QR Code</p>
              <p className="text-xs text-brand-gray mt-1">Point your camera at a news QR code</p>
            </div>
          </div>
        )}

        <div 
          id={qrcodeRegionId} 
          className={`w-full overflow-hidden rounded-xl border border-white shadow-sm bg-black ${isScanning ? 'block' : 'hidden'}`}
        ></div>

        {isScanning && (
          <div className="flex justify-center mt-2">
            <button 
              onClick={stopScanner}
              className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <X size={16} /> Cancel Scanning
            </button>
          </div>
        )}

        {(url || (!isScanning && url)) && (
          <div className="flex flex-col gap-1.5 mt-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-brand-gray/80 pl-1">
              Scanned URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-3 bg-white/50 border border-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 rounded-xl outline-none transition-all text-brand-navy shadow-sm pr-10"
                disabled={isAnalyzing}
              />
              <button 
                onClick={() => setUrl('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brand-gray hover:text-red-500 transition-colors"
                title="Clear"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="mt-2">
          <Button 
            onClick={handleAnalyze} 
            isLoading={isAnalyzing} 
            disabled={!url.trim() || isScanning}
            variant="primary"
          >
            {isAnalyzing ? <span>Analyzing URL...</span> : (
              <>
                <span>Analyze QR URL</span>
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default QrAnalyzer;
