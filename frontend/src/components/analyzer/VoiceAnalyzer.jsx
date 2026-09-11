import React, { useState, useRef, useEffect } from 'react';
import GlassCard from '../ui/GlassCard';
import Button from '../Button';
import { ArrowRight, Mic, Square, Loader2 } from 'lucide-react';
import { analyzeNews } from '../../services/api';

const VoiceAnalyzer = ({ onResult, onError }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [supportError, setSupportError] = useState(null);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check browser support for Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupportError("Your browser doesn't support the Web Speech API. Try using Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event) => {
      onError(`Speech recognition error: ${event.error}`);
      setIsRecording(false);
    };

    recognition.onend = () => {
      // If we didn't intentionally stop it, it might have timed out. We don't auto-restart here to prevent loops.
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onError]);

  const toggleRecording = () => {
    if (supportError) {
      onError(supportError);
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      onError(null);
      setTranscript('');
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      onError('No transcript available to analyze.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }

    setIsAnalyzing(true);
    onError(null);

    try {
      // Pass the transcript up to Analyze.jsx to orchestrate both calls
      onResult({
        source_type: 'text', // Treated as text input
        title: 'Voice Transcript',
        text: transcript
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
        
        <div className="flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-white/90 rounded-xl border border-white dark:border-white/60 shadow-sm">
          <button
            onClick={toggleRecording}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
              isRecording 
                ? 'bg-red-50 text-red-500 hover:bg-red-100 animate-pulse border-2 border-red-200' 
                : 'bg-brand-orange text-white hover:bg-[#d95f3b] hover:scale-105'
            }`}
          >
            {isRecording ? <Square size={32} fill="currentColor" /> : <Mic size={32} />}
          </button>
          
          <div className="mt-4 text-center">
            <h3 className="font-semibold text-brand-navy">
              {isRecording ? 'Listening...' : 'Tap to Speak'}
            </h3>
            <p className="text-xs text-brand-gray mt-1">
              {isRecording ? 'Click the square to stop recording' : 'Dictate the news article you want to verify'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-brand-gray/80 pl-1 flex justify-between">
            <span>Transcript</span>
            <span className="font-normal text-[10px]">You can edit before analyzing</span>
          </label>
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your transcribed text will appear here..."
            className="w-full h-40 px-4 py-3 bg-white/50 dark:bg-white/90 border border-white dark:border-white/60 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 rounded-xl outline-none transition-all resize-none text-sm text-brand-navy shadow-sm leading-relaxed"
            disabled={isAnalyzing}
          />
        </div>

        <div className="mt-2">
          <Button 
            onClick={handleAnalyze} 
            isLoading={isAnalyzing} 
            disabled={!transcript.trim()}
            variant="primary"
          >
            {isAnalyzing ? <span>Analyzing voice input...</span> : (
              <>
                <span>Analyze Transcript</span>
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </div>
      </div>
    </GlassCard>
  );
};

export default VoiceAnalyzer;
