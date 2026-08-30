import React from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NewsCard = ({ article }) => {
  const { t } = useTranslation();

  const fallbackImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800";

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={article.image_url || fallbackImage}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />
      </div>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-brand-orange bg-brand-peach/50 px-2 py-1 rounded-full uppercase tracking-wider">
            {article.source?.name || 'News Source'}
          </span>
          <div className="flex items-center text-xs text-brand-gray gap-1">
            <Clock size={14} />
            <span>{formatDate(article.published_at)}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-brand-navy mb-2 line-clamp-2 leading-tight">
          {article.title}
        </h3>

        <p className="text-sm text-brand-gray line-clamp-3 mb-4 flex-1">
          {article.description || article.content || t('liveNews.noDescription', 'No description available.')}
        </p>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-brand-navy text-white rounded-xl text-sm font-medium hover:bg-brand-navy/90 transition-colors"
        >
          <span>{t('liveNews.readArticle', 'Read Full Story')}</span>
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
