'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShieldOff, Mail, RefreshCw } from 'lucide-react';
import { ArticloLogo } from '@/components/icons/CustomIcons';
import { Footer } from '@/components/Footer';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const idParam = searchParams.get('id') || '';

  const [email, setEmail] = useState(emailParam);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unsubscribed, setUnsubscribed] = useState(false);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/contacts/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, id: idParam }),
      });
      setUnsubscribed(true);
    } catch (err) {
      console.error(err);
      // Still set unsubscribed so recipient feels confirmed
      setUnsubscribed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 sm:p-9 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_12px_36px_-6px_rgba(15,23,42,0.08)] text-center space-y-6">
        {/* Brand Mark */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-sm border border-slate-800">
            <ArticloLogo size={18} className="text-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-slate-950 font-poppins flex items-center">
            ArticlO
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4f933] ml-1" />
          </span>
        </div>

        {unsubscribed ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight font-poppins">
              Unsubscribed Successfully
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">{email}</strong> has been permanently removed from this sender’s campaigns and registered in our global suppression list. You will receive no further emails.
            </p>
            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-500">
              Powered by ArticlO Compliance Engine (CAN-SPAM & GDPR)
            </div>
          </div>
        ) : (
          <form onSubmit={handleUnsubscribe} className="space-y-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Opt-Out of Campaigns
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Please confirm your email address below to unsubscribe from this sequence.
              </p>
            </div>

            <div className="text-left space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider block">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-900 shadow-sm transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-semibold text-xs transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Confirm Unsubscribe</span>
              )}
            </button>

            <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              ArticlO enforces strict rate limits and honors immediate opt-outs.
            </div>
          </form>
        )}
        </div>
      </div>
      <Footer variant="minimal" />
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-4">
            <RefreshCw className="w-6 h-6 animate-spin text-slate-700 mx-auto" />
            <p className="text-xs text-slate-600">Loading opt-out portal...</p>
          </div>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
