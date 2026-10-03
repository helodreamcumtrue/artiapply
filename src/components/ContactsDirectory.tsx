'use client';

import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Mail,
  Building,
  Briefcase,
  Download,
  Upload,
  FileSpreadsheet,
  Plus,
  Sparkles,
  Check,
  X,
  FileText,
  ShieldCheck,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { Contact } from '@/types/database';
import { formatTime } from '@/lib/utils/formatDate';
import { verifyLeadList } from '@/lib/utils/verifyEmail';
import {
  downloadSampleCSVFile,
  getSample50Contacts,
} from '@/lib/data/sampleContacts';

interface ContactsDirectoryProps {
  contacts: Contact[];
  onAddContacts?: (newContacts: Contact[]) => void;
  onClearContacts?: () => void;
  onNewCampaign?: () => void;
}

export const ContactsDirectory: React.FC<ContactsDirectoryProps> = ({
  contacts,
  onAddContacts,
  onClearContacts,
  onNewCampaign,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'pending' | 'failed' | 'sending'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<any[]>([]);
  const [verificationStats, setVerificationStats] = useState<{
    verified: number;
    risky: number;
    invalid: number;
  } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter contacts
  const filtered = contacts.filter((c) => {
    const matchesFilter = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.last_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.company || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.role || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle Load 50 Sample Contacts
  const handleLoadSampleContacts = () => {
    const sample50 = getSample50Contacts();
    if (onAddContacts) {
      onAddContacts(sample50);
      showToast('Loaded 50 verified sample B2B contacts into directory!');
    }
  };

  // Handle CSV file upload (PapaParse)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsUploading(false);
        const data = results.data as Record<string, string>[];

        if (data.length === 0) {
          setUploadError('The selected CSV file is empty.');
          return;
        }

        // Standardize column keys
        const mapped = data
          .map((row, idx) => {
            const keys = Object.keys(row);
            const emailKey = keys.find((k) => /email/i.test(k));
            const firstNameKey = keys.find((k) => /first.*name|fname/i.test(k));
            const lastNameKey = keys.find((k) => /last.*name|lname/i.test(k));
            const companyKey = keys.find((k) => /company|org|business/i.test(k));
            const roleKey = keys.find((k) => /role|title|position/i.test(k));

            const email = (emailKey ? row[emailKey] : row['email'])?.trim();
            if (!email) return null;

            return {
              id: `imported-${Date.now()}-${idx}`,
              campaign_id: 'campaign-imported',
              user_id: 'user-1',
              email,
              first_name: firstNameKey ? row[firstNameKey]?.trim() : (row['first_name'] || null),
              last_name: lastNameKey ? row[lastNameKey]?.trim() : (row['last_name'] || null),
              company: companyKey ? row[companyKey]?.trim() : (row['company'] || null),
              role: roleKey ? row[roleKey]?.trim() : (row['role'] || null),
              status: 'pending' as const,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
          })
          .filter(Boolean) as Contact[];

        if (mapped.length === 0) {
          setUploadError('No valid contacts found. Please make sure the CSV contains an "email" column.');
          return;
        }

        const stats = verifyLeadList(mapped);
        setVerificationStats({
          verified: stats.verified.length,
          risky: stats.risky.length,
          invalid: stats.invalid.length,
        });
        setParsedPreview(mapped);
      },
      error: (err) => {
        setIsUploading(false);
        setUploadError(`Failed to parse CSV: ${err.message}`);
      },
    });
  };

  const handleConfirmImport = () => {
    if (parsedPreview.length > 0 && onAddContacts) {
      onAddContacts(parsedPreview);
      showToast(`Successfully imported ${parsedPreview.length} contacts!`);
      setShowUploadModal(false);
      setParsedPreview([]);
      setVerificationStats(null);
    }
  };

  // Export current list to CSV
  const handleExportCurrent = () => {
    if (contacts.length === 0) return;
    const headers = ['first_name', 'last_name', 'email', 'company', 'role', 'status'];
    const rows = contacts.map((c) => [
      `"${c.first_name || ''}"`,
      `"${c.last_name || ''}"`,
      `"${c.email}"`,
      `"${c.company || ''}"`,
      `"${c.role || ''}"`,
      `"${c.status}"`,
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts_export_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header and Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center space-x-2">
            <span>Contacts Directory</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium">
              {contacts.length} Leads
            </span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage recipient lists, download the 50-entry sample lead file, or upload custom CSV lists.
          </p>
        </div>

        {/* Action Buttons: Sample Download, Load 50 Sample, and Upload CSV */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Download Sample CSV File */}
          <button
            onClick={downloadSampleCSVFile}
            title="Download ready-to-use sample CSV with 50 verified B2B leads"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Download Sample File (50 entries)</span>
          </button>

          {/* 2. Instant One-Click Load 50 Sample Contacts */}
          <button
            onClick={handleLoadSampleContacts}
            title="Populate directory instantly with 50 sample leads"
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-600" />
            <span>Load 50 Samples</span>
          </button>

          {/* 3. Self Upload CSV Button */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-sm transition active:scale-[0.98]"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload CSV</span>
          </button>

          {/* 4. Launch Campaign CTA */}
          {onNewCampaign && (
            <button
              onClick={onNewCampaign}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Launch Campaign</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_16px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_24px_-4px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Contacts</span>
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-poppins">{contacts.length}</span>
          <p className="text-[11px] text-slate-400 mt-1">Directory list</p>
        </div>

        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_16px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_24px_-4px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Delivered</span>
            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-emerald-600 tracking-tight font-poppins">
            {contacts.filter((c) => c.status === 'sent').length}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Direct to inbox</p>
        </div>

        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_16px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_24px_-4px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Pending Delivery</span>
            <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-amber-600 tracking-tight font-poppins">
            {contacts.filter((c) => c.status === 'pending' || c.status === 'queued').length}
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Queued in BullMQ</p>
        </div>

        <div className="bg-white p-5 rounded-[24px] border border-slate-200/85 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_16px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_24px_-4px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Sample Leads</span>
            <div className="w-7 h-7 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-bold text-sky-600 tracking-tight font-poppins">50 Ready</span>
          <p className="text-[11px] text-slate-400 mt-1">1-click populated</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1 bg-white p-1 rounded-full border border-slate-200 shadow-sm overflow-x-auto">
          {[
            { id: 'all', label: `All (${contacts.length})` },
            { id: 'sent', label: `Delivered (${contacts.filter((c) => c.status === 'sent').length})` },
            { id: 'sending', label: 'In Flight' },
            { id: 'pending', label: 'Pending' },
            { id: 'failed', label: 'Failed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads, company, role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-sm transition"
            />
          </div>

          {contacts.length > 0 && (
            <button
              onClick={handleExportCurrent}
              title="Export filtered contacts to CSV"
              className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-[28px] overflow-hidden border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-mono tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-5 font-semibold">Contact</th>
                <th className="py-3.5 px-5 font-semibold">Company & Role</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold">Dispatched At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-14 text-center text-slate-500">
                    <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                    <p className="font-semibold text-slate-800 font-poppins">No contacts found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Click <strong className="text-slate-900">"Load 50 Samples"</strong> or <strong className="text-slate-900">"Upload Your CSV"</strong> to add contacts.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-5">
                      <div className="font-semibold text-slate-900 font-poppins">
                        {contact.first_name ? `${contact.first_name} ${contact.last_name || ''}` : 'Recipient'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono flex items-center mt-0.5">
                        <Mail className="w-3 h-3 mr-1 text-slate-400 shrink-0" />
                        <span>{contact.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="text-slate-800 font-medium">{contact.company || '—'}</div>
                      <div className="text-[11px] text-slate-500">{contact.role || '—'}</div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span
                        className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full inline-flex items-center space-x-1 ${
                          contact.status === 'sent'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : contact.status === 'sending'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200 animate-pulse'
                            : contact.status === 'failed'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {contact.status === 'sent' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {contact.status === 'failed' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {contact.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        <span>{contact.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px]" suppressHydrationWarning>
                      {formatTime(contact.sent_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Self Upload CSV Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200/90 rounded-[28px] max-w-lg w-full p-6 sm:p-7 shadow-[0_20px_50px_rgba(15,23,42,0.15)] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-poppins">Self Upload CSV</h3>
                  <p className="text-xs text-slate-500">Import your lead list from any spreadsheet</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setParsedPreview([]);
                  setUploadError(null);
                }}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-slate-500 rounded-[22px] p-6 text-center cursor-pointer transition bg-slate-50/60 hover:bg-slate-50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <FileSpreadsheet className="w-10 h-10 mx-auto text-slate-500 mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-900">Click or drag & drop CSV file</p>
              <p className="text-xs text-slate-500 mt-1">
                Supported columns: <code className="text-slate-800 font-semibold">email, first_name, last_name, company, role</code>
              </p>
              <div className="mt-3 inline-flex items-center space-x-1 text-xs text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-sm">
                <span>Need a template?</span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadSampleCSVFile();
                  }}
                  className="text-slate-900 hover:underline font-semibold cursor-pointer"
                >
                  Download 50 sample leads CSV
                </span>
              </div>
            </div>

            {/* Upload Error */}
            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Parsed Preview & Verification Stats */}
            {parsedPreview.length > 0 && verificationStats && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">
                    Found {parsedPreview.length} valid contacts
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px]">
                      {verificationStats.verified} Safe
                    </span>
                    {verificationStats.risky > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-mono text-[10px]">
                        {verificationStats.risky} Risky
                      </span>
                    )}
                  </div>
                </div>

                <div className="max-h-36 overflow-y-auto rounded-xl bg-slate-50 border border-slate-200 p-2 text-xs divide-y divide-slate-200/60 font-mono">
                  {parsedPreview.slice(0, 4).map((p, i) => (
                    <div key={i} className="py-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-800 font-medium">{p.email}</span>
                      <span className="text-slate-500">{p.company || '—'}</span>
                    </div>
                  ))}
                  {parsedPreview.length > 4 && (
                    <div className="pt-1.5 text-center text-[10px] text-slate-500">
                      + {parsedPreview.length - 4} more leads ready
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setParsedPreview([]);
                }}
                className="px-4 py-2 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmImport}
                disabled={parsedPreview.length === 0}
                className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold shadow-sm transition"
              >
                Import {parsedPreview.length > 0 ? `${parsedPreview.length} Contacts` : 'Contacts'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
