'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Zap,
  Layers,
  Clock,
  Paperclip,
  RotateCcw,
  Sliders,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Send,
  User,
  Users,
  Check,
  X,
  FileText,
  Lock,
  Flame,
  Star,
  Globe,
  HelpCircle,
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onConnectGoogle?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  onConnectGoogle,
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState<'composer' | 'limiter' | 'followup'>('composer');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [quickEmail, setQuickEmail] = useState('');
  const [quickName, setQuickName] = useState('');

  // Rate Limiter Demo Animation State
  const [simulatedProgress, setSimulatedProgress] = useState(3);
  const totalSimulated = 6;

  useEffect(() => {
    if (activeDemoTab === 'limiter') {
      const interval = setInterval(() => {
        setSimulatedProgress((prev) => (prev >= totalSimulated ? 1 : prev + 1));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [activeDemoTab]);

  // Sync dark mode from document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('artiapply_theme');
      const isDark = stored === 'dark' || document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
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

  const handleQuickLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickEmail.trim()) {
      localStorage.setItem('artiapply_user_email', quickEmail.trim());
      if (quickName.trim()) {
        localStorage.setItem('artiapply_user_name', quickName.trim());
      }
    }
    setShowAuthModal(false);
    onLogin();
  };

  const faqs = [
    {
      q: 'How does ArticlO guarantee cold emails land in the Primary inbox?',
      a: 'Unlike bulk marketing tools (Mailchimp, Brevo) that route emails through shared, often flagged relay IPs, ArticlO dispatches emails directly through your authenticated Google Workspace or Gmail account. Combined with our strict 2 emails/sec human-cadence rate limiter, spam filters identify your messages as authentic 1-to-1 conversations.',
    },
    {
      q: 'Do I need developer credentials or a Google Cloud Console setup?',
      a: 'No! You can start in 60 seconds using a standard 16-character Gmail App Password. It works with personal @gmail.com accounts and custom Google Workspace domains without any developer account or API approvals.',
    },
    {
      q: 'Why does ArticlO enforce a 2 emails/second rate limiter?',
      a: 'Blasting 100 emails in a single second is the #1 trigger for Google and Outlook algorithms to greylist or spam-flag your domain. By enforcing a natural 2-second gap between recipients, ArticlO simulates human sending velocity, keeping your domain warm and clean.',
    },
    {
      q: 'Can I attach PDFs, pitch decks, and images to my campaigns?',
      a: 'Yes! You can attach files up to 8MB (PDFs, Word documents, pitch decks, screenshots). All attachments are safely encoded into RFC-compliant base64 email streams that deliver cleanly without triggering firewall spam filters.',
    },
    {
      q: 'How does the automated follow-up sequence work?',
      a: 'You can launch smart follow-up sequences (such as Gentle Bump, Value Add, or Breakup) with one click. When a prospect replies to your email, the sequence automatically pauses for that recipient so they are never awkwardly followed up with.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      {/* ========================================================================= */}
      {/* 1. FLOATING NAVIGATION BAR                                                */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-[#070b14]/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Version Badge */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight font-poppins bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                ArticlO
              </span>
              <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                v2.4 Deliverability
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Features
            </a>
            <a href="#demo" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Live Showcase
            </a>
            <a href="#deliverability" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Deliverability
            </a>
            <a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2.5">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Sign In Button */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3.5 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Sign In
            </button>

            {/* Launch App Button */}
            <button
              onClick={onLogin}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 transition"
            >
              <span>Launch App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Ambient Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-pink-500/10 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 blur-[90px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
              High-Deliverability Engine • 99.4% Primary Inbox Rate
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-poppins text-slate-900 dark:text-white leading-[1.12] max-w-4xl mx-auto">
            Cold emails that actually land in{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Primary Inboxes,
            </span>{' '}
            not spam.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Automate personalized 1-to-1 cold outreach directly through authentic Google Workspace & Gmail accounts. Built-in 2 emails/sec rate limiting, Gemini AI copywriting, rich PDF attachments, and smart multi-touch follow-up sequences.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onLogin}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold shadow-xl shadow-slate-900/10 dark:shadow-white/5 transition flex items-center justify-center space-x-2 group"
            >
              <span>Get Started Free — Launch App</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </button>

            <a
              href="/api/auth/google"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold border border-slate-200 dark:border-slate-800 shadow-sm transition flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </a>
          </div>

          {/* Social Proof Metric Highlights */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <span className="font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white font-poppins block">
                99.4%
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Primary Inbox Placement
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <span className="font-extrabold text-xl sm:text-2xl text-indigo-600 dark:text-indigo-400 font-poppins block">
                2 emails/s
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Smart Human Throttle
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <span className="font-extrabold text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400 font-poppins block">
                0
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Shared Relay Penalties
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-sm">
              <span className="font-extrabold text-xl sm:text-2xl text-purple-600 dark:text-purple-400 font-poppins block">
                10+
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Proven Templates
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE PRODUCT SHOWCASE (Live Mockup Browser)                     */}
      {/* ========================================================================= */}
      <section id="demo" className="py-12 sm:py-16 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Interactive Product Preview
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-poppins">
              Built for speed, simplicity & zero spam flags.
            </p>
          </div>

          {/* Interactive Tab Switcher */}
          <div className="flex items-center justify-center mb-6">
            <div className="inline-flex p-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <button
                onClick={() => setActiveDemoTab('composer')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeDemoTab === 'composer'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Gmail-Style Composer</span>
              </button>

              <button
                onClick={() => setActiveDemoTab('limiter')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeDemoTab === 'limiter'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Anti-Spam Limiter (2/sec)</span>
              </button>

              <button
                onClick={() => setActiveDemoTab('followup')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center space-x-1.5 ${
                  activeDemoTab === 'followup'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Smart Follow-Ups</span>
              </button>
            </div>
          </div>

          {/* Mockup Frame with macOS-style window controls */}
          <div className="bg-white dark:bg-[#0d1322] rounded-[28px] border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-slate-900/5 dark:shadow-black/40 overflow-hidden">
            {/* Window Title Bar */}
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-rose-400/80" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                <span className="text-xs font-mono text-slate-400 pl-2">artiapply.io/app</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Rate Limiter Guard: Active</span>
              </div>
            </div>

            {/* TAB 1: Gmail Compose View */}
            {activeDemoTab === 'composer' && (
              <div className="p-5 sm:p-7 space-y-4 animate-in fade-in duration-200">
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">New Outreach Message</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full font-semibold">
                      Gmail Compose Mode
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-400 w-16">To:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                        &#123;&#123;email&#125;&#125; (24 prospective tech founders)
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-slate-400 w-16">Subject:</span>
                      <span className="text-slate-900 dark:text-white font-medium">
                        Quick question regarding &#123;&#123;company&#125;&#125; outreach workflow
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans space-y-2">
                    <p>Hi &#123;&#123;first_name&#125;&#125;,</p>
                    <p>
                      Loved your recent launch at <strong>&#123;&#123;company&#125;&#125;</strong>. Noticed you are scaling outbound for your sales pipeline.
                    </p>
                    <p>
                      We built ArticlO to send verified 1-to-1 emails directly through authentic sender accounts with strict rate limiting (2 emails/sec)—achieving a <strong>99.4% inbox placement rate</strong>.
                    </p>
                    <p>
                      Would you be open to a 5-minute walkthrough this Thursday? Attached our deck below!
                    </p>
                  </div>

                  {/* Attachment Pill Demo */}
                  <div className="pt-2 flex items-center space-x-2">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 font-medium">
                      <Paperclip className="w-3 h-3 text-indigo-500" />
                      <span>ArticlO_Executive_Deck.pdf (2.4 MB)</span>
                    </div>
                  </div>

                  {/* Compose Bottom Toolbar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1.5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center space-x-1 shadow-sm">
                        <Send className="w-3 h-3" />
                        <span>Send Campaign</span>
                      </span>
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center space-x-1 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        <span>✨ Gemini AI Assistant Ready</span>
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">10 Templates Loaded</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Anti-Spam Rate Limiter Demo */}
            {activeDemoTab === 'limiter' && (
              <div className="p-5 sm:p-7 space-y-5 animate-in fade-in duration-200">
                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-xs">
                      Enforced 2 Emails/Second Pacing Engine
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                      Simulates authentic human velocity. Prevents ISP greylisting and automated spam traps.
                    </p>
                  </div>
                  <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 px-3 py-1 rounded-full shadow-sm">
                    {simulatedProgress} / {totalSimulated} Sent
                  </span>
                </div>

                {/* Simulated Contact Queue Rows */}
                <div className="space-y-2 text-xs">
                  {[
                    { email: 'jordan.bell@stratasys.io', name: 'Jordan Bell', status: simulatedProgress >= 1 ? 'delivered' : 'pending' },
                    { email: 'samantha.v@novatech.co', name: 'Samantha Vance', status: simulatedProgress >= 2 ? 'delivered' : 'pending' },
                    { email: 'matthew.z@hypergrowth.ai', name: 'Matthew Zhang', status: simulatedProgress >= 3 ? 'delivered' : (simulatedProgress === 2 ? 'sending' : 'pending') },
                    { email: 'claire.morris@apexcloud.dev', name: 'Claire Morris', status: simulatedProgress >= 4 ? 'delivered' : (simulatedProgress === 3 ? 'sending' : 'pending') },
                    { email: 'david.chen@fintechpulse.com', name: 'David Chen', status: simulatedProgress >= 5 ? 'delivered' : 'pending' },
                    { email: 'elena.rostova@venturelab.io', name: 'Elena Rostova', status: simulatedProgress >= 6 ? 'delivered' : 'pending' },
                  ].map((lead, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{lead.name}</p>
                          <p className="text-[11px] font-mono text-slate-500">{lead.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {lead.status === 'delivered' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Inbox Verified (2.0s delay)</span>
                          </span>
                        )}
                        {lead.status === 'sending' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 animate-pulse">
                            <Zap className="w-3 h-3" />
                            <span>Pacing Send...</span>
                          </span>
                        )}
                        {lead.status === 'pending' && (
                          <span className="text-[10px] text-slate-400 font-medium">Queued in Buffer</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Automated Follow-Up Sequence */}
            {activeDemoTab === 'followup' && (
              <div className="p-5 sm:p-7 space-y-4 animate-in fade-in duration-200">
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600" />
                        <span>Touchpoint 1: Initial Cold Pitch</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        Delivered
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Subject: Quick question regarding &#123;&#123;company&#125;&#125; outreach workflow
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pl-4 py-1 text-slate-400 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>3 Days Later (If No Reply Detected)</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center space-x-1.5">
                        <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Touchpoint 2: Gentle Bump Follow-Up</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                        Auto-Scheduled
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      "Hi &#123;&#123;first_name&#125;&#125;, wanted to gently float this to the top of your inbox in case it got buried..."
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Auto-Stop Safeguard:</strong> Sequences automatically halt for any recipient the moment they respond.
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CORE FEATURES GRID (6 Pillars)                                         */}
      {/* ========================================================================= */}
      <section id="features" className="py-14 sm:py-20 bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              The ArticlO Difference
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-poppins text-slate-900 dark:text-white">
              Engineered for genuine 1-to-1 inbox placement.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Every detail is designed to make your emails indistinguishable from a handcrafted personal message.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="p-6 rounded-[26px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">
                Direct Authenticated Dispatch
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Sends directly through your real Gmail or Workspace account using a 16-character App Password or OAuth. Zero shared relay IP pools that trigger bulk spam flags.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-[26px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">
                Enforced 2 emails/sec Limiter
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automatic BullMQ queue throttles dispatches to 2 emails per second. Simulates natural human cadence so spam detection algorithms never greylist your domain.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-[26px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">
                Gemini AI & 10 Battle Templates
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Type a quick prompt to write high-converting cold pitches with Google Gemini, or 1-click load proven frameworks like The Question Pitch and Value-First Teaser.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-[26px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Paperclip className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">
                Photos, Resumes & Decks (8MB)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Attach PDF pitch decks, Word files, portfolios, or screenshots with RFC-compliant base64 encoding that lands cleanly without triggering corporate firewall alerts.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-[26px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">
                One-Click Follow-Up Sequences
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Send targeted follow-ups in existing threads with preset templates (Gentle Bump, Value Add). Automatically halts sequences when a prospect responds.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-[26px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3 hover:shadow-md transition">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base font-poppins">
                Streamlined Lead Management
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero bloated CRM complexity. Upload CSVs in seconds, edit contact details inline, and download 50 pre-verified sample leads to start testing immediately.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. DELIVERABILITY COMPARISON TABLE                                        */}
      {/* ========================================================================= */}
      <section id="deliverability" className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Why ArticlO Wins
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-poppins text-slate-900 dark:text-white">
              ArticlO vs. Traditional Bulk Email Blasters
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Comparing authentic 1-to-1 sending with shared marketing relays.
            </p>
          </div>

          <div className="rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-lg overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 font-bold text-slate-900 dark:text-white">Feature</th>
                  <th className="p-4 font-bold text-indigo-600 dark:text-indigo-400">ArticlO Engine</th>
                  <th className="p-4 font-bold text-slate-500">Bulk Email Tools</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="p-4 font-semibold">Delivery Origin</td>
                  <td className="p-4 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Your authentic Gmail/Workspace account</span>
                  </td>
                  <td className="p-4 text-slate-500">Shared third-party relay IPs (often spam-flagged)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Send Cadence</td>
                  <td className="p-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                    Strict 2 emails/sec (Human velocity)
                  </td>
                  <td className="p-4 text-rose-500">Simultaneous blasts (instant greylisting)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Primary Inbox Rate</td>
                  <td className="p-4 text-emerald-600 dark:text-emerald-400 font-extrabold font-mono text-sm">
                    99.4% Primary Inbox
                  </td>
                  <td className="p-4 text-slate-500 font-mono">35% – 50% (often Spam/Promotions)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Follow-Up Handling</td>
                  <td className="p-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                    Auto-stops immediately on reply
                  </td>
                  <td className="p-4 text-slate-500">Manual tracking or unsegmented blasts</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Attachments</td>
                  <td className="p-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                    Up to 8MB PDF decks & photos supported
                  </td>
                  <td className="p-4 text-slate-500">Often blocked or tracked with tracking pixels</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Setup Time</td>
                  <td className="p-4 text-emerald-600 dark:text-emerald-400 font-semibold">
                    60 Seconds (Gmail App Password)
                  </td>
                  <td className="p-4 text-slate-500">Complex DNS, SPF, DKIM verification</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW IT WORKS (3 Simple Steps)                                         */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-slate-100/50 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Zero Learning Curve
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-poppins text-slate-900 dark:text-white">
              Launch your first campaign in 3 minutes.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-[26px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">
                1
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm font-poppins">
                Connect Your Account
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Enter your Gmail address and 16-character App Password (or sign in with Google Workspace). Done in 60 seconds.
              </p>
            </div>

            <div className="p-6 rounded-[26px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">
                2
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm font-poppins">
                Craft with AI & Templates
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Use Gemini AI to tailor your pitch, load proven frameworks, attach decks, and insert dynamic tags like &#123;&#123;company&#125;&#125;.
              </p>
            </div>

            <div className="p-6 rounded-[26px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-extrabold flex items-center justify-center text-xs">
                3
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm font-poppins">
                Safe Live Dispatch
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Click Launch and watch ArticlO safely deliver every email at 2 emails/sec with zero spam flags.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FREQUENTLY ASKED QUESTIONS ACCORDION                                   */}
      {/* ========================================================================= */}
      <section id="faq" className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-poppins text-slate-900 dark:text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 overflow-hidden transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white font-poppins"
                  >
                    <span>{faq.q}</span>
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 ml-3">
                      {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. RADIANT BOTTOM CALL TO ACTION                                          */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-[32px] bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 text-center space-y-6 overflow-hidden shadow-2xl border border-indigo-700/30">
            {/* Glowing Accent */}
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/20 blur-[90px] rounded-full pointer-events-none" />

            <div className="relative z-10 space-y-3 max-w-xl mx-auto">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[11px] font-semibold border border-indigo-400/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Zero Spam Flags Guarantee</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-poppins">
                Start landing in primary inboxes today.
              </h2>
              <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
                Connect your account in 60 seconds and experience cold outbound the way it was meant to be.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onLogin}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-sm font-bold shadow-lg transition flex items-center justify-center space-x-2"
              >
                <span>Launch Free Application</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-indigo-800/60 hover:bg-indigo-800 text-white text-sm font-semibold border border-indigo-600/40 transition"
              >
                Quick Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FOOTER                                                                 */}
      {/* ========================================================================= */}
      <footer className="py-10 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white font-poppins">ArticlO</span>
            <span className="text-slate-400">• High-Deliverability Cold Outreach</span>
          </div>

          <div className="flex items-center space-x-5 text-slate-600 dark:text-slate-400 font-medium">
            <button onClick={onLogin} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Dashboard
            </button>
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Privacy Policy
            </a>
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Terms of Service
            </a>
            <a href="/unsubscribe" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              Opt-Out Unsubscribe
            </a>
          </div>

          <div>
            <span>© {new Date().getFullYear()} ArticlO Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 10. AUTH / QUICK ACCESS MODAL                                             */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full">
                  Quick Access
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5 font-poppins">
                  Sign in to ArticlO
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick 1-Click Launch Button */}
            <button
              type="button"
              onClick={() => {
                setShowAuthModal(false);
                onLogin();
              }}
              className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4" />
              <span>Launch App (Direct Demo Access)</span>
            </button>

            {/* Google OAuth Option */}
            <a
              href="/api/auth/google"
              className="w-full py-2.5 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm transition flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google Workspace</span>
            </a>

            <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
              <span>Or enter your details</span>
              <div className="flex-1 border-t border-slate-200 dark:border-slate-800" />
            </div>

            {/* Custom Email Form */}
            <form onSubmit={handleQuickLoginSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  placeholder="e.g. Alex Outreach"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  placeholder="e.g. alex@yourcompany.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm"
              >
                Enter Workspace
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
