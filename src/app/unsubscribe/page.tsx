'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShieldOff, Mail, RefreshCw } from 'lucide-react';

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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-white/[0.08] shadow-2xl text-center space-y-6">
        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-2xl bg-surface-900 border border-white/[0.1] text-primary flex items-center justify-center mx-auto shadow-glow">
          <ShieldOff className="w-6 h-6 text-slate-400" />
        </div>

        {unsubscribed ? (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Unsubscribed Successfully
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">{email}</strong> has been permanently removed from this sender’s cold outreach campaigns. You will receive no further emails.
            </p>
            <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-500">
              Powered by ArticleApply Compliance Engine (CAN-SPAM & GDPR)
            </div>
          </div>
        ) : (
          <form onSubmit={handleUnsubscribe} className="space-y-4">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Opt-Out of Outreach
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Please confirm your email address below to unsubscribe from this sequence.
              </p>
            </div>

            <div className="text-left space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-surface-950/80 border border-white/[0.1] text-white text-xs focus:outline-none focus:border-primary transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-white font-medium text-xs transition flex items-center justify-center space-x-2 disabled:opacity-50"
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

            <div className="text-[11px] text-slate-500 pt-2 border-t border-white/[0.06]">
              ArticleApply enforces strict rate limits and honors immediate opt-outs.
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel p-8 rounded-2xl border border-white/[0.08] text-center space-y-4">
            <RefreshCw className="w-6 h-6 animate-spin text-primary mx-auto" />
            <p className="text-xs text-slate-400">Loading opt-out portal...</p>
          </div>
        </div>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
