'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Mail,
  Building,
  Briefcase,
  Filter,
} from 'lucide-react';
import { Contact } from '@/types/database';
import { formatTime } from '@/lib/utils/formatDate';

interface ContactsDirectoryProps {
  contacts: Contact[];
}

export const ContactsDirectory: React.FC<ContactsDirectoryProps> = ({ contacts }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'sent' | 'pending' | 'failed' | 'sending'>('all');

  const filtered = contacts.filter((c) => {
    const matchesFilter = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      (c.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.company || '').toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Contacts Directory</h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore all uploaded recipients and their realtime delivery statuses
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 bg-surface-950/80 p-1 rounded-xl border border-white/[0.08] overflow-x-auto">
          {[
            { id: 'all', label: `All (${contacts.length})` },
            { id: 'sent', label: 'Delivered' },
            { id: 'sending', label: 'In Flight' },
            { id: 'pending', label: 'Pending' },
            { id: 'failed', label: 'Failed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === tab.id ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search email, name, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-4 py-1.5 rounded-xl bg-surface-950/80 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary transition w-full sm:w-64"
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-white/[0.08]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-900/80 text-slate-400 uppercase font-mono tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Company & Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Dispatched At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    No contacts matching your search criteria
                  </td>
                </tr>
              ) : (
                filtered.map((contact) => (
                  <tr key={contact.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">
                        {contact.first_name ? `${contact.first_name} ${contact.last_name || ''}` : 'Recipient'}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono flex items-center mt-0.5">
                        <Mail className="w-3 h-3 mr-1 text-slate-500 shrink-0" />
                        <span>{contact.email}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-200">{contact.company || '—'}</div>
                      <div className="text-[11px] text-slate-500">{contact.role || '—'}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full inline-flex items-center space-x-1 ${
                          contact.status === 'sent'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : contact.status === 'sending'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 animate-pulse'
                            : contact.status === 'failed'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {contact.status === 'sent' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {contact.status === 'failed' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {contact.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                        <span>{contact.status}</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]" suppressHydrationWarning>
                      {formatTime(contact.sent_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
