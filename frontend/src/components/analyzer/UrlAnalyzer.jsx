import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import Button from '../Button';
import { ArrowRight, Link } from 'lucide-react';
import { analyzeUrl } from '../../services/api';

const UrlAnalyzer = ({ onResult, onError }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      onError('Please provide a URL to analyze.');
      return;
    }
    
    setLoading(true);
    onError(null);
    try {
      const result = await analyzeUrl(url);
      onResult(result);
    } catch (err) {
      onError(err.message || 'Unable to extract article content from this URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="url" className="text-xs font-semibold uppercase tracking-wider text-brand-gray/80 pl-1 flex items-center gap-2">
            <Link size={14} />
            Article URL
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/news/article"
            className="w-full px-4 py-3 bg-white/50 dark:bg-white/90 border border-white dark:border-white/60 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 rounded-xl outline-none transition-all placeholder:text-brand-gray/40 text-brand-navy shadow-sm"
            disabled={loading}
          />
        </div>

        <div className="mt-2">
          <Button type="submit" isLoading={loading} variant="primary">
            {loading ? <span>Fetching and analyzing article...</span> : (
              <>
                <span>Analyze URL</span>
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
};

export default UrlAnalyzer;
