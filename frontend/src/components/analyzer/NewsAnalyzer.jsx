import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import { Loader2, ArrowRight } from 'lucide-react';
import { analyzeNews } from '../../services/api';

const NewsAnalyzer = ({ onResult, onError }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() && !text.trim()) {
      onError('Please provide a headline or article text to analyze.');
      return;
    }
    
    setLoading(true);
    onError(null);
    try {
      const result = await analyzeNews(title, text);
      onResult(result);
    } catch (err) {
      onError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-brand-navy tracking-tight mb-1">Analyze News</h2>
        <p className="text-sm text-brand-navy/60">Evaluate a news article using our trained machine learning model.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-brand-gray/80 pl-1">
            Headline
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the news headline..."
            className="w-full px-4 py-3 bg-white/50 border border-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 rounded-xl outline-none transition-all placeholder:text-brand-gray/40 text-brand-navy shadow-sm"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="text" className="text-xs font-semibold uppercase tracking-wider text-brand-gray/80 pl-1">
            Article Content
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the main article text here..."
            className="w-full h-48 px-4 py-3 bg-white/50 border border-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 rounded-xl outline-none transition-all resize-none placeholder:text-brand-gray/40 text-brand-navy shadow-sm"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-brand-orange text-white font-medium px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#d95f3b] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-orange/20 transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none disabled:transform-none"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Analyze Article</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </GlassCard>
  );
};

export default NewsAnalyzer;
