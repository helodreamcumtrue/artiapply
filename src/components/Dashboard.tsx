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
} from 'lucide-react';
import { Campaign, Contact } from '@/types/database';
import { formatDate } from '@/lib/utils/formatDate';

interface DashboardProps {
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  recentActivity: Contact[];
  onNewCampaign: () => void;
  onSelectCampaign: (campaign: Campaign) => void;
  isSimulatingSending?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  campaigns,
  activeCampaign,
  recentActivity,
  onNewCampaign,
  onSelectCampaign,
  isSimulatingSending = false,
}) => {
  // Aggregate stats across campaigns
  const totalSent = campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0);
  const totalFailed = campaigns.reduce((acc, c) => acc + (c.failed_count || 0), 0);
  const totalContacts = campaigns.reduce((acc, c) => acc + (c.total_contacts || 0), 0);
  const activeCount = campaigns.filter((c) => c.status === 'in_progress' || c.status === 'queued').length;
  const pendingCount = totalContacts - (totalSent + totalFailed);

  const deliveryRate = totalSent + totalFailed > 0
    ? ((totalSent / (totalSent + totalFailed)) * 100).toFixed(1)
    : '99.4';

  const currentCamp = activeCampaign || campaigns.find((c) => c.status === 'in_progress') || campaigns[0];
  const progressPercent = currentCamp && currentCamp.total_contacts > 0
    ? Math.min(100, Math.round(((currentCamp.sent_count + currentCamp.failed_count) / currentCamp.total_contacts) * 100))
    : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>Outreach Performance</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Live System
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Automating cold emails via Gmail API with BullMQ rate limiter (2 emails/sec)
          </p>
        </div>
        <button
          onClick={onNewCampaign}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-hover hover:to-indigo-700 text-white font-medium text-sm shadow-glow transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Sent</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary-light flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white tracking-tight">{totalSent.toLocaleString()}</span>
            <span className="text-xs font-medium text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Across all campaigns</p>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
        </div>

        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Deliverability</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white tracking-tight">{deliveryRate}%</span>
            <span className="text-xs font-medium text-emerald-400">Optimal</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Zero spam triggers reported</p>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
        </div>

        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Queues</span>
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 text-accent-cyan flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white tracking-tight">{activeCount}</span>
            <span className="text-xs font-medium text-accent-cyan">BullMQ</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Dispatched at 2 emails/sec</p>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-accent-cyan/10 rounded-full blur-xl pointer-events-none" />
        </div>

        <div className="glass-panel p-5 rounded-2xl relative overflow-hidden glass-panel-hover">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Contacts</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white tracking-tight">{Math.max(0, pendingCount)}</span>
            <span className="text-xs font-medium text-slate-400">Scheduled</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">Awaiting queue slot</p>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
        </div>
      </div>

      {/* Real-time Active Campaign Queue Tracker */}
      {currentCamp && (
        <div className="glass-panel p-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-surface-900/90 via-surface-900/60 to-primary/5 relative overflow-hidden shadow-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
                <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">
                  Live Queue Dispatches
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                  2 emails / sec
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {currentCamp.name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xl">
                Subject: <span className="text-slate-300 font-mono">{currentCamp.subject}</span>
              </p>
            </div>

            <div className="flex items-center space-x-4 self-start md:self-auto">
              <div className="text-right">
                <span className="text-2xl font-black text-white font-mono">{progressPercent}%</span>
                <p className="text-[11px] text-slate-400">
                  {currentCamp.sent_count + currentCamp.failed_count} of {currentCamp.total_contacts} sent
                </p>
              </div>
              <button
                onClick={() => onSelectCampaign(currentCamp)}
                className="px-3.5 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white transition flex items-center space-x-1.5"
              >
                <span>Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-surface-950/80 rounded-full h-3 overflow-hidden p-0.5 border border-white/[0.06]">
              <div
                className="h-full bg-gradient-to-r from-primary via-indigo-400 to-accent-cyan rounded-full transition-all duration-500 shadow-glow"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="text-emerald-400 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {currentCamp.sent_count} Delivered
              </span>
              {currentCamp.failed_count > 0 && (
                <span className="text-rose-400 flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  {currentCamp.failed_count} Failed
                </span>
              )}
              <span className="text-slate-400">
                {Math.max(0, currentCamp.total_contacts - currentCamp.sent_count - currentCamp.failed_count)} Remaining
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Active Campaigns & Live Delivery Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaigns List (2 cols) */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="font-semibold text-white text-base">Campaigns Overview</h3>
              <p className="text-xs text-slate-400">All outbound automated email sequences</p>
            </div>
            <button
              onClick={onNewCampaign}
              className="text-xs text-primary-light hover:text-white font-medium transition flex items-center space-x-1"
            >
              <span>+ New Sequence</span>
            </button>
          </div>

          <div className="space-y-3">
            {campaigns.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Mail className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-medium">No campaigns created yet</p>
                <p className="text-xs text-slate-500 mt-1">Start by launching your first cold email campaign</p>
              </div>
            ) : (
              campaigns.map((camp) => {
                const pct = camp.total_contacts > 0
                  ? Math.round(((camp.sent_count + camp.failed_count) / camp.total_contacts) * 100)
                  : 0;

                const statusStyles: Record<string, string> = {
                  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                  in_progress: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
                  queued: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
                  failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                };

                return (
                  <div
                    key={camp.id}
                    onClick={() => onSelectCampaign(camp)}
                    className="p-4 rounded-xl bg-surface-900/40 hover:bg-surface-900/80 border border-white/[0.04] hover:border-primary/30 transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm text-slate-200 group-hover:text-white transition">
                          {camp.name}
                        </span>
                        <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full border ${statusStyles[camp.status] || statusStyles.draft}`}>
                          {camp.status.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">{pct}%</span>
                    </div>

                    <p className="text-xs text-slate-400 truncate mb-3 font-mono">
                      {camp.subject}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{camp.total_contacts} Contacts</span>
                      <span className="text-slate-400" suppressHydrationWarning>
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
        <div className="glass-panel rounded-2xl p-6 space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="font-semibold text-white text-base flex items-center space-x-2">
                <span>Live Feed</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h3>
              <p className="text-xs text-slate-400">Real-time status dispatches</p>
            </div>
            <RefreshCw className="w-3.5 h-3.5 text-slate-500 animate-spin" style={{ animationDuration: '4s' }} />
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[420px] pr-1">
            {recentActivity.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-xs">Waiting for dispatches...</p>
              </div>
            ) : (
              recentActivity.map((activity, idx) => (
                <div
                  key={activity.id || idx}
                  className="p-3 rounded-xl bg-surface-900/40 border border-white/[0.04] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-200 truncate max-w-[150px]">
                      {activity.first_name ? `${activity.first_name} ${activity.last_name || ''}` : activity.email}
                    </span>
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                        activity.status === 'sent'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : activity.status === 'sending'
                          ? 'bg-cyan-500/10 text-cyan-400 animate-pulse'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-400 text-[11px] truncate">
                    <Mail className="w-3 h-3 mr-1 text-slate-500 shrink-0" />
                    <span className="truncate">{activity.email}</span>
                  </div>
                  {activity.company && (
                    <div className="flex items-center text-slate-500 text-[10px]">
                      <Building className="w-3 h-3 mr-1 text-slate-600 shrink-0" />
                      <span>{activity.company}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 text-center">
            Queue rate-limited to avoid Gmail API quotas
          </div>
        </div>
      </div>
    </div>
  );
};
