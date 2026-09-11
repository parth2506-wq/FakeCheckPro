import React from 'react';
import { ScanSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative border-t border-[var(--border-color)] bg-[var(--surface)] pt-16 pb-8 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]">
                <ScanSearch size={18} className="text-white" />
              </div>
              <span className="font-semibold tracking-tight text-lg text-[var(--text-primary)]">FakeCheckPro</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm">
              Advanced machine learning classification and explainable AI platform for news verification and digital truth analysis.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><a href="#features" className="hover:text-[var(--accent)] transition-colors">Features</a></li>
              <li><a href="#technology" className="hover:text-[var(--accent)] transition-colors">How It Works</a></li>
              <li><Link to="/login" className="hover:text-[var(--accent)] transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--text-primary)] mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[var(--accent)] transition-colors cursor-pointer">Privacy Policy</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[var(--accent)] transition-colors cursor-pointer">Terms of Service</a></li>
              <li><Link to="/research-disclaimer" className="hover:text-[var(--accent)] transition-colors cursor-pointer">Research Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} FakeCheckPro. All rights reserved.
          </p>
          <div className="text-xs text-[var(--text-muted)]">
            Powered by WELFake Dataset & AI Models
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
