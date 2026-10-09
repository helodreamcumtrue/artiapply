'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Paperclip,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  ArrowRight,
  Mail,
  Send,
  HelpCircle,
  FileText,
  Clock,
  Layers,
  Zap,
  Users,
} from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: 'dashboard' | 'builder' | 'campaigns' | 'contacts' | 'settings') => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const [activeGuideTab, setActiveGuideTab] = useState<'quickstart' | 'formats' | 'attachments' | 'followups' | 'faq'>('quickstart');

  // Interactive Checklist persisted to localStorage
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    smtp: false,
    format: false,
    attachment: false,
    contacts: false,
    launch: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('artiapply_guide_checklist');
      if (saved) {
        setChecklist(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const toggleCheck = (key: string) => {
    setChecklist((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('artiapply_guide_checklist', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const completedCount = Object.values(checklist).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 5) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-indigo-50/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900 font-poppins">ArticlO Outreach Guide</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
                  Quick-Start & Playbook
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Learn how to send verified, rate-limited campaigns, attach files, and automate follow-ups.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-100 flex items-center space-x-2 overflow-x-auto no-scrollbar bg-white">
          {[
            { id: 'quickstart', label: '🚀 5-Step Quickstart', badge: `${progressPercent}%` },
            { id: 'formats', label: '📋 Email Formats' },
            { id: 'attachments', label: '📎 Files & Photos' },
            { id: 'followups', label: '🔄 Follow-up Engine' },
            { id: 'faq', label: '❓ Deliverability & FAQ' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveGuideTab(tab.id as any)}
              className={`py-3.5 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeGuideTab === tab.id
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 font-mono">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm leading-relaxed">
          
          {/* TAB 1: 5-STEP QUICKSTART */}
          {activeGuideTab === 'quickstart' && (
            <div className="space-y-6">
              {/* Progress Card */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                      Your Onboarding Progress
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-700">
                      {completedCount} / 5 completed
                    </span>
                  </div>
                  <div className="w-full sm:w-64 bg-indigo-200/60 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
                {progressPercent === 100 ? (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full inline-flex items-center self-start sm:self-auto">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    You are ready to launch!
                  </span>
                ) : (
                  <span className="text-xs text-indigo-700 font-medium">
                    Check off steps as you set up your outreach.
                  </span>
                )}
              </div>

              {/* Checklist Steps */}
              <div className="space-y-3">
                {/* Step 1 */}
                <div
                  onClick={() => toggleCheck('smtp')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                    checklist.smtp
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checklist.smtp}
                    onChange={() => {}}
                    className="w-5 h-5 rounded-md mt-0.5 text-slate-900 focus:ring-0 cursor-pointer accent-slate-900"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">
                        1. Connect Gmail / Email Credentials in Settings
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          onNavigateToTab?.('settings');
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
                      >
                        <span>Open Settings</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Navigate to <strong>Settings &gt; Email Setup</strong> and enter your Gmail address and a 16-character Google App Password. Click &ldquo;Send Test Email&rdquo; to confirm instant delivery.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div
                  onClick={() => toggleCheck('format')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                    checklist.format
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checklist.format}
                    onChange={() => {}}
                    className="w-5 h-5 rounded-md mt-0.5 text-slate-900 focus:ring-0 cursor-pointer accent-slate-900"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">
                        2. Pick a High-Converting Email Format
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveGuideTab('formats');
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
                      >
                        <span>View Formats</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Choose from proven templates: Job Application, B2B Problem-Agitate-Solve, Executive 3-Bullet Brief, or Investor Pitch. Automatic tokens like <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">&#123;&#123;first_name&#125;&#125;</code> and <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">&#123;&#123;company&#125;&#125;</code> auto-personalize for every contact.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div
                  onClick={() => toggleCheck('attachment')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                    checklist.attachment
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checklist.attachment}
                    onChange={() => {}}
                    className="w-5 h-5 rounded-md mt-0.5 text-slate-900 focus:ring-0 cursor-pointer accent-slate-900"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">
                        3. Attach Files & Photos (Resumes, Pitch Decks, Images)
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveGuideTab('attachments');
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
                      >
                        <span>Attachment Guide</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Attach PDFs, Word docs, spreadsheets, or image assets directly inside the campaign builder. They are encoded and sent safely to all recipients.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div
                  onClick={() => toggleCheck('contacts')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                    checklist.contacts
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checklist.contacts}
                    onChange={() => {}}
                    className="w-5 h-5 rounded-md mt-0.5 text-slate-900 focus:ring-0 cursor-pointer accent-slate-900"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">
                        4. Load or Upload Contact Leads
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          onNavigateToTab?.('contacts');
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
                      >
                        <span>Contacts Directory</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Upload your own CSV with columns <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">email, first_name, company, role</code> or click &ldquo;Load 50 Samples&rdquo; to test immediately.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div
                  onClick={() => toggleCheck('launch')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                    checklist.launch
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-800'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checklist.launch}
                    onChange={() => {}}
                    className="w-5 h-5 rounded-md mt-0.5 text-slate-900 focus:ring-0 cursor-pointer accent-slate-900"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">
                        5. Launch Rate-Limited Delivery & Automate Follow-ups
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          onNavigateToTab?.('builder');
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
                      >
                        <span>Start Campaign</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      Our queue worker dispatches emails sequentially at a rate of 2 emails per second. This prevents Gmail spam traps. After dispatch, trigger follow-ups with 1 click!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFESSIONAL EMAIL FORMATS */}
          {activeGuideTab === 'formats' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-poppins">Professional Email Formats Playbook</h3>
                <p className="text-xs text-slate-500 mt-1">
                  ArticlO comes built-in with 10 battle-tested formats curated for maximum reply rates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                      Artiapply Special
                    </span>
                    <span className="text-[11px] text-slate-400">Job Outreach</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Job Application & Portfolio Pitch</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Designed specifically for cold outreach to hiring managers and engineering leads. Includes attachments for resumes and work portfolios with an easy 10-minute calendar call to action.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      High Conversion
                    </span>
                    <span className="text-[11px] text-slate-400">B2B Sales</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Problem-Agitate-Solve (PAS)</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Pinpoints the recipient&apos;s exact role headache (e.g., spam flags, manual tasks), offers clear social proof, and proposes a 5-minute conversation.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                      Under 100 Words
                    </span>
                    <span className="text-[11px] text-slate-400">C-Suite</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Executive 3-Bullet Brief</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Busy CEOs and VPs delete long messages. This format delivers 3 impactful bullet points and asks if you should speak with them or someone on their team.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                      Fundraising
                    </span>
                    <span className="text-[11px] text-slate-400">Angel & VC</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Investor Pitch & Deck</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Highlights month-over-month growth, active traction metrics, and references an attached pitch deck PDF with a polite introductory inquiry.
                  </p>
                </div>
              </div>

              {/* Personalization Tag Cheat Sheet */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Available Personalization Chips
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800">&#123;&#123;first_name&#125;&#125;</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800">&#123;&#123;company&#125;&#125;</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800">&#123;&#123;role&#125;&#125;</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800">&#123;&#123;email&#125;&#125;</span>
                  <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800">&#123;&#123;sender_name&#125;&#125;</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ATTACHMENTS GUIDE */}
          {activeGuideTab === 'attachments' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-poppins">Attaching Files & Photos in Outreach</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Attach resumes, portfolios, product screenshots, or case studies to every email in your campaign.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">PDF Documents</h4>
                  <p className="text-[11px] text-slate-500">Resumes, 1-Pagers, Pitch Decks, Case Studies, Proposals</p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 mx-auto flex items-center justify-center">
                    <Paperclip className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Images & Photos</h4>
                  <p className="text-[11px] text-slate-500">PNG, JPG, WebP screenshots, charts, profile headshots</p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2 text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs">Spam Safe Size</h4>
                  <p className="text-[11px] text-slate-500">Keep total file size under 5 MB to ensure fast inbox delivery</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs space-y-1.5">
                <span className="font-bold">Deliverability Tip:</span>
                <p>
                  Avoid sending ZIP or executable (.exe) files as recipient spam filters automatically quarantine them. PDFs and PNG/JPG images are 100% standard and deliver cleanly.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: FOLLOW-UP ENGINE */}
          {activeGuideTab === 'followups' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-poppins">The 3-Step Follow-Up Engine</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Studies show over 70% of cold email replies come from follow-up emails, not the initial message!
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">Initial Outreach</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">Day 0</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Your introductory email with primary value proposition and call to action.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/40 flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">Follow-up #1: The Gentle 3-Day Bump</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-mono">Day 3</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      A polite 2-sentence note: &ldquo;Just following up on my note below in case it got buried.&rdquo; Frequently generates 40% of campaign replies.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-sm">Follow-up #2: Value-Add or Break-up</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">Day 6</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Either share a relevant case study or send a polite &ldquo;permission to close your file&rdquo; note.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">
                  Ready to follow up on your existing campaigns?
                </span>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToTab?.('campaigns');
                  }}
                  className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <span>Go to Campaigns</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: FAQ & DELIVERABILITY */}
          {activeGuideTab === 'faq' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-poppins">Frequently Asked Questions & Deliverability</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Everything you need to know about credentials, spam avoidance, and rate limits.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs">How do I generate a Gmail App Password?</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    1. Go to your <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-indigo-600 underline font-semibold">Google Account Security page</a>.<br/>
                    2. Enable <strong>2-Step Verification</strong> if not already active.<br/>
                    3. Search for <strong>&ldquo;App passwords&rdquo;</strong>.<br/>
                    4. Create an app named &ldquo;ArticlO&rdquo; and copy the 16-character code into <strong>Settings &gt; Email Setup</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs">Why does ArticlO use a 2 emails/sec rate limit?</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Blasting 100 emails simultaneously is the #1 reason cold outbound accounts get flagged by Google and Microsoft algorithms. By pacing dispatches at 2 emails/second via BullMQ, every email looks like authentic human activity.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <h4 className="font-bold text-slate-900 text-xs">What CSV column headers are supported?</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    The importer automatically detects <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">email</code>, <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">first_name</code>, <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">company</code>, and <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[11px]">role</code>. Extra columns are preserved as custom fields!
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            ArticlO Outreach Engine • Deliverability Guaranteed
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
          >
            Got it, Let&apos;s Outreach
          </button>
        </div>

      </div>
    </div>
  );
};
