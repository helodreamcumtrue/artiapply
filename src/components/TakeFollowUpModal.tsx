'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  RotateCcw,
  Send,
  FileText,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import { Campaign, Contact, EmailAttachment } from '@/types/database';
import { PROFESSIONAL_EMAIL_TEMPLATES } from '@/lib/data/emailTemplates';

interface TakeFollowUpModalProps {
  isOpen: boolean;
  campaign: Campaign | null;
  contacts: Contact[];
  onClose: () => void;
  onFollowUpSuccess: (campaignId: string, updatedContacts: Contact[], followUpDetails: any) => void;
  userEmail?: string | null;
  userName?: string | null;
}

export const TakeFollowUpModal: React.FC<TakeFollowUpModalProps> = ({
  isOpen,
  campaign,
  contacts,
  onClose,
  onFollowUpSuccess,
  userEmail,
  userName,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<'bump' | 'value' | 'breakup' | 'custom'>('bump');
  const [subject, setSubject] = useState('');
  const [bodyTemplate, setBodyTemplate] = useState('');
  const [targetAudience, setTargetAudience] = useState<'all' | 'sent_only'>('all');
  const [attachments, setAttachments] = useState<EmailAttachment[]>([]);
  const [isDispatching, setIsDispatching] = useState(false);
  const [progressIndex, setProgressIndex] = useState(0);
  const [sentSuccessCount, setSentSuccessCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [dispatchFinished, setDispatchFinished] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize subject and body when campaign or preset changes
  React.useEffect(() => {
    if (!campaign) return;

    const baseSubject = campaign.subject.startsWith('Re:')
      ? campaign.subject
      : `Re: ${campaign.subject}`;

    setSubject(baseSubject);

    if (selectedPreset === 'bump') {
      const tmpl = PROFESSIONAL_EMAIL_TEMPLATES.find((t) => t.id === 'followup-gentle-bump');
      setBodyTemplate(tmpl ? tmpl.body.replace('{{sender_name}}', userName || 'Alex') : `Hi {{first_name}},\n\nFollowing up briefly on my previous email to make sure it didn't get buried.\n\nDo you have 5 minutes this week?\n\nBest,\n${userName || 'Alex'}`);
    } else if (selectedPreset === 'value') {
      const tmpl = PROFESSIONAL_EMAIL_TEMPLATES.find((t) => t.id === 'followup-value-add');
      setBodyTemplate(tmpl ? tmpl.body.replace('{{sender_name}}', userName || 'Alex') : `Hi {{first_name}},\n\nWanted to share a quick benchmark relevant to {{company}}'s outreach goals...\n\nBest,\n${userName || 'Alex'}`);
    } else if (selectedPreset === 'breakup') {
      const tmpl = PROFESSIONAL_EMAIL_TEMPLATES.find((t) => t.id === 'followup-polite-breakup');
      setBodyTemplate(tmpl ? tmpl.body.replace('{{sender_name}}', userName || 'Alex') : `Hi {{first_name}},\n\nI haven't heard back, so I assume this isn't a current priority for {{company}} right now—completely understand! I'll close our file so I don't crowd your inbox.\n\nBest,\n${userName || 'Alex'}`);
    }
  }, [campaign, selectedPreset, userName]);

  if (!isOpen || !campaign) return null;

  // Filter target recipients
  const campaignContacts = contacts.filter((c) => c.campaign_id === campaign.id);
  const targetRecipients = targetAudience === 'sent_only'
    ? campaignContacts.filter((c) => c.status === 'sent')
    : (campaignContacts.length > 0 ? campaignContacts : contacts.slice(0, 10));

  // File and photo attachment handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 8MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const isImage = file.type.startsWith('image/');
        const newAttachment: EmailAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          filename: file.name,
          contentType: file.type || 'application/octet-stream',
          size: file.size,
          data: result,
          isImage,
        };
        setAttachments((prev) => [...prev, newAttachment]);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const removeAttachment = (id?: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Run rate-limited sequential dispatch
  const handleDispatchFollowUp = async () => {
    if (targetRecipients.length === 0) {
      alert('No recipients found to send follow-up to.');
      return;
    }

    if (!subject.trim() || !bodyTemplate.trim()) {
      alert('Please provide both a subject and follow-up body template.');
      return;
    }

    setIsDispatching(true);
    setProgressIndex(0);
    setSentSuccessCount(0);
    setFailedCount(0);
    setDispatchFinished(false);
    setErrorMessage(null);

    let savedSmtpConfig: any = null;
    try {
      const stored = localStorage.getItem('artiapply_smtp_config');
      if (stored) savedSmtpConfig = JSON.parse(stored);
    } catch {}

    const updatedContactsList = [...contacts];
    let currentIndex = 0;
    let successful = 0;
    let failed = 0;

    const dispatchNext = async () => {
      if (currentIndex >= targetRecipients.length) {
        setIsDispatching(false);
        setDispatchFinished(true);
        onFollowUpSuccess(campaign.id, updatedContactsList, {
          subject,
          bodyTemplate,
          sentCount: successful,
          preset: selectedPreset,
        });
        return;
      }

      const currentContact = targetRecipients[currentIndex];
      setProgressIndex(currentIndex + 1);

      try {
        const res = await fetch('/api/campaigns/send-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaignId: campaign.id,
            contact: currentContact,
            subject,
            bodyTemplate,
            senderName: userName,
            senderEmail: userEmail,
            smtpConfig: savedSmtpConfig,
            attachments,
            isFollowUp: true,
          }),
        });

        const data = await res.json();

        if (data.success) {
          successful++;
          setSentSuccessCount(successful);

          const cIdx = updatedContactsList.findIndex((c) => c.id === currentContact.id);
          if (cIdx >= 0) {
            updatedContactsList[cIdx] = {
              ...updatedContactsList[cIdx],
              status: 'sent',
              followup_sent_at: new Date().toISOString(),
              followup_count: (updatedContactsList[cIdx].followup_count || 0) + 1,
            };
          }
        } else {
          failed++;
          setFailedCount(failed);
          if (currentIndex === 0 && data.error) {
            setErrorMessage(data.error);
          }
        }
      } catch (err: any) {
        failed++;
        setFailedCount(failed);
      }

      currentIndex++;
      if (currentIndex < targetRecipients.length) {
        setTimeout(dispatchNext, 500); // 2 emails/sec
      } else {
        setIsDispatching(false);
        setDispatchFinished(true);
        onFollowUpSuccess(campaign.id, updatedContactsList, {
          subject,
          bodyTemplate,
          sentCount: successful,
          preset: selectedPreset,
        });
      }
    };

    dispatchNext();
  };

  const progressPercent = targetRecipients.length > 0
    ? Math.round((progressIndex / targetRecipients.length) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-[32px] border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-sky-50/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <RotateCcw className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900 font-poppins">Take Campaign Follow-up</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 uppercase tracking-wider">
                  Sequence Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md">
                Campaign: <strong>{campaign.name}</strong> • Original: {campaign.subject}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDispatching}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Preset Follow-up Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Select Follow-up Strategy
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'bump', label: '1. Gentle Bump', desc: 'Day 3 reminder' },
                { id: 'value', label: '2. Value & Case Study', desc: 'Day 5 insight' },
                { id: 'breakup', label: '3. Polite Breakup', desc: 'Final close-out' },
                { id: 'custom', label: 'Custom Message', desc: 'Write your own' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPreset(p.id as any)}
                  className={`p-2.5 rounded-2xl border text-left transition ${
                    selectedPreset === p.id
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <p className="text-xs font-bold leading-tight">{p.label}</p>
                  <p className={`text-[10px] mt-0.5 ${selectedPreset === p.id ? 'text-slate-300' : 'text-slate-400'}`}>
                    {p.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Subject Line */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Follow-up Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isDispatching}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-900 shadow-sm transition"
            />
          </div>

          {/* Body Template */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Follow-up Message Template
              </label>
              <span className="text-[11px] text-slate-400">
                Variables: &#123;&#123;first_name&#125;&#125;, &#123;&#123;company&#125;&#125;, &#123;&#123;role&#125;&#125;
              </span>
            </div>
            <textarea
              rows={6}
              value={bodyTemplate}
              onChange={(e) => setBodyTemplate(e.target.value)}
              disabled={isDispatching}
              className="w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:border-slate-900 shadow-sm transition leading-relaxed"
            />
          </div>

          {/* Target Audience & Attachments Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Target Audience */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Recipients Target
              </label>
              <div className="space-y-1 text-xs">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="targetAudience"
                    checked={targetAudience === 'all'}
                    onChange={() => setTargetAudience('all')}
                    disabled={isDispatching}
                    className="accent-slate-900"
                  />
                  <span>All Campaign Leads ({targetRecipients.length})</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="targetAudience"
                    checked={targetAudience === 'sent_only'}
                    onChange={() => setTargetAudience('sent_only')}
                    disabled={isDispatching}
                    className="accent-slate-900"
                  />
                  <span>Only Leads who Received Initial Email</span>
                </label>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700 flex items-center space-x-1">
                  <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                  <span>Attach Files & Photos</span>
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isDispatching}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center space-x-1"
                >
                  <span>+ Add File</span>
                </button>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />

              {attachments.length === 0 ? (
                <p className="text-[11px] text-slate-400">
                  Optional: Attach a case study PDF, portfolio, or screenshot.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-24 overflow-y-auto">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between p-1.5 rounded-lg bg-white border border-slate-200 text-[11px]"
                    >
                      <div className="flex items-center space-x-1.5 truncate max-w-[180px]">
                        {att.isImage ? (
                          <ImageIcon className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        ) : (
                          <FileText className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        )}
                        <span className="truncate text-slate-800">{att.filename}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(att.id)}
                        disabled={isDispatching}
                        className="text-slate-400 hover:text-rose-600 ml-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dispatch Progress Card */}
          {isDispatching && (
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-sky-900">
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1.5 animate-spin text-sky-600" />
                  Dispatching Follow-up Sequence ({progressIndex} / {targetRecipients.length})...
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-sky-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sky-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-sky-700">
                Paced at 2 emails/sec to protect your Gmail inbox reputation.
              </p>
            </div>
          )}

          {/* Success Summary */}
          {dispatchFinished && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
              <div className="font-bold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Follow-up Sequence Finished!</span>
              </div>
              <p>
                Successfully dispatched {sentSuccessCount} follow-up emails. {failedCount > 0 && `(${failedCount} failed)`}
              </p>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            onClick={onClose}
            disabled={isDispatching}
            className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium transition"
          >
            {dispatchFinished ? 'Close' : 'Cancel'}
          </button>

          {!dispatchFinished && (
            <button
              onClick={handleDispatchFollowUp}
              disabled={isDispatching}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {isDispatching
                  ? `Sending (${progressIndex}/${targetRecipients.length})...`
                  : `Dispatch Follow-up (${targetRecipients.length} Leads)`}
              </span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
