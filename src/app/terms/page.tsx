import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { ArticloLogo } from '@/components/icons/CustomIcons';
import { Footer } from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ArticlO',
  description: 'ArticlO Terms of Service and Acceptable Use Policy.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-700 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Top Header & Brand Bar */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center shadow-sm border border-slate-800 group-hover:scale-105 transition-transform">
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
            <FileText className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500">
            Last Updated: September 23, 2026 • Effective Date: September 23, 2026
          </p>
        </div>

        {/* Anti-Spam & Acceptable Use Policy Alert */}
        <div className="bg-white p-6 sm:p-7 rounded-[28px] border border-slate-200/90 shadow-[0_1px_3px_rgba(15,23,42,0.03),0_6px_20px_-4px_rgba(15,23,42,0.04)] space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2 font-poppins">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Anti-Spam & CAN-SPAM / GDPR Compliance Commitment</span>
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            ArticlO strictly prohibits the sending of unsolicited spam, deceptive subject lines, malicious attachments, or unlawful commercial communications. All users agree to comply fully with the United States CAN-SPAM Act of 2003, the European General Data Protection Regulation (GDPR), and relevant international anti-spam regulations.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the ArticlO software platform, website, and related APIs (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access or use the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">2. Description of Service</h2>
            <p>
              ArticlO provides a job application and career correspondence platform that enables job seekers and students (including Chartered Accountant articleship candidates) to organize, format, and dispatch legitimate job application materials through their own authenticated email accounts (including Gmail via official Google OAuth APIs). Features include application scheduling, quota-compliant rate-limiting (2 emails/second), recipient formatting tools, AI-assisted cover letter enhancement powered by Google Gemini, and real-time delivery telemetry.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">3. Acceptable Use Policy & Google API Compliance</h2>
            <p>You agree NOT to use ArticlO to:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li>
                <strong>Engage in Email Warming:</strong> Email warming services, automated engagement manipulation, simulated inbox interactions (artificial opens, replies, or threads), or warm-up schedules are <strong>strictly prohibited on all Google accounts</strong> and are not supported on ArticlO.
              </li>
              <li>
                <strong>Distribute Unsolicited Bulk Email (Spam):</strong> Transmit unsolicited commercial email, bulk advertising, or commercial solicitations to recipients who have not consented to receive professional communications or with whom you do not have a legitimate professional or employment interest.
              </li>
              <li>
                <strong>Mislead Recipients:</strong> Send emails containing false, misleading, or deceptive sender identities, email headers, or subject lines.
              </li>
              <li>
                <strong>Bypass Opt-Outs:</strong> Circumvent, tamper with, or fail to honor unsubscribe requests. All opt-out requests are permanently recorded in ArticlO’s server-side suppression list and cannot be overridden by new contact uploads or campaign launches.
              </li>
              <li>
                <strong>Transmit Harmful Content:</strong> Transmit phishing material, malware, viruses, fraudulent offers, or illegal commercial schemes.
              </li>
              <li>
                <strong>Bypass Provider Quotas:</strong> Exceed, circumvent, or attempt to bypass rate limits imposed by the platform or Google API quotas.
              </li>
            </ul>
            <p className="text-xs text-slate-600">
              <strong>No Lead Database:</strong> ArticlO does not provide, scrape, sell, or distribute recipient email addresses, recruiter databases, or lead lists. Users are strictly responsible for providing their own verified contact lists.
            </p>
            <p className="text-xs text-slate-500">
              Failure to adhere to this Acceptable Use Policy will result in immediate termination of your account without refund and permanent revocation of API access.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">4. User Account & Google Authorization</h2>
            <p>
              You are responsible for maintaining the confidentiality of your credentials. You authorize ArticlO to access the Google Gmail API solely to execute campaigns you have created and initiated. You may revoke access at any time via your Google Account permissions panel.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">5. Intellectual Property</h2>
            <p>
              The Service, including its original code, user interface, brand assets, and functionality, is owned by ArticlO Inc. and protected by copyright and intellectual property laws. You retain full ownership of the campaign copy and contact lists you import.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">6. Limitation of Liability</h2>
            <p>
              In no event shall ArticlO, its officers, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, deliverability reputation, or business interruption arising from your use of the Service or actions taken by third-party email providers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">7. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. Continued use of the platform after effective revisions signifies acceptance of the amended terms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900">8. Contact Information</h2>
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-700 shadow-sm">
              ArticlO Legal Team: legal@articleapply.io
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
