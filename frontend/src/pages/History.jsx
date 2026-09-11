import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';
import { History as HistoryIcon, Trash2, Loader2, AlertCircle, ExternalLink, Bookmark } from 'lucide-react';
import { getHistory, deleteHistory, toggleSaveHistory } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
};

const History = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All Analysis');

  const filters = [t('history.filters.all'), t('history.filters.credible'), t('history.filters.unverified'), t('history.filters.misleading'), t('history.filters.saved')];

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message || 'Failed to load history.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("history.deleteConfirm"))) return;
    try {
      await deleteHistory(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      alert("Failed to delete record: " + err.message);
    }
  };

  const handleToggleSave = async (id) => {
    try {
      const updatedItem = await toggleSaveHistory(id);
      setItems(items.map(item => item.id === id ? updatedItem : item));
    } catch (err) {
      alert("Failed to save record: " + err.message);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const filteredItems = useMemo(() => {
    switch (activeFilter) {
      case 'Credible':
        return items.filter(item => 
          item.final_assessment === 'SUPPORTED' || 
          item.final_assessment === 'LIKELY_CREDIBLE' || 
          (!item.final_assessment && item.category === 'Real')
        );
      case 'Misleading':
        return items.filter(item => 
          item.final_assessment === 'LIKELY_MISLEADING' || 
          item.final_assessment === 'CONTRADICTED' || 
          (!item.final_assessment && item.category === 'Fake')
        );
      case 'Unverified':
        return items.filter(item => item.final_assessment === 'UNVERIFIED');
      case 'Saved':
        return items.filter(item => item.saved);
      default:
        return items;
    }
  }, [items, activeFilter]);

  return (
    <DashboardLayout title={t("history.title")}>
      <motion.div 
        className="flex flex-col gap-6 pb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <GlassCard className="flex flex-col border-b border-[var(--border-color)]">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] tracking-tight mb-1">{t("history.analyses")}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{t("history.analysesDesc")}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter 
                    ? 'bg-[var(--text-primary)] text-[var(--bg-base)] shadow-md'
                    : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] hover:bg-[var(--surface)] border border-[var(--border-color)] hover:shadow-sm'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={32} className="text-[var(--accent)] animate-spin mb-4" />
              <p className="text-sm text-[var(--text-secondary)]">{t('history.loading')}</p>
            </div>
          ) : error ? (
            <div className="bg-[var(--danger-soft)] border border-[var(--danger)]/20 p-4 rounded-2xl flex items-center gap-3 text-[var(--danger)] shadow-sm">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--text-secondary)] opacity-50 mb-6 shadow-sm border border-[var(--border-color)]">
                <HistoryIcon size={32} />
              </div>
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">{t('history.noAnalyses')}</h3>
              <p className="text-sm text-[var(--text-secondary)] max-w-sm">
                {t('history.noAnalysesDesc')}
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-[var(--text-secondary)]">{t('history.noItemsFilter')} {activeFilter}</p>
            </div>
          ) : (
            <motion.div 
              className="flex flex-col gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.div 
                    key={item.id} 
                    variants={itemVariants}
                    layout
                    className="bg-[var(--surface)] hover:bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between transition-all shadow-sm hover:shadow-md"
                  >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--bg-base)] text-[var(--text-secondary)] shadow-sm border border-[var(--border-color)]">
                        {item.source_type}
                      </span>
                      <span className="text-xs font-medium text-[var(--text-secondary)] opacity-80">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-[var(--text-primary)] truncate">
                      {item.title || item.url || t("history.untitled")}
                    </h4>
                    {item.source_type === 'url' && item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1 mt-1 truncate max-w-md inline-block">
                        <ExternalLink size={12} />
                        {item.url}
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 shrink-0 mt-3 sm:mt-0">
                    <div className="flex flex-col items-end text-right">
                      <span className={`text-sm font-bold ${
                        !item.risk_level ? 'text-[var(--text-secondary)]' :
                        item.risk_level.includes('HIGH') ? 'text-[var(--danger)]' :
                        item.risk_level.includes('MODERATE') ? 'text-[var(--warning)]' :
                        item.risk_level.includes('LOW') ? 'text-[var(--success)]' : 'text-[var(--text-secondary)]'
                      }`}>
                        {item.final_assessment || (item.category === 'Fake' ? t('history.fakeNews') : t('history.realNews'))}
                      </span>
                      {item.credibility_score !== null && item.credibility_score !== undefined ? (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-xs font-bold text-[var(--text-primary)]">
                            {Number(item.credibility_score).toFixed(2)} <span className="text-[var(--text-secondary)] font-medium">/ 100</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--text-secondary)] font-medium mt-0.5">
                          {item.confidence_percentage || (item.confidence ? (item.confidence * 100).toFixed(1) : 0)}% {t('history.confidence')}
                        </span>
                      )}
                      
                      {item.risk_level && (
                        <span className="text-[10px] text-[var(--text-secondary)] font-medium uppercase tracking-wider mt-0.5">
                          {t('history.riskScore')} • <span className={`${
                            item.risk_level.includes('HIGH') ? 'text-[var(--danger)]' :
                            item.risk_level.includes('MODERATE') ? 'text-[var(--warning)]' :
                            item.risk_level.includes('LOW') ? 'text-[var(--success)]' : 'text-[var(--text-secondary)]'
                          }`}>{item.risk_level}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 border-l border-[var(--border-color)] pl-4 ml-2">
                      <button 
                        onClick={() => handleToggleSave(item.id)}
                        className={`p-2 rounded-lg transition-colors ${item.saved ? 'text-[var(--accent)] bg-[var(--accent-soft)]' : 'text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)]'}`}
                        title={item.saved ? t("history.unsave") : t("history.save")}
                      >
                        <Bookmark size={18} fill={item.saved ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] rounded-lg transition-colors"
                        title={t("history.delete")}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </GlassCard>
      </motion.div>
    </DashboardLayout>
  );
};

export default History;
