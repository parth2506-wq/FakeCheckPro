import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';
import { History as HistoryIcon } from 'lucide-react';

const History = () => {
  return (
    <DashboardLayout title="Analysis History">
      <GlassCard className="flex flex-col items-center justify-center py-32 text-center h-[60vh]">
        <div className="w-16 h-16 rounded-2xl bg-white/50 flex items-center justify-center text-brand-gray/40 mb-6 shadow-sm border border-white">
          <HistoryIcon size={32} />
        </div>
        <h2 className="text-xl font-semibold text-brand-navy mb-2">No analyses yet</h2>
        <p className="text-brand-gray max-w-sm">
          Your analyzed articles will appear here once history storage is enabled by the backend API.
        </p>
      </GlassCard>
    </DashboardLayout>
  );
};

export default History;
