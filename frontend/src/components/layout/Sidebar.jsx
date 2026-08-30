import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ScanSearch, History, User, Info, LogOut, HelpCircle, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const mainLinks = [
    { name: t('sidebar.dashboard'), path: '/dashboard', icon: LayoutDashboard },
    { name: t('sidebar.analyze'), path: '/analyze', icon: ScanSearch },
    { name: t('sidebar.liveNews', 'Live News'), path: '/live-news', icon: Globe },
    { name: t('sidebar.history'), path: '/history', icon: History },
  ];

  const systemLinks = [
    { name: t('sidebar.howItWorks'), path: '/how-it-works', icon: Info },
    { name: t('sidebar.faq', 'FAQ'), path: '/faq', icon: HelpCircle },
    { name: t('sidebar.profile', 'Profile'), path: '/profile', icon: User },
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <NavLink
        to={item.path}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
          isActive 
            ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-brand-navy font-medium' 
            : 'text-brand-gray hover:bg-white/50 hover:text-brand-navy'
        }`}
      >
        <Icon size={18} className={isActive ? 'text-brand-orange' : ''} />
        <span>{item.name}</span>
      </NavLink>
    );
  };

  return (
    <aside className="w-[260px] h-full flex flex-col pt-8 pb-6 px-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 mb-10">
        <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center shadow-lg shadow-brand-orange/20">
          <ScanSearch size={22} className="text-white" />
        </div>
        <span className="font-semibold text-xl text-brand-navy tracking-tight">FakeCheckPro</span>
      </div>

      <div className="flex-1 flex flex-col gap-8">
        {/* Main Menu */}
        <div>
          <h3 className="text-xs font-semibold text-brand-gray/60 uppercase tracking-wider px-4 mb-3">{t('sidebar.mainMenu')}</h3>
          <nav className="flex flex-col gap-1">
            {mainLinks.map(link => <NavItem key={link.name} item={link} />)}
          </nav>
        </div>

        {/* System Menu */}
        <div>
          <h3 className="text-xs font-semibold text-brand-gray/60 uppercase tracking-wider px-4 mb-3">{t('sidebar.system')}</h3>
          <nav className="flex flex-col gap-1">
            {systemLinks.map(link => <NavItem key={link.name} item={link} />)}
          </nav>
        </div>
      </div>

      {/* Logout */}
      <button 
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-brand-gray hover:bg-white/50 hover:text-red-500 transition-all duration-300 mt-auto text-left"
      >
        <LogOut size={18} />
        <span>{t('sidebar.logout')}</span>
      </button>
    </aside>
  );
};

export default Sidebar;
