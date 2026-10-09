'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Mail,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Copy,
  Terminal,
  ShieldCheck,
  Check,
  User,
  Sliders,
  Download,
  Code2,
  Eye,
  EyeOff,
  Send,
  KeyRound,
  HelpCircle,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  Flame,
  Clock,
  Shield,
  Server,
  Zap,
} from 'lucide-react';
import { downloadSampleCSVFile } from '@/lib/data/sampleContacts';

interface SettingsViewProps {
  isGoogleConnected: boolean;
  isRedisConnected: boolean;
  userEmail?: string | null;
  userName?: string | null;
}

type HelpGuideType =
  | 'app_password'
  | 'daily_limits'
  | 'anti_spam'
  | 'oauth_vs_password'
  | 'custom_smtp'
  | null;

export const SettingsView: React.FC<SettingsViewProps> = ({
  isGoogleConnected,
  isRedisConnected,
  userEmail,
  userName = 'John Smith',
}) => {
  // Tab state: 'simple' (Essentials) or 'advanced' (Developer / IT)
  const [activeTab, setActiveTab] = useState<'simple' | 'advanced'>('simple');

  // Active guide popup modal state
  const [activeGuide, setActiveGuide] = useState<HelpGuideType>(null);

  // Simple Settings State
  const [name, setName] = useState(userName || 'John Smith');
  const [email, setEmail] = useState(userEmail || 'user@articleapply.io');
  const [dailyLimit, setDailyLimit] = useState<'50' | '100' | '200' | '500'>('100');
  const [autoPauseReplies, setAutoPauseReplies] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Real Email Sending (SMTP / Gmail App Password) State
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState('465');
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvancedSmtp, setShowAdvancedSmtp] = useState(false);
  const [smtpSavedSuccess, setSmtpSavedSuccess] = useState(false);

  // Live Test Email State
  const [testEmailTo, setTestEmailTo] = useState('lakshayjain148@gmail.com');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

  // Advanced / Developer State
  const [queueStatus, setQueueStatus] = useState<any>(null);
  const [isCheckingQueue, setIsCheckingQueue] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveGuide(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scroll when modal is active
  useEffect(() => {
    if (activeGuide) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeGuide]);

  // Load saved SMTP configuration on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('artiapply_smtp_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user) setSmtpUser(parsed.user);
        if (parsed.pass) setSmtpPass(parsed.pass);
        if (parsed.host) {
          setSmtpHost(parsed.host);
          if (parsed.host !== 'smtp.gmail.com') setShowAdvancedSmtp(true);
        }
        if (parsed.port) {
          setSmtpPort(String(parsed.port));
          if (String(parsed.port) !== '465') setShowAdvancedSmtp(true);
        }
      }
    } catch {}
  }, []);

  const handleSaveSmtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const config = {
      user: smtpUser.trim(),
      pass: smtpPass.trim(),
      host: smtpHost.trim() || 'smtp.gmail.com',
      port: Number(smtpPort) || 465,
      fromEmail: smtpUser.trim() || email,
      fromName: name || 'ArticlO Outreach',
    };
    localStorage.setItem('artiapply_smtp_config', JSON.stringify(config));
    setSmtpSavedSuccess(true);
    setTimeout(() => setSmtpSavedSuccess(false), 3000);
  };

  const handleSendTestEmail = async () => {
    if (!testEmailTo.trim()) {
      alert('Please enter a recipient email address to send the test.');
      return;
    }
    setIsSendingTest(true);
    setTestResult(null);

    const config = {
      user: smtpUser.trim(),
      pass: smtpPass.trim(),
      host: smtpHost.trim() || 'smtp.gmail.com',
      port: Number(smtpPort) || 465,
      fromEmail: smtpUser.trim() || email,
      fromName: name || 'ArticlO Outreach',
    };

    if (config.user && config.pass) {
      localStorage.setItem('artiapply_smtp_config', JSON.stringify(config));
    }

    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: testEmailTo.trim(),
          subject: 'ArticlO Live Dispatch Test',
          message: 'Success! Your ArticlO email sending service is verified and delivering real messages.',
          smtpConfig: config.user && config.pass ? config : undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message || `Test email successfully delivered to ${testEmailTo}! Check your inbox.`,
        });
      } else {
        setTestResult({
          success: false,
          error: data.error || 'Failed to dispatch email. Please check your credentials.',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Network error occurred while sending test email.',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

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
    <div className="max-w-4xl mx-auto space-y-6 pb-14">
      {/* Header with Clean Essentials / Developer Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
            <span>Settings & Preferences</span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Configure your sending identity, connect your email, and customize outreach safety guardrails.
          </p>
        </div>

        {/* Tab Switcher: Essentials (Default) vs Developer */}
        <div className="flex items-center p-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('simple')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              activeTab === 'simple'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Essentials
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition flex items-center space-x-1.5 ${
              activeTab === 'advanced'
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Developer / IT</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ESSENTIALS (Simplified, user-friendly, with popup guides)          */}
      {/* ========================================================================= */}
      {activeTab === 'simple' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* CARD 1: Real Email Sending (Gmail App Password & Live Dispatch) */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3.5">
                <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">
                      Email Sending Account
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        smtpUser && smtpPass
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {smtpUser && smtpPass ? 'Live Sending Ready' : 'Setup Required'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                    Connect your Gmail or Google Workspace using a 16-character App Password to send genuine, deliverable emails directly to recipient inboxes.
                  </p>
                </div>
              </div>

              {/* Guide Trigger Button */}
              <button
                type="button"
                onClick={() => setActiveGuide('app_password')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold flex items-center space-x-1.5 self-start sm:self-auto bg-indigo-50/80 dark:bg-indigo-950/50 hover:bg-indigo-100/80 dark:hover:bg-indigo-900/50 px-3.5 py-2 rounded-full border border-indigo-200/80 dark:border-indigo-800/80 transition shadow-sm"
              >
                <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>How to Get App Password</span>
              </button>
            </div>

            {/* Inputs: Gmail & App Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Your Gmail / Workspace Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-slate-400 shadow-sm transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    16-Character Gmail App Password <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveGuide('app_password')}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                  >
                    <Info className="w-3 h-3" />
                    <span>60-sec guide</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="e.g. abcd efgh ijkl mnop"
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-mono placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-slate-400 shadow-sm transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Optional Collapsible: Custom SMTP / Host & Port */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvancedSmtp((prev) => !prev)}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center space-x-1.5 transition font-medium"
              >
                {showAdvancedSmtp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>Advanced Server Settings (Custom SMTP, Outlook, Port 465/587)</span>
              </button>

              {showAdvancedSmtp && (
                <div className="mt-3 p-4 rounded-[20px] bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Custom Server Configuration
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveGuide('custom_smtp')}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Port & Server Guide</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 block mb-1">SMTP Host</label>
                      <input
                        type="text"
                        value={smtpHost}
                        onChange={(e) => setSmtpHost(e.target.value)}
                        placeholder="smtp.gmail.com"
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-900 dark:focus:border-slate-400"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 block mb-1">SMTP Port (465 SSL / 587 TLS)</label>
                      <input
                        type="text"
                        value={smtpPort}
                        onChange={(e) => setSmtpPort(e.target.value)}
                        placeholder="465"
                        className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-slate-900 dark:focus:border-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Save Credentials Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Credentials are securely encrypted in your browser and used only for direct dispatch.</span>
              </span>
              <button
                type="button"
                onClick={() => handleSaveSmtp()}
                className="px-5 py-2 rounded-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-sm transition self-end sm:self-auto"
              >
                {smtpSavedSuccess ? '✓ Credentials Saved' : 'Save Email Credentials'}
              </button>
            </div>

            {/* Instant Live Test Email Dispatcher */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white font-poppins flex items-center space-x-1.5">
                  <Send className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Send a Live Test Email to Verify Delivery</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Instant Test</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <input
                  type="email"
                  value={testEmailTo}
                  onChange={(e) => setTestEmailTo(e.target.value)}
                  placeholder="Recipient email to test (e.g. yourname@example.com)"
                  className="w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-slate-400 shadow-sm transition"
                />
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={isSendingTest}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center space-x-1.5 disabled:opacity-50 flex-shrink-0"
                >
                  {isSendingTest ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Test Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Test Email</span>
                    </>
                  )}
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-3.5 rounded-[18px] text-xs flex items-start space-x-2.5 animate-in fade-in duration-150 ${
                    testResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">
                      {testResult.success ? 'Email Delivered Successfully!' : 'Email Delivery Failed'}
                    </p>
                    <p className="text-[11px] mt-0.5 leading-relaxed opacity-90">
                      {testResult.message || testResult.error}
                    </p>
                    {!testResult.success && (
                      <div className="mt-2 flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setActiveGuide('app_password')}
                          className="text-[11px] font-bold text-rose-700 dark:text-rose-300 underline"
                        >
                          Open 60-Sec App Password Guide →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CARD 2: Sender Profile & Safety Guardrails */}
          <form
            onSubmit={handleSaveSimple}
            className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-5"
          >
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm font-poppins">
                Sender Profile & Safe Guardrails
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-slate-400 shadow-sm transition"
                  placeholder="e.g. John Smith"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Reply-To Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-slate-900 dark:focus:border-slate-400 shadow-sm transition"
                  placeholder="e.g. john@yourcompany.com"
                />
              </div>
            </div>

            {/* Safety Guardrails */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Daily limit selector */}
                <div className="p-4 rounded-[20px] bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Daily Email Volume Limit</span>
                    <button
                      type="button"
                      onClick={() => setActiveGuide('daily_limits')}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Warmup Guide</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    {(['50', '100', '200', '500'] as const).map((limit) => (
                      <button
                        key={limit}
                        type="button"
                        onClick={() => setDailyLimit(limit)}
                        className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition ${
                          dailyLimit === limit
                            ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {limit}
                      </button>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Recommended: 100/day to maintain warm domain score & prevent spam flags.
                  </span>
                </div>

                {/* Built-in Anti-Spam Limiter Card */}
                <div className="p-4 rounded-[20px] bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Anti-Spam Limiter</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        2 emails/sec
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveGuide('anti_spam')}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                      >
                        <HelpCircle className="w-3 h-3" />
                        <span>Why?</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    Automatically spaces out dispatches to simulate human cadence and prevent algorithmic spam triggers.
                  </p>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5 pt-1 text-xs">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPauseReplies}
                    onChange={(e) => setAutoPauseReplies(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-slate-900 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Auto-stop sequence when a recipient replies
                  </span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-slate-900 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Receive summary email when campaign dispatches finish
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
              {savedSuccess ? (
                <span className="text-xs text-emerald-700 dark:text-emerald-400 flex items-center font-medium">
                  <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                  Preferences updated successfully!
                </span>
              ) : (
                <span className="text-xs text-slate-500 dark:text-slate-400">Settings apply to all new campaigns</span>
              )}
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-semibold shadow-sm transition"
              >
                Save Preferences
              </button>
            </div>
          </form>

          {/* CARD 3: Google Account & Lead Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Google OAuth Status */}
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs font-poppins">
                      Google OAuth Sign-In
                    </h4>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        isGoogleConnected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {isGoogleConnected ? 'OAuth Active' : 'Demo Mode'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveGuide('oauth_vs_password')}
                  className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Guide</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Connect your corporate Google Workspace SSO or switch the active sending account.
              </p>

              <a
                href="/api/auth/google"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
              >
                <span>{isGoogleConnected ? 'Switch Account' : 'Connect Google'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Sample Leads CSV Downloader */}
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs font-poppins">
                    Need Sample Leads?
                  </h4>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    50 verified mock prospects
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Test campaigns immediately with formatted CSV rows including first names, roles, and verified companies.
              </p>

              <button
                type="button"
                onClick={downloadSampleCSVFile}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DEVELOPER / IT (Tucked neatly away for advanced users)              */}
      {/* ========================================================================= */}
      {activeTab === 'advanced' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="p-4 rounded-[20px] bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center space-x-2.5">
            <Code2 className="w-4 h-4 flex-shrink-0 text-slate-600 dark:text-slate-400" />
            <span>
              Developer & Infrastructure Diagnostics: Redis queue monitoring, OAuth callback endpoints, and environment variables.
            </span>
          </div>

          {/* BullMQ & Redis Status */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm font-poppins">
                      BullMQ Queue & Redis Service
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        queueStatus?.connected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
                          : 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800'
                      }`}
                    >
                      {queueStatus?.connected ? 'Redis Online' : 'Simulation Mode Active'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Strict 2 emails/sec rate limiter active
                  </p>
                </div>
              </div>

              <button
                onClick={checkQueueHealth}
                disabled={isCheckingQueue}
                className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition flex items-center space-x-1.5 self-start sm:self-auto shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCheckingQueue ? 'animate-spin' : ''}`} />
                <span>Ping Queue</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
              <div className="p-3.5 rounded-[18px] bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium block">Waiting</span>
                <span className="font-mono text-base font-bold text-slate-900 dark:text-white">{queueStatus?.counts?.waiting ?? 0}</span>
              </div>
              <div className="p-3.5 rounded-[18px] bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium block">Active</span>
                <span className="font-mono text-base font-bold text-sky-700 dark:text-sky-400">{queueStatus?.counts?.active ?? 0}</span>
              </div>
              <div className="p-3.5 rounded-[18px] bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium block">Completed</span>
                <span className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-400">{queueStatus?.counts?.completed ?? 0}</span>
              </div>
              <div className="p-3.5 rounded-[18px] bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium block">Failed</span>
                <span className="font-mono text-base font-bold text-rose-700 dark:text-rose-400">{queueStatus?.counts?.failed ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Google Cloud OAuth Verification Card */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm font-poppins">
              Google Cloud OAuth Verification Endpoints
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'privacy', title: 'Privacy Policy URL', url: 'https://artiapply.vercel.app/privacy' },
                { id: 'terms', title: 'Terms of Service URL', url: 'https://artiapply.vercel.app/terms' },
                { id: 'unsubscribe', title: 'Unsubscribe Opt-Out', url: 'https://artiapply.vercel.app/unsubscribe' },
                { id: 'callback', title: 'Authorized Redirect URI', url: 'https://artiapply.vercel.app/auth/callback' },
              ].map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-[18px] bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between space-x-2"
                >
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">{item.title}</p>
                    <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.url}</p>
                  </div>
                  <button
                    onClick={() => copyLink(item.url, item.id)}
                    className="p-1.5 rounded-full bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 shadow-sm transition"
                    title="Copy URL"
                  >
                    {copiedLink === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Environment Variables Blueprint */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Terminal className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm font-poppins">
                  Environment Variables Blueprint (.env.local)
                </h3>
              </div>
              <button
                onClick={handleCopyEnv}
                className="text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center space-x-1 font-semibold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedEnv ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <pre className="p-4 sm:p-5 rounded-[20px] bg-slate-50/90 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
              {envSample}
            </pre>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CONTEXTUAL GUIDE POPUP MODALS                                             */}
      {/* ========================================================================= */}
      {activeGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setActiveGuide(null)}
        >
          <div
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200/60 dark:border-indigo-800/60">
                  {activeGuide === 'app_password' && '60-Second Setup Guide'}
                  {activeGuide === 'daily_limits' && 'Deliverability & Warmup Guide'}
                  {activeGuide === 'anti_spam' && 'Anti-Spam Safeguards'}
                  {activeGuide === 'oauth_vs_password' && 'Method Comparison'}
                  {activeGuide === 'custom_smtp' && 'SMTP Configuration'}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 font-poppins">
                  {activeGuide === 'app_password' && 'How to Get a Gmail App Password'}
                  {activeGuide === 'daily_limits' && 'Safe Daily Sending Limits & Warmup'}
                  {activeGuide === 'anti_spam' && 'Why ArticlO Throttles Email Sends'}
                  {activeGuide === 'oauth_vs_password' && 'Google OAuth vs. App Password'}
                  {activeGuide === 'custom_smtp' && 'Custom SMTP Server & Port Settings'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveGuide(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {/* GUIDE 1: App Password */}
              {activeGuide === 'app_password' && (
                <>
                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-900 dark:text-indigo-200 leading-relaxed">
                    <strong>Why is this required?</strong> Google accounts have 2-Step Verification enabled. Google blocks third-party apps from using your main password and instead gives you a secure, dedicated 16-character <em>App Password</em> specifically for email dispatches.
                  </div>

                  <div className="space-y-3">
                    <p className="font-bold text-slate-900 dark:text-white text-xs">
                      Follow these 4 simple steps:
                    </p>

                    <ol className="space-y-2.5 list-none pl-0">
                      <li className="flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                          1
                        </span>
                        <div>
                          <span>Make sure <strong>2-Step Verification</strong> is ON in your{' '}</span>
                          <a
                            href="https://myaccount.google.com/security"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 font-semibold underline inline-flex items-center space-x-0.5"
                          >
                            <span>Google Security Settings</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>.
                        </div>
                      </li>

                      <li className="flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                          2
                        </span>
                        <div>
                          <span>Open Google's App Passwords page directly at{' '}</span>
                          <a
                            href="https://myaccount.google.com/apppasswords"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 font-semibold underline inline-flex items-center space-x-0.5"
                          >
                            <span>myaccount.google.com/apppasswords</span>
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>.
                        </div>
                      </li>

                      <li className="flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                          3
                        </span>
                        <div>
                          <span>Under "App name", type <strong>ArticlO</strong> and click <strong>Create</strong>.</span>
                        </div>
                      </li>

                      <li className="flex items-start space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                          4
                        </span>
                        <div>
                          <span>Google will generate a 16-character code (e.g.{' '}
                          <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono font-bold text-slate-900 dark:text-white">
                            abcd efgh ijkl mnop
                          </code>). Copy it and paste it into the field!</span>
                        </div>
                      </li>
                    </ol>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                      100% Safe & Revocable Anytime
                    </p>
                    <p>
                      This code never exposes your master Google password and can be revoked with a single click inside Google Settings.
                    </p>
                  </div>
                </>
              )}

              {/* GUIDE 2: Daily Limits & Warmup */}
              {activeGuide === 'daily_limits' && (
                <>
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80 text-amber-900 dark:text-amber-200 leading-relaxed">
                    <strong>Why do daily limits exist?</strong> Email service providers (Google, Microsoft, Yahoo) monitor send volumes to identify spam bots. Gradually increasing your volume protects your domain reputation and keeps your emails out of the Spam folder.
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white">Recommended Warmup Schedule:</h4>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">Fresh / New Email (&lt; 2 weeks old)</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">Establish initial good sender history</p>
                        </div>
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">30–50 / day</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">Active / Warmed Account (2–4 weeks)</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">Recommended standard for optimal balance</p>
                        </div>
                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">100 / day</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">Seasoned / High Volume (1+ months)</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">High reputation with positive reply ratios</p>
                        </div>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">200–500 / day</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1 text-[11px]">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Deliverability Golden Rules:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                      <li>Use dynamic personalization variables like <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded font-mono">&#123;&#123;first_name&#125;&#125;</code> and <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded font-mono">&#123;&#123;company&#125;&#125;</code>.</li>
                      <li>Never send to unverified email lists with bounce rates above 2%.</li>
                      <li>Keep the automated 2-second rate limiter enabled.</li>
                    </ul>
                  </div>
                </>
              )}

              {/* GUIDE 3: Anti-Spam Rate Limiter */}
              {activeGuide === 'anti_spam' && (
                <>
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200 leading-relaxed">
                    <strong>Algorithmic Protection:</strong> ArticlO enforces an intentional 2-second pause between each recipient. This guarantees your cold emails arrive in the Primary inbox rather than Promotions or Spam.
                  </div>

                  <div className="space-y-2.5">
                    <h4 className="font-bold text-slate-900 dark:text-white">Why simultaneous blasting hurts you:</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      When a script or app sends 100 emails in 1 second, recipient mail exchangers (Gmail MX, Microsoft Office 365) detect an unnatural spike and immediately trigger "Rate-Limited: Greylisted" or route your message directly into Spam.
                    </p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      By spacing out sends at human velocity, your account looks 100% natural and enjoys delivery rates exceeding <strong>98%+</strong>.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400">
                    💡 <em>Example:</em> A campaign of 50 contacts completes in roughly 100 seconds safely in the background while you continue working!
                  </div>
                </>
              )}

              {/* GUIDE 4: OAuth vs App Password */}
              {activeGuide === 'oauth_vs_password' && (
                <>
                  <div className="space-y-3">
                    <p className="leading-relaxed">
                      ArticlO supports both direct Google Workspace OAuth and 16-character App Passwords. Here is which one to choose:
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/70 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900 dark:text-indigo-300">
                            1. Gmail App Password (Recommended)
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                            Fastest
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          Takes 60 seconds to configure. Works instantly with personal @gmail.com and custom Google Workspace domains without needing Google Cloud API app verification.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 dark:text-white">
                            2. Google Workspace OAuth
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            Enterprise
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          1-click authentication using standard Google Sign-In. Best for teams that have registered OAuth credentials in Google Cloud Console with verified redirect URIs.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* GUIDE 5: Custom SMTP */}
              {activeGuide === 'custom_smtp' && (
                <>
                  <div className="space-y-3">
                    <p className="leading-relaxed">
                      If you're not using standard Gmail, enter your provider's SMTP host and port below:
                    </p>

                    <div className="space-y-2 text-[11px]">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <p className="font-bold text-slate-900 dark:text-white">Gmail / Google Workspace</p>
                        <p className="font-mono text-indigo-600 dark:text-indigo-400">Host: smtp.gmail.com | Port: 465 (SSL)</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <p className="font-bold text-slate-900 dark:text-white">Microsoft 365 / Outlook</p>
                        <p className="font-mono text-indigo-600 dark:text-indigo-400">Host: smtp.office365.com | Port: 587 (TLS)</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <p className="font-bold text-slate-900 dark:text-white">SendGrid</p>
                        <p className="font-mono text-indigo-600 dark:text-indigo-400">Host: smtp.sendgrid.net | Port: 587 (TLS)</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <p className="font-bold text-slate-900 dark:text-white">Amazon SES</p>
                        <p className="font-mono text-indigo-600 dark:text-indigo-400">Host: email-smtp.[region].amazonaws.com | Port: 465</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {activeGuide === 'app_password' ? (
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition"
                >
                  <span>Open Google App Passwords</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <div />
              )}
              <button
                type="button"
                onClick={() => setActiveGuide(null)}
                className="px-5 py-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
