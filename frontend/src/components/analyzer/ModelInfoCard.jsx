import React, { useEffect, useState } from 'react';
import { Network, Database, Cpu } from 'lucide-react';
import { getModelInfo } from '../../services/api';

const ModelInfoCard = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await getModelInfo();
        setInfo(data);
      } catch (err) {
        console.error("Failed to load model info", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  return (
    <div className="dark-feature-card p-6 flex flex-col h-full relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-brand-orange/20 blur-[60px] pointer-events-none" />
      
      <h2 className="text-xl font-semibold mb-6 tracking-tight relative z-10 flex items-center gap-2">
        <Network size={20} className="text-brand-orange" />
        AI Analysis Pipeline
      </h2>

      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
          <div className="h-4 bg-white/10 rounded w-1/2"></div>
        </div>
      ) : info ? (
        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-white/50">Current Model</span>
            <span className="text-base font-semibold">{info.model}</span>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-white/50">Feature Extraction</span>
            <div className="flex items-center gap-2">
              <Database size={14} className="text-brand-orange/80" />
              <span className="text-base font-semibold">{info.feature_type}</span>
            </div>
            <span className="text-xs text-white/40 mt-1">Vocabulary: up to {info.max_features.toLocaleString()}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-white/50">Explainability</span>
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-brand-orange/80" />
              <span className="text-base font-semibold">Enabled</span>
            </div>
            <span className="text-xs text-white/40 mt-1">Feature Contribution Analysis</span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-white/50">Model info unavailable.</div>
      )}
    </div>
  );
};

export default ModelInfoCard;
