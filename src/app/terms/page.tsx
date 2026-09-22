import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ArticleApply',
  description: 'ArticleApply Terms of Service and Acceptable Use Policy.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-slate-300 py-16 px-4 sm:px-6 lg:px-8 selection:bg-primary/30 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to ArticleApply Dashboard</span>
        </Link>

        {/* Header */}
        <div className="space-y-4 border-b border-white/[0.08] pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-medium">
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400">
            Last Updated: September 23, 2026 • Effective Date: September 23, 2026
          </p>
        </div>

        {/* Anti-Spam & Acceptable Use Policy Alert */}
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.03] space-y-3">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Anti-Spam & CAN-SPAM / GDPR Compliance Commitment</span>
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            ArticleApply strictly prohibits the sending of unsolicited spam, deceptive subject lines, malicious attachments, or unlawful commercial communications. All users agree to comply fully with the United States CAN-SPAM Act of 2003, the European General Data Protection Regulation (GDPR), and relevant international anti-spam regulations.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the ArticleApply software platform, website, and related APIs (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access or use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Description of Service</h2>
            <p>
              ArticleApply provides an automated cold email outreach solution that connects directly to authenticated Google Workspace and Gmail accounts via official Google APIs. Features include campaign scheduling, rate-limiting (2 emails/second), contact list management, AI-assisted template copywriting powered by Google Gemini, and real-time delivery telemetry.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Acceptable Use Policy</h2>
            <p>You agree NOT to use ArticleApply to:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>Send emails containing false, misleading, or deceptive sender names, headers, or subject lines.</li>
              <li>Transmit phishing material, malware, viruses, pyramid schemes, or illegal commercial offers.</li>
              <li>Circumvent or tamper with opt-out requests or fail to honor unsubscribe submissions.</li>
              <li>Harass, threaten, or violate the legal rights of any recipient.</li>
              <li>Exceed or bypass rate limits imposed by the platform or Google API quotas.</li>
            </ul>
            <p className="text-xs text-slate-400">
              Failure to adhere to this Acceptable Use Policy will result in immediate termination of your account without refund.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. User Account & Google Authorization</h2>
            <p>
              You are responsible for maintaining the confidentiality of your credentials. You authorize ArticleApply to access the Google Gmail API solely to execute campaigns you have created and initiated. You may revoke access at any time via your Google Account permissions panel.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Intellectual Property</h2>
            <p>
              The Service, including its original code, user interface, brand assets, and functionality, is owned by ArticleApply Inc. and protected by copyright and intellectual property laws. You retain full ownership of the campaign copy and contact lists you import.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Limitation of Liability</h2>
            <p>
              In no event shall ArticleApply, its officers, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, deliverability reputation, or business interruption arising from your use of the Service or actions taken by third-party email providers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. Continued use of the platform after effective revisions signifies acceptance of the amended terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">8. Contact Information</h2>
            <div className="p-4 rounded-xl bg-surface-950/80 border border-white/[0.08] text-xs font-mono text-slate-300">
              ArticleApply Legal Team: legal@articleapply.io
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-white/[0.08] text-xs text-slate-500 flex justify-between items-center">
          <span>&copy; {new Date().getFullYear()} ArticleApply Inc. All rights reserved.</span>
          <Link href="/privacy" className="text-primary-light hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
