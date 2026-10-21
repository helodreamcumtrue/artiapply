'use client';

import React, { useState } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
} from 'lucide-react';
import {
  ARTICLES_CSV_CATEGORIES,
  FirmCategory,
  downloadCategoryCSV,
  getCategoryContacts,
} from '@/lib/data/sampleContacts';
import { Contact } from '@/types/database';

interface SampleCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadContacts?: (contacts: Contact[], fileName: string) => void;
}

export const SampleCsvModal: React.FC<SampleCsvModalProps> = ({
  isOpen,
  onClose,
  onLoadContacts,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FirmCategory>('big4');
  const [copiedHeaders, setCopiedHeaders] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const currentCategoryInfo =
    ARTICLES_CSV_CATEGORIES.find((c) => c.id === selectedCategory) ||
    ARTICLES_CSV_CATEGORIES[0];

  const handleCopyHeaders = () => {
    const headerStr = 'first_name,last_name,email,company,role,location';
    navigator.clipboard.writeText(headerStr);
    setCopiedHeaders(true);
    setTimeout(() => setCopiedHeaders(false), 2500);
  };

  const handleDownload = () => {
    downloadCategoryCSV(selectedCategory);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleLoadDirectly = () => {
    if (onLoadContacts) {
      const formatted = getCategoryContacts(selectedCategory);
      onLoadContacts(formatted, currentCategoryInfo.filename);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-[28px] border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-sky-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 text-[#d4f933] flex items-center justify-center shadow-md border border-slate-800">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-slate-900 font-poppins">
                  Articleship HR Contacts & CSV Templates
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                  4 Curated Tiers
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose from 4 tiers of CA firms with active HR recruiter mail IDs and ATS-ready formatting.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Category Selection Pills / Cards */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {ARTICLES_CSV_CATEGORIES.map((cat) => {
              const isSelected = cat.id === selectedCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-slate-950 shadow-md ring-2 ring-slate-950/10'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl">{cat.icon}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${cat.badgeColor}`}
                    >
                      {cat.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-poppins">
                      {cat.shortName}
                    </h4>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {cat.contacts.length} HR Recruiter Leads
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Tier Overview & Highlights */}
        <div className="px-5 sm:px-6 pt-4 pb-2">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-sm font-poppins">
                  {currentCategoryInfo.name}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                  {currentCategoryInfo.contacts.length} Verified Contacts
                </span>
              </div>
              <p className="text-[11px] text-slate-600 max-w-xl leading-relaxed">
                {currentCategoryInfo.description}
              </p>
              <div className="text-[11px] text-slate-500 pt-1">
                <strong>Featured Firms:</strong> {currentCategoryInfo.highlightFirms}
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyHeaders}
                className="text-[11px] font-medium text-slate-700 hover:text-slate-900 flex items-center space-x-1 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition"
              >
                {copiedHeaders ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Headers Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-500" />
                    <span>Copy Headers</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Table Preview */}
        <div className="p-5 sm:p-6 pt-2 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Recruiter Mail IDs Preview ({currentCategoryInfo.contacts.length} entries)
            </span>
            <span className="text-[11px] text-slate-400">
              CSV file: <code className="font-mono text-slate-700">{currentCategoryInfo.filename}</code>
            </span>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto max-h-56">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold sticky top-0 z-10">
                  <tr>
                    <th className="px-3.5 py-2">first_name</th>
                    <th className="px-3.5 py-2">last_name</th>
                    <th className="px-3.5 py-2">email</th>
                    <th className="px-3.5 py-2">company (Firm)</th>
                    <th className="px-3.5 py-2">role</th>
                    <th className="px-3.5 py-2">location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {currentCategoryInfo.contacts.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50 hover:bg-sky-50/30 transition'}
                    >
                      <td className="px-3.5 py-2 font-semibold text-slate-900">{row.first_name}</td>
                      <td className="px-3.5 py-2">{row.last_name}</td>
                      <td className="px-3.5 py-2 font-mono text-[11px] text-sky-700">{row.email}</td>
                      <td className="px-3.5 py-2 font-medium text-slate-900">{row.company}</td>
                      <td className="px-3.5 py-2 text-slate-500">{row.role}</td>
                      <td className="px-3.5 py-2 text-slate-500">{row.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-100 text-[11px] text-emerald-800 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              All email addresses are structured to resolve directly to partner and campus hiring recruitment desks without bounce penalties.
            </span>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-white transition"
          >
            Close
          </button>

          <div className="flex items-center space-x-2.5 w-full sm:w-auto">
            {/* Download CSV button */}
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold transition shadow-sm flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>
                {downloadSuccess ? 'Downloaded!' : `Download ${currentCategoryInfo.shortName} CSV`}
              </span>
            </button>

            {/* Optional 1-Click Load into Campaign */}
            {onLoadContacts && (
              <button
                type="button"
                onClick={handleLoadDirectly}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full bg-[#d4f933] hover:bg-[#c6f627] text-slate-950 text-xs font-extrabold transition shadow-md shadow-[#d4f933]/25 flex items-center justify-center space-x-1.5 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Load into Campaign ({currentCategoryInfo.contacts.length})</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
