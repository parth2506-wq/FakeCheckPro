import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import Button from '../Button';
import { ArrowRight } from 'lucide-react';
import { analyzeNews } from '../../services/api';
import { useTranslation } from 'react-i18next';

const ManualAnalyzer = ({ onResult, onError }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() && !text.trim()) {
      onError('Please provide a headline or article text to analyze.');
      return;
    }
    
    setLoading(true);
    onError(null);
    try {
      // Instead of calling the API here, pass the data up to Analyze.jsx
      // which will orchestrate both ML and LLM calls simultaneously
      onResult({
        source_type: 'text',
        title: title,
        text: text
      });
    } catch (err) {
      onError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlassCard className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-brand-gray/80 pl-1">
            {t('analyze.inputs.headline')}
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('analyze.inputs.headlinePlaceholder')}
            className="w-full px-4 py-3 bg-white/50 border border-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 rounded-xl outline-none transition-all placeholder:text-brand-gray/40 text-brand-navy shadow-sm"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="text" className="text-xs font-semibold uppercase tracking-wider text-brand-gray/80 pl-1">
            {t('analyze.inputs.articleContent')}
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t('analyze.inputs.articlePlaceholder')}
            className="w-full h-48 px-4 py-3 bg-white/50 border border-white focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 rounded-xl outline-none transition-all resize-none placeholder:text-brand-gray/40 text-brand-navy shadow-sm"
            disabled={loading}
          />
        </div>

        <div className="mt-2">
          <Button type="submit" isLoading={loading} variant="primary">
            {loading ? <span>{t('analyze.inputs.analyzing')}</span> : (
              <>
                <span>{t('analyze.inputs.analyzeArticle')}</span>
                <ArrowRight size={18} />
              </>
            )}
          </Button>
        </div>
      </form>
    </GlassCard>
  );
};

export default ManualAnalyzer;
