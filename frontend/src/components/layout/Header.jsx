import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User } from 'lucide-react';

const Header = ({ title }) => {
  const { user } = useAuth();

  return (
    <header className="w-full flex items-center justify-between py-8 px-2">
      <h1 className="text-3xl font-semibold text-brand-navy tracking-tight">{title}</h1>
      
      <div className="flex items-center gap-6">
        {/* Status Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/80 shadow-sm">
          <ShieldCheck size={16} className="text-green-500" />
          <span className="text-sm font-medium text-brand-navy">AI Verification</span>
        </div>
        
        {/* Profile */}
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full border border-white shadow-sm cursor-pointer hover:bg-white transition-colors">
          <div className="w-8 h-8 rounded-full bg-brand-peach/50 flex items-center justify-center text-brand-orange">
            <User size={16} />
          </div>
          <span className="text-sm font-medium pr-2 text-brand-navy">{user?.username || 'User'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
