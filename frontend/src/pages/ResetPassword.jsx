import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../api/axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [status, setStatus] = useState('initial'); // initial, loading, success, error
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.newPassword) newErrors.newPassword = 'Password is required';
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
      const response = await api.post('/auth/reset-password', { 
        token, 
        new_password: formData.newPassword 
      });
      setStatus('success');
      setMessage(response.data.message);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.detail || 'Failed to reset password.');
    }
  };

  if (!token && status !== 'success') {
    return (
      <AuthLayout title="Invalid Link" subtitle="This password reset link is invalid or has expired.">
        <div className="text-center mt-6">
          <Link to="/forgot-password" className="text-brand-orange font-medium hover:underline">
            Request a new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Create a new secure password for your account.">
      {status === 'success' ? (
        <div className="text-center space-y-6">
          <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100">
            {message}
          </div>
          <Link to="/login" className="block text-brand-orange font-medium hover:underline">
            Return to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {message}
            </div>
          )}
          
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
          
          <Button type="submit" isLoading={status === 'loading'} className="mt-4">
            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
};

export default ResetPassword;
