import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Search, ExternalLink, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const configs = {
    SUPPORTED: { color: 'bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]/20', icon: CheckCircle2, label: 'Supported' },
    LIKELY_CREDIBLE: { color: 'bg-[var(--success-soft)] text-[var(--success)] border-[var(--success)]/20', icon: CheckCircle2, label: 'Likely Credible' },
    UNVERIFIED: { color: 'bg-[var(--text-primary)]/10 text-[var(--text-secondary)] border-[var(--border-color)]', icon: HelpCircle, label: 'Unverified' },
    LIKELY_MISLEADING: { color: 'bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning)]/20', icon: AlertTriangle, label: 'Likely Misleading' },
    CONTRADICTED: { color: 'bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger)]/20', icon: AlertCircle, label: 'Contradicted' }
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
  const getColor = (s) => {
    if (s >= 75) return 'text-[var(--success)]';
    if (s >= 50) return 'text-[var(--warning)]';
    if (s >= 25) return 'text-[var(--danger)]';
    return 'text-[var(--danger)]';
  };
  
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="transform -rotate-90 w-16 h-16">
        <circle cx="32" cy="32" r={radius} className="stroke-[var(--border-color)]" strokeWidth="6" fill="transparent" />
        <circle 
          cx="32" cy="32" r={radius} 
          className={`stroke-current ${getColor(score)} transition-all duration-1000 ease-out`} 
          strokeWidth="6" fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-sm font-bold text-[var(--text-primary)]">{score}</span>
      </div>
    </div>
  );
};

const EvidenceVerification = ({ evidenceData, isLoading, error }) => {
  if (isLoading) {
    return (
      <GlassCard className="mt-6 flex flex-col items-center justify-center p-8 gap-4">
        <div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[var(--text-secondary)] font-medium text-center">
          Searching for evidence and analyzing claims using the Evidence Intelligence Engine...<br />
          <span className="text-xs opacity-75">This may take up to 20 seconds.</span>
        </p>
      </GlassCard>
    );
  }

  if (error) {
    return (
      <GlassCard className="mt-6 border-[var(--danger)]/30 bg-[var(--danger-soft)]">
        <div className="flex items-center gap-3 text-[var(--danger)]">
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
    <GlassCard className="mt-6 relative overflow-hidden group">
      {/* Background glow indication for evidence */}
      <div className="absolute top-0 right-0 w-64 h-64 blur-[100px] opacity-20 pointer-events-none rounded-full bg-blue-500 transition-colors duration-700" />
      
      <div className="flex items-start justify-between relative z-10 gap-4">
        <div className="flex-1 pr-4">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Evidence Intelligence Engine</h3>
            <StatusBadge status={result.verification_status} />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">{result.summary}</p>
        </div>
        
        <div className="flex flex-col items-center bg-[var(--surface-elevated)] rounded-xl p-3 border border-[var(--border-color)] shadow-sm shrink-0">
          <span className="text-xs font-semibold uppercase text-[var(--text-secondary)] mb-1 tracking-wider">Score</span>
          <EvidenceScoreRing score={result.evidence_score} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 relative z-10">
        {/* Left column: Key reasoning and limitations */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border-color)]">
            <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-2 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[var(--accent)]" />
              Reasoning
            </h4>
            <ul className="text-sm space-y-2 text-[var(--text-secondary)]">
              {result.reasoning.map((reason, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="shrink-0 text-[var(--accent)] mt-0.5">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {result.limitations.length > 0 && (
            <div className="bg-[var(--warning-soft)] p-4 rounded-xl border border-[var(--warning)]/20">
              <h4 className="font-semibold text-sm text-[var(--warning)] mb-2 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={16} className="text-[var(--warning)]" />
                Limitations
              </h4>
              <ul className="text-sm space-y-2 text-[var(--warning)] opacity-90">
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
          <h4 className="font-semibold text-sm text-[var(--text-primary)] uppercase tracking-wider mb-2">Claim Analysis</h4>
          
          {result.claims.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)] italic bg-[var(--surface)] p-4 rounded-xl border border-[var(--border-color)]">No verifiable claims extracted.</p>
          ) : (
            <div className="space-y-4">
              {result.claims.map((claim, idx) => (
                <div key={idx} className="bg-[var(--surface)] border border-[var(--border-color)] rounded-xl overflow-hidden">
                  <div className="p-4 bg-[var(--surface-elevated)] border-b border-[var(--border-color)] flex justify-between items-start gap-4">
                    <p className="font-medium text-[var(--text-primary)] flex-1">"{claim.claim_text}"</p>
                    <span className="text-xs px-2 py-1 rounded bg-[var(--glass-bg)] text-[var(--text-primary)] font-medium tracking-wide border border-[var(--border-color)]">
                      {claim.status}
                    </span>
                  </div>
                  
                  {claim.evidence && claim.evidence.length > 0 ? (
                    <div className="p-3 bg-transparent space-y-3">
                      <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider px-1">Sources</p>
                      {claim.evidence.map((source, sIdx) => (
                        <div key={sIdx} className="text-sm border-l-2 border-[var(--border-color)] pl-3 py-1 flex flex-col gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="font-medium text-[var(--accent)] hover:underline flex items-center gap-1 line-clamp-1"
                            >
                              {source.title || source.url || 'Source Link'}
                              <ExternalLink size={12} className="shrink-0" />
                            </a>
                            <span className={`shrink-0 text-[10px] uppercase px-1.5 py-0.5 rounded font-bold
                              ${source.stance === 'SUPPORTING' ? 'bg-[var(--success-soft)] text-[var(--success)]' : 
                                source.stance === 'CONTRADICTING' ? 'bg-[var(--danger-soft)] text-[var(--danger)]' : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)]'}`}>
                              {source.stance}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                            {source.publisher && <span className="font-medium">{source.publisher}</span>}
                            {source.publisher && <span>•</span>}
                            <span>Reliability: {source.source_reliability_score}/100</span>
                            {source.published_date && <span>•</span>}
                            {source.published_date && <span>{source.published_date}</span>}
                          </div>
                          {source.reason && <p className="text-[var(--text-secondary)] mt-1 italic text-[13px]">{source.reason}</p>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-transparent text-sm text-[var(--text-secondary)] italic">
                      No external evidence found for this claim.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <p>{result.disclaimer}</p>
        <p>Verified at {new Date(result.verification_timestamp).toLocaleString()}</p>
      </div>
    </GlassCard>
  );
};

export default EvidenceVerification;
