'use client';

import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import {
  Sparkles,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Rocket,
  Shield,
  Eye,
  Code2,
  Trash2,
  RefreshCw,
  Clock,
  Send,
  HelpCircle,
} from 'lucide-react';
import { Contact } from '@/types/database';
import { verifyLeadList } from '@/lib/utils/verifyEmail';

interface CampaignBuilderProps {
  onLaunchSuccess: (campaignData: any) => void;
  onCancel: () => void;
}

export const CampaignBuilder: React.FC<CampaignBuilderProps> = ({
  onLaunchSuccess,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Details
  const [campaignName, setCampaignName] = useState('');
  const [senderName, setSenderName] = useState('Outreach Team');
  const [targetAudience, setTargetAudience] = useState('B2B SaaS Founders & Growth Leads');

  // Step 2: Email Template
  const [subject, setSubject] = useState('Quick question regarding {{company}}');
  const [bodyTemplate, setBodyTemplate] = useState(
`Hi {{first_name}},

I came across {{company}} and noticed your focus on scaling outreach. As {{role}}, you likely know how frustrating it is when emails land in spam or trigger Google API limits.

We built ArticleApply to send personalized cold emails directly through your Gmail with a strict rate limiter (2 emails/sec) ensuring 100% spam-safe deliverability.

Would you be open to a 5-minute chat this week?

Best regards,
${senderName}`
  );
  const [activeEditorTab, setActiveEditorTab] = useState<'editor' | 'preview'>('editor');
  const [isEnhancingWithAI, setIsEnhancingWithAI] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTone, setAiTone] = useState<'persuasive' | 'executive' | 'casual' | 'direct'>('persuasive');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Step 3: Contacts CSV
  const [contacts, setContacts] = useState<any[]>([]);
  const [csvFileName, setCsvFileName] = useState<string | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [verificationStats, setVerificationStats] = useState<{
    verified: number;
    risky: number;
    invalid: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 4: Launching
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchError, setLaunchError] = useState<string | null>(null);

  // Variable Pill Insertion
  const insertVariable = (variable: string) => {
    if (!bodyTextareaRef.current) return;
    const textarea = bodyTextareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = bodyTemplate;
    const newText = text.substring(0, start) + `{{${variable}}}` + text.substring(end);
    setBodyTemplate(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
    }, 0);
  };

  // AI Enhancement Handler
  const handleEnhanceWithAI = async () => {
    setIsEnhancingWithAI(true);
    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          subject,
          body: bodyTemplate,
          tone: aiTone,
          targetAudience,
        }),
      });

      const data = await res.json();
      if (data.subjects && data.subjects.length > 0) {
        setAiSuggestions(data.subjects);
      }
      if (data.body) {
        setBodyTemplate(data.body);
      }
      setShowAiModal(false);
    } catch (err) {
      console.error('AI enhancement failed:', err);
    } finally {
      setIsEnhancingWithAI(false);
    }
  };

  // CSV Parsing Handler
  const handleCsvUpload = (file: File) => {
    setCsvError(null);
    setCsvFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data as Record<string, any>[];
        if (!rows || rows.length === 0) {
          setCsvError('The uploaded CSV file is empty.');
          return;
        }

        // Map column headers intelligently
        const parsed = rows.map((row, idx) => {
          const keys = Object.keys(row);
          const emailKey = keys.find((k) => /email/i.test(k)) || keys[0];
          const firstNameKey = keys.find((k) => /first.*name|fname/i.test(k));
          const lastNameKey = keys.find((k) => /last.*name|lname/i.test(k));
          const nameKey = keys.find((k) => /name|full.*name/i.test(k));
          const companyKey = keys.find((k) => /company|org|business/i.test(k));
          const roleKey = keys.find((k) => /role|title|position/i.test(k));

          let firstName = firstNameKey ? row[firstNameKey] : undefined;
          let lastName = lastNameKey ? row[lastNameKey] : undefined;

          if (!firstName && nameKey && row[nameKey]) {
            const parts = row[nameKey].trim().split(' ');
            firstName = parts[0];
            lastName = parts.slice(1).join(' ') || undefined;
          }

          return {
            id: `row-${idx}`,
            email: row[emailKey]?.trim() || '',
            first_name: firstName?.trim() || '',
            last_name: lastName?.trim() || '',
            company: (companyKey ? row[companyKey] : '')?.trim() || '',
            role: (roleKey ? row[roleKey] : '')?.trim() || '',
            custom_fields: row,
          };
        }).filter((c) => c.email && c.email.includes('@'));

        if (parsed.length === 0) {
          setCsvError('No valid contacts with email addresses found in the CSV.');
          return;
        }

        const { verified, risky, invalid } = verifyLeadList(parsed);
        setVerificationStats({
          verified: verified.length,
          risky: risky.length,
          invalid: invalid.length,
        });

        // Use verified and risky (auto-suggested) leads
        setContacts([...verified, ...risky]);
      },
      error: (err) => {
        setCsvError(`Failed to parse CSV: ${err.message}`);
      },
    });
  };

  // Load Demo Contacts
  const loadDemoContacts = () => {
    const demo = [
      { id: '1', email: 'alex.rivers@techscale.io', first_name: 'Alex', company: 'TechScale', role: 'Head of Growth' },
      { id: '2', email: 'sarah.chen@cloudpulse.ai', first_name: 'Sarah', company: 'CloudPulse', role: 'VP of Marketing' },
      { id: '3', email: 'marcus.v@finflow.co', first_name: 'Marcus', company: 'FinFlow', role: 'Founder & CEO' },
      { id: '4', email: 'elena.rostova@devsphere.dev', first_name: 'Elena', company: 'DevSphere', role: 'Director of Outreach' },
      { id: '5', email: 'david.kim@apexleads.com', first_name: 'David', company: 'ApexLeads', role: 'Growth Strategist' },
    ];
    const { verified, risky, invalid } = verifyLeadList(demo);
    setVerificationStats({
      verified: verified.length,
      risky: risky.length,
      invalid: invalid.length,
    });
    setContacts(demo);
    setCsvFileName('demo_contacts_high_growth.csv');
  };

  // Launch Campaign
  const handleLaunch = async () => {
    setIsLaunching(true);
    setLaunchError(null);

    try {
      const response = await fetch('/api/campaigns/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: campaignName,
          subject,
          bodyTemplate,
          contacts,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to launch campaign');
      }

      onLaunchSuccess(data);
    } catch (err: any) {
      setLaunchError(err.message || 'An error occurred while launching.');
      setIsLaunching(false);
    }
  };

  // Sample contact preview render
  const sampleContact = contacts[0] || {
    first_name: 'Alex',
    last_name: 'Rivers',
    company: 'TechScale',
    role: 'Head of Growth',
    email: 'alex.rivers@techscale.io',
  };

  const previewBody = bodyTemplate
    .replace(/{{\s*first_name\s*}}/gi, sampleContact.first_name || 'Alex')
    .replace(/{{\s*company\s*}}/gi, sampleContact.company || 'TechScale')
    .replace(/{{\s*role\s*}}/gi, sampleContact.role || 'Head of Growth')
    .replace(/{{\s*email\s*}}/gi, sampleContact.email || 'alex.rivers@techscale.io');

  const previewSubject = subject
    .replace(/{{\s*first_name\s*}}/gi, sampleContact.first_name || 'Alex')
    .replace(/{{\s*company\s*}}/gi, sampleContact.company || 'TechScale');

  const estimatedDurationSecs = Math.max(1, Math.round(contacts.length * 0.5));

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-6">
      {/* Stepper Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create New Campaign</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure sequence, personalize with Gemini AI, and schedule rate-limited delivery
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.04] transition"
        >
          Cancel
        </button>
      </div>

      {/* Visual Stepper */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { step: 1, label: '1. Campaign Setup' },
          { step: 2, label: '2. Email & AI Crafter' },
          { step: 3, label: '3. Contacts CSV' },
          { step: 4, label: '4. Rate-Limited Launch' },
        ].map((item) => (
          <div
            key={item.step}
            className={`py-2 px-3 rounded-xl border text-center transition-all ${
              currentStep === item.step
                ? 'bg-primary/20 border-primary text-white font-medium shadow-glow'
                : currentStep > item.step
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-medium'
                : 'bg-surface-900/40 border-white/[0.06] text-slate-500'
            }`}
          >
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: CAMPAIGN SETUP */}
      {currentStep === 1 && (
        <div className="glass-panel p-6 rounded-2xl space-y-5 animate-in fade-in duration-200">
          <h2 className="text-lg font-semibold text-white">Campaign Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Campaign Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Q4 SaaS Growth Leaders Outreach"
                className="w-full px-4 py-2.5 rounded-xl bg-surface-950/80 border border-white/[0.1] text-white text-sm focus:outline-none focus:border-primary transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Sender Display Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Alex from ArticleApply"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-950/80 border border-white/[0.1] text-white text-sm focus:outline-none focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. B2B CEOs, Growth Directors"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-950/80 border border-white/[0.1] text-white text-sm focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => {
                if (!campaignName.trim()) {
                  alert('Please enter a campaign name');
                  return;
                }
                setCurrentStep(2);
              }}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition shadow-glow flex items-center space-x-2"
            >
              <span>Next: Email & AI Crafter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: EMAIL TEMPLATE & AI */}
      {currentStep === 2 && (
        <div className="glass-panel p-6 rounded-2xl space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
            <div>
              <h2 className="text-lg font-semibold text-white">Email Template & Personalization</h2>
              <p className="text-xs text-slate-400">Use variable chips or let Gemini AI polish your copy</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAiModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-accent-purple/20 to-primary/20 hover:from-accent-purple/30 hover:to-primary/30 text-accent-purple border border-accent-purple/40 text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enhance with Gemini AI</span>
              </button>
              <div className="flex rounded-lg bg-surface-950/80 p-0.5 border border-white/[0.08]">
                <button
                  onClick={() => setActiveEditorTab('editor')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                    activeEditorTab === 'editor' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Editor
                </button>
                <button
                  onClick={() => setActiveEditorTab('preview')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                    activeEditorTab === 'preview' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Quick question regarding {{company}}"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-950/80 border border-white/[0.1] text-white text-sm font-mono focus:outline-none focus:border-primary transition"
            />
            {aiSuggestions.length > 0 && (
              <div className="pt-1.5 flex flex-wrap gap-2">
                <span className="text-[11px] text-slate-400 self-center">AI Suggestions:</span>
                {aiSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => setSubject(sug)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-primary/20 text-slate-300 hover:text-white border border-white/[0.08] transition"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Variable Chips Toolbar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400 font-medium">Insert Variable:</span>
            {['first_name', 'last_name', 'company', 'role', 'email', 'unsubscribe_url'].map((varName) => (
              <button
                key={varName}
                type="button"
                onClick={() => insertVariable(varName)}
                className="px-2.5 py-1 rounded-lg bg-surface-950 border border-primary/30 text-primary-light hover:bg-primary/20 hover:text-white text-xs font-mono transition"
              >
                {`{{${varName}}}`}
              </button>
            ))}
          </div>

          {/* Editor or Preview */}
          {activeEditorTab === 'editor' ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Email Body (HTML/Plain Text)
              </label>
              <textarea
                ref={bodyTextareaRef}
                rows={10}
                value={bodyTemplate}
                onChange={(e) => setBodyTemplate(e.target.value)}
                className="w-full p-4 rounded-xl bg-surface-950/80 border border-white/[0.1] text-white text-sm font-mono focus:outline-none focus:border-primary transition leading-relaxed"
              />
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-surface-950 border border-white/[0.08] space-y-3">
              <div className="text-xs text-slate-400 pb-2 border-b border-white/[0.06]">
                <span className="font-semibold text-slate-300">Previewing for: </span>
                <span className="text-primary-light font-mono">
                  {sampleContact.first_name} ({sampleContact.email}) at {sampleContact.company}
                </span>
              </div>
              <div className="text-sm font-bold text-white font-mono">
                Subject: {previewSubject}
              </div>
              <div className="text-sm text-slate-300 font-sans whitespace-pre-line leading-relaxed pt-2">
                {previewBody}
              </div>
            </div>
          )}

          {/* Step Actions */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl border border-white/[0.1] hover:bg-white/[0.04] text-slate-300 text-sm font-medium transition flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (!subject.trim() || !bodyTemplate.trim()) {
                  alert('Please enter both subject and body template');
                  return;
                }
                setCurrentStep(3);
              }}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition shadow-glow flex items-center space-x-2"
            >
              <span>Next: Contacts CSV</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CSV CONTACTS UPLOAD */}
      {currentStep === 3 && (
        <div className="glass-panel p-6 rounded-2xl space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div>
              <h2 className="text-lg font-semibold text-white">Import Contacts CSV</h2>
              <p className="text-xs text-slate-400">Upload a spreadsheet containing recipient emails, names, and companies</p>
            </div>
            <button
              onClick={loadDemoContacts}
              className="text-xs px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary-light border border-primary/30 font-medium transition"
            >
              ⚡ Load Sample Contacts
            </button>
          </div>

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/[0.12] hover:border-primary/50 bg-surface-950/40 hover:bg-surface-950/80 rounded-2xl p-8 text-center cursor-pointer transition group"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleCsvUpload(file);
              }}
            />
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition mx-auto flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-white">Click or drag & drop CSV file here</p>
            <p className="text-xs text-slate-500 mt-1">Accepts headers like email, first_name, company, role</p>
          </div>

          {csvError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{csvError}</span>
            </div>
          )}

          {/* Contacts Preview Table */}
          {contacts.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-emerald-400 flex items-center bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {verificationStats?.verified ?? contacts.length} Verified Deliverable
                  </span>
                  {verificationStats && verificationStats.risky > 0 && (
                    <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg font-medium">
                      ⚠️ {verificationStats.risky} Typos Corrected
                    </span>
                  )}
                  {verificationStats && verificationStats.invalid > 0 && (
                    <span className="text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg font-medium">
                      🛡️ {verificationStats.invalid} Disposable Filtered
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setContacts([]);
                    setCsvFileName(null);
                    setVerificationStats(null);
                  }}
                  className="text-slate-400 hover:text-rose-400 transition flex items-center space-x-1 self-start sm:self-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/[0.08] bg-surface-950/60 max-h-56">
                <table className="w-full text-left text-xs">
                  <thead className="bg-surface-900/80 text-slate-400 uppercase font-mono tracking-wider border-b border-white/[0.06]">
                    <tr>
                      <th className="p-2.5">Email</th>
                      <th className="p-2.5">First Name</th>
                      <th className="p-2.5">Company</th>
                      <th className="p-2.5">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-slate-300">
                    {contacts.slice(0, 5).map((c, i) => (
                      <tr key={i} className="hover:bg-white/[0.02]">
                        <td className="p-2.5 font-mono text-white">{c.email}</td>
                        <td className="p-2.5">{c.first_name || '—'}</td>
                        <td className="p-2.5">{c.company || '—'}</td>
                        <td className="p-2.5">{c.role || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {contacts.length > 5 && (
                <p className="text-[11px] text-slate-500 text-center">
                  + {contacts.length - 5} more contacts ready for sequential delivery
                </p>
              )}
            </div>
          )}

          {/* Step Actions */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl border border-white/[0.1] hover:bg-white/[0.04] text-slate-300 text-sm font-medium transition flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (contacts.length === 0) {
                  alert('Please upload or load at least 1 contact');
                  return;
                }
                setCurrentStep(4);
              }}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition shadow-glow flex items-center space-x-2"
            >
              <span>Next: Review & Launch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & RATE-LIMITED LAUNCH */}
      {currentStep === 4 && (
        <div className="glass-panel p-6 rounded-2xl space-y-6 animate-in fade-in duration-200">
          <div className="pb-3 border-b border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white">Review & Queue Launch</h2>
            <p className="text-xs text-slate-400">Confirm email template and delivery rate settings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campaign Summary */}
            <div className="p-4 rounded-xl bg-surface-950/80 border border-white/[0.08] space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Campaign Summary
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Name:</span>
                  <span className="font-semibold text-white">{campaignName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Sender:</span>
                  <span>{senderName}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Audience:</span>
                  <span>{targetAudience}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Recipients:</span>
                  <span className="text-emerald-400 font-bold">{contacts.length} Contacts</span>
                </div>
              </div>
            </div>

            {/* BullMQ Rate-Limiter Safeguard */}
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
              <div className="flex items-center space-x-2 text-cyan-400">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Anti-Spam Rate Protection
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                ArticleApply sends emails sequentially at a rate of <strong>2 emails / second</strong> via BullMQ. This strictly protects your Gmail domain reputation and prevents API throttling.
              </p>
              <div className="flex items-center space-x-2 text-xs font-mono text-cyan-300">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimated duration: ~{estimatedDurationSecs} seconds</span>
              </div>
            </div>
          </div>

          {/* Email Preview Snippet */}
          <div className="p-4 rounded-xl bg-surface-950/80 border border-white/[0.08] space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Live Sample Render
            </span>
            <div className="text-xs text-white font-mono">
              <span className="text-slate-400">Subject: </span>{previewSubject}
            </div>
            <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed border-t border-white/[0.04] pt-2">
              {previewBody}
            </div>
          </div>

          {launchError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{launchError}</span>
            </div>
          )}

          {/* Launch Buttons */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl border border-white/[0.1] hover:bg-white/[0.04] text-slate-300 text-sm font-medium transition flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleLaunch}
              disabled={isLaunching}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-accent-cyan hover:from-primary-hover hover:to-cyan-600 text-white font-bold text-sm shadow-glow transition-all active:scale-[0.98] flex items-center space-x-2 disabled:opacity-50"
            >
              {isLaunching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Enqueuing Campaign...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  <span>Launch Campaign ({contacts.length} Emails)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* GEMINI AI ENHANCEMENT MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="glass-panel p-6 rounded-2xl max-w-lg w-full border border-accent-purple/30 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center space-x-2 text-accent-purple">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">Gemini AI Email Enhancer</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Desired Copywriting Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'persuasive', label: 'Persuasive & High Reply' },
                    { id: 'executive', label: 'Executive Concise (<80 words)' },
                    { id: 'casual', label: 'Casual & Warm' },
                    { id: 'direct', label: 'Direct Value-Driven' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setAiTone(t.id as any)}
                      className={`p-2 rounded-xl text-xs font-medium border text-left transition ${
                        aiTone === t.id
                          ? 'bg-accent-purple/20 border-accent-purple text-white'
                          : 'bg-surface-950/60 border-white/[0.08] text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Custom Prompt / Value Proposition (Optional)
                </label>
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Focus on our 99.4% deliverability guarantee"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-950/80 border border-white/[0.1] text-white text-xs focus:outline-none focus:border-accent-purple transition"
                />
              </div>

              <div className="text-[11px] text-slate-400 bg-surface-950/60 p-2.5 rounded-xl border border-white/[0.04]">
                🤖 Gemini 2.5 Flash preserves all variable placeholders like <code className="text-primary-light">{"{{first_name}}"}</code> and optimizes subject lines for maximum open rates.
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 rounded-xl border border-white/[0.1] text-slate-300 text-xs font-medium hover:bg-white/[0.04] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEnhanceWithAI}
                disabled={isEnhancingWithAI}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-accent-purple to-primary hover:opacity-90 text-white text-xs font-semibold shadow-glow transition flex items-center space-x-1.5 disabled:opacity-50"
              >
                {isEnhancingWithAI ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Gemini is rewriting...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply AI Enhancement</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
