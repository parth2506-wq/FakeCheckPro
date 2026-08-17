import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, User, LogOut, Settings, Key } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full flex items-center justify-between py-8 px-2">
      <h1 className="text-3xl font-semibold text-brand-navy tracking-tight">{title}</h1>
      
      <div className="flex items-center gap-6">
        {/* Language Selector */}
        <div className="flex items-center bg-white/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/80 shadow-sm">
          <select 
            className="bg-transparent text-sm font-medium text-brand-navy outline-none cursor-pointer"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>

        {/* Status Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/80 shadow-sm">
          <ShieldCheck size={16} className="text-green-500" />
          <span className="text-sm font-medium text-brand-navy">{t('header.aiVerification')}</span>
        </div>
        
        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full border border-white shadow-sm cursor-pointer hover:bg-white transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="w-8 h-8 rounded-full bg-brand-peach/50 flex items-center justify-center text-brand-orange font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
            </div>
            <span className="text-sm font-medium pr-2 text-brand-navy">{user?.name || 'User'}</span>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              <Link 
                to="/profile" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-brand-navy hover:bg-brand-gray/5 transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <Settings size={16} />
                Profile
              </Link>
              <Link 
                to="/change-password" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-brand-navy hover:bg-brand-gray/5 transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <Key size={16} />
                Change Password
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut size={16} />
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
