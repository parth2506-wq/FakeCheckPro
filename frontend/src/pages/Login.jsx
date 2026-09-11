import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.detail || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Verify information with confidence.">
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="p-3 bg-[var(--danger-soft)] text-[var(--danger)] text-sm rounded-lg border border-[var(--danger)]/20">
            {apiError}
          </div>
        )}
        
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />
        
        <div className="relative">
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            error={errors.password}
          />
          <div className="absolute top-0 right-0">
            <Link to="/forgot-password" className="text-sm text-[var(--accent)] hover:underline">
              Forgot password?
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mb-6">
          <input 
            type="checkbox" 
            id="remember" 
            className="rounded border-[var(--border-color)] text-[var(--accent)] focus:ring-[var(--accent)] bg-[var(--surface-elevated)]" 
          />
          <label htmlFor="remember" className="text-sm text-[var(--text-secondary)] cursor-pointer">
            Remember me
          </label>
        </div>
        
        <Button type="submit" isLoading={isLoading} className="mt-2">
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
      
      <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
        Don't have an account?{' '}
        <Link to="/register" className="text-[var(--accent)] font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
