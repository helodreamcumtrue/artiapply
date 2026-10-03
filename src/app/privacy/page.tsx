import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Mail, Lock, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ArticlO',
  description: 'ArticlO Privacy Policy and Google API User Data Disclosure.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Back navigation */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to ArticlO Dashboard</span>
        </Link>

        {/* Header */}
        <div className="space-y-4 border-b border-slate-200 pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Google API Compliance & Privacy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">
            Last Updated: September 23, 2026 • Effective Date: September 23, 2026
          </p>
        </div>

        {/* Google User Data Disclosure Alert */}
        <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 font-poppins">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Google API Services User Data Policy Disclosure</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            ArticlO's use and transfer to any other app of information received from Google APIs will adhere to the{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-900 underline font-medium"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            We specifically request access to <code className="text-slate-900 font-mono font-semibold">https://www.googleapis.com/auth/gmail.send</code> solely to transmit cold outreach emails explicitly authored and approved by you within your campaign schedules. We <strong>never</strong> read your personal emails, sell your data, or use your Gmail data to train generalized AI models.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
            <p>
              When you use ArticlO, we collect information necessary to provide and operate our automated cold outreach platform:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                <strong className="text-slate-900">Account Information:</strong> Name, email address, profile picture, and Google authentication identifiers.
              </li>
              <li>
                <strong className="text-slate-900">Google OAuth Tokens:</strong> Securely encrypted access tokens and refresh tokens provided through Google OAuth to permit sending messages on your behalf.
              </li>
              <li>
                <strong className="text-slate-900">Campaign & Contact Data:</strong> Lead spreadsheets (CSV) uploaded by you, including contact names, email addresses, company names, and email templates authored by you.
              </li>
              <li>
                <strong className="text-slate-900">Technical Data:</strong> Log data, IP address, delivery timestamps, bounce rates, and queue execution metrics.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. How We Use Your Information</h2>
            <p>We use your information exclusively for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>Pacing and dispatching scheduled email campaigns through the native Gmail API at a controlled rate (2 emails/second) to protect your sender reputation.</li>
              <li>Providing real-time tracking of email delivery statuses (queued, sending, sent, failed) via Supabase Realtime.</li>
              <li>Enhancing your email copy and subject lines using Google Gemini AI upon your request.</li>
              <li>Enforcing opt-out and unsubscribe requests to ensure full compliance with CAN-SPAM and GDPR.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Data Security & Storage</h2>
            <p>
              We implement industry-standard administrative, physical, and technical safeguards. All communications with our servers, Supabase PostgreSQL, and Google APIs use TLS 1.3 encryption. Your Google OAuth tokens are stored securely in database rows protected by PostgreSQL Row Level Security (RLS) policies, ensuring only your authenticated user account can access them.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. Data Sharing & Third Parties</h2>
            <p>
              ArticlO does not sell, rent, or lease your personal data or your contact lists to third parties. We share data only with trusted service providers essential for platform operations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong className="text-slate-900">Google APIs:</strong> For email transmission and Google Gemini AI copywriting inference.</li>
              <li><strong className="text-slate-900">Supabase:</strong> For managed, encrypted PostgreSQL hosting and real-time WebSocket state management.</li>
              <li><strong className="text-slate-900">Redis (Upstash):</strong> For ephemeral message queue state and rate-limiting.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">5. Your Rights & Data Deletion</h2>
            <p>
              You maintain complete ownership of your data. You may delete any contact, campaign, or disconnect your Google Workspace account at any time directly through the ArticlO dashboard or via your Google Security Account settings. Upon disconnection, your OAuth tokens and campaign data are permanently purged from our systems.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">6. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy or ArticlO’s privacy practices, please contact us at:
            </p>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-sm">
              Email: support@articleapply.io
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>&copy; {new Date().getFullYear()} ArticlO Inc. All rights reserved.</span>
          <Link href="/terms" className="text-slate-700 font-medium hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
