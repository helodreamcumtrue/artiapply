'use client';

import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  MailCheck,
  Users,
  BarChart3,
  Settings,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Flame,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'builder' | 'campaigns' | 'contacts' | 'analytics' | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isGoogleConnected: boolean;
  isRedisConnected: boolean;
  userEmail?: string | null;
  userName?: string | null;
  userAvatar?: string | null;
  activeCampaignCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isGoogleConnected,
  isRedisConnected,
  userEmail,
  userName,
  userAvatar,
  activeCampaignCount = 0,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'builder', label: 'New Campaign', icon: PlusCircle, badge: 'AI' },
    { id: 'campaigns', label: 'Campaigns', icon: MailCheck, badge: activeCampaignCount > 0 ? `${activeCampaignCount}` : null },
    { id: 'contacts', label: 'Contacts', icon: Users, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Settings & APIs', icon: Settings, badge: null },
  ] as const;

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-surface-950/80 backdrop-blur-xl border-r border-white/[0.08] flex flex-col z-40 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent-cyan flex items-center justify-center shadow-glow">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ArticleApply
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-full bg-primary/20 text-primary-light border border-primary/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400">Cold Outreach System</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Main Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-primary/20 to-primary/5 text-white border border-primary/30 shadow-sm shadow-primary/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-primary-light' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    item.badge === 'AI'
                      ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30 flex items-center space-x-1'
                      : 'bg-primary/20 text-primary-light border border-primary/30'
                  }`}
                >
                  {item.badge === 'AI' && <Sparkles className="w-2.5 h-2.5 mr-0.5 inline" />}
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Infrastructure Status Widget */}
      <div className="p-4 mx-3 mb-4 rounded-xl bg-surface-900/60 border border-white/[0.06] space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-slate-400 font-medium">
          <span className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Infrastructure</span>
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Active
          </span>
        </div>

        {/* Gmail Status */}
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isGoogleConnected ? 'bg-emerald-400 shadow-glow-emerald' : 'bg-amber-400'}`} />
            <span className="text-[11px]">Gmail API</span>
          </span>
          <span className="text-[10px] text-slate-400">
            {isGoogleConnected ? 'Connected' : 'Demo Mode'}
          </span>
        </div>

        {/* BullMQ / Redis Status */}
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isRedisConnected ? 'bg-cyan-400 shadow-glow-cyan' : 'bg-slate-400'}`} />
            <span className="text-[11px]">BullMQ Queue</span>
          </span>
          <span className="text-[10px] text-slate-400">
            {isRedisConnected ? '2/sec Limiter' : 'Local Queue'}
          </span>
        </div>

        {/* Compliance & Legal Links */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-slate-400">
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition underline underline-offset-2">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition underline underline-offset-2">
            Terms
          </a>
          <span>•</span>
          <a href="/unsubscribe" target="_blank" rel="noopener noreferrer" className="hover:text-slate-200 transition underline underline-offset-2">
            Opt-out
          </a>
        </div>
      </div>

      {/* User Account Footer */}
      <div className="p-4 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-white/20 object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent-purple flex items-center justify-center text-xs font-bold text-white">
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div className="truncate">
            <p className="text-xs font-medium text-slate-200 truncate">
              {userName || 'Demo Marketer'}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {userEmail || 'user@articleapply.io'}
            </p>
          </div>
        </div>
        <a
          href="/api/auth/google"
          title="Sign in or Connect with Google"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
};
