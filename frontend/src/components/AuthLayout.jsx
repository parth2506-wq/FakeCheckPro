import React from 'react';
import logo from '../assets/logo.png';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements are handled by global css gradient, but we can add more if needed */}
      
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="glass-card p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 overflow-hidden border border-brand-peach/30 p-1">
              <img src={logo} alt="FakeCheckPro Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <h1 className="text-3xl font-outfit font-bold text-brand-navy mb-1 tracking-tight">FakeCheckPro</h1>
            <p className="text-brand-orange font-medium text-sm tracking-wide uppercase mb-4">Trust What You See</p>
            <h2 className="text-xl font-semibold text-brand-navy mb-2">{title}</h2>
            {subtitle && <p className="text-brand-gray text-center text-sm">{subtitle}</p>}
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
