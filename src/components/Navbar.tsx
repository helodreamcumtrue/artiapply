'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Moon,
  Sun,
  BarChart3,
  Settings,
  Sparkles,
  Layers,
  CheckCircle2,
  ExternalLink,
  Shield,
  LogOut,
  Mail,
  Zap,
  Users,
  Send,
  Clock,
  X,
  ChevronDown,
  BookOpen,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'builder' | 'campaigns' | 'contacts' | 'settings';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isGoogleConnected: boolean;
  isRedisConnected: boolean;
  userEmail?: string | null;
  userName?: string | null;
  userAvatar?: string | null;
  activeCampaignCount?: number;
  onOpenTour?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isGoogleConnected,
  isRedisConnected,
  userEmail,
  userName = 'John Smith',
  userAvatar,
  activeCampaignCount = 0,
  onOpenTour,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage or document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('artiapply_theme');
      const isDark = storedTheme === 'dark' || document.documentElement.classList.contains('dark');
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (storedTheme === 'light') {
        document.documentElement.classList.remove('dark');
      }
      setIsDarkMode(isDark);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        if (next) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('artiapply_theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('artiapply_theme', 'light');
        }
      }
      return next;
    });
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary navigation tabs for ArticlO outreach workflow
  const navTabs: { id: NavTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'builder', label: 'New Campaign' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'contacts', label: 'Contacts' },
  ];

  // Derive user initials, fallback "JS" matching user profile
  const getInitials = (name?: string | null) => {
    if (!name) return 'JS';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase() || 'JS';
  };

  return (
    <header className="sticky top-3 z-50 w-full px-4 sm:px-6 select-none">
      <div className="max-w-5xl mx-auto">
        {/* Floating Pill Container */}
        <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full px-4 sm:px-5 py-2.5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] flex items-center justify-between transition-colors">
          
          {/* Left Brand Badge */}
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            {/* ArticlO Logo Mark: Aerodynamic 'A' dispatch apex with electric indigo 'O' orbit */}
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-[0_2px_8px_rgba(15,23,42,0.18)] flex-shrink-0 group-hover:scale-105 transition-transform border border-slate-800">
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Aerodynamic send paper/quill apex for Articl */}
                <path
                  d="M12 2.5L3.5 20.5L12 16.5L20.5 20.5L12 2.5Z"
                  fill="url(#articlo-gradient)"
                  stroke="white"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                {/* Vibrant 'O' circle center */}
                <circle cx="12" cy="11.5" r="2.2" fill="#6366f1" />
                <defs>
                  <linearGradient id="articlo-gradient" x1="12" y1="2.5" x2="12" y2="20.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" />
                    <stop offset="1" stopColor="#cbd5e1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 leading-none font-poppins flex items-center">
                Articl<span className="text-indigo-600">O</span>
              </span>
              <span className="text-[10px] text-slate-500 tracking-wide font-medium">
                Article & Outreach Engine
              </span>
            </div>
          </div>

          {/* Center Navigation Tabs (Analytics removed from here!) */}
          <nav className="flex items-center space-x-1 sm:space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            {/* Notification Bell */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => {
                  setShowNotifications((prev) => !prev);
                  setUnreadCount(0);
                }}
                title="Notifications"
                className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Recent Activity
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
                          Outreach Delivery Live
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Just now</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        Queue rate limiter running at 2 emails/sec with 99.4% deliverability.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 flex items-center">
                          <Zap className="w-3.5 h-3.5 text-sky-600 mr-1.5" />
                          Contacts Ready
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Ready</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        50 verified sample B2B leads available in Contacts Directory.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Onboarding Tour Trigger */}
            {onOpenTour && (
              <button
                onClick={onOpenTour}
                title="Start interactive walkthrough"
                className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition active:scale-95 shadow-sm border border-indigo-100"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Tour</span>
              </button>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={isDarkMode ? 'Switch to Light Mode' : 'Toggle Theme'}
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Vertical Divider */}
            <div className="h-4 w-px bg-slate-200 mx-0.5" />

            {/* User Profile Avatar with Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#6366f1] text-white font-bold flex items-center justify-center text-xs shadow-sm hover:ring-2 hover:ring-indigo-300 transition-all cursor-pointer"
                title="Account Menu"
              >
                {userAvatar ? (
                  <img src={userAvatar} alt="User" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span>{getInitials(userName)}</span>
                )}
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Account Summary */}
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {userName || 'John Smith'}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate font-mono">
                      {userEmail || 'user@articleapply.io'}
                    </p>
                    <div className="flex items-center space-x-1.5 mt-1.5">
                      <span className={`w-2 h-2 rounded-full ${isGoogleConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <span className="text-[10px] text-slate-600 font-medium">
                        {isGoogleConnected ? 'Google Gmail Connected' : 'Demo Sending Mode'}
                      </span>
                    </div>
                  </div>

                  {/* Settings & Preferences */}
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setShowUserMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      activeTab === 'settings'
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Settings & Email Setup</span>
                    </div>
                  </button>

                  {/* Interactive Walkthrough Tour */}
                  {onOpenTour && (
                    <button
                      onClick={() => {
                        onOpenTour();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      <div className="flex items-center space-x-2.5">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span>Restart Onboarding Tour</span>
                      </div>
                    </button>
                  )}

                  <div className="my-1 border-t border-slate-100" />

                  {/* Quick Legal & Opt-out Links */}
                  <div className="px-3 py-1 flex items-center justify-between text-[11px] text-slate-400">
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-700">
                      Privacy
                    </a>
                    <span>•</span>
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-slate-700">
                      Terms
                    </a>
                    <span>•</span>
                    <a href="/unsubscribe" target="_blank" rel="noopener noreferrer" className="hover:text-slate-700">
                      Opt-out
                    </a>
                  </div>

                  <div className="my-1 border-t border-slate-100" />

                  {/* Google OAuth Connect */}
                  <a
                    href="/api/auth/google"
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isGoogleConnected ? 'Switch Google Account' : 'Connect Google Workspace'}</span>
                  </a>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
