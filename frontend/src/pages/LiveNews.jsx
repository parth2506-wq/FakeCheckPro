import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/layout/DashboardLayout';
import Header from '../components/layout/Header';
import NewsCard from '../components/NewsCard';
import { getLiveNews } from '../services/api';
import { AlertCircle, RefreshCw } from 'lucide-react';

const NewsSection = ({ categoryKey, title, articles }) => {
  const { t } = useTranslation();

  if (!articles || articles.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-brand-navy mb-6">{title}</h2>
        <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
          <p className="text-brand-gray">{t('liveNews.noNews', 'No news available in this category.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-brand-navy mb-6 flex items-center gap-3">
        {title}
        <span className="text-sm font-normal text-brand-gray bg-white px-3 py-1 rounded-full border border-gray-100">
          {articles.length} {t('liveNews.articlesCount', 'Articles')}
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
};

const LiveNews = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLiveNews();
      setData(response);
    } catch (err) {
      setError(err.message || 'Live news is currently unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const renderContent = () => {
    if (loading && !data) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <RefreshCw className="animate-spin text-brand-orange mb-4" size={32} />
          <h3 className="text-xl font-medium text-brand-navy">{t('liveNews.loading', 'Loading Live News...')}</h3>
          <p className="text-brand-gray mt-2">{t('liveNews.loadingDesc', 'Fetching the latest updates across the globe.')}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <h3 className="text-xl font-medium text-brand-navy mb-2">{error}</h3>
          <button 
            onClick={fetchNews}
            className="flex items-center gap-2 px-6 py-3 bg-brand-navy text-white rounded-xl hover:bg-brand-navy/90 transition-colors mt-4"
          >
            <RefreshCw size={18} />
            <span>{t('liveNews.retry', 'Retry')}</span>
          </button>
        </div>
      );
    }

    if (!data || !data.sections) {
      return null;
    }

    // Order of categories based on requirements
    const orderedKeys = ['politics', 'business', 'technology', 'sports', 'health', 'world'];

    return (
      <div className="space-y-4">
        {orderedKeys.map(key => {
          const section = data.sections[key];
          if (!section) return null;
          // Localized section title if exists, else fallback to backend provided title
          const localizedTitle = t(`liveNews.categories.${key}`, section.title);
          return (
            <NewsSection 
              key={key} 
              categoryKey={key} 
              title={localizedTitle} 
              articles={section.articles} 
            />
          );
        })}
      </div>
    );
  };

  return (
    <DashboardLayout title={t('liveNews.title', 'Live News')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <p className="text-lg text-brand-gray">
            {t('liveNews.subtitle', 'Explore current news across major categories.')}
          </p>
        </div>
        
        {renderContent()}
      </div>
    </DashboardLayout>
  );
};

export default LiveNews;
