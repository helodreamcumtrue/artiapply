'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  Database,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Copy,
  Terminal,
  ShieldCheck,
  FileText,
  Check,
} from 'lucide-react';

interface SettingsViewProps {
  isGoogleConnected: boolean;
  isRedisConnected: boolean;
  userEmail?: string | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isGoogleConnected,
  isRedisConnected,
  userEmail,
}) => {
  const [queueStatus, setQueueStatus] = useState<any>(null);
  const [isCheckingQueue, setIsCheckingQueue] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const copyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const checkQueueHealth = async () => {
    setIsCheckingQueue(true);
    try {
      const res = await fetch('/api/queue/status');
      const data = await res.json();
      setQueueStatus(data);
    } catch (err) {
      setQueueStatus({ connected: false, error: 'Could not connect to API' });
    } finally {
      setIsCheckingQueue(false);
    }
  };

  useEffect(() => {
    checkQueueHealth();
  }, []);

  const envSample = `# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Google OAuth & Gmail API (Send permissions)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Gemini AI
GEMINI_API_KEY=AIzaSy...

# BullMQ Redis
REDIS_URL=redis://localhost:6379`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">System Settings & Integrations</h1>
        <p className="text-xs text-slate-400 mt-1">
          Verify connected services: Google OAuth, Gmail API, Supabase Database, Gemini AI, and BullMQ Redis
        </p>
      </div>

      {/* Service Cards */}
      <div className="space-y-4">
        {/* 1. Google OAuth & Gmail API */}
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-white text-sm">Google Gmail API & OAuth</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      isGoogleConnected
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {isGoogleConnected ? 'Connected & Authorized' : 'Demo / Standby'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scopes: <code className="text-slate-300 font-mono text-[11px]">https://www.googleapis.com/auth/gmail.send</code> with offline refresh token
                </p>
              </div>
            </div>

            <a
              href="/api/auth/google"
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold transition self-start sm:self-auto"
            >
              <span>{isGoogleConnected ? 'Reconnect Account' : 'Connect Google Workspace'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {userEmail && (
            <div className="text-xs text-slate-300 bg-surface-950/60 p-2.5 rounded-xl border border-white/[0.04]">
              Connected Gmail Account: <span className="font-mono text-primary-light">{userEmail}</span>
            </div>
          )}
        </div>

        {/* 2. BullMQ & Redis Rate Limiter */}
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-white text-sm">BullMQ Queue & Redis Service</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      queueStatus?.connected
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    }`}
                  >
                    {queueStatus?.connected ? 'Redis Online' : 'Simulation Mode Active'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enforces strict <strong className="text-slate-200">2 emails / sec</strong> rate-limiter to protect Gmail domain reputation
                </p>
              </div>
            </div>

            <button
              onClick={checkQueueHealth}
              disabled={isCheckingQueue}
              className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium transition flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingQueue ? 'animate-spin' : ''}`} />
              <span>Ping Queue</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="p-2.5 rounded-xl bg-surface-950/60 border border-white/[0.04]">
              <span className="text-slate-400 text-[10px] block">Waiting Jobs</span>
              <span className="font-mono text-sm font-bold text-white">{queueStatus?.counts?.waiting ?? 0}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-950/60 border border-white/[0.04]">
              <span className="text-slate-400 text-[10px] block">Active In-Flight</span>
              <span className="font-mono text-sm font-bold text-cyan-400">{queueStatus?.counts?.active ?? 0}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-950/60 border border-white/[0.04]">
              <span className="text-slate-400 text-[10px] block">Completed Jobs</span>
              <span className="font-mono text-sm font-bold text-emerald-400">{queueStatus?.counts?.completed ?? 0}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-950/60 border border-white/[0.04]">
              <span className="text-slate-400 text-[10px] block">Failed Jobs</span>
              <span className="font-mono text-sm font-bold text-rose-400">{queueStatus?.counts?.failed ?? 0}</span>
            </div>
          </div>
        </div>

        {/* 3. Google Gemini AI Engine */}
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-accent-purple/10 text-accent-purple flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-white text-sm">Google Gemini AI Engine</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-purple/10 text-accent-purple border border-accent-purple/20">
                  gemini-2.5-flash
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generates high-reply subject line alternatives and preserves email personalization variable pills
              </p>
            </div>
          </div>
        </div>

        {/* 4. Supabase PostgreSQL & Realtime */}
        <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-white text-sm">Supabase Database & Realtime</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  PostgreSQL + RLS + Realtime
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Live WebSocket progress updates for contacts and campaigns table changes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Google OAuth Verification & Legal Compliance Card */}
      <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary-light flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-white text-base">Google Cloud OAuth Verification & Legal Links</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready for Review
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Paste these verified URLs into your Google Cloud Console OAuth Consent Screen configuration.
              </p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              id: 'privacy',
              title: 'Privacy Policy URL',
              url: 'https://artiapply.vercel.app/privacy',
              desc: 'Explains Google Limited Use policy and data protection.',
            },
            {
              id: 'terms',
              title: 'Terms of Service URL',
              url: 'https://artiapply.vercel.app/terms',
              desc: 'Anti-spam rules, acceptable use policy, and warranties.',
            },
            {
              id: 'unsubscribe',
              title: 'Unsubscribe / Opt-Out Endpoint',
              url: 'https://artiapply.vercel.app/unsubscribe',
              desc: 'One-click contact removal supporting CAN-SPAM & GDPR.',
            },
            {
              id: 'callback',
              title: 'Authorized Redirect URI',
              url: 'https://artiapply.vercel.app/auth/callback',
              desc: 'Required in Google Cloud Credentials for OAuth token handshake.',
            },
          ].map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-surface-950/60 border border-white/[0.06] flex items-center justify-between space-x-3"
            >
              <div className="truncate">
                <div className="flex items-center space-x-2">
                  <FileText className="w-3.5 h-3.5 text-primary-light flex-shrink-0" />
                  <p className="text-xs font-medium text-slate-200">{item.title}</p>
                </div>
                <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">{item.url}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>

              <div className="flex items-center space-x-1.5 flex-shrink-0">
                <button
                  onClick={() => copyLink(item.url, item.id)}
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition"
                  title="Copy URL"
                >
                  {copiedLink === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition"
                  title="Open URL in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Regulatory Badges */}
        <div className="p-3.5 rounded-xl bg-surface-950/40 border border-white/[0.04] flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center space-x-1.5 text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Google API Limited Use Certified</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center space-x-1.5 text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>CAN-SPAM 1-Click Opt-Out</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center space-x-1.5 text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>GDPR Right to Erasure</span>
          </span>
        </div>
      </div>

      {/* Environment Setup Guide */}
      <div className="glass-panel p-6 rounded-2xl border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-primary-light" />
            <h3 className="font-semibold text-white text-sm">Environment Variables Blueprint (.env.local)</h3>
          </div>
          <button
            onClick={handleCopyEnv}
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] transition flex items-center space-x-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copiedEnv ? 'Copied!' : 'Copy Blueprint'}</span>
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-surface-950/80 border border-white/[0.06] text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed">
          {envSample}
        </pre>

        <div className="p-3.5 rounded-xl bg-surface-950/40 border border-white/[0.04] text-xs text-slate-400 space-y-1">
          <span className="font-semibold text-slate-300 block">💡 Quick Start Commands:</span>
          <p>• Start Redis container: <code className="text-accent-cyan font-mono">docker-compose up -d</code></p>
          <p>• Run BullMQ background worker: <code className="text-accent-cyan font-mono">npm run worker</code></p>
          <p>• Run Next.js web application: <code className="text-accent-cyan font-mono">npm run dev</code></p>
        </div>
      </div>
    </div>
  );
};
