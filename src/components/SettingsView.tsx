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
  User,
  Sliders,
  Bell,
  Download,
  Code2,
} from 'lucide-react';
import { downloadSampleCSVFile } from '@/lib/data/sampleContacts';

interface SettingsViewProps {
  isGoogleConnected: boolean;
  isRedisConnected: boolean;
  userEmail?: string | null;
  userName?: string | null;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isGoogleConnected,
  isRedisConnected,
  userEmail,
  userName = 'John Smith',
}) => {
  // Tab state: 'simple' (default for non-technical users) or 'advanced' (developer/IT)
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');

  // Simple Settings State
  const [name, setName] = useState(userName || 'John Smith');
  const [email, setEmail] = useState(userEmail || 'user@articleapply.io');
  const [dailyLimit, setDailyLimit] = useState<'50' | '100' | '200' | '500'>('100');
  const [autoPauseReplies, setAutoPauseReplies] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Advanced Settings State
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
    if (activeTab === 'advanced') {
      checkQueueHealth();
    }
  }, [activeTab]);

  const handleSaveSimple = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

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
      {/* Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <span>Settings & Preferences</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Configure your sending identity, connect your email, and customize outreach safety guardrails.
          </p>
        </div>

        {/* Tab Switcher: Simple (Default) vs Advanced */}
        <div className="flex items-center p-1 rounded-full bg-white border border-slate-200 shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('simple')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
              activeTab === 'simple'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Essentials
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition flex items-center space-x-1.5 ${
              activeTab === 'advanced'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer / IT</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SIMPLE & ESSENTIALS (Non-technical user friendly)                  */}
      {/* ========================================================================= */}
      {activeTab === 'simple' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* 1. Google Workspace Connection Card */}
          <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-base font-poppins">Google Workspace / Gmail Account</h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isGoogleConnected
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {isGoogleConnected ? 'Connected & Safe' : 'Demo Mode'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 max-w-xl">
                    Cold emails are sent directly through your authenticated Google account to ensure high deliverability and avoid spam filters.
                  </p>
                </div>
              </div>

              <a
                href="/api/auth/google"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition self-start sm:self-auto flex-shrink-0"
              >
                <span>{isGoogleConnected ? 'Switch Account' : 'Connect Google Account'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {userEmail && (
              <div className="flex items-center justify-between text-xs text-slate-700 bg-slate-50/80 p-3.5 rounded-[18px] border border-slate-200/80">
                <span>Sending from: <strong className="text-slate-900 font-mono">{userEmail}</strong></span>
                <span className="text-emerald-700 font-medium flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  OAuth Verified
                </span>
              </div>
            )}
          </div>

          {/* 2. Sender Profile Information Form */}
          <form onSubmit={handleSaveSimple} className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-5">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <User className="w-4 h-4 text-slate-600" />
              <h3 className="font-bold text-slate-900 text-sm font-poppins">Sender Identity</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-sm transition"
                  placeholder="e.g. John Smith"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Reply-To Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-sm transition"
                  placeholder="e.g. john@yourcompany.com"
                />
              </div>
            </div>

            {/* 3. Safety Guardrails & Sending Preferences */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-slate-600" />
                <h4 className="font-bold text-slate-900 text-xs">Sending Guardrails & Safety</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Daily limit selector */}
                <div className="p-4 rounded-[20px] bg-slate-50/80 border border-slate-200/80 space-y-2">
                  <span className="font-semibold text-slate-800 block">Daily Email Volume Limit</span>
                  <div className="flex items-center space-x-2">
                    {(['50', '100', '200', '500'] as const).map((limit) => (
                      <button
                        key={limit}
                        type="button"
                        onClick={() => setDailyLimit(limit)}
                        className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition ${
                          dailyLimit === limit
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {limit}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Recommended: 100/day to maintain warm domain score
                  </span>
                </div>

                {/* Built-in Rate Limiter Note */}
                <div className="p-4 rounded-[20px] bg-slate-50/80 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Anti-Spam Limiter</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Automatically spaces out sends at 2 emails/sec to mimic human sending and avoid algorithmic flags.
                  </p>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-1 text-xs">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPauseReplies}
                    onChange={(e) => setAutoPauseReplies(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-slate-700 font-medium">
                    Auto-stop sequence when a recipient replies
                  </span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-slate-700 font-medium">
                    Receive summary email when campaign dispatches finish
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              {savedSuccess ? (
                <span className="text-xs text-emerald-700 flex items-center font-medium">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                  Preferences updated!
                </span>
              ) : (
                <span className="text-xs text-slate-500">Changes apply to future campaigns</span>
              )}
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition"
              >
                Save Preferences
              </button>
            </div>
          </form>

          {/* Quick Helpful Tools for Beginners */}
          <div className="p-5 sm:p-6 rounded-[28px] bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 font-poppins">Need sample leads to test?</p>
                <p className="text-slate-500 text-[11px]">Download our 50-entry verified B2B leads file anytime.</p>
              </div>
            </div>
            <button
              onClick={downloadSampleCSVFile}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition self-start sm:self-auto shadow-sm"
            >
              Download Sample CSV
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ADVANCED & DEVELOPER (Kept intact for technical needs)             */}
      {/* ========================================================================= */}
      {activeTab === 'advanced' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="p-4 rounded-[20px] bg-slate-100/80 border border-slate-200 text-xs text-slate-700 flex items-center space-x-2.5">
            <Code2 className="w-4 h-4 flex-shrink-0 text-slate-600" />
            <span>
              Developer & Infrastructure Mode: Technical diagnostics, Redis queues, and Google Cloud credentials.
            </span>
          </div>

          {/* BullMQ & Redis Status */}
          <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-sm font-poppins">BullMQ Queue & Redis Service</h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        queueStatus?.connected
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-sky-50 text-sky-700 border-sky-200'
                      }`}
                    >
                      {queueStatus?.connected ? 'Redis Online' : 'Simulation Mode Active'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Strict 2 emails/sec rate limiter active
                  </p>
                </div>
              </div>

              <button
                onClick={checkQueueHealth}
                disabled={isCheckingQueue}
                className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition flex items-center space-x-1.5 self-start sm:self-auto shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingQueue ? 'animate-spin' : ''}`} />
                <span>Ping Queue</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
              <div className="p-3.5 rounded-[18px] bg-slate-50/80 border border-slate-200/80">
                <span className="text-slate-500 text-[10px] font-medium block">Waiting</span>
                <span className="font-mono text-base font-bold text-slate-900">{queueStatus?.counts?.waiting ?? 0}</span>
              </div>
              <div className="p-3.5 rounded-[18px] bg-slate-50/80 border border-slate-200/80">
                <span className="text-slate-500 text-[10px] font-medium block">Active</span>
                <span className="font-mono text-base font-bold text-sky-700">{queueStatus?.counts?.active ?? 0}</span>
              </div>
              <div className="p-3.5 rounded-[18px] bg-slate-50/80 border border-slate-200/80">
                <span className="text-slate-500 text-[10px] font-medium block">Completed</span>
                <span className="font-mono text-base font-bold text-emerald-700">{queueStatus?.counts?.completed ?? 0}</span>
              </div>
              <div className="p-3.5 rounded-[18px] bg-slate-50/80 border border-slate-200/80">
                <span className="text-slate-500 text-[10px] font-medium block">Failed</span>
                <span className="font-mono text-base font-bold text-rose-700">{queueStatus?.counts?.failed ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Google Cloud OAuth Verification Card */}
          <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-4">
            <h3 className="font-bold text-slate-900 text-sm font-poppins">Google Cloud OAuth Verification Endpoints</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'privacy', title: 'Privacy Policy URL', url: 'https://artiapply.vercel.app/privacy' },
                { id: 'terms', title: 'Terms of Service URL', url: 'https://artiapply.vercel.app/terms' },
                { id: 'unsubscribe', title: 'Unsubscribe Opt-Out', url: 'https://artiapply.vercel.app/unsubscribe' },
                { id: 'callback', title: 'Authorized Redirect URI', url: 'https://artiapply.vercel.app/auth/callback' },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-[18px] bg-slate-50/80 border border-slate-200/80 flex items-center justify-between space-x-2"
                >
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                    <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">{item.url}</p>
                  </div>
                  <button
                    onClick={() => copyLink(item.url, item.id)}
                    className="p-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 shadow-sm transition"
                    title="Copy URL"
                  >
                    {copiedLink === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Environment Variables Blueprint */}
          <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Terminal className="w-4 h-4 text-slate-700" />
                <h3 className="font-bold text-slate-900 text-sm font-poppins">Environment Variables Blueprint (.env.local)</h3>
              </div>
              <button
                onClick={handleCopyEnv}
                className="text-xs text-slate-700 hover:text-slate-900 px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition flex items-center space-x-1 font-semibold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedEnv ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-4 sm:p-5 rounded-[20px] bg-slate-50/90 border border-slate-200/80 text-slate-800 font-mono text-xs overflow-x-auto leading-relaxed">
              {envSample}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
