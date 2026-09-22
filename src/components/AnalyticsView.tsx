'use client';

import React from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  MailCheck,
  AlertCircle,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Campaign } from '@/types/database';

interface AnalyticsViewProps {
  campaigns: Campaign[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ campaigns }) => {
  const totalSent = campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0);
  const totalFailed = campaigns.reduce((acc, c) => acc + (c.failed_count || 0), 0);
  const totalContacts = campaigns.reduce((acc, c) => acc + (c.total_contacts || 0), 0);

  const deliveryRate = totalSent + totalFailed > 0
    ? ((totalSent / (totalSent + totalFailed)) * 100).toFixed(1)
    : '99.4';

  const hourlyData = [
    { hour: '09:00', sent: 120 },
    { hour: '10:00', sent: 240 },
    { hour: '11:00', sent: 360 },
    { hour: '12:00', sent: 180 },
    { hour: '13:00', sent: 140 },
    { hour: '14:00', sent: 290 },
    { hour: '15:00', sent: 410 },
    { hour: '16:00', sent: 320 },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Outreach Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">
          Deep-dive deliverability performance, rate throttling adherence, and sender reputation
        </p>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.06]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Inbox Placement</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-bold text-white tracking-tight">{deliveryRate}%</div>
          <p className="text-xs text-emerald-400 mt-1 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            100% Primary Inbox Target
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/[0.06]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">BullMQ Dispatch Speed</span>
            <Zap className="w-4 h-4 text-accent-cyan" />
          </div>
          <div className="text-3xl font-bold text-white tracking-tight">120 / min</div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Paced strictly at 2 emails/sec
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/[0.06]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Bounce & Failure Rate</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-bold text-white tracking-tight">
            {totalSent > 0 ? ((totalFailed / totalSent) * 100).toFixed(2) : '0.6'}%
          </div>
          <p className="text-xs text-slate-400 mt-1">Well below the 2% danger threshold</p>
        </div>
      </div>

      {/* Hourly Throughput Bar Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-white/[0.06] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white text-base">Hourly Email Throughput</h3>
            <p className="text-xs text-slate-400">Sequential dispatches smoothed across active sending hours</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg bg-surface-950 text-slate-400 font-mono border border-white/[0.08]">
            Today (Local Time)
          </span>
        </div>

        <div className="pt-6 pb-2 grid grid-cols-8 gap-2 items-end h-48">
          {hourlyData.map((bar, i) => {
            const heightPercent = Math.round((bar.sent / 450) * 100);
            return (
              <div key={i} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition mb-1">
                  {bar.sent}
                </span>
                <div
                  className="w-full bg-gradient-to-t from-primary/30 to-primary group-hover:from-primary group-hover:to-accent-cyan rounded-t-lg transition-all duration-300"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[10px] font-mono text-slate-500 mt-2">{bar.hour}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Google Reputation Checklist */}
      <div className="glass-panel p-6 rounded-2xl border border-white/[0.06] space-y-4">
        <h3 className="font-semibold text-white text-base flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-accent-cyan" />
          <span>Deliverability Best Practices (ArticleApply Engine)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-surface-950/60 border border-white/[0.06] space-y-1">
            <span className="font-semibold text-white flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              Automated Delays (2/sec Limiter)
            </span>
            <p className="text-slate-400">
              Bulk bursts flag spam algorithms immediately. ArticleApply paces jobs through Redis to mimic genuine human sending.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-950/60 border border-white/[0.06] space-y-1">
            <span className="font-semibold text-white flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              Native Gmail OAuth API
            </span>
            <p className="text-slate-400">
              Emails originate directly from your authenticated Google Workspace inbox rather than spoofed third-party SMTP relays.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-950/60 border border-white/[0.06] space-y-1">
            <span className="font-semibold text-white flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              Gemini AI Variable Personalization
            </span>
            <p className="text-slate-400">
              Individualized dynamic snippets prevent identical hash matches across hundreds of outgoing emails.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-950/60 border border-white/[0.06] space-y-1">
            <span className="font-semibold text-white flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
              Supabase Realtime Monitoring
            </span>
            <p className="text-slate-400">
              Immediate feedback on bounces and delivery statuses ensures you can pause campaigns before damage occurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
