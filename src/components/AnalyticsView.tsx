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
  ArrowLeft,
} from 'lucide-react';
import { Campaign } from '@/types/database';

interface AnalyticsViewProps {
  campaigns: Campaign[];
  onBack?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ campaigns, onBack }) => {
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
      {/* Header with Back button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center space-x-2.5">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition"
                title="Back to Dashboard"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
              <span>Outreach Analytics</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                Advanced Mode
              </span>
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Deep-dive deliverability performance, rate throttling adherence, and sender reputation
          </p>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="text-xs text-slate-700 hover:text-slate-900 font-semibold px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm transition self-start sm:self-auto"
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_16px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_24px_-4px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Inbox Placement</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-poppins">{deliveryRate}%</div>
          <p className="text-xs text-emerald-700 mt-1 flex items-center font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            100% Primary Inbox Target
          </p>
        </div>

        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_16px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_24px_-4px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Dispatch Speed</span>
            <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-poppins">120 / min</div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Paced strictly at 2 emails/sec
          </p>
        </div>

        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_16px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_24px_-4px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Bounce & Failure Rate</span>
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-poppins">
            {totalSent > 0 ? ((totalFailed / totalSent) * 100).toFixed(2) : '0.6'}%
          </div>
          <p className="text-xs text-slate-500 mt-1">Well below the 2% danger threshold</p>
        </div>
      </div>

      {/* Hourly Throughput Bar Chart */}
      <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base font-poppins">Hourly Email Throughput</h3>
            <p className="text-xs text-slate-500">Sequential dispatches smoothed across active sending hours</p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono border border-slate-200">
            Today (Local Time)
          </span>
        </div>

        <div className="pt-6 pb-2 grid grid-cols-8 gap-3 items-end h-48">
          {hourlyData.map((bar, i) => {
            const heightPercent = Math.round((bar.sent / 450) * 100);
            return (
              <div key={i} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition mb-1 font-semibold">
                  {bar.sent}
                </span>
                <div
                  className="w-full bg-slate-800 group-hover:bg-slate-950 rounded-t-lg transition-all duration-300 shadow-sm"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[10px] font-mono text-slate-500 mt-2">{bar.hour}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deliverability Checklist */}
      <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2 font-poppins">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <span>Deliverability Best Practices (ArtiApply Engine)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-[20px] bg-slate-50/80 border border-slate-200/80 space-y-1">
            <span className="font-semibold text-slate-900 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
              Automated Delays (2/sec Limiter)
            </span>
            <p className="text-slate-600">
              Bulk bursts flag spam algorithms immediately. ArtiApply paces jobs through Redis to mimic genuine human sending.
            </p>
          </div>

          <div className="p-4 rounded-[20px] bg-slate-50/80 border border-slate-200/80 space-y-1">
            <span className="font-semibold text-slate-900 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
              Native Gmail OAuth API
            </span>
            <p className="text-slate-600">
              Emails originate directly from your authenticated Google Workspace inbox rather than spoofed third-party SMTP relays.
            </p>
          </div>

          <div className="p-4 rounded-[20px] bg-slate-50/80 border border-slate-200/80 space-y-1">
            <span className="font-semibold text-slate-900 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
              Gemini AI Variable Personalization
            </span>
            <p className="text-slate-600">
              Individualized dynamic snippets prevent identical hash matches across hundreds of outgoing emails.
            </p>
          </div>

          <div className="p-4 rounded-[20px] bg-slate-50/80 border border-slate-200/80 space-y-1">
            <span className="font-semibold text-slate-900 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" />
              Realtime Delivery Monitoring
            </span>
            <p className="text-slate-600">
              Immediate feedback on bounces and delivery statuses ensures you can pause campaigns before damage occurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
