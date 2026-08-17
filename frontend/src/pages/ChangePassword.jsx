import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import GlassCard from '../components/ui/GlassCard';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

const ChangePassword = () => {
  const { changePassword } = useAuth();
  
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState('initial'); // initial, loading, success, error
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
    
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 8) newErrors.newPassword = 'Password must be at least 8 characters';
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords must match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setStatus('loading');
    try {
      const response = await changePassword({ 
        current_password: formData.currentPassword,
        new_password: formData.newPassword 
      });
      setStatus('success');
      setMessage(response.message || 'Password changed successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.detail || 'Failed to change password.');
    }
  };

  return (
    <DashboardLayout title="Change Password">
      <div className="max-w-2xl mx-auto py-8">
        <GlassCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-brand-orange/10 text-brand-orange rounded-xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">Update Password</h2>
              <p className="text-brand-gray/80 text-sm">Ensure your account is using a long, random password to stay secure.</p>
            </div>
          </div>

          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100 flex items-center justify-between">
              <span>{message}</span>
              <button onClick={() => setStatus('initial')} className="text-green-700 font-bold ml-4">×</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {status === 'error' && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {message}
              </div>
            )}
            
            <Input
              label="Current Password"
              type="password"
              placeholder="Enter current password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              error={errors.currentPassword}
            />
            
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              error={errors.newPassword}
            />
            
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              error={errors.confirmPassword}
            />
            
            <div className="pt-2">
              <Button type="submit" isLoading={status === 'loading'} className="w-full sm:w-auto">
                {status === 'loading' ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default ChangePassword;
