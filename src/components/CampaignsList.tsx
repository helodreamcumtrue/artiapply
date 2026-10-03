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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Campaigns</h1>
          <p className="text-xs text-slate-600 mt-1">
            Manage your cold email sequences, delivery metrics, and active queues
          </p>
        </div>
        <button
          onClick={onNewCampaign}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Sequence</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-1 bg-white p-1 rounded-full border border-slate-200 shadow-sm overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'queued', label: 'Queued' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                filter === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
            className="pl-8 pr-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-sm transition w-full sm:w-60"
          />
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="space-y-3.5">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white p-14 text-center rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)]">
            <MailCheck className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="text-base font-bold text-slate-800 font-poppins">No campaigns found</p>
            <p className="text-xs text-slate-500 mt-1">Try clearing your filters or create a new campaign</p>
          </div>
        ) : (
          filteredCampaigns.map((camp) => {
            const progress = camp.total_contacts > 0
              ? Math.min(100, Math.round(((camp.sent_count + camp.failed_count) / camp.total_contacts) * 100))
              : 0;

            const statusColors: Record<string, string> = {
              completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              in_progress: 'bg-sky-50 text-sky-700 border-sky-200',
              queued: 'bg-amber-50 text-amber-700 border-amber-200',
              draft: 'bg-slate-100 text-slate-700 border-slate-200',
            };

            return (
              <div
                key={camp.id}
                className="bg-white p-6 rounded-[26px] border border-slate-200/85 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_4px_16px_-2px_rgba(15,23,42,0.04)] hover:shadow-[0_2px_8px_rgba(15,23,42,0.04),0_12px_24px_-4px_rgba(15,23,42,0.07)] hover:-translate-y-0.5 transition-all duration-300 group space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <MailCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-slate-700 transition font-poppins">
                          {camp.name}
                        </h3>
                        <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${statusColors[camp.status] || statusColors.draft}`}>
                          {camp.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-lg">
                        {camp.subject}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                      onClick={() => onSelectCampaign(camp)}
                      className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-800 transition flex items-center space-x-1.5"
                    >
                      <span>View Progress</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {onDeleteCampaign && (
                      <button
                        onClick={() => onDeleteCampaign(camp.id)}
                        className="p-2 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-1">
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5">
                    <div
                      className="h-full bg-slate-900 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span className="font-medium">
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
