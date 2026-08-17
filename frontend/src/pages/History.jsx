import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';
import { History as HistoryIcon, Trash2, Loader2, AlertCircle, ExternalLink, Bookmark } from 'lucide-react';
import { getHistory, deleteHistory, toggleSaveHistory } from '../services/api';

const History = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All Analysis');

  const filters = ['All Analysis', 'Credible', 'Unverified', 'Misleading', 'Saved'];

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
    if (!window.confirm("Are you sure you want to delete this record?")) return;
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
    <DashboardLayout title="Analysis History">
      <div className="flex flex-col gap-6 pb-10">
        <GlassCard className="flex flex-col border-b border-brand-orange/10">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-brand-navy tracking-tight mb-1">Your Analyses</h2>
            <p className="text-sm text-brand-navy/60">A record of past articles, URLs, and images you've analyzed.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === filter 
                    ? 'bg-brand-navy text-white shadow-md'
                    : 'bg-white/50 text-brand-navy/70 hover:bg-white border border-white hover:shadow-sm'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={32} className="text-brand-orange animate-spin mb-4" />
              <p className="text-sm text-brand-gray">Loading history...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50/80 backdrop-blur-md border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600 shadow-sm">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/50 flex items-center justify-center text-brand-gray/40 mb-6 shadow-sm border border-white">
                <HistoryIcon size={32} />
              </div>
              <h3 className="text-lg font-medium text-brand-navy mb-2">No analyses yet</h3>
              <p className="text-sm text-brand-gray max-w-sm">
                Your analyzed articles will appear here once you start using the Analyze News tool.
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-sm text-brand-gray">No items found for filter: {activeFilter}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white/40 hover:bg-white/60 border border-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between transition-all shadow-sm hover:shadow-md">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white text-brand-gray/80 shadow-sm border border-gray-100">
                        {item.source_type}
                      </span>
                      <span className="text-xs font-medium text-brand-gray/70">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                    <h4 className="text-base font-semibold text-brand-navy truncate">
                      {item.title || item.url || "Untitled Analysis"}
                    </h4>
                    {item.source_type === 'url' && item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-orange hover:underline flex items-center gap-1 mt-1 truncate max-w-md inline-block">
                        <ExternalLink size={12} />
                        {item.url}
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 shrink-0 mt-3 sm:mt-0">
                    <div className="flex flex-col items-end text-right">
                      <span className={`text-sm font-bold ${
                        !item.risk_level ? 'text-brand-gray' :
                        item.risk_level.includes('HIGH') ? 'text-red-500' :
                        item.risk_level.includes('MODERATE') ? 'text-orange-500' :
                        item.risk_level.includes('LOW') ? 'text-green-500' : 'text-brand-gray'
                      }`}>
                        {item.final_assessment || (item.category === 'Fake' ? 'Fake News' : 'Real News')}
                      </span>
                      {item.credibility_score !== null && item.credibility_score !== undefined ? (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-xs font-bold text-brand-navy">
                            {Number(item.credibility_score).toFixed(2)} <span className="text-brand-gray/60 font-medium">/ 100</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-brand-gray font-medium mt-0.5">
                          {item.confidence_percentage || (item.confidence ? (item.confidence * 100).toFixed(1) : 0)}% Confidence
                        </span>
                      )}
                      
                      {item.risk_level && (
                        <span className="text-[10px] text-brand-gray font-medium uppercase tracking-wider mt-0.5">
                          Risk Score • <span className={`${
                            item.risk_level.includes('HIGH') ? 'text-red-500' :
                            item.risk_level.includes('MODERATE') ? 'text-orange-500' :
                            item.risk_level.includes('LOW') ? 'text-green-500' : 'text-brand-gray'
                          }`}>{item.risk_level}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 border-l border-brand-navy/10 pl-4 ml-2">
                      <button 
                        onClick={() => handleToggleSave(item.id)}
                        className={`p-2 rounded-lg transition-colors ${item.saved ? 'text-brand-orange bg-brand-orange/10' : 'text-brand-gray hover:text-brand-orange hover:bg-orange-50'}`}
                        title={item.saved ? "Unsave Record" : "Save Record"}
                      >
                        <Bookmark size={18} fill={item.saved ? "currentColor" : "none"} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-brand-gray hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default History;
