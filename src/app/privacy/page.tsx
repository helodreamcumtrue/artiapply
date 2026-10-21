import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft, Mail, Lock, CheckCircle2 } from 'lucide-react';
import { ArticloLogo } from '@/components/icons/CustomIcons';
import { Footer } from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ArticlO',
  description: 'ArticlO Privacy Policy and Google API User Data Disclosure.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Top Header & Brand Bar */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-sm border border-slate-800 flex-shrink-0 group-hover:scale-105 transition-transform">
              <ArticloLogo size={18} className="text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-950 font-poppins flex items-center">
              ArticlO
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4f933] ml-1" />
            </span>
          </Link>

          {/* Back navigation */}
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

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
            ArticlO&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{' '}
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
            We specifically request access to <code className="text-slate-900 font-mono font-semibold">https://www.googleapis.com/auth/gmail.send</code> solely to transmit job applications and professional communications explicitly authored and initiated by you within your campaigns. We <strong>never</strong> read your personal emails (we do not request or use read/inbox scopes), we do not store your private inbox messages, we never sell your data, and we never use your Gmail data to train generalized AI models.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Information We Collect & How It Is Handled</h2>
            <p>
              When you use ArticlO, we collect and store only the data necessary to provide and operate our career application and correspondence platform:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                <strong className="text-slate-900">Account Profile:</strong> Name, email address, profile photo, and Google account identifier (to authenticate your session).
              </li>
              <li>
                <strong className="text-slate-900">Google OAuth Tokens:</strong> Encrypted access and refresh tokens provided via official Google OAuth consent to send messages on your behalf when you launch a campaign. Tokens are isolated by PostgreSQL Row Level Security (RLS).
              </li>
              <li>
                <strong className="text-slate-900">Contact & Template Data:</strong> Recipient lists (CSV files) uploaded directly by you (names, email addresses, companies, roles) and application email templates and resume attachments authored by you.
              </li>
              <li>
                <strong className="text-slate-900">Delivery Status Logs:</strong> Timestamps, delivery status (queued, sent, failed), recipient addresses, and system error codes for delivery monitoring.
              </li>
              <li>
                <strong className="text-slate-900">Permanent Suppression Registry:</strong> Email addresses of recipients who have opted out via unsubscribe links, stored permanently to ensure they are never emailed again.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. Strict Prohibition of Email Warming</h2>
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 space-y-2 leading-relaxed">
              <p>
                <strong>Email Warming Is Strictly Prohibited on Google Accounts:</strong> In compliance with Google API User Data Policy and Anti-Spam Guidelines, ArticlO does not provide, operate, or permit email warming services, automated engagement manipulation, or simulated conversations on any Google or Gmail-connected accounts.
              </p>
              <p>
                Our server-side dispatch engine and background queue processors enforce strict provider checks. Any attempt to queue or execute an email warming job on a Google account is automatically rejected, flagged, and permanently cancelled.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Anti-Spam Policy, Recipient Consent & No Lead Sourcing</h2>
            <p>ArticlO enforces strict anti-spam standards across all features:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                <strong className="text-slate-900">No Lead Databases:</strong> ArticlO does not sell, rent, scrape, or distribute recipient email addresses, recruiter databases, or lead lists. Sample files provided in the application are strictly RFC-compliant demonstration templates (using <code>.example.com</code> domains).
              </li>
              <li>
                <strong className="text-slate-900">Mandatory Recipient Consent:</strong> Users are required to confirm that their recipients are verified contacts who have consented to receive professional communications or with whom the user has a legitimate employment or business interest.
              </li>
              <li>
                <strong className="text-slate-900">Server-Side Unsubscribe Suppression:</strong> All campaign emails include an unsubscribe mechanism. Once a recipient unsubscribes, their address is permanently added to our multi-tier suppression registry (Memory, JSON, Redis, and Supabase). The platform strictly blocks future sends to suppressed recipients across all campaigns, background queues, direct sends, and new CSV imports.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. How We Use Your Information</h2>
            <p>We use your information exclusively for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>Pacing and dispatching your user-initiated email campaigns through the native Gmail API at a controlled rate (2 emails/second) to stay within Google API quotas.</li>
              <li>Providing real-time tracking of email delivery statuses (queued, sending, sent, failed) via Supabase Realtime.</li>
              <li>Polishing your cover letter templates using Google Gemini AI upon your explicit request.</li>
              <li>Enforcing opt-out and unsubscribe requests to ensure full compliance with CAN-SPAM and GDPR.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">5. Data Security & Storage</h2>
            <p>
              We implement industry-standard administrative, physical, and technical safeguards. All communications with our servers, Supabase PostgreSQL, and Google APIs use TLS 1.3 encryption. Your Google OAuth tokens are stored securely in database rows protected by PostgreSQL Row Level Security (RLS) policies, ensuring only your authenticated user account can access them.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">6. Data Sharing & Third Parties</h2>
            <p>
              ArticlO does not sell, rent, or lease your personal data or your contact lists to third parties. We share data only with trusted service providers essential for platform operations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong className="text-slate-900">Google APIs:</strong> For email transmission via Gmail API and cover letter drafting via Google Gemini AI.</li>
              <li><strong className="text-slate-900">Supabase:</strong> For managed, encrypted PostgreSQL hosting and real-time WebSocket state management.</li>
              <li><strong className="text-slate-900">Redis (Upstash):</strong> For ephemeral message queue state and rate-limiting.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">7. Your Rights & Data Deletion</h2>
            <p>
              You maintain complete ownership of your data. You may delete any contact, campaign, or disconnect your Google account at any time directly through the ArticlO dashboard or via your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-slate-900 underline font-semibold">Google Account Security permissions</a>. Upon disconnection, your OAuth tokens and campaign data are permanently purged from our systems.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">8. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy or ArticlO’s privacy practices, please contact us at:
            </p>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-sm">
              Email: privacy@articlo.online
            </div>
          </section>
        </div>
      </div>

      <div className="mt-16 -mx-4 sm:-mx-6 lg:-mx-8">
        <Footer />
      </div>
    </div>
  );
}
