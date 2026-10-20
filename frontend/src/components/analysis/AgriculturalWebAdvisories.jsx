import React, { useState, useEffect } from 'react';
import { 
  Globe, ExternalLink, ShieldCheck, AlertTriangle, CheckCircle2, 
  HelpCircle, RefreshCw, ChevronDown, ChevronUp, BookOpen, Sparkles
} from 'lucide-react';

export default function AgriculturalWebAdvisories({ 
  crop = 'Wheat', 
  issue = '', 
  chemical = '', 
  location = 'Punjab',
  stage = ''
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [moduleStatus, setModuleStatus] = useState({ checked: false, enabled: false });

  // Check if TinyFish module is configured on backend
  useEffect(() => {
    let isMounted = true;
    fetch('/api/tinyfish/status')
      .then(res => res.json())
      .then(statusData => {
        if (isMounted) {
          setModuleStatus({ checked: true, enabled: Boolean(statusData?.enabled) });
        }
      })
      .catch(() => {
        if (isMounted) {
          setModuleStatus({ checked: true, enabled: false });
        }
      });
    return () => { isMounted = false; };
  }, []);

  const handleFetchAdvisories = async () => {
    if (!issue && !chemical) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tinyfish/advisories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: crop || 'Wheat',
          issue: issue || '',
          chemical: chemical || '',
          location: location || 'India',
          stage: stage || ''
        })
      });

      const result = await response.json();
      
      if (!response.ok || (result.success === false && result.error)) {
        setError(result.error || 'Failed to retrieve web advisories.');
      } else {
        setData(result);
        setIsExpanded(true);
      }
    } catch (err) {
      setError('Network request failed. TinyFish service unreachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden transition-all">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Globe size={26} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-300">
                Extension Intelligence Layer
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                TinyFish AI
              </span>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Agricultural Web Intelligence & Validation
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFetchAdvisories}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Searching Portals...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>{data ? 'Re-verify Sources' : 'Verify with Web Advisories'}</span>
              </>
            )}
          </button>
          {data && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6 md:p-8 space-y-6">
        
        {/* Initial Prompt State */}
        {!data && !loading && !error && (
          <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <BookOpen className="mx-auto text-indigo-400 mb-3" size={36} />
            <h4 className="text-base font-bold text-slate-800 mb-1">
              Cross-Verify Treatment with Official Literature
            </h4>
            <p className="text-sm text-slate-500 max-w-lg mx-auto mb-5">
              Click the button above to autonomously search verified ICAR institutes, Krishi Vigyan Kendras (KVK), and State Agriculture portals via TinyFish API.
            </p>
            {moduleStatus.checked && !moduleStatus.enabled && (
              <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle size={14} />
                <span>Notice: Set TINYFISH_API_KEY in backend .env to enable live queries with your $8 credits.</span>
              </div>
            )}
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4 py-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-200"></div>
              <div className="h-5 bg-indigo-100 rounded-md w-1/3"></div>
            </div>
            <div className="h-16 bg-slate-100 rounded-2xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-28 bg-slate-100 rounded-2xl"></div>
              <div className="h-28 bg-slate-100 rounded-2xl"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
            <AlertTriangle className="flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm">
              <p className="font-bold">Web Advisory Search Notice</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Data Loaded View */}
        {data && isExpanded && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Validation Outcome Banner */}
            {data.validation && (
              <div className={`p-5 rounded-2xl border flex items-start sm:items-center justify-between gap-4 ${
                data.validation.status === 'verified' 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                  : data.validation.status === 'warning' 
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}>
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl ${
                    data.validation.status === 'verified' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {data.validation.status === 'verified' ? <ShieldCheck size={24} /> : <AlertTriangle size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm tracking-wide uppercase">
                        Validation Status:
                      </span>
                      <span className="font-black text-sm">{data.validation.badge}</span>
                    </div>
                    <p className="text-sm mt-0.5 opacity-90">{data.validation.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Retrieved Trusted Sources List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Retrieved Official Extension Portals ({data.sources?.length || 0})
                </h4>
                <span className="text-xs text-slate-400">Strictly isolated from ML weights</span>
              </div>

              {(!data.sources || data.sources.length === 0) ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-2xl text-sm">
                  No specific extension pages were indexed for this particular symptom combination.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.sources.map((source, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50 hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-200 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                            source.isTrusted 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {source.sourceType || 'Extension Portal'}
                          </span>
                          {source.publishedDate && (
                            <span className="text-[11px] text-slate-400">{source.publishedDate}</span>
                          )}
                        </div>

                        <h5 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                          {source.title}
                        </h5>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                          {source.snippet || 'Refer to the official bulletin link for dosage parameters and spray safety.'}
                        </p>
                      </div>

                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 mt-auto pt-2 border-t border-slate-200/60"
                      >
                        <span>Open Official Document</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Strict Regulatory & Architectural Disclaimer */}
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-[11px] text-slate-500 leading-normal flex items-start gap-2.5">
              <HelpCircle size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700">Decoupled Architecture Notice: </span>
                {data.disclaimer}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
