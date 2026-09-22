'use client';

import React, { useState } from 'react';
import {
  MailCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  ArrowRight,
  Filter,
  Plus,
  Play,
} from 'lucide-react';
import { Campaign } from '@/types/database';
import { formatDate } from '@/lib/utils/formatDate';

interface CampaignsListProps {
  campaigns: Campaign[];
  onSelectCampaign: (campaign: Campaign) => void;
  onNewCampaign: () => void;
  onDeleteCampaign?: (id: string) => void;
}

export const CampaignsList: React.FC<CampaignsListProps> = ({
  campaigns,
  onSelectCampaign,
  onNewCampaign,
  onDeleteCampaign,
}) => {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed' | 'queued'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCampaigns = campaigns.filter((camp) => {
    const matchesFilter = filter === 'all' || camp.status === filter;
    const matchesSearch =
      camp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camp.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Campaigns</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your cold email sequences, delivery metrics, and active queues
          </p>
        </div>
        <button
          onClick={onNewCampaign}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-glow transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Sequence</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 bg-surface-950/80 p-1 rounded-xl border border-white/[0.08] overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'queued', label: 'Queued' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filter === tab.id ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
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
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-4 py-1.5 rounded-xl bg-surface-950/80 border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary transition w-full sm:w-60"
          />
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-3">
        {filteredCampaigns.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl">
            <MailCheck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">No campaigns found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your filters or create a new campaign</p>
          </div>
        ) : (
          filteredCampaigns.map((camp) => {
            const progress = camp.total_contacts > 0
              ? Math.min(100, Math.round(((camp.sent_count + camp.failed_count) / camp.total_contacts) * 100))
              : 0;

            const statusColors: Record<string, string> = {
              completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
              in_progress: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
              queued: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
              draft: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
            };

            return (
              <div
                key={camp.id}
                className="glass-panel p-5 rounded-2xl border border-white/[0.06] hover:border-primary/40 transition group space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary-light flex items-center justify-center shrink-0">
                      <MailCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white text-sm group-hover:text-primary-light transition">
                          {camp.name}
                        </h3>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${statusColors[camp.status] || statusColors.draft}`}>
                          {camp.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-lg">
                        {camp.subject}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                      onClick={() => onSelectCampaign(camp)}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-white transition flex items-center space-x-1"
                    >
                      <span>View Progress</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {onDeleteCampaign && (
                      <button
                        onClick={() => onDeleteCampaign(camp.id)}
                        className="p-1.5 rounded-xl hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="w-full bg-surface-950 rounded-full h-2 overflow-hidden border border-white/[0.04]">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>
                      {camp.sent_count} / {camp.total_contacts} contacts ({progress}%)
                    </span>
                    <span suppressHydrationWarning>Created: {formatDate(camp.created_at)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
