import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../api/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('initial'); // initial, loading, success, error
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Valid email is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setStatus('loading');
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setStatus('success');
      setMessage(response.data.message);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.detail || 'Failed to process request.');
    }
  };

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your registered email and we'll help you reset your password.">
      {status === 'success' ? (
        <div className="text-center space-y-6">
          <div className="p-4 bg-green-50 text-green-700 text-sm rounded-xl border border-green-100">
            {message}
          </div>
          <Link to="/login" className="block text-brand-orange font-medium hover:underline">
            Back to Login
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
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          
          <Button type="submit" isLoading={status === 'loading'} className="mt-4">
            {status === 'loading' ? 'Sending Link...' : 'Send Reset Link'}
          </Button>
          
          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-brand-gray hover:text-brand-navy transition-colors">
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
