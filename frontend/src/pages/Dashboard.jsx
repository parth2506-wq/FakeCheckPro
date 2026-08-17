import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import { TrendingUp, ShieldCheck, AlertCircle, XCircle, Bookmark, Download, ScanSearch } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [trendingData, setTrendingData] = useState(null);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/history/dashboard_stats');
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchTrending = async () => {
      try {
        const response = await api.get('/history/trending');
        setTrendingData(response.data);
      } catch (err) {
        console.error("Failed to fetch trending data", err);
      } finally {
        setIsLoadingTrending(false);
      }
    };

    fetchStats();
    fetchTrending();
  }, []);

  const PIE_COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Real, Partial, Fake

  const pieData = [
    { name: 'Real', value: stats?.real || 0 },
    { name: 'Partial', value: stats?.partial || 0 },
    { name: 'Fake', value: stats?.fake || 0 }
  ].filter(d => d.value > 0);

  if (loading) {
    return (
      <DashboardLayout title={t('dashboard.title', 'Dashboard')}>
        <div className="flex items-center justify-center h-full">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t('dashboard.title', 'Dashboard')}>
      <div className="flex flex-col gap-6 pb-10 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <div>
            <h1 className="text-sm font-semibold text-brand-gray/60 tracking-widest uppercase mb-2">Welcome</h1>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-orange flex items-center justify-center shadow-lg shadow-brand-orange/30">
                <ScanSearch size={26} className="text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-4xl font-black text-brand-navy tracking-tight leading-none mb-2.5 mt-1">
                  {user?.name}
                </h2>
                <div className="text-lg font-medium text-brand-navy/80 flex items-center gap-1.5 leading-none">
                  <span className="text-brand-gray/60 font-normal italic">to</span> FakeCheckPro
                </div>
              </div>
            </div>
            <p className="text-brand-gray mt-4 text-lg">
              Here's a snapshot of your verification activity.
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-gray/20 bg-white/50 text-brand-navy hover:bg-white transition-all shadow-sm">
            <Download size={18} />
            <span className="font-medium">Download CSV</span>
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <GlassCard className="flex flex-col p-5 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="text-brand-navy mb-2"><TrendingUp size={24} /></div>
            <div className="text-3xl font-black text-brand-navy mb-1">{stats?.total_checks || 0}</div>
            <div className="text-xs font-semibold text-brand-gray/60 uppercase tracking-widest">Total Checks</div>
          </GlassCard>

          <GlassCard className="flex flex-col p-5 border border-emerald-500/20 bg-emerald-50/50 shadow-[0_8px_30px_rgb(16,185,129,0.1)]">
            <div className="text-emerald-500 mb-2"><ShieldCheck size={24} /></div>
            <div className="text-3xl font-black text-emerald-600 mb-1">{stats?.real || 0}</div>
            <div className="text-xs font-semibold text-emerald-600/60 uppercase tracking-widest">Real</div>
          </GlassCard>

          <GlassCard className="flex flex-col p-5 border border-amber-500/20 bg-amber-50/50 shadow-[0_8px_30px_rgb(245,158,11,0.1)]">
            <div className="text-amber-500 mb-2"><AlertCircle size={24} /></div>
            <div className="text-3xl font-black text-amber-600 mb-1">{stats?.partial || 0}</div>
            <div className="text-xs font-semibold text-amber-600/60 uppercase tracking-widest">Partially True</div>
          </GlassCard>

          <GlassCard className="flex flex-col p-5 border border-red-500/20 bg-red-50/50 shadow-[0_8px_30px_rgb(239,68,68,0.1)]">
            <div className="text-red-500 mb-2"><XCircle size={24} /></div>
            <div className="text-3xl font-black text-red-600 mb-1">{stats?.fake || 0}</div>
            <div className="text-xs font-semibold text-red-600/60 uppercase tracking-widest">Fake</div>
          </GlassCard>

          <GlassCard className="flex flex-col p-5 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="text-brand-gray mb-2"><Bookmark size={24} /></div>
            <div className="text-3xl font-black text-brand-navy mb-1">{stats?.saved_reports || 0}</div>
            <div className="text-xs font-semibold text-brand-gray/60 uppercase tracking-widest">Saved Reports</div>
          </GlassCard>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="md:col-span-2 p-6 flex flex-col border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-xs font-semibold text-brand-gray/60 uppercase tracking-widest mb-6">Activity (14D)</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.activity || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(val) => val.substring(5)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#0f172a" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#0f172a', stroke: '#fff', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-xs font-semibold text-brand-gray/60 uppercase tracking-widest mb-2">Real vs Partial vs Fake</h3>
            <div className="flex-1 min-h-[200px] flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData.length > 0 ? pieData : [{ name: 'No Data', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.length > 0 ? pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    )) : (
                      <Cell fill="#e2e8f0" />
                    )}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <span className="text-brand-gray text-sm">Avg. credibility: </span>
              <span className="font-bold text-brand-navy">{stats?.avg_credibility || 0} / 100</span>
            </div>
          </GlassCard>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="md:col-span-2 p-6 flex flex-col border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-xs font-semibold text-brand-gray/60 uppercase tracking-widest mb-6">Credibility Distribution</h3>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.distribution || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)'}} />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {
                        (stats?.distribution || []).map((entry, index) => {
                           const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#10b981']; // Red (Fake) to Green (Real)
                           return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })
                      }
                    </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <h3 className="text-xs font-semibold text-brand-gray/60 uppercase tracking-widest mb-6">Languages</h3>
            <div className="flex flex-col gap-4 flex-1">
              {stats?.languages?.length > 0 ? (
                stats.languages.map((lang, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="font-semibold text-brand-navy">{lang.name}</span>
                    <span className="font-black text-brand-navy text-lg">{lang.count}</span>
                  </div>
                ))
              ) : (
                <div className="text-brand-gray text-sm">No data available</div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Trending Section Row 3 */}
        <div className="flex flex-col gap-6 mt-2">
          {isLoadingTrending ? (
            <>
              <GlassCard className="p-6 flex flex-col border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse">
                <div className="h-4 bg-brand-gray/20 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="p-4 rounded-xl border border-brand-gray/20 bg-white/30 h-24 flex flex-col gap-2">
                      <div className="flex justify-between">
                        <div className="h-4 bg-brand-gray/20 rounded w-1/2"></div>
                        <div className="h-4 bg-brand-gray/20 rounded w-8"></div>
                      </div>
                      <div className="h-3 bg-brand-gray/20 rounded w-full mt-2"></div>
                      <div className="h-3 bg-brand-gray/20 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </GlassCard>
              <GlassCard className="p-6 flex flex-col border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse">
                <div className="h-4 bg-brand-gray/20 rounded w-1/4 mb-4"></div>
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="h-8 w-24 bg-brand-gray/20 rounded-full"></div>
                  ))}
                </div>
              </GlassCard>
            </>
          ) : (
            (trendingData?.trending_topics?.length > 0 || trendingData?.trending_keywords?.length > 0) && (
              <>
                {trendingData?.trending_topics?.length > 0 && (
                  <GlassCard className="p-6 flex flex-col border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h3 className="text-xs font-semibold text-brand-gray/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                      GLOBAL TRENDING <span className="text-[#ef4444]">FAKE TOPICS</span> <span className="text-brand-gray/30">•</span> LAST 30D <span className="text-brand-gray/30">•</span> <span className="text-[#ef4444]">6 FLAGGED</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {trendingData.trending_topics.map((topic, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-brand-gray/20 bg-white/50 flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-brand-navy text-sm">{topic.title || topic}</span>
                            <span className="text-brand-red text-xs font-medium mt-0.5">x{topic.count || 1}</span>
                          </div>
                          <p className="text-xs text-brand-gray line-clamp-2">{topic.subtitle || ""}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {trendingData?.trending_keywords?.length > 0 && (
                  <GlassCard className="p-6 flex flex-col border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <h3 className="text-xs font-semibold text-[#10b981] uppercase tracking-widest mb-4">TRENDING KEYWORDS</h3>
                    <div className="flex flex-wrap gap-3">
                      {trendingData.trending_keywords.map((kw, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gray/20 bg-white/50 text-sm">
                          <span className="font-medium text-brand-navy">{kw.keyword}</span>
                          <span className="text-brand-gray/40">•</span>
                          <span className="text-brand-gray">{kw.count}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </>
            )
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
