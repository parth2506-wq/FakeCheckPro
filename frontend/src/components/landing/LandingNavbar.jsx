import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ScanSearch, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const LandingNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToTop = (e) => {
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/10 dark:bg-[#0B0E13]/60 backdrop-blur-md border-b border-white/20 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="/" onClick={scrollToTop} className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent-glow)] group-hover:scale-105 transition-transform">
            <ScanSearch size={22} className="text-white" />
          </div>
          <span className="font-semibold text-xl tracking-tight text-[var(--text-primary)] group-hover:opacity-80 transition-opacity">FakeCheckPro</span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/about" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">About</Link>
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">Features</a>
          <a href="#technology" onClick={(e) => scrollToSection(e, 'technology')} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">How It Works</a>
          <Link to="/research-disclaimer" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer">Disclaimer</Link>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--surface)] backdrop-blur-md border border-[var(--border-color)] shadow-sm text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] hover:-translate-y-0.5 active:translate-y-0 hover:shadow-md transition-all duration-300"
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/login" className="hidden sm:block text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors">
            Log In
          </Link>
          <Link to="/register" className="text-sm font-medium px-5 py-2.5 rounded-full bg-[var(--text-primary)] text-[var(--bg-base)] hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-[var(--border-color)]">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
