'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Search,
  Check,
  FileText,
  Paperclip,
  Tag,
  ArrowRight,
  Briefcase,
  TrendingUp,
  Shield,
  Layers,
} from 'lucide-react';
import { PROFESSIONAL_EMAIL_TEMPLATES, EmailTemplate } from '@/lib/data/emailTemplates';

interface EmailTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: EmailTemplate) => void;
  senderName?: string;
}

export const EmailTemplatesModal: React.FC<EmailTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  senderName = 'Alex',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activePreviewId, setActivePreviewId] = useState<string>(PROFESSIONAL_EMAIL_TEMPLATES[0].id);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Formats (10)' },
    { id: 'job_application', label: '🎯 Job Application' },
    { id: 'sales', label: '💼 B2B Sales Outbound' },
    { id: 'executive', label: '⚡ Executive / C-Suite' },
    { id: 'investor', label: '🚀 Investor Pitch' },
    { id: 'agency', label: '🛠️ Freelance & Agency' },
    { id: 'partnership', label: '🤝 Partnership & BD' },
    { id: 'followup', label: '🔄 Follow-up Sequences' },
  ];

  const filteredTemplates = PROFESSIONAL_EMAIL_TEMPLATES.filter((tmpl) => {
    const matchesCategory = selectedCategory === 'all' || tmpl.category === selectedCategory;
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeTemplate = PROFESSIONAL_EMAIL_TEMPLATES.find((t) => t.id === activePreviewId) || filteredTemplates[0];

  const handleApply = (tmpl: EmailTemplate) => {
    onSelectTemplate(tmpl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl h-[88vh] rounded-[32px] border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-purple-50/40">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-slate-900 font-poppins">Professional Email Formats</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 uppercase tracking-wider">
                  Proven Playbook
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Curated high-conversion templates with auto-personalized variables and attachment recommendations.
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

        {/* Filter bar & Search */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Category Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative shrink-0 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search formats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-sm"
            />
          </div>
        </div>

        {/* Two-Column Explorer: Left List, Right Detailed Preview */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Template Cards List */}
          <div className="md:col-span-5 border-r border-slate-100 overflow-y-auto p-4 space-y-2.5 bg-slate-50/30">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No templates matched your query.
              </div>
            ) : (
              filteredTemplates.map((tmpl) => {
                const isSelected = (activeTemplate?.id === tmpl.id);
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => setActivePreviewId(tmpl.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left space-y-1.5 ${
                      isSelected
                        ? 'bg-white border-slate-900 shadow-md ring-1 ring-slate-900/10'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-900">{tmpl.name}</span>
                      {tmpl.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {tmpl.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {tmpl.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                      {tmpl.recommendedAttachments && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 font-medium flex items-center">
                          <Paperclip className="w-2.5 h-2.5 mr-1" />
                          File Ready
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Full Preview & Apply Button */}
          <div className="md:col-span-7 flex flex-col justify-between overflow-y-auto p-6 bg-white space-y-5">
            {activeTemplate ? (
              <div className="space-y-4">
                {/* Header details */}
                <div className="space-y-1 pb-3 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                      {activeTemplate.categoryLabel}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      Token placeholders auto-replace on send
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-poppins pt-1">
                    {activeTemplate.name}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {activeTemplate.description}
                  </p>
                </div>

                {/* Recommended Attachment Callout */}
                {activeTemplate.recommendedAttachments && (
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
                    <Paperclip className="w-4 h-4 shrink-0 text-amber-700" />
                    <span>
                      <strong>Recommended Attachment:</strong> {activeTemplate.recommendedAttachments}
                    </span>
                  </div>
                )}

                {/* Subject Line Preview */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Subject Line
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-900">
                    {activeTemplate.subject}
                  </p>
                </div>

                {/* Email Body Preview */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Body Template
                  </span>
                  <div className="text-xs text-slate-800 font-sans whitespace-pre-line leading-relaxed font-mono">
                    {activeTemplate.body.replace('{{sender_name}}', senderName)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-slate-400">
                Select a template from the left list.
              </div>
            )}

            {/* Bottom Apply Bar */}
            {activeTemplate && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ready to write with this structure?
                </span>
                <button
                  onClick={() => handleApply(activeTemplate)}
                  className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center space-x-2 active:scale-95"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Use This Format</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
