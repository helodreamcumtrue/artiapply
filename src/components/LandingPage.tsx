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
  TrendingUp,
  BarChart3,
  Lightbulb,
} from 'lucide-react';
import {
  ArticloLogo,
  IconShieldVerified,
  IconCadenceTimer,
  IconDirectMail,
  IconAiEngine,
  IconPersonalize,
  IconSafeAttachment,
  IconVerifiedBadge,
  IconAnalyticsPulse,
  IconAdaptiveGear,
} from './icons/CustomIcons';
import { Footer } from './Footer';

interface LandingPageProps {
  onLogin: () => void;
  onConnectGoogle?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLogin,
  onConnectGoogle,
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'composer' | 'limiter' | 'followup'>('composer');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [quickEmail, setQuickEmail] = useState('');
  const [quickName, setQuickName] = useState('');

  // Rate Limiter Showcase Animation State
  const [simulatedProgress, setSimulatedProgress] = useState(3);
  const totalSimulated = 6;

  useEffect(() => {
    if (activePreviewTab === 'limiter') {
      const interval = setInterval(() => {
        setSimulatedProgress((prev) => (prev >= totalSimulated ? 1 : prev + 1));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [activePreviewTab]);

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-[#d4f933] selection:text-black font-sans antialiased overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: REFINED SAPPHIRE-SKY ATMOSPHERE + CONTAINED 5-CARD ARC   */}
      {/* ========================================================================= */}
      <section className="relative w-full bg-gradient-to-b from-[#0b3366] via-[#134e8d] to-[#2575c0] text-white pt-5 pb-20 sm:pb-28 overflow-hidden">
        {/* Soft Natural Atmospheric Cloud Texture (Balanced Opacity & Depth) */}
        <div 
          className="absolute inset-0 bg-cover bg-bottom opacity-35 pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: `url('/images/hero-sky.jpg')` }}
        />

        {/* Ambient Top & Center Glow (Soft Depth without Harsh Glare) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-sky-300/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-white/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header Navigation Bar - Floating Sleek Glass Capsule */}
          <header className="flex items-center justify-between py-2.5 px-5 sm:px-6 mb-12 sm:mb-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-lg shadow-black/5">
            {/* Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm">
                <ArticloLogo size={20} className="text-white" />
              </div>
              <span className="font-extrabold text-lg tracking-tight font-poppins text-white">
                ArticlO
              </span>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-white/90">
              <a href="#hero" className="hover:text-white transition">Home</a>
              <a href="#about" className="hover:text-white transition">Services</a>
              <a href="#deliverability" className="hover:text-white transition">About Us</a>
              <a href="#preview" className="hover:text-white transition flex items-center space-x-1">
                <span>Features</span>
                <ChevronDown className="w-3 h-3 text-white/70" />
              </a>
            </nav>

            {/* Right Header Action Button */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-5 py-2 rounded-full bg-[#d4f933] hover:bg-[#c6f627] text-slate-950 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#d4f933]/20 active:scale-95"
            >
              Get Started
            </button>
          </header>

          {/* Hero Typography */}
          <div className="text-center max-w-4xl mx-auto space-y-4 pt-1 pb-6">
            {/* Executive Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold shadow-sm mb-1">
              <span className="w-2 h-2 rounded-full bg-[#d4f933] animate-pulse" />
              <span>Next-Gen Outreach Engine • Powered by Gmail API & AI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-poppins text-white leading-[1.15] drop-shadow-sm">
              Your articleship hunt ends here
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 max-w-3xl mx-auto pt-3 pb-1">
              <div className="flex items-center space-x-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold shadow-sm transition hover:bg-white/20">
                <span>📬 Reach out to hundreds of HR in a click</span>
              </div>
              <div className="flex items-center space-x-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold shadow-sm transition hover:bg-white/20">
                <span>📜 Get ATS free resume templates</span>
              </div>
              <div className="flex items-center space-x-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm font-semibold shadow-sm transition hover:bg-white/20">
                <span>✉️ Get active mail IDs of HR</span>
              </div>
            </div>

            {/* Hero Dual Action Buttons */}
            <div className="flex flex-row items-center justify-center gap-3.5 pt-4">
              <a
                href="#preview"
                className="px-6 py-3 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
              >
                View Demo
              </a>

              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-3 rounded-full bg-[#d4f933] hover:bg-[#c6f627] text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#d4f933]/25 flex items-center space-x-2 active:scale-95"
              >
                <span>Get Started</span>
                <span className="w-5 h-5 rounded-full bg-slate-950 text-[#d4f933] flex items-center justify-center text-xs font-bold leading-none">
                  ↗
                </span>
              </button>
            </div>

            {/* Credibility / Trust Indicators with CustomIcons */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-3 text-[11px] font-medium text-white/80">
              <span className="flex items-center space-x-1.5">
                <IconShieldVerified size={14} className="text-[#d4f933]" />
                <span>99.4% Primary Inbox</span>
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center space-x-1.5">
                <IconCadenceTimer size={14} className="text-[#d4f933]" />
                <span>2.0/s Human Cadence</span>
              </span>
              <span className="text-white/30">•</span>
              <span className="flex items-center space-x-1.5">
                <IconVerifiedBadge size={14} className="text-[#d4f933]" />
                <span>Zero Shared Relay IPs</span>
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SIGNATURE 3D FLOATING CARDS ARC - PERFECTLY CONTAINED & BALANCED          */}
          {/* (5 Curated Cards: Deliverability, Portrait, Obsidian AI, Curve, 520k+)   */}
          {/* ========================================================================= */}
          <div className="relative pt-8 sm:pt-12 pb-10 max-w-5xl mx-auto">
            {/* The 5-Card Deck: Perfectly centered, never cut off on sides or bottom */}
            <div className="flex items-center justify-center -space-x-3 sm:-space-x-4 md:-space-x-5 py-4 perspective-1200 preserve-3d scale-[0.72] sm:scale-90 md:scale-100 origin-center">
              
              {/* CARD 1: Deliverability ($4,900/mo + Breakdown) */}
              {/* CARD 1: Deliverability (Accurate 99.4% Primary Inbox Rate) */}
              <div 
                className="arc-card w-40 sm:w-44 md:w-48 h-56 sm:h-64 rounded-2xl bg-white p-4 shadow-xl border border-white/90 shrink-0 transform -rotate-6 translate-y-3 cursor-pointer text-slate-800"
              >
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inbox Placement</div>
                <div className="text-base sm:text-lg font-black font-poppins text-slate-900 mt-0.5">
                  99.4% <span className="text-[10px] text-emerald-600 font-semibold">Primary</span>
                </div>
                
                <div className="space-y-1.5 mt-3 text-[10px] text-slate-600">
                  <div className="flex justify-between pb-1 border-b border-slate-100">
                    <span>Dispatch Mode</span>
                    <span className="font-bold text-slate-900">Direct Gmail</span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-100">
                    <span>Rate Limiter</span>
                    <span className="font-bold text-slate-900">2.0 /sec</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shared Relay IPs</span>
                    <span className="font-bold text-emerald-600">0 (None)</span>
                  </div>
                </div>

                <div className="flex items-end space-x-1.5 h-12 pt-2 mt-2 border-t border-slate-100">
                  <div className="w-2.5 bg-emerald-400 rounded-t h-6" />
                  <div className="w-2.5 bg-sky-400 rounded-t h-9" />
                  <div className="w-2.5 bg-indigo-500 rounded-t h-12" />
                  <div className="w-2.5 bg-indigo-300 rounded-t h-7" />
                  <div className="w-2.5 bg-teal-400 rounded-t h-8" />
                </div>
              </div>

              {/* CARD 2: Personalization & Merge Tags (Prospect / Team Portrait) */}
              <div 
                className="arc-card w-40 sm:w-44 md:w-48 h-60 sm:h-68 rounded-2xl overflow-hidden shadow-2xl border border-white/90 shrink-0 transform -rotate-2 translate-y-1 relative cursor-pointer group"
              >
                <img
                  src="/images/portrait-customer.jpg"
                  alt="Personalized Outreach"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-md rounded-xl p-2 flex items-center justify-between text-[10px] font-bold text-slate-900 shadow-md">
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase tracking-wider">Merge Tag</span>
                    <span className="text-indigo-600 font-mono">&#123;&#123;first_name&#125;&#125;</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[8px] uppercase tracking-wider">Company</span>
                    <span className="text-emerald-600 font-mono">&#123;&#123;company&#125;&#125;</span>
                  </div>
                </div>
              </div>

              {/* CARD 3: Obsidian Centerpiece (Flagship Authentic Dispatch Engine) */}
              <div 
                className="arc-card w-44 sm:w-48 md:w-52 h-64 sm:h-72 rounded-2xl bg-[#0c1017] p-5 shadow-2xl border border-white/20 shrink-0 transform rotate-0 scale-105 z-20 text-white cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#d4f933]/15 text-[#d4f933] text-[10px] font-bold mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#d4f933] inline-block animate-pulse" />
                    <span>Outreach Engine</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-100 leading-snug">
                    Authentic 1-to-1 Dispatch with Strict Cadence Throttling
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                    Personalized cold outreach sent directly via your Google Workspace account.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Gemini AI Engine</span>
                  <span className="text-[#d4f933] font-bold">Active & Verified</span>
                </div>
              </div>

              {/* CARD 4: Strict Pacing Velocity & Human Cadence */}
              <div 
                className="arc-card w-40 sm:w-44 md:w-48 h-60 sm:h-68 rounded-2xl bg-white p-4 shadow-2xl border border-white/90 shrink-0 transform rotate-2 translate-y-1 cursor-pointer text-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Pacing Cadence</div>
                  <div className="text-xs sm:text-sm font-extrabold text-slate-900">Human-Simulated Velocity</div>
                  
                  {/* Visual Spline Curve Graphic */}
                  <div className="mt-3 h-20 relative flex items-end">
                    <svg className="w-full h-16 text-sky-400" viewBox="0 0 100 50" preserveAspectRatio="none">
                      <path
                        d="M0,45 Q20,35 40,25 T70,15 T100,5 L100,50 L0,50 Z"
                        fill="currentColor"
                        fillOpacity="0.18"
                      />
                      <path
                        d="M0,45 Q20,35 40,25 T70,15 T100,5"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="2.5"
                      />
                    </svg>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Delay Gap</span>
                  <span className="text-emerald-600 font-bold">500ms (2/sec)</span>
                </div>
              </div>

              {/* CARD 5: 8MB Attachments & Domain Safety */}
              <div 
                className="arc-card w-40 sm:w-44 md:w-48 h-56 sm:h-64 rounded-2xl bg-white p-4 shadow-xl border border-white/90 shrink-0 transform rotate-6 translate-y-3 cursor-pointer text-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex space-x-1 mb-1.5">
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">RFC MIME</span>
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 font-semibold">Safe Base64</span>
                  </div>
                  <div className="text-[9px] text-slate-400 uppercase font-semibold">Max Attachment</div>
                  <div className="text-lg sm:text-xl font-black font-poppins text-slate-900 mt-0.5">8 MB</div>
                  
                  <div className="mt-3 text-[9px] text-slate-500">
                    <div className="flex justify-between mb-1">
                      <span>Supported Files</span>
                      <span className="font-bold text-slate-800">PDF, DOCX, Decks</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#d4f933] h-full w-4/5" />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[9px] text-emerald-600 font-bold flex items-center space-x-1">
                  <span>✓</span>
                  <span>Firewall Spam Safe</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ABOUT US & BENTO GRID SECTION (Exact Design Style with Accurate Data)   */}
      {/* ========================================================================= */}
      <section id="about" className="py-20 sm:py-28 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          
          {/* Section Kicker & Big Editorial Headline with Inline Pills */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              <span>Core Architecture</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 font-poppins leading-[1.18]">
              An intelligent outreach engine <br className="hidden sm:inline" />
              dedicated to building{' '}
              <span className="inline-flex items-center align-middle mx-1 px-3 py-1 rounded-full bg-[#0284c7] text-white text-xs sm:text-sm font-bold shadow-sm">
                <IconCadenceTimer size={14} className="mr-1.5 text-white" />
                <span>smarter</span>
              </span>{' '}
              <br className="sm:hidden" />
              and{' '}
              <span className="inline-flex items-center align-middle mx-1 px-3.5 py-1 rounded-full bg-[#d4f933] text-slate-950 text-xs sm:text-sm font-extrabold shadow-sm">
                <IconAdaptiveGear size={14} className="mr-1.5 text-slate-950" />
                <span>more adaptive</span>
              </span>{' '}
              campaigns
            </h2>
          </div>

          {/* Bento Grid Matching Reference Image with Accurate Data */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
            
            {/* Bento Card 1 (Left Column: Sky Photo Card with Floating Stats) */}
            <div className="md:col-span-5 rounded-[32px] overflow-hidden bg-sky-600 relative min-h-[380px] shadow-lg border border-slate-200/60 flex flex-col justify-between p-6">
              <img
                src="/images/portrait-founder.jpg"
                alt="Founder & Team"
                className="absolute inset-0 w-full h-full object-cover object-top opacity-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

              {/* Top Header Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-white font-extrabold tracking-wider font-poppins text-lg drop-shadow">
                  ARTICLO
                </span>
                <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-900 shadow-sm">
                  <IconAnalyticsPulse size={16} className="text-slate-800" />
                </div>
              </div>

              {/* Floating Bottom White Card */}
              <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/60 space-y-1.5">
                <div className="text-3xl font-black font-poppins text-slate-900">
                  99.4%
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Primary inbox deliverability achieved by sending directly through authenticated Google accounts instead of flagged relay servers.
                </p>
              </div>
            </div>

            {/* Bento Card 2 (Middle Column: 100% Direct Dispatch + Architecture) */}
            <div className="md:col-span-4 rounded-[32px] bg-white p-6 sm:p-7 shadow-lg border border-slate-200/80 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Direct Authenticated Dispatch
                </p>
                <h3 className="text-4xl font-black font-poppins text-slate-900 mt-1">
                  100%
                </h3>

                {/* Avatar Cluster */}
                <div className="flex -space-x-2.5 my-6">
                  <img src="/images/portrait-customer.jpg" alt="User 1" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                  <img src="/images/portrait-founder.jpg" alt="User 2" className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    GM
                  </div>
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">
                    TLS
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  &ldquo;Sending via direct Gmail API credentials with 500ms pacing simulates authentic 1-to-1 human behavior and keeps domains warm permanently.&rdquo;
                </p>
              </div>
            </div>

            {/* Right Column (Stacked Lime Card + Dark Card) */}
            <div className="md:col-span-3 flex flex-col gap-5 sm:gap-6">
              
              {/* Card 3: Electric Lime Stat Card */}
              <div className="rounded-[32px] bg-[#d4f933] p-6 shadow-lg border border-[#c6f627] flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Max File Attachments
                  </span>
                  <h3 className="text-4xl font-black font-poppins text-slate-950 mt-1">
                    8 MB
                  </h3>
                </div>
                <p className="text-xs text-slate-900/85 font-medium leading-relaxed mt-4">
                  Safely attach pitch decks, portfolio PDFs, and case studies encoded into compliant base64 email streams.
                </p>
              </div>

              {/* Card 4: Sleek Pitch Black Tile */}
              <div className="rounded-[32px] bg-[#0c1017] p-6 shadow-lg border border-slate-800 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium">Outbound Speed</p>
                  <p className="text-xs text-slate-500">Rate Limiter</p>
                </div>
                <div className="text-2xl sm:text-3xl font-black font-poppins text-[#d4f933]">
                  2.0/s
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE PRODUCT PREVIEW (Live Interactive Suite)                  */}
      {/* ========================================================================= */}
      <section id="preview" className="py-20 sm:py-24 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">
              Interactive Showcase
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-poppins">
              Built for speed, simplicity & zero spam flags.
            </h2>
          </div>

          {/* Interactive Switcher Pill */}
          <div className="flex items-center justify-center mb-8">
            <div className="inline-flex p-1 rounded-full bg-slate-100 border border-slate-200 shadow-sm">
              <button
                onClick={() => setActivePreviewTab('composer')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center space-x-1.5 ${
                  activePreviewTab === 'composer'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Gmail-Style Composer</span>
              </button>

              <button
                onClick={() => setActivePreviewTab('limiter')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center space-x-1.5 ${
                  activePreviewTab === 'limiter'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Anti-Spam Limiter (2/sec)</span>
              </button>

              <button
                onClick={() => setActivePreviewTab('followup')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center space-x-1.5 ${
                  activePreviewTab === 'followup'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Smart Follow-Ups</span>
              </button>
            </div>
          </div>

          {/* Mockup Frame */}
          <div className="rounded-[28px] bg-slate-50 border border-slate-200/90 shadow-xl overflow-hidden">
            {/* Window Dots Header */}
            <div className="px-5 py-3.5 border-b border-slate-200 bg-white/80 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-medium">
                artiapply.io / command-center
              </span>
              <div className="w-12" />
            </div>

            {/* TAB 1: Gmail Composer View */}
            {activePreviewTab === 'composer' && (
              <div className="p-6 sm:p-8 space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 text-xs">
                    <span className="font-bold text-slate-900">New Outreach Sequence</span>
                    <span className="text-[10px] text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full font-bold">
                      Native Gmail Mode
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <span className="font-semibold text-slate-400 w-16">To:</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[11px] text-slate-800">
                        &#123;&#123;email&#125;&#125; (24 prospective tech founders)
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-slate-600">
                      <span className="font-semibold text-slate-400 w-16">Subject:</span>
                      <span className="text-slate-900 font-medium">
                        Quick question regarding &#123;&#123;company&#125;&#125; outreach workflow
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-700 leading-relaxed font-sans space-y-2">
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

                  {/* Attachment Pill */}
                  <div className="pt-2 flex items-center space-x-2">
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-700 font-medium">
                      <Paperclip className="w-3 h-3 text-sky-600" />
                      <span>ArticlO_Executive_Deck.pdf (2.4 MB)</span>
                    </div>
                  </div>

                  {/* Toolbar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setShowAuthModal(true)}
                        className="px-4 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send Campaign</span>
                      </button>
                      <span className="text-[11px] text-slate-700 font-medium flex items-center space-x-1 bg-[#d4f933] px-2.5 py-1 rounded-full">
                        <Sparkles className="w-3 h-3 text-black" />
                        <span>Gemini AI Copywriter</span>
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">10 Templates Loaded</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Rate Limiter Showcase */}
            {activePreviewTab === 'limiter' && (
              <div className="p-6 sm:p-8 space-y-5">
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sky-950 text-xs">
                      Enforced 2 Emails/Second Pacing Engine
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Simulates authentic human velocity. Prevents ISP greylisting and automated spam traps.
                    </p>
                  </div>
                  <span className="font-mono text-sm font-bold text-sky-800 bg-white px-3 py-1 rounded-full shadow-sm">
                    {simulatedProgress} / {totalSimulated} Sent
                  </span>
                </div>

                {/* Queue Rows */}
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
                      className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-[10px] font-bold flex items-center justify-center text-slate-600">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-slate-900">{lead.name}</p>
                          <p className="text-[11px] font-mono text-slate-500">{lead.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {lead.status === 'delivered' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Inbox Verified (2.0s delay)</span>
                          </span>
                        )}
                        {lead.status === 'sending' && (
                          <span className="inline-flex items-center space-x-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 animate-pulse">
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

            {/* TAB 3: Follow-Up Sequences */}
            {activePreviewTab === 'followup' && (
              <div className="p-6 sm:p-8 space-y-4">
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-600" />
                        <span>Touchpoint 1: Initial Cold Pitch</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Dispatched
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      Hi &#123;&#123;first_name&#125;&#125;, loved your recent launch at &#123;&#123;company&#125;&#125;...
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-sky-950 flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#d4f933]" />
                        <span>Touchpoint 2: Quick Gentle Bump (3 Days Later)</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                        Scheduled
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      Hi &#123;&#123;first_name&#125;&#125;, following up briefly in case my last email got buried. Open to a 5-min intro?
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FAQ SECTION                                                            */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-24 bg-[#f8fafc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-poppins">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900"
                >
                  <span>{faq.q}</span>
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                    {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-slate-700" /> : <ChevronDown className="w-4 h-4 text-slate-700" />}
                  </div>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION BANNER (Radiant Sky Footer)                             */}
      {/* ========================================================================= */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-r from-[#0b82f4] via-[#2196f3] to-[#0284c7] text-white text-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-bottom opacity-40 pointer-events-none mix-blend-screen"
          style={{ backgroundImage: `url('/images/hero-sky.jpg')` }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black font-poppins tracking-tight text-white leading-tight">
            Ready to guarantee your cold emails <br />
            land in the Primary inbox?
          </h2>
          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
            Join thousands of sales teams scaling authentic Google Workspace outreach with 99.4% deliverability.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-4 rounded-full bg-[#d4f933] hover:bg-[#c6f627] text-slate-950 font-extrabold text-sm uppercase tracking-wider transition-all shadow-xl shadow-black/20 active:scale-95 inline-flex items-center space-x-2.5"
            >
              <span>Get Started Now</span>
              <span className="w-6 h-6 rounded-full bg-slate-950 text-[#d4f933] flex items-center justify-center text-xs font-bold">
                ↗
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. UNIFIED PLATFORM FOOTER                                                */}
      {/* ========================================================================= */}
      <Footer />

      {/* ========================================================================= */}
      {/* 8. AUTHENTICATION / QUICK ACCESS MODAL                                    */}
      {/* ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-[28px] p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full">
                  Instant Access
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1 font-poppins">
                  Enter ArticlO Command Center
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1-Click Launch Button */}
            <button
              type="button"
              onClick={() => {
                setShowAuthModal(false);
                onLogin();
              }}
              className="w-full py-3.5 rounded-full bg-[#d4f933] hover:bg-[#c6f627] text-slate-950 text-xs font-black uppercase tracking-wider shadow-md transition flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>Launch Outreach Hub (Direct Entry)</span>
            </button>

            {/* Google OAuth Option */}
            <a
              href="/api/auth/google"
              className="w-full py-3 rounded-full bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-sm transition flex items-center justify-center space-x-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Connect with Google Workspace</span>
            </a>

            <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
              <div className="flex-1 border-t border-slate-200" />
              <span>Or personalize your workspace</span>
              <div className="flex-1 border-t border-slate-200" />
            </div>

            {/* Custom Email Form */}
            <form onSubmit={handleQuickLoginSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  value={quickName}
                  onChange={(e) => setQuickName(e.target.value)}
                  placeholder="e.g. Alex Outreach"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600 transition"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Your Sender Email
                </label>
                <input
                  type="email"
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  placeholder="e.g. alex@yourcompany.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
              >
                Enter Command Center
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
