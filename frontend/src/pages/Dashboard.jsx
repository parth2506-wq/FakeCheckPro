import React from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-brand-beige p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 glass-card p-6">
          <div>
            <h1 className="text-2xl font-bold text-brand-navy">Dashboard</h1>
            <p className="text-brand-gray">Welcome back, {user?.name}</p>
          </div>
          <Button variant="secondary" onClick={logout} className="w-auto px-6">
            <LogOut size={18} />
            Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 h-64 flex items-center justify-center text-brand-gray">
            Dashboard Widget 1
          </div>
          <div className="glass-card p-6 h-64 flex items-center justify-center text-brand-gray">
            Dashboard Widget 2
          </div>
          <div className="glass-card p-6 h-64 flex items-center justify-center text-brand-gray">
            Dashboard Widget 3
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
