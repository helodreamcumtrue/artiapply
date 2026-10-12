'use client';

import React, { useState } from 'react';
import {
  ArticloLogo,
  IconSecurityLock,
  IconDirectMail,
  IconCadenceTimer,
  IconShieldVerified,
  IconArrowUpRight,
} from './icons/CustomIcons';
import { X, KeyRound, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

interface LaunchAuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSettings: () => void;
  onLoginSuccess: (email: string, name: string) => void;
  currentEmail?: string | null;
  currentName?: string | null;
  campaignName?: string;
  totalContacts?: number;
}

export const LaunchAuthRequiredModal: React.FC<LaunchAuthRequiredModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSettings,
  onLoginSuccess,
  currentEmail,
  currentName,
  campaignName = 'Outreach Campaign',
  totalContacts = 0,
}) => {
  const [emailInput, setEmailInput] = useState(currentEmail || '');
  const [nameInput, setNameInput] = useState(currentName || '');
  const [appPasswordInput, setAppPasswordInput] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSaveAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      alert('Please enter your email address to log in.');
      return;
    }

    setIsSaving(true);
    // Persist login session
    localStorage.setItem('artiapply_session', 'true');
    localStorage.setItem('artiapply_user_email', emailInput.trim());
    if (nameInput.trim()) {
      localStorage.setItem('artiapply_user_name', nameInput.trim());
    }

    // If app password was provided, save SMTP config directly
    if (appPasswordInput.trim()) {
      const config = {
        user: emailInput.trim(),
        pass: appPasswordInput.trim().replace(/\s+/g, ''),
        host: 'smtp.gmail.com',
        port: 465,
        fromEmail: emailInput.trim(),
        fromName: nameInput.trim() || 'Outreach Manager',
      };
      localStorage.setItem('artiapply_smtp_config', JSON.stringify(config));
    }

    setIsSaving(false);
    onLoginSuccess(emailInput.trim(), nameInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-[32px] border border-slate-200/90 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Dark Hero Capsule Bar */}
        <div className="bg-[#0c1017] text-white p-6 sm:p-7 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4f933]/10 blur-[80px] pointer-events-none rounded-full" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Status Badge */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#d4f933]/15 text-[#d4f933] text-xs font-bold uppercase tracking-wider mb-3">
            <IconSecurityLock size={14} className="text-[#d4f933]" />
            <span>Launch Safeguard</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-poppins text-white tracking-tight leading-snug">
            Please login and update the settings
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            To dispatch <span className="text-[#d4f933] font-bold">{totalContacts > 0 ? `${totalContacts} emails` : 'your campaign'}</span> through authenticated Google accounts and ensure spam immunity, please sign in and verify your sending credentials.
          </p>

          {/* Core Guardrail Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/10 flex items-center space-x-1">
              <IconShieldVerified size={12} className="text-[#d4f933]" />
              <span>99.4% Primary Inbox</span>
            </span>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/10 flex items-center space-x-1">
              <IconCadenceTimer size={12} className="text-[#d4f933]" />
              <span>2.0/s Human Cadence</span>
            </span>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/90 border border-white/10 flex items-center space-x-1">
              <IconDirectMail size={12} className="text-[#d4f933]" />
              <span>Zero Shared Relays</span>
            </span>
          </div>
        </div>

        {/* Modal Form Body */}
        <div className="p-6 sm:p-7 space-y-5">
          <form onSubmit={handleSaveAndProceed} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Your Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. founder@company.com or outreach@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-900 focus:bg-white shadow-sm transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Your Full Name / Workspace Identity
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Alex Rivers"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-900 focus:bg-white shadow-sm transition"
              />
            </div>

            {/* Quick App Password field (optional inline or in Settings) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Gmail 16-Char App Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPasswordInput(!showPasswordInput)}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  {showPasswordInput ? 'Hide' : '+ Add directly here'}
                </button>
              </div>

              {showPasswordInput ? (
                <div className="space-y-1.5">
                  <input
                    type="password"
                    value={appPasswordInput}
                    onChange={(e) => setAppPasswordInput(e.target.value)}
                    placeholder="xxxx xxxx xxxx xxxx (from myaccount.google.com/apppasswords)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-900 focus:bg-white shadow-sm transition"
                  />
                  <p className="text-[10px] text-slate-500">
                    Generates in 30 seconds inside Google Security. Or click below to configure in Settings.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center space-x-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                    <span>Credentials can also be updated in Settings.</span>
                  </span>
                </div>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 px-5 rounded-full bg-[#d4f933] hover:bg-[#c6f627] text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-md shadow-[#d4f933]/25 transition-all duration-200 flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
              >
                <span>Log In & Update Settings</span>
                <span className="w-5 h-5 rounded-full bg-slate-950 text-[#d4f933] flex items-center justify-center text-xs font-bold">
                  ↗
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (emailInput.trim()) {
                    localStorage.setItem('artiapply_user_email', emailInput.trim());
                  }
                  if (nameInput.trim()) {
                    localStorage.setItem('artiapply_user_name', nameInput.trim());
                  }
                  onClose();
                  onNavigateToSettings();
                }}
                className="w-full py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-bold text-xs transition flex items-center justify-center space-x-2"
              >
                <span>Go Directly to Settings Tab</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>
          </form>

          {/* Safe Note */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-500">
              Your campaign draft <strong className="text-slate-800 font-semibold">{campaignName}</strong> is auto-saved and ready to dispatch once credentials are set.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
