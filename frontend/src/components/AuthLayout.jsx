import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[var(--bg-base)]">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)] opacity-10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 opacity-10 rounded-full blur-[100px]" />
      
      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <div className="glass-card p-8 sm:p-10 shadow-xl shadow-[var(--accent-glow)]">
          <div className="flex flex-col items-center mb-8">
            <Link to="/" className="flex flex-col items-center group cursor-pointer">
              <motion.div 
                className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4 overflow-hidden border border-[var(--border-color)] p-1"
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img src={logo} alt="FakeCheckPro Logo" className="w-full h-full object-contain rounded-xl" />
              </motion.div>
              <h1 className="text-3xl font-outfit font-bold text-[var(--text-primary)] mb-1 tracking-tight group-hover:opacity-80 transition-opacity">FakeCheckPro</h1>
              <p className="text-[var(--accent)] font-medium text-sm tracking-wide uppercase mb-4">Trust What You See</p>
            </Link>
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">{title}</h2>
            {subtitle && <p className="text-[var(--text-secondary)] text-center text-sm">{subtitle}</p>}
          </div>
          
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
