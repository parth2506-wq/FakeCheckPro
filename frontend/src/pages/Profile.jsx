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
    <DashboardLayout title="Profile">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-brand-navy text-white flex items-center justify-center text-4xl font-bold shadow-xl shadow-brand-navy/20">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              {isEditing ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white/50 border border-brand-gray/20 rounded-lg px-4 py-2 text-2xl font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/50"
                  />
                  <div className="text-brand-gray">{user?.email}</div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-brand-navy">{user?.name}</h1>
                  <div className="text-brand-gray mt-1">{user?.email}</div>
                </>
              )}
            </div>
          </div>
          
          <div>
            {isEditing ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-brand-gray border border-brand-gray/20 hover:bg-gray-50 transition-colors"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange text-white shadow-lg shadow-brand-orange/20 hover:bg-orange-500 transition-colors"
                >
                  <Check size={18} />
                  <span>Save</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-brand-gray border border-white/40 shadow-sm hover:shadow-md transition-all hover:text-brand-navy"
              >
                <Edit2 size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GlassCard className="flex flex-col gap-1 p-5 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <div className="flex items-center gap-2 text-brand-gray/60 mb-2 text-sm font-medium uppercase tracking-wider">
               <span>Email</span>
             </div>
             <div className="text-brand-navy font-semibold text-lg">{user?.email}</div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-1 p-5 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-2 text-brand-gray/60 mb-2 text-sm font-medium uppercase tracking-wider">
              <span>Phone</span>
            </div>
            {isEditing ? (
              <input
                type="tel"
                value={editForm.phone_number}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone_number: e.target.value }))}
                className="bg-white/50 border border-brand-gray/20 rounded-lg px-3 py-2 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/50 w-full"
                placeholder="Enter your phone"
              />
            ) : (
              <div className="text-brand-navy font-semibold text-lg">{user?.phone_number || '—'}</div>
            )}
          </GlassCard>

          <GlassCard className="flex flex-col gap-1 p-5 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <div className="flex items-center gap-2 text-brand-gray/60 mb-2 text-sm font-medium uppercase tracking-wider">
               <span>Language</span>
             </div>
             <div className="text-brand-navy font-semibold text-lg">{currentLanguage}</div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-1 p-5 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <div className="flex items-center gap-2 text-brand-gray/60 mb-2 text-sm font-medium uppercase tracking-wider">
               <span>Member Since</span>
             </div>
             <div className="text-brand-navy font-semibold text-lg">{memberSince}</div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-1 p-5 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <div className="flex items-center gap-2 text-brand-gray/60 mb-2 text-sm font-medium uppercase tracking-wider">
               <span>Notifications</span>
             </div>
             <div className="text-brand-navy font-semibold text-lg">On</div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-1 p-5 border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
             <div className="flex items-center gap-2 text-brand-gray/60 mb-2 text-sm font-medium uppercase tracking-wider">
               <span>Privacy</span>
             </div>
             <div className="text-brand-navy font-semibold text-lg">Private</div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
