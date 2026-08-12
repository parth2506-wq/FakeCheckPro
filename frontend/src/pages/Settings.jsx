import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <DashboardLayout title="Settings">
      <GlassCard className="flex flex-col items-center justify-center py-32 text-center h-[60vh]">
        <div className="w-16 h-16 rounded-2xl bg-white/50 flex items-center justify-center text-brand-gray/40 mb-6 shadow-sm border border-white">
          <SettingsIcon size={32} />
        </div>
        <h2 className="text-xl font-semibold text-brand-navy mb-2">Settings</h2>
        <p className="text-brand-gray max-w-sm">
          User preferences and application settings will be available here in a future update.
        </p>
      </GlassCard>
    </DashboardLayout>
  );
};

export default Settings;
