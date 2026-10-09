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
  Paperclip,
  Image as ImageIcon,
  FileText,
  RotateCcw,
  Plus,
  Check,
  Minus,
  Maximize2,
  Minimize2,
  X,
  Smile,
  Link as LinkIcon,
  PenTool,
  MoreVertical,
  ChevronDown,
} from 'lucide-react';
import { Contact, EmailAttachment, CampaignFollowUp } from '@/types/database';
import { verifyLeadList } from '@/lib/utils/verifyEmail';
import { RAW_50_SAMPLE_CONTACTS, downloadSampleCSVFile } from '@/lib/data/sampleContacts';
import { EmailTemplatesModal } from './EmailTemplatesModal';
import { EmailTemplate } from '@/lib/data/emailTemplates';

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
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [aiTone, setAiTone] = useState<'persuasive' | 'executive' | 'casual' | 'direct'>('persuasive');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Gmail Compose UI States
  const [showSnippetsMenu, setShowSnippetsMenu] = useState(false);
  const [showVariablesMenu, setShowVariablesMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // Quick Inline AI Draft Handler (triggers from the Gmail Describe your message pill)
  const handleQuickAiDraft = async () => {
    if (!aiPrompt.trim()) return;
    setIsEnhancingWithAI(true);
    try {
      const response = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject || 'Quick question',
          bodyTemplate: bodyTemplate,
          tone: 'persuasive',
          customPrompt: aiPrompt,
        }),
      });
      const data = await response.json();
      if (data.enhancedBody || data.body) {
        setBodyTemplate(data.enhancedBody || data.body);
      }
      if (data.subjectSuggestions?.[0] || data.subjects?.[0]) {
        setSubject(data.subjectSuggestions?.[0] || data.subjects?.[0]);
      }
      setAiPrompt('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancingWithAI(false);
    }
  };

  // Step 2 Attachments (Photos and Files)
  const [attachments, setAttachments] = useState<EmailAttachment[]>([]);

  // Step 2 Follow-Up Sequencing
  const [enableFollowUps, setEnableFollowUps] = useState(false);
  const [followUps, setFollowUps] = useState<CampaignFollowUp[]>([
    {
      id: 'step-fu-1',
      step_number: 1,
      delay_days: 3,
      subject: '',
      body_template: `Hi {{first_name}},\n\nFollowing up briefly on my previous email in case it got buried in your inbox.\n\nWould you be open to a 5-minute chat this week?\n\nBest regards,\n${senderName}`,
    },
  ]);

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

  // Helper Snippets Insertion
  const insertSnippet = (snippet: string) => {
    if (!bodyTextareaRef.current) return;
    const textarea = bodyTextareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = bodyTemplate;
    const newText = text.substring(0, start) + snippet + text.substring(end);
    setBodyTemplate(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 0);
  };

  // Attachment Handler
  const handleAttachmentFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        alert(`File "${file.name}" is over 8MB. Maximum attachment size is 8MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const isImage = file.type.startsWith('image/');
        const newAtt: EmailAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          filename: file.name,
          contentType: file.type || 'application/octet-stream',
          size: file.size,
          data: result,
          isImage,
        };
        setAttachments((prev) => [...prev, newAtt]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeAttachment = (id?: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleApplyTemplate = (tmpl: EmailTemplate) => {
    setSubject(tmpl.subject);
    setBodyTemplate(tmpl.body.replace(/\{\{\s*sender_name\s*\}\}/g, senderName));
  };

  // Follow-up Step Management
  const addFollowUpStep = () => {
    const nextStepNum = followUps.length + 1;
    const nextDelay = nextStepNum === 2 ? 5 : 7;
    const newStep: CampaignFollowUp = {
      id: `step-fu-${Date.now()}`,
      step_number: nextStepNum,
      delay_days: nextDelay,
      subject: `Re: ${subject}`,
      body_template: `Hi {{first_name}},\n\nWanted to quickly circle back on my previous email regarding {{company}}.\n\nBest,\n${senderName}`,
    };
    setFollowUps((prev) => [...prev, newStep]);
  };

  const removeFollowUpStep = (id: string) => {
    setFollowUps((prev) => prev.filter((s) => s.id !== id));
  };

  const updateFollowUpStep = (id: string, updates: Partial<CampaignFollowUp>) => {
    setFollowUps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
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
          attachments,
          follow_ups: enableFollowUps ? followUps : [],
          userEmail,
          userName: senderName,
          senderName,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to launch campaign');
      }

      onLaunchSuccess({
        ...data,
        attachments,
        follow_ups: enableFollowUps ? followUps : [],
      });
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
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 font-poppins">Campaign Details</h2>
            <p className="text-xs text-slate-500 mt-0.5">Name your sequence to begin crafting your outreach message.</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Campaign Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Q4 SaaS Founders Outreach"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-slate-900 shadow-sm transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Target Audience <span className="text-slate-400 font-normal">(Optional)</span>
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

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => {
                if (!campaignName.trim()) {
                  alert('Please enter a campaign name');
                  return;
                }
                setCurrentStep(2);
              }}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition shadow-sm flex items-center space-x-2 active:scale-95"
            >
              <span>Next: Compose Email</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: GMAIL-STYLE EMAIL CRAFTER */}
      {currentStep === 2 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Top helper header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-poppins">Craft Email</h2>
              <p className="text-xs text-slate-500">
                Compose in a clean Gmail-style editor. Attach files, prompt AI, or apply battle-tested formats.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowTemplatesModal(true)}
                className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>10 Pro Formats</span>
              </button>
            </div>
          </div>

          {/* Clean Gmail Compose Window Frame (matches user reference image) */}
          <div
            className={`bg-white rounded-2xl border border-slate-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col transition-all ${
              isMaximized ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : 'min-h-[500px]'
            }`}
          >
            {/* Top Blue Window Bar (#f2f6fc) */}
            <div className="bg-[#f2f6fc] px-4 py-2.5 flex items-center justify-between border-b border-slate-200/80 select-none">
              <span className="text-xs sm:text-sm font-semibold text-[#041e49]">
                New Message
              </span>
              <div className="flex items-center space-x-1.5 text-slate-500">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  title="Minimize / Back to Step 1"
                  className="p-1 hover:text-slate-800 rounded hover:bg-slate-200/60 transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMaximized((prev) => !prev)}
                  title={isMaximized ? 'Restore down' : 'Full screen'}
                  className="p-1 hover:text-slate-800 rounded hover:bg-slate-200/60 transition"
                >
                  {isMaximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  title="Close"
                  className="p-1 hover:text-slate-800 rounded hover:bg-slate-200/60 transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 'To' Field Row */}
            <div className="flex items-center px-4 py-2.5 border-b border-slate-200/70 text-xs">
              <span className="text-[#444746] font-medium w-12 shrink-0">To</span>
              <div className="flex-1 flex items-center space-x-1.5 overflow-hidden">
                <span className="bg-[#e8f0fe] text-[#1a73e8] px-2.5 py-0.5 rounded-full font-medium text-xs flex items-center">
                  Campaign Contacts (&#123;&#123;email&#125;&#125;)
                </span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-slate-500 font-medium">
                <span
                  onClick={() => insertVariable('first_name')}
                  className="hover:text-[#0b57d0] cursor-pointer transition select-none"
                  title="Add personalized first name"
                >
                  Cc
                </span>
                <span
                  onClick={() => insertVariable('company')}
                  className="hover:text-[#0b57d0] cursor-pointer transition select-none"
                  title="Add company variable"
                >
                  Bcc
                </span>
              </div>
            </div>

            {/* 'Subject' Field Row */}
            <div className="px-4 py-2 border-b border-slate-200/70">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full text-sm text-slate-900 placeholder-[#747775] bg-transparent outline-none font-normal"
              />
            </div>

            {/* Message Body Canvas */}
            <div className="p-4 flex-1 flex flex-col min-h-[260px] bg-white">
              <textarea
                ref={bodyTextareaRef}
                rows={11}
                value={bodyTemplate}
                onChange={(e) => setBodyTemplate(e.target.value)}
                placeholder="Write your email here..."
                className="w-full flex-1 text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none resize-none leading-relaxed font-sans"
              />

              {/* Attached Files & Photos Chips */}
              {attachments.length > 0 && (
                <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2 text-xs shadow-sm"
                    >
                      {att.isImage ? (
                        <div className="w-5 h-5 rounded overflow-hidden shrink-0 border border-slate-200">
                          <img src={att.data} alt={att.filename} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                      )}
                      <span className="font-medium text-slate-700 truncate max-w-[140px] text-[11px]">
                        {att.filename}
                      </span>
                      <span className="text-[10px] text-slate-400">({formatFileSize(att.size)})</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Prompt Pill (matching user attached reference screenshot) */}
            <div className="mx-4 mb-3 rounded-full bg-[#f0f4f9] px-4 py-2 flex items-center space-x-2 border border-slate-200/60 shadow-inner group focus-within:border-[#0b57d0]/40">
              <Sparkles className="w-4 h-4 text-[#0b57d0] shrink-0" />
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleQuickAiDraft();
                  }
                }}
                placeholder="Describe your message"
                className="w-full text-xs sm:text-sm bg-transparent outline-none text-slate-800 placeholder-[#444746]"
              />
              <button
                type="button"
                onClick={handleQuickAiDraft}
                disabled={isEnhancingWithAI || !aiPrompt.trim()}
                className="px-3.5 py-1 rounded-full bg-white text-[#0b57d0] hover:bg-slate-50 disabled:opacity-40 font-semibold text-xs border border-slate-200 shrink-0 shadow-sm transition active:scale-95"
              >
                {isEnhancingWithAI ? 'Drafting...' : '✨ Draft'}
              </button>
            </div>

            {/* Gmail Bottom Action Toolbar (matching reference screenshot) */}
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between bg-white rounded-b-2xl relative">
              {/* Left Side: Send Button & Action Icons */}
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                {/* Send Pill Button */}
                <div className="flex rounded-full overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => {
                      if (!subject.trim() || !bodyTemplate.trim()) {
                        alert('Please enter both subject and email body.');
                        return;
                      }
                      setCurrentStep(3);
                    }}
                    className="px-5 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs sm:text-sm font-semibold transition active:scale-95"
                  >
                    Send
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!subject.trim() || !bodyTemplate.trim()) {
                        alert('Please enter both subject and email body.');
                        return;
                      }
                      setCurrentStep(3);
                    }}
                    className="px-2 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white border-l border-blue-400/30 transition"
                    title="Next Step: Contacts"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Aa Formatting Snippets */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSnippetsMenu((prev) => !prev)}
                    title="Formatting & Writing Snippets"
                    className={`p-2 rounded-full hover:bg-slate-100 text-slate-600 transition ${
                      showSnippetsMenu ? 'bg-slate-100 text-slate-900' : ''
                    }`}
                  >
                    <span className="font-bold text-xs font-serif leading-none">Aa</span>
                  </button>
                  {showSnippetsMenu && (
                    <div className="absolute bottom-11 left-0 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 w-52 z-30 text-xs space-y-1">
                      <p className="px-2.5 py-1 text-[10px] font-bold uppercase text-slate-400">Quick Snippets</p>
                      <button
                        type="button"
                        onClick={() => {
                          insertSnippet(`\n\nBest regards,\n${senderName}`);
                          setShowSnippetsMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700"
                      >
                        ✍️ Signature
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          insertSnippet('\n• Key point 1: \n• Key point 2: \n• Key point 3: \n');
                          setShowSnippetsMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700"
                      >
                        📋 3-Bullet Points
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          insertSnippet('\nWould you be open to a quick 5-minute chat this week?\n');
                          setShowSnippetsMenu(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700"
                      >
                        💬 Meeting Call CTA
                      </button>
                    </div>
                  )}
                </div>

                {/* ✨ Templates Browser */}
                <button
                  type="button"
                  onClick={() => setShowTemplatesModal(true)}
                  title="Browse 10 Professional Email Formats"
                  className="p-2 rounded-full hover:bg-slate-100 text-[#0b57d0] hover:text-[#0842a0] transition"
                >
                  <Sparkles className="w-4 h-4" />
                </button>

                {/* 📎 Attach Documents/Files */}
                <button
                  type="button"
                  onClick={() => attachmentInputRef.current?.click()}
                  title="Attach files (PDF, DOCX, XLSX, max 8MB)"
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* 🔗 Insert Unsubscribe Link */}
                <button
                  type="button"
                  onClick={() => insertVariable('unsubscribe_url')}
                  title="Insert Unsubscribe Link"
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>

                {/* 😊 Insert Variables */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowVariablesMenu((prev) => !prev)}
                    title="Insert Personalization Variables"
                    className={`p-2 rounded-full hover:bg-slate-100 text-slate-600 transition ${
                      showVariablesMenu ? 'bg-slate-100 text-slate-900' : ''
                    }`}
                  >
                    <Smile className="w-4 h-4" />
                  </button>
                  {showVariablesMenu && (
                    <div className="absolute bottom-11 left-0 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 w-48 z-30 text-xs space-y-1">
                      <p className="px-2.5 py-1 text-[10px] font-bold uppercase text-slate-400">Insert Variable</p>
                      {['first_name', 'last_name', 'company', 'role', 'email'].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            insertVariable(v);
                            setShowVariablesMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-50 text-slate-700 font-mono text-[11px]"
                        >
                          &#123;&#123;{v}&#125;&#125;
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 🖼️ Attach Photos */}
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  title="Attach photos or screenshots"
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                {/* ✍️ Signature */}
                <button
                  type="button"
                  onClick={() => insertSnippet(`\n\nBest regards,\n${senderName}`)}
                  title="Insert Professional Signature"
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition"
                >
                  <PenTool className="w-4 h-4" />
                </button>

                {/* Hidden Inputs */}
                <input
                  type="file"
                  ref={attachmentInputRef}
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.csv,.xlsx,.pptx"
                  className="hidden"
                  onChange={handleAttachmentFiles}
                />
                <input
                  type="file"
                  ref={photoInputRef}
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleAttachmentFiles}
                />
              </div>

              {/* Right Side: Clear draft */}
              <div className="flex items-center space-x-1 text-slate-500">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Clear email draft?')) {
                      setBodyTemplate('');
                      setAttachments([]);
                    }
                  }}
                  title="Discard draft"
                  className="p-2 rounded-full hover:bg-slate-100 hover:text-rose-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Simple Follow-Up Sequence Checkbox */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between text-xs">
            <label className="flex items-center space-x-2.5 cursor-pointer text-slate-700 font-medium">
              <input
                type="checkbox"
                checked={enableFollowUps}
                onChange={(e) => setEnableFollowUps(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-0"
              />
              <span>Schedule an automated follow-up sequence if contact doesn&apos;t reply in 3 days</span>
            </label>
            {enableFollowUps && (
              <span className="text-[11px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Follow-up Enabled (Day 3)
              </span>
            )}
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Setup</span>
            </button>
            <button
              onClick={() => {
                if (!subject.trim() || !bodyTemplate.trim()) {
                  alert('Please enter both subject and email body.');
                  return;
                }
                setCurrentStep(3);
              }}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm active:scale-95"
            >
              <span>Next: Contacts CSV</span>
              <ArrowRight className="w-3.5 h-3.5" />
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
                {attachments.length > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500">Attachments:</span>
                    <span className="text-indigo-700 font-semibold flex items-center">
                      <Paperclip className="w-3 h-3 mr-1" />
                      {attachments.length} files ({formatFileSize(attachments.reduce((acc, a) => acc + a.size, 0))})
                    </span>
                  </div>
                )}
                {enableFollowUps && (
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-500">Sequenced Steps:</span>
                    <span className="text-sky-700 font-semibold flex items-center">
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Initial + {followUps.length} Follow-up{followUps.length > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
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

          {/* Email Preview Snippet with attachments list */}
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
            {attachments.length > 0 && (
              <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-slate-500 flex items-center font-medium">
                  <Paperclip className="w-3 h-3 mr-1" /> Attachments:
                </span>
                {attachments.map((att) => (
                  <span key={att.id} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                    {att.filename}
                  </span>
                ))}
              </div>
            )}
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

      {/* PROFESSIONAL EMAIL FORMATS MODAL */}
      <EmailTemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        onSelectTemplate={handleApplyTemplate}
        senderName={senderName}
      />
    </div>
  );
};
