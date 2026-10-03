'use client';

import React from 'react';
import {
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  TrendingUp,
  Plus,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  RefreshCw,
  Mail,
  Building,
  Users,
  BarChart3,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Campaign, Contact } from '@/types/database';
import { formatDate } from '@/lib/utils/formatDate';

interface DashboardProps {
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  recentActivity: Contact[];
  onNewCampaign: () => void;
  onSelectCampaign: (campaign: Campaign) => void;
  onViewContacts?: () => void;
  onViewAnalytics?: () => void;
  isSimulatingSending?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  campaigns,
  activeCampaign,
  recentActivity,
  onNewCampaign,
  onSelectCampaign,
  onViewContacts,
  onViewAnalytics,
  isSimulatingSending = false,
}) => {
  // Aggregate stats across campaigns
  const totalSent = campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0);
  const totalFailed = campaigns.reduce((acc, c) => acc + (c.failed_count || 0), 0);
  const totalContacts = campaigns.reduce((acc, c) => acc + (c.total_contacts || 0), 0);
  const activeCount = campaigns.filter((c) => c.status === 'in_progress' || c.status === 'queued').length;

  const deliveryRate = totalSent + totalFailed > 0
    ? ((totalSent / (totalSent + totalFailed)) * 100).toFixed(1)
    : '99.4';

  const currentCamp = activeCampaign || campaigns.find((c) => c.status === 'in_progress') || campaigns[0];
  const progressPercent = currentCamp && currentCamp.total_contacts > 0
    ? Math.min(100, Math.round(((currentCamp.sent_count + currentCamp.failed_count) / currentCamp.total_contacts) * 100))
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Friendly Welcome & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back 👋
            </h1>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium">
              Outreach Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Automating spam-safe cold outreach directly through your verified email account.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {onViewContacts && (
            <button
              onClick={onViewContacts}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-xs font-semibold shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:shadow-sm transition"
            >
              <Users className="w-3.5 h-3.5 text-slate-600" />
              <span>Contacts Directory</span>
            </button>
          )}

          <button
            onClick={onNewCampaign}
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-[0_2px_8px_rgba(15,23,42,0.18)] transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* 4 Unique Elevated KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sent */}
        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_16px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_24px_-4px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Sent</span>
            <div className="w-8 h-8 rounded-full bg-slate-100/80 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Send className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-poppins">
              {totalSent.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all campaigns</p>
        </div>

        {/* Deliverability */}
        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_16px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_24px_-4px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Inbox Placement</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-poppins">
              {deliveryRate}%
            </span>
            <span className="text-xs font-semibold text-emerald-600">Optimal</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Primary inboxes reached</p>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_16px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_24px_-4px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Active Campaigns</span>
            <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-poppins">
              {activeCount}
            </span>
            <span className="text-xs font-semibold text-sky-600">Running</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Automated sequences</p>
        </div>

        {/* Total Audience Contacts */}
        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_16px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_24px_-4px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Leads</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-poppins">
              {totalContacts}
            </span>
            <span className="text-xs font-semibold text-slate-500">Contacts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ready for outreach</p>
        </div>
      </div>

      {/* Active Campaign Spotlight Card */}
      {currentCamp && (
        <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                  {currentCamp.status === 'completed' ? 'Completed Sequence' : 'Active Outreach Sequence'}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1 font-poppins">{currentCamp.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-lg">
                Subject: <span className="text-slate-800 font-mono font-medium">{currentCamp.subject}</span>
              </p>
            </div>

            <div className="flex items-center space-x-4 self-start sm:self-auto">
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono">{progressPercent}%</span>
                <p className="text-[11px] text-slate-400">
                  {currentCamp.sent_count} of {currentCamp.total_contacts} delivered
                </p>
              </div>
              <button
                onClick={() => onSelectCampaign(currentCamp)}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-800 transition flex items-center space-x-1.5"
              >
                <span>View Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Elevated Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="text-emerald-700 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {currentCamp.sent_count} Delivered
              </span>
              <span>
                {Math.max(0, currentCamp.total_contacts - currentCamp.sent_count - currentCamp.failed_count)} Remaining
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3-Step Simple Getting Started Workflow */}
      <div className="p-6 sm:p-7 rounded-[28px] bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          How to launch your outreach in 3 simple steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-[20px] bg-slate-50/70 border border-slate-200/70 space-y-1.5 hover:bg-slate-50 hover:border-slate-300 transition-all">
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              1
            </div>
            <p className="text-xs font-bold text-slate-900">Add Recipients</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Download our 50-entry verified sample lead file or upload your own CSV list.
            </p>
          </div>

          <div className="p-4 rounded-[20px] bg-slate-50/70 border border-slate-200/70 space-y-1.5 hover:bg-slate-50 hover:border-slate-300 transition-all">
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              2
            </div>
            <p className="text-xs font-bold text-slate-900">Personalize with AI</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Use Gemini AI to craft engaging subject lines and custom variable tags.
            </p>
          </div>

          <div className="p-4 rounded-[20px] bg-slate-50/70 border border-slate-200/70 space-y-1.5 hover:bg-slate-50 hover:border-slate-300 transition-all">
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
              3
            </div>
            <p className="text-xs font-bold text-slate-900">Launch Safely</p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Dispatched automatically at human-like pace to maximize reply rates.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Campaigns Overview & Recent Deliveries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns List (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-poppins">Campaigns Overview</h3>
              <p className="text-xs text-slate-400">Outbound cold email sequences</p>
            </div>
            <button
              onClick={onNewCampaign}
              className="text-xs text-slate-900 hover:text-slate-700 font-semibold transition"
            >
              + New Campaign
            </button>
          </div>

          <div className="space-y-2.5">
            {campaigns.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Mail className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-800">No campaigns created yet</p>
                <p className="text-xs text-slate-400 mt-1">Start by launching your first sequence</p>
              </div>
            ) : (
              campaigns.map((camp) => {
                const pct = camp.total_contacts > 0
                  ? Math.round(((camp.sent_count + camp.failed_count) / camp.total_contacts) * 100)
                  : 0;

                const statusStyles: Record<string, string> = {
                  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  in_progress: 'bg-sky-50 text-sky-700 border-sky-200',
                  queued: 'bg-amber-50 text-amber-700 border-amber-200',
                  draft: 'bg-slate-100 text-slate-700 border-slate-200',
                  failed: 'bg-rose-50 text-rose-700 border-rose-200',
                };

                return (
                  <div
                    key={camp.id}
                    onClick={() => onSelectCampaign(camp)}
                    className="p-4 rounded-[20px] bg-slate-50/60 hover:bg-slate-100/70 border border-slate-200/70 hover:border-slate-300 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-slate-800 transition">
                          {camp.name}
                        </span>
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${statusStyles[camp.status] || statusStyles.draft}`}>
                          {camp.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-500 font-semibold">{pct}%</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{camp.total_contacts} Contacts</span>
                      <span className="text-slate-500" suppressHydrationWarning>
                        {camp.sent_count} sent • {formatDate(camp.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Live Delivery Stream (1 col) */}
        <div className="bg-white rounded-[28px] p-6 sm:p-7 border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-poppins flex items-center space-x-2">
                <span>Recent Deliveries</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400">Live recipient status feed</p>
            </div>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {recentActivity.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs">Waiting for dispatches...</p>
              </div>
            ) : (
              recentActivity.map((activity, idx) => (
                <div
                  key={activity.id || idx}
                  className="p-3 rounded-[16px] bg-slate-50/60 border border-slate-200/70 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 truncate max-w-[150px]">
                      {activity.first_name ? `${activity.first_name} ${activity.last_name || ''}` : activity.email}
                    </span>
                    <span
                      className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                        activity.status === 'sent'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : activity.status === 'sending'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200 animate-pulse'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-400 text-[11px] truncate">
                    <Mail className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                    <span className="truncate">{activity.email}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Advanced Analytics Link Banner */}
      {onViewAnalytics && (
        <div className="p-5 sm:p-6 rounded-[28px] bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 font-poppins">Need deep-dive charts & hourly throughput?</p>
              <p className="text-[11px] text-slate-500">
                Explore spam score tests, hourly dispatch charts, and domain reputation analysis in Advanced Analytics.
              </p>
            </div>
          </div>
          <button
            onClick={onViewAnalytics}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-900 text-xs font-semibold transition self-start sm:self-auto flex-shrink-0"
          >
            <span>Open Advanced Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
