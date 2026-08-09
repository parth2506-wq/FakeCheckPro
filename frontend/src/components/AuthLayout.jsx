import React from 'react';
import { ShieldCheck } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements are handled by global css gradient, but we can add more if needed */}
      
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="glass-card p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-brand-orange text-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-2xl font-semibold text-brand-navy mb-2">{title}</h1>
            {subtitle && <p className="text-brand-gray text-center text-sm">{subtitle}</p>}
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
