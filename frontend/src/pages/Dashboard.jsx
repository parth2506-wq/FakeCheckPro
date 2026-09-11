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
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

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
      <DashboardLayout title={t('dashboard.title')}>
        <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t('dashboard.title')}>
      <motion.div
        className="flex flex-col gap-6 pb-10 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
          <div>
            <h1 className="text-sm font-semibold text-[var(--text-secondary)] tracking-widest uppercase mb-2">{t("dashboard.welcome")}</h1>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]">
                <ScanSearch size={26} className="text-white" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-4xl font-black text-[var(--text-primary)] tracking-tight leading-none mb-2.5 mt-1">
                  {user?.name}
                </h2>
                <div className="text-lg font-medium text-[var(--text-primary)] opacity-80 flex items-center gap-1.5 leading-none">
                  <span className="text-[var(--text-secondary)] font-normal italic">{t("dashboard.to")}</span> FakeCheckPro
                </div>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] mt-4 text-lg">
              {t("dashboard.snapshot")}
            </p>
          </div>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-all shadow-sm print:hidden"
          >
            <Download size={18} />
            <span className="font-medium">{t("dashboard.downloadPdf")}</span>
          </button>
        </div>

        {/* Stat Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <GlassCard className="flex flex-col p-5 group hover:shadow-lg transition-all duration-300" motionProps={{ variants: itemVariants }}>
            <div className="text-[var(--accent)] mb-2 group-hover:scale-110 transition-transform"><TrendingUp size={24} /></div>
            <div className="text-3xl font-black text-[var(--text-primary)] mb-1">{stats?.total_checks || 0}</div>
            <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest">{t("dashboard.totalChecks")}</div>
          </GlassCard>

          <GlassCard className="flex flex-col p-5 border border-[var(--success)]/20 bg-[var(--success-soft)] group hover:shadow-lg transition-all duration-300" motionProps={{ variants: itemVariants }}>
            <div className="text-[var(--success)] mb-2 group-hover:scale-110 transition-transform"><ShieldCheck size={24} /></div>
            <div className="text-3xl font-black text-[var(--success)] mb-1">{stats?.real || 0}</div>
            <div className="text-xs font-semibold text-[var(--success)] opacity-80 uppercase tracking-widest">{t("dashboard.real")}</div>
          </GlassCard>

          <GlassCard className="flex flex-col p-5 border border-[var(--warning)]/20 bg-[var(--warning-soft)] group hover:shadow-lg transition-all duration-300" motionProps={{ variants: itemVariants }}>
            <div className="text-[var(--warning)] mb-2 group-hover:scale-110 transition-transform"><AlertCircle size={24} /></div>
            <div className="text-3xl font-black text-[var(--warning)] mb-1">{stats?.partial || 0}</div>
            <div className="text-xs font-semibold text-[var(--warning)] opacity-80 uppercase tracking-widest">{t("dashboard.partiallyTrue")}</div>
          </GlassCard>

          <GlassCard className="flex flex-col p-5 border border-[var(--danger)]/20 bg-[var(--danger-soft)] group hover:shadow-lg transition-all duration-300" motionProps={{ variants: itemVariants }}>
            <div className="text-[var(--danger)] mb-2 group-hover:scale-110 transition-transform"><XCircle size={24} /></div>
            <div className="text-3xl font-black text-[var(--danger)] mb-1">{stats?.fake || 0}</div>
            <div className="text-xs font-semibold text-[var(--danger)] opacity-80 uppercase tracking-widest">{t("dashboard.fake")}</div>
          </GlassCard>

          <GlassCard className="flex flex-col p-5 group hover:shadow-lg transition-all duration-300" motionProps={{ variants: itemVariants }}>
            <div className="text-[var(--text-secondary)] mb-2 group-hover:scale-110 transition-transform"><Bookmark size={24} /></div>
            <div className="text-3xl font-black text-[var(--text-primary)] mb-1">{stats?.saved_reports || 0}</div>
            <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest">{t("dashboard.savedReports")}</div>
          </GlassCard>
        </motion.div>

        {/* Charts Row 1 */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="md:col-span-2 p-6 flex flex-col">
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-6">{t("dashboard.activity")}</h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats?.activity || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} tickFormatter={(val) => val.substring(5)} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'var(--surface-elevated)', color: 'var(--text-primary)', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: 'var(--accent)', stroke: 'var(--surface)', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col">
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-2">{t("dashboard.realVsFake")}</h3>
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
                      <Cell fill="var(--border-color)" />
                    )}
                  </Pie>
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--surface-elevated)', border: 'none', borderRadius: '8px' }} itemStyle={{ color: 'var(--text-primary)' }}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center mt-2">
              <span className="text-[var(--text-secondary)] text-sm">{t("dashboard.avgCredibility")} </span>
              <span className="font-bold text-[var(--text-primary)]">{stats?.avg_credibility || 0} / 100</span>
            </div>
          </GlassCard>
        </motion.div>

        {/* Charts Row 2 */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="md:col-span-2 p-6 flex flex-col">
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-6">{t("dashboard.distribution")}</h3>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.distribution || []} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                  <RechartsTooltip cursor={{ fill: 'var(--surface-elevated)' }} contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: 'var(--surface-elevated)', color: 'var(--text-primary)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }} />
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

          <GlassCard className="p-6 flex flex-col">
            <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-6">{t("dashboard.languages")}</h3>
            <div className="flex flex-col gap-4 flex-1">
              {stats?.languages?.length > 0 ? (
                stats.languages.map((lang, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="font-semibold text-[var(--text-primary)]">{lang.name}</span>
                    <span className="font-black text-[var(--text-primary)] text-lg">{lang.count}</span>
                  </div>
                ))
              ) : (
                <div className="text-[var(--text-secondary)] text-sm">{t("dashboard.noData")}</div>
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Trending Section Row 3 */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6 mt-2">
          {isLoadingTrending ? (
            <>
              <GlassCard className="p-6 flex flex-col animate-pulse">
                <div className="h-4 bg-[var(--surface-elevated)] rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-elevated)] h-24 flex flex-col gap-2">
                      <div className="flex justify-between">
                        <div className="h-4 bg-[var(--border-color)] rounded w-1/2"></div>
                        <div className="h-4 bg-[var(--border-color)] rounded w-8"></div>
                      </div>
                      <div className="h-3 bg-[var(--border-color)] rounded w-full mt-2"></div>
                      <div className="h-3 bg-[var(--border-color)] rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </GlassCard>
              <GlassCard className="p-6 flex flex-col animate-pulse">
                <div className="h-4 bg-[var(--surface-elevated)] rounded w-1/4 mb-4"></div>
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="h-8 w-24 bg-[var(--surface-elevated)] rounded-full border border-[var(--border-color)]"></div>
                  ))}
                </div>
              </GlassCard>
            </>
          ) : (
            (trendingData?.trending_topics?.length > 0 || trendingData?.trending_keywords?.length > 0) && (
              <>
                {trendingData?.trending_topics?.length > 0 && (
                  <GlassCard className="p-6 flex flex-col">
                    <h3 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest mb-4 flex items-center gap-2">
                      {t("dashboard.globalTrending")} <span className="opacity-50">•</span> {t("dashboard.last30d")} <span className="opacity-50">•</span> <span className="text-[var(--danger)]">{t("dashboard.flagged")}</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {trendingData.trending_topics.map((topic, idx) => (
                        <div key={idx} className="p-4 rounded-xl border border-[var(--border-color)] bg-[var(--surface-elevated)] flex flex-col gap-2">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-[var(--text-primary)] text-sm">{topic.title || topic}</span>
                            <span className="text-[var(--danger)] text-xs font-medium mt-0.5">x{topic.count || 1}</span>
                          </div>
                          <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{topic.subtitle || ""}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {trendingData?.trending_keywords?.length > 0 && (
                  <GlassCard className="p-6 flex flex-col">
                    <h3 className="text-xs font-semibold text-[var(--success)] uppercase tracking-widest mb-4">{t("dashboard.trendingKeywords")}</h3>
                    <div className="flex flex-wrap gap-3">
                      {trendingData.trending_keywords.map((kw, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] bg-[var(--surface-elevated)] text-sm">
                          <span className="font-medium text-[var(--text-primary)]">{kw.keyword}</span>
                          <span className="text-[var(--text-secondary)] opacity-50">•</span>
                          <span className="text-[var(--text-secondary)]">{kw.count}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </>
            )
          )}
        </motion.div>

      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
