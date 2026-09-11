import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';
import { User, Mail, Phone, Globe, Calendar, Bell, Shield, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    phone_number: user?.phone_number || '',
  });

  const handleSave = async () => {
    try {
      await updateProfile({
        name: editForm.name,
        phone_number: editForm.phone_number
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      phone_number: user?.phone_number || '',
    });
    setIsEditing(false);
  };

  const currentLanguage = i18n.language === 'hi' ? 'Hindi' : i18n.language === 'mr' ? 'Marathi' : 'English';
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A';


  return (
    <DashboardLayout title={t("profile.title")}>
      <div className="max-w-4xl mx-auto py-8">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-[var(--accent)] text-white flex items-center justify-center text-4xl font-bold shadow-xl shadow-[var(--accent)]/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-lg px-4 py-2 text-2xl font-bold text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
                  />
                  <div className="text-[var(--text-secondary)]">{user?.email}</div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-[var(--text-primary)]">{user?.name}</h1>
                  <div className="text-[var(--text-secondary)] mt-1">{user?.email}</div>
                </>
              )}
            </div>
          </div>
          
          <div>
            {isEditing ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-color)] hover:bg-[var(--surface-elevated)] transition-colors"
                >
                  <X size={18} />
                  <span>{t("profile.cancel")}</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20 hover:opacity-90 transition-opacity"
                >
                  <Check size={18} />
                  <span>{t("profile.save")}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all hover:text-[var(--accent)]"
              >
                <Edit2 size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="flex flex-col gap-1 p-5 border border-[var(--border-color)] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2 text-sm font-medium uppercase tracking-wider">
               <span>{t("profile.email")}</span>
             </div>
             <div className="text-[var(--text-primary)] font-semibold text-lg">{user?.email}</div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-1 p-5 border border-[var(--border-color)] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2 text-sm font-medium uppercase tracking-wider">
              <span>{t("profile.phone")}</span>
            </div>
            {isEditing ? (
              <input
                type="tel"
                value={editForm.phone_number}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone_number: e.target.value }))}
                className="bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 w-full"
                placeholder={t("profile.enterPhone")}
              />
            ) : (
              <div className="text-[var(--text-primary)] font-semibold text-lg">{user?.phone_number || '—'}</div>
            )}
          </GlassCard>

          <GlassCard className="flex flex-col gap-1 p-5 border border-[var(--border-color)] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2 text-sm font-medium uppercase tracking-wider">
               <span>{t("profile.language")}</span>
             </div>
             <div className="text-[var(--text-primary)] font-semibold text-lg">{currentLanguage}</div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-1 p-5 border border-[var(--border-color)] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2 text-sm font-medium uppercase tracking-wider">
               <span>{t("profile.memberSince")}</span>
             </div>
             <div className="text-[var(--text-primary)] font-semibold text-lg">{memberSince}</div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-1 p-5 border border-[var(--border-color)] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2 text-sm font-medium uppercase tracking-wider">
               <span>{t("profile.notifications")}</span>
             </div>
             <div className="text-[var(--text-primary)] font-semibold text-lg">{t("profile.on")}</div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-1 p-5 border border-[var(--border-color)] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <div className="flex items-center gap-2 text-[var(--text-muted)] mb-2 text-sm font-medium uppercase tracking-wider">
               <span>{t("profile.privacy")}</span>
             </div>
             <div className="text-[var(--text-primary)] font-semibold text-lg">{t("profile.private")}</div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
