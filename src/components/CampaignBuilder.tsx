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
  Download,
} from 'lucide-react';
import { Contact } from '@/types/database';
import { verifyLeadList } from '@/lib/utils/verifyEmail';
import { RAW_50_SAMPLE_CONTACTS, downloadSampleCSVFile } from '@/lib/data/sampleContacts';

interface CampaignBuilderProps {
  onLaunchSuccess: (campaignData: any) => void;
  onCancel: () => void;
  userEmail?: string | null;
  userName?: string | null;
}

export const CampaignBuilder: React.FC<CampaignBuilderProps> = ({
  onLaunchSuccess,
  onCancel,
  userEmail,
  userName,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Details
  const [campaignName, setCampaignName] = useState('');
  const [senderName, setSenderName] = useState(userName || 'Alex Outreach');
  const [targetAudience, setTargetAudience] = useState('B2B SaaS Founders & Growth Leads');

  // Step 2: Email Template
  const [subject, setSubject] = useState('Quick question regarding {{company}}');
  const [bodyTemplate, setBodyTemplate] = useState(
`Hi {{first_name}},

I came across {{company}} and noticed your focus on scaling outreach. As {{role}}, you likely know how frustrating it is when emails land in spam or trigger Google API limits.

We built ArticlO to send personalized cold emails directly through your Gmail with a strict rate limiter (2 emails/sec) ensuring 100% spam-safe deliverability.

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
      const response = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          bodyTemplate,
          tone: aiTone,
          customPrompt: aiPrompt,
        }),
      });

      const data = await response.json();
      const updatedBody = data.enhancedBody || data.body;
      const suggestions = data.subjectSuggestions || data.subjects || [];

      if (updatedBody) {
        setBodyTemplate(updatedBody);
      }
      if (suggestions.length > 0) {
        setAiSuggestions(suggestions);
        setSubject(suggestions[0]);
      }
      setShowAiModal(false);
    } catch (err) {
      console.error('Failed to enhance template:', err);
    } finally {
      setIsEnhancingWithAI(false);
    }
  };

  // Handle CSV file upload
  const handleCsvUpload = (file: File) => {
    setCsvError(null);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rawData = results.data as Record<string, string>[];
        if (rawData.length === 0) {
          setCsvError('Uploaded CSV file is empty.');
          return;
        }

        const parsedContacts = rawData
          .map((row, index) => {
            const keys = Object.keys(row);
            const emailKey = keys.find((k) => /email/i.test(k));
            const firstNameKey = keys.find((k) => /first.*name|fname/i.test(k));
            const lastNameKey = keys.find((k) => /last.*name|lname/i.test(k));
            const companyKey = keys.find((k) => /company|org|business/i.test(k));
            const roleKey = keys.find((k) => /role|title|position/i.test(k));

            const email = (emailKey ? row[emailKey] : row['email'])?.trim();
            if (!email) return null;

            return {
              id: `temp-${index + 1}`,
              email,
              first_name: firstNameKey ? row[firstNameKey]?.trim() : (row['first_name'] || null),
              last_name: lastNameKey ? row[lastNameKey]?.trim() : (row['last_name'] || null),
              company: companyKey ? row[companyKey]?.trim() : (row['company'] || null),
              role: roleKey ? row[roleKey]?.trim() : (row['role'] || null),
            };
          })
          .filter(Boolean);

        if (parsedContacts.length === 0) {
          setCsvError('No valid contacts found. Ensure the CSV has an "email" column.');
          return;
        }

        const { verified, risky, invalid } = verifyLeadList(parsedContacts);
        setVerificationStats({
          verified: verified.length,
          risky: risky.length,
          invalid: invalid.length,
        });
        setContacts(parsedContacts);
        setCsvFileName(file.name);
      },
      error: (err) => {
        setCsvError(`Failed to parse CSV: ${err.message}`);
      },
    });
  };

  // Load 50 Sample Contacts
  const loadDemoContacts = () => {
    const sample50 = RAW_50_SAMPLE_CONTACTS.map((c, i) => ({
      id: `builder-sample-${i + 1}`,
      email: c.email,
      first_name: c.first_name,
      last_name: c.last_name,
      company: c.company,
      role: c.role,
    }));
    const { verified, risky, invalid } = verifyLeadList(sample50);
    setVerificationStats({
      verified: verified.length,
      risky: risky.length,
      invalid: invalid.length,
    });
    setContacts(sample50);
    setCsvFileName('artiapply_50_sample_contacts.csv');
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
          userEmail,
          userName,
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
    <div className="max-w-4xl mx-auto pb-16 space-y-6 pt-2">
      {/* Stepper Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create New Campaign</h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Configure sequence, personalize with Gemini AI, and schedule rate-limited delivery
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-xs text-slate-600 hover:text-slate-900 px-3.5 py-1.5 rounded-full border border-slate-200 hover:bg-slate-50 transition"
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
            className={`py-2 px-3 rounded-full border text-center transition-all ${
              currentStep === item.step
                ? 'bg-slate-900 border-slate-900 text-white font-medium shadow-sm'
                : currentStep > item.step
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium'
                : 'bg-white border-slate-200 text-slate-500'
            }`}
          >
            <span className="text-xs">{item.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: CAMPAIGN SETUP */}
      {currentStep === 1 && (
        <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-5 animate-in fade-in duration-200">
          <h2 className="text-lg font-bold text-slate-900 font-poppins">Campaign Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Campaign Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Q4 SaaS Growth Leaders Outreach"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-slate-900 shadow-sm transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Sender Display Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="e.g. Alex from ArticlO"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-slate-900 shadow-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. B2B CEOs, Growth Directors"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-slate-900 shadow-sm transition"
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
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition shadow-sm flex items-center space-x-2"
            >
              <span>Next: Email & AI Crafter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: EMAIL TEMPLATE & AI */}
      {currentStep === 2 && (
        <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-poppins">Email Template & Personalization</h2>
              <p className="text-xs text-slate-500">Use variable chips or let Gemini AI polish your copy</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAiModal(true)}
                className="px-3.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Enhance with Gemini AI</span>
              </button>
              <div className="flex rounded-full bg-slate-100 p-0.5 border border-slate-200">
                <button
                  onClick={() => setActiveEditorTab('editor')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    activeEditorTab === 'editor' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Editor
                </button>
                <button
                  onClick={() => setActiveEditorTab('preview')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                    activeEditorTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Quick question regarding {{company}}"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-mono focus:outline-none focus:border-slate-900 shadow-sm transition"
            />
            {aiSuggestions.length > 0 && (
              <div className="pt-1.5 flex flex-wrap gap-2">
                <span className="text-[11px] text-slate-500 self-center">AI Suggestions:</span>
                {aiSuggestions.map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => setSubject(sug)}
                    className="text-xs px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Variable Chips Toolbar */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 font-medium">Insert Variable:</span>
            {['first_name', 'last_name', 'company', 'role', 'email', 'unsubscribe_url'].map((varName) => (
              <button
                key={varName}
                type="button"
                onClick={() => insertVariable(varName)}
                className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 text-xs font-mono transition"
              >
                {`{{${varName}}}`}
              </button>
            ))}
          </div>

          {/* Editor or Preview */}
          {activeEditorTab === 'editor' ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Email Body (HTML/Plain Text)
              </label>
              <textarea
                ref={bodyTextareaRef}
                rows={10}
                value={bodyTemplate}
                onChange={(e) => setBodyTemplate(e.target.value)}
                className="w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-mono focus:outline-none focus:border-slate-900 shadow-sm transition leading-relaxed"
              />
            </div>
          ) : (
            <div className="p-5 sm:p-6 rounded-[22px] bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="text-xs text-slate-500 pb-2 border-b border-slate-200">
                <span className="font-semibold text-slate-700">Previewing for: </span>
                <span className="text-slate-900 font-mono">
                  {sampleContact.first_name} ({sampleContact.email}) at {sampleContact.company}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 font-mono">
                Subject: {previewSubject}
              </div>
              <div className="text-sm text-slate-800 font-sans whitespace-pre-line leading-relaxed pt-2">
                {previewBody}
              </div>
            </div>
          )}

          {/* Step Actions */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition flex items-center space-x-2"
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
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition shadow-sm flex items-center space-x-2"
            >
              <span>Next: Contacts CSV</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CSV CONTACTS UPLOAD */}
      {currentStep === 3 && (
        <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-poppins">Import Contacts CSV</h2>
              <p className="text-xs text-slate-500">Upload a spreadsheet containing recipient emails, names, and companies</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={downloadSampleCSVFile}
                className="text-xs px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium transition flex items-center space-x-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download Sample (50)</span>
              </button>
              <button
                type="button"
                onClick={loadDemoContacts}
                className="text-xs px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold transition"
              >
                ⚡ Load 50 Samples
              </button>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-slate-500 bg-slate-50/60 rounded-[22px] p-8 text-center cursor-pointer transition group"
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
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 mx-auto flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-900 font-poppins">Click or drag & drop CSV file here</p>
            <p className="text-xs text-slate-500 mt-1">Accepts headers like email, first_name, company, role</p>
          </div>

          {csvError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{csvError}</span>
            </div>
          )}

          {/* Contacts Preview Table */}
          {contacts.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-emerald-700 flex items-center bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    {verificationStats?.verified ?? contacts.length} Verified Deliverable
                  </span>
                  {verificationStats && verificationStats.risky > 0 && (
                    <span className="text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-medium">
                      ⚠️ {verificationStats.risky} Typos Corrected
                    </span>
                  )}
                  {verificationStats && verificationStats.invalid > 0 && (
                    <span className="text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full font-medium">
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
                  className="text-slate-500 hover:text-rose-600 transition flex items-center space-x-1 self-start sm:self-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-[20px] border border-slate-200/80 bg-white max-h-56 shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 text-slate-500 uppercase font-mono tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="p-3 font-semibold">Email</th>
                      <th className="p-3 font-semibold">First Name</th>
                      <th className="p-3 font-semibold">Company</th>
                      <th className="p-3 font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {contacts.slice(0, 5).map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono text-slate-900 font-medium">{c.email}</td>
                        <td className="p-3">{c.first_name || '—'}</td>
                        <td className="p-3">{c.company || '—'}</td>
                        <td className="p-3">{c.role || '—'}</td>
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
              className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition flex items-center space-x-2"
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
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition shadow-sm flex items-center space-x-2"
            >
              <span>Next: Review & Launch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW & RATE-LIMITED LAUNCH */}
      {currentStep === 4 && (
        <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-6 animate-in fade-in duration-200">
          <div className="pb-3 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 font-poppins">Review & Queue Launch</h2>
            <p className="text-xs text-slate-500">Confirm email template and delivery rate settings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Campaign Summary */}
            <div className="p-5 rounded-[22px] bg-slate-50/80 border border-slate-200/80 space-y-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Campaign Summary
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Name:</span>
                  <span className="font-semibold text-slate-900">{campaignName}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Sender:</span>
                  <span>{senderName}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Audience:</span>
                  <span>{targetAudience}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Recipients:</span>
                  <span className="text-emerald-700 font-bold">{contacts.length} Contacts</span>
                </div>
              </div>
            </div>

            {/* Anti-Spam Safeguard */}
            <div className="p-5 rounded-[22px] bg-sky-50/80 border border-sky-200 space-y-2">
              <div className="flex items-center space-x-2 text-sky-800">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Anti-Spam Rate Protection
                </span>
              </div>
              <p className="text-xs text-sky-900 leading-relaxed">
                ArticlO sends emails sequentially at a rate of <strong>2 emails / second</strong> via BullMQ. This strictly protects your Gmail domain reputation and prevents API throttling.
              </p>
              <div className="flex items-center space-x-2 text-xs font-mono text-sky-700 pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Estimated duration: ~{estimatedDurationSecs} seconds</span>
              </div>
            </div>
          </div>

          {/* Email Preview Snippet */}
          <div className="p-5 rounded-[22px] bg-slate-50/80 border border-slate-200/80 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Live Sample Render
            </span>
            <div className="text-xs text-slate-900 font-mono">
              <span className="text-slate-500">Subject: </span>{previewSubject}
            </div>
            <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed border-t border-slate-200 pt-2 font-sans">
              {previewBody}
            </div>
          </div>

          {launchError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{launchError}</span>
            </div>
          )}

          {/* Launch Buttons */}
          <div className="pt-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium transition flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={handleLaunch}
              disabled={isLaunching}
              className="px-8 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-[0_2px_8px_rgba(15,23,42,0.18)] transition-all active:scale-[0.98] flex items-center space-x-2 disabled:opacity-50"
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white p-6 sm:p-7 rounded-[28px] max-w-lg w-full border border-slate-200/90 space-y-4 shadow-[0_20px_50px_rgba(15,23,42,0.15)]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5 text-purple-700">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-base font-poppins">Gemini AI Email Enhancer</h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs p-1.5 rounded-full hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
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
                      className={`p-3 rounded-[18px] text-xs font-medium border text-left transition ${
                        aiTone === t.id
                          ? 'bg-purple-50 border-purple-300 text-purple-800 font-semibold shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Custom Prompt / Value Proposition (Optional)
                </label>
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Focus on our 99.4% deliverability guarantee"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-900 shadow-sm transition"
                />
              </div>

              <div className="text-[11px] text-slate-600 bg-slate-50/80 p-3.5 rounded-[18px] border border-slate-200/80">
                🤖 Gemini AI preserves all variable placeholders like <code className="text-slate-900 font-semibold">{"{{first_name}}"}</code> and optimizes subject lines for maximum open rates.
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 rounded-full border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEnhanceWithAI}
                disabled={isEnhancingWithAI}
                className="px-5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1.5 disabled:opacity-50"
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
