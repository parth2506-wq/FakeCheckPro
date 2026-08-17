import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Search, ExternalLink, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const configs = {
    SUPPORTED: { color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle2, label: 'Supported' },
    LIKELY_CREDIBLE: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2, label: 'Likely Credible' },
    UNVERIFIED: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: HelpCircle, label: 'Unverified' },
    LIKELY_MISLEADING: { color: 'bg-orange-100 text-orange-700 border-orange-200', icon: AlertTriangle, label: 'Likely Misleading' },
    CONTRADICTED: { color: 'bg-red-100 text-red-700 border-red-200', icon: AlertCircle, label: 'Contradicted' }
  };

  const config = configs[status] || configs['UNVERIFIED'];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${config.color}`}>
      <Icon size={16} />
      {config.label}
    </span>
  );
};

const EvidenceScoreRing = ({ score }) => {
  // Score 0-100 mapped to color
  const getColor = (s) => {
    if (s >= 75) return 'text-green-500';
    if (s >= 50) return 'text-yellow-500';
    if (s >= 25) return 'text-orange-500';
    return 'text-red-500';
  };
  
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-16 h-16">
        <circle cx="32" cy="32" r={radius} className="stroke-gray-100" strokeWidth="6" fill="transparent" />
        <circle 
          cx="32" cy="32" r={radius} 
          className={`stroke-current ${getColor(score)} transition-all duration-1000 ease-out`} 
          strokeWidth="6" fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-sm font-bold text-gray-800">{score}</span>
      </div>
    </div>
  );
};

const EvidenceVerification = ({ evidenceData, isLoading, error }) => {
  if (isLoading) {
    return (
      <GlassCard className="mt-6 flex flex-col items-center justify-center p-8 gap-4">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
        <p className="text-brand-gray font-medium text-center">
          Searching for evidence and analyzing claims using the Evidence Intelligence Engine...<br />
          <span className="text-xs opacity-75">This may take up to 20 seconds.</span>
        </p>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className="mt-6 border-red-200 bg-red-50/50">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle size={24} />
          <div>
            <h4 className="font-semibold">Evidence Verification Failed</h4>
            <p className="text-sm opacity-90">{error}</p>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (!evidenceData || !evidenceData.evidence) return null;

  const result = evidenceData.evidence;

  return (
    <GlassCard className="mt-6 relative overflow-hidden">
      <div className="flex items-start justify-between relative z-10 gap-4">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-brand-navy">Evidence Intelligence Engine</h3>
            <StatusBadge status={result.verification_status} />
          </div>
          <p className="text-sm text-gray-600">{result.summary}</p>
        </div>
        
        <div className="flex flex-col items-center bg-white/50 rounded-xl p-3 border border-gray-100 shadow-sm shrink-0">
          <span className="text-xs font-semibold uppercase text-gray-500 mb-1 tracking-wider">Score</span>
          <EvidenceScoreRing score={result.evidence_score} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 relative z-10">
        {/* Left column: Key reasoning and limitations */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/60 p-4 rounded-xl border border-gray-100">
            <h4 className="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={16} className="text-brand-orange" />
              Reasoning
            </h4>
            <ul className="text-sm space-y-2 text-gray-600">
              {result.reasoning.map((reason, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="shrink-0 text-brand-orange/50 mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {result.limitations.length > 0 && (
            <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
              <h4 className="font-semibold text-sm text-orange-800 mb-2 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={16} className="text-orange-500" />
                Limitations
              </h4>
              <ul className="text-sm space-y-2 text-orange-700/80">
                {result.limitations.map((limit, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="shrink-0 mt-0.5">•</span>
                    <span>{limit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right column: Claims and Sources */}
        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-semibold text-sm text-gray-700 uppercase tracking-wider mb-2">Claim Analysis</h4>
          
          {result.claims.length === 0 ? (
            <p className="text-sm text-gray-500 italic bg-white/40 p-4 rounded-xl">No verifiable claims extracted.</p>
          ) : (
            <div className="space-y-4">
              {result.claims.map((claim, idx) => (
                <div key={idx} className="bg-white/60 border border-gray-200 rounded-xl overflow-hidden">
                  <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-start gap-4">
                    <p className="font-medium text-brand-navy flex-1">"{claim.claim_text}"</p>
                    <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-700 font-medium tracking-wide">
                      {claim.status}
                    </span>
                  </div>
                  
                  {claim.evidence && claim.evidence.length > 0 ? (
                    <div className="p-3 bg-white space-y-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Sources</p>
                      {claim.evidence.map((source, sIdx) => (
                        <div key={sIdx} className="text-sm border-l-2 border-brand-gray/20 pl-3 py-1 flex flex-col gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium text-brand-orange hover:underline flex items-center gap-1 line-clamp-1"
                            >
                              {source.title || source.url || 'Source Link'}
                              <ExternalLink size={12} className="shrink-0" />
                            </a>
                            <span className={`shrink-0 text-[10px] uppercase px-1.5 py-0.5 rounded font-bold
                              ${source.stance === 'SUPPORTING' ? 'bg-green-100 text-green-700' : 
                                source.stance === 'CONTRADICTING' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                              {source.stance}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {source.publisher && <span className="font-medium">{source.publisher}</span>}
                            {source.publisher && <span>•</span>}
                            <span>Reliability: {source.source_reliability_score}/100</span>
                            {source.published_date && <span>•</span>}
                            {source.published_date && <span>{source.published_date}</span>}
                          </div>
                          {source.reason && <p className="text-gray-600 mt-1 italic text-[13px]">{source.reason}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-white text-sm text-gray-500 italic">
                      No external evidence found for this claim.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
        <p>{result.disclaimer}</p>
        <p>Verified at {new Date(result.verification_timestamp).toLocaleString()}</p>
      </div>
    </GlassCard>
  );
};

export default EvidenceVerification;
