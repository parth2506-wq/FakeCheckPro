import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';
import { getModelInfo } from '../services/api';
import { Network, Database, Cpu, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const data = await getModelInfo();
        setInfo(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  return (
    <DashboardLayout title="Dashboard">
      <div className="flex flex-col gap-6 pb-10">
        
        {/* Welcome Card */}
        <GlassCard className="flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute right-0 top-0 w-64 h-64 bg-brand-orange/10 blur-3xl rounded-full" />
          <div className="relative z-10 flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-brand-navy">Welcome to FakeCheckPro</h2>
            <p className="text-brand-navy/70 max-w-xl">
              Evaluate news articles using our machine learning classifier. The system extracts textual features and identifies patterns associated with verified and unverified sources.
            </p>
          </div>
          <button 
            onClick={() => navigate('/analyze')}
            className="relative z-10 whitespace-nowrap bg-brand-navy text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:bg-brand-navy/90 hover:shadow-lg transition-all"
          >
            <Search size={18} />
            Analyze an Article
          </button>
        </GlassCard>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-peach/30 flex items-center justify-center text-brand-orange">
              <Network size={24} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-gray uppercase tracking-wider mb-1">ML Model</h3>
              <p className="text-2xl font-bold text-brand-navy">
                {loading ? '...' : info?.model || 'Logistic Regression'}
              </p>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-peach/30 flex items-center justify-center text-brand-orange">
              <Database size={24} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-gray uppercase tracking-wider mb-1">Features</h3>
              <p className="text-2xl font-bold text-brand-navy">
                {loading ? '...' : info?.feature_type || 'TF-IDF'}
              </p>
              <p className="text-sm text-brand-gray mt-1">Up to {info?.max_features?.toLocaleString() || '60,000'} features</p>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-peach/30 flex items-center justify-center text-brand-orange">
              <Cpu size={24} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-brand-gray uppercase tracking-wider mb-1">Explainability</h3>
              <p className="text-2xl font-bold text-brand-navy">Enabled</p>
              <p className="text-sm text-brand-gray mt-1">Feature Contribution Analysis</p>
            </div>
          </GlassCard>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
