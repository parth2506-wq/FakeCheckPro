import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ShieldCheck, User, LogOut, Settings, Key, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    navigate('/');
  };

  return (
    <header className="w-full flex items-center justify-between py-8 px-2 transition-colors duration-500">
      <h1 className="text-3xl font-semibold text-[var(--text-primary)] tracking-tight">{title}</h1>

      <div className="flex items-center gap-6">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--surface)] backdrop-blur-md border border-[var(--border-color)] shadow-sm text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md transition-all duration-300"
          aria-label="Toggle Dark Mode"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Language Selector */}
        <div className="group flex items-center bg-[var(--surface)] backdrop-blur-md px-3 py-1.5 rounded-full border border-[var(--border-color)] shadow-sm transition-all duration-300 hover:bg-[var(--surface-elevated)] hover:-translate-y-0.5 cursor-pointer">
          <select
            className="bg-transparent text-sm font-medium text-[var(--text-primary)] transition-colors duration-300 outline-none cursor-pointer"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
          >
            <option value="en" className="text-gray-900">English</option>
            <option value="hi" className="text-gray-900">हिंदी (Hindi)</option>
            <option value="mr" className="text-gray-900">मराठी (Marathi)</option>
          </select>
        </div>

        {/* Status Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-[var(--surface)] backdrop-blur-md px-4 py-2 rounded-full border border-[var(--border-color)] shadow-sm transition-all duration-300 cursor-default">
          <ShieldCheck size={16} className="text-[var(--success)]" />
          <span className="text-sm font-medium text-[var(--text-primary)]">{t('header.aiVerification')}</span>
        </div>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-3 bg-[var(--surface)] backdrop-blur-md px-3 py-2 rounded-full border border-[var(--border-color)] shadow-sm cursor-pointer transition-all duration-300 hover:bg-[var(--surface-elevated)] hover:-translate-y-0.5"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="w-8 h-8 rounded-full bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] font-bold border border-[var(--accent-glow)]">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
            </div>
            <span className="text-sm font-medium pr-2 text-[var(--text-primary)]">{user?.name || 'User'}</span>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-[var(--surface-elevated)] rounded-xl shadow-xl border border-[var(--border-color)] py-1 z-50 overflow-hidden backdrop-blur-xl">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--accent-soft)] transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <Settings size={16} />
                {t('header.profile')}
              </Link>
              <Link
                to="/change-password"
                className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--accent-soft)] transition-colors"
                onClick={() => setShowDropdown(false)}
              >
                <Key size={16} />
                {t('header.changePassword')}
              </Link>
              <div className="border-t border-[var(--border-color)] my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors text-left"
              >
                <LogOut size={16} />
                {t('header.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
