'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Mail,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ArticloLogo, IconShieldVerified, IconCadenceTimer } from './icons/CustomIcons';

interface FooterProps {
  className?: string;
  variant?: 'minimal' | 'full';
}

export const Footer: React.FC<FooterProps> = ({
  className = '',
  variant = 'full',
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`w-full bg-white dark:bg-[#0b101c] border-t border-slate-200 dark:border-slate-800/80 transition-colors duration-200 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {variant === 'full' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-100 dark:border-slate-800/60">
            {/* Brand column */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center shadow-sm border border-slate-800 dark:border-slate-200">
                  <ArticloLogo size={18} />
                </div>
                <span className="font-extrabold text-base tracking-tight text-slate-950 dark:text-white font-poppins flex items-center">
                  ArticlO
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d4f933] ml-1" />
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                Empowering CA students and articleship aspirants to reach hundreds of HRs and audit partners in one click with ATS-free templates, verified mail IDs, and authentic Gmail delivery.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>99.4% Primary Inbox</span>
                </span>
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <span>2.0/s Human Cadence</span>
                </span>
              </div>
            </div>

            {/* Platform Links */}
            <div className="md:col-span-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-poppins">
                Platform
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition">
                    Outreach Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition">
                    Terms & Acceptable Use
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/unsubscribe" className="text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition">
                    Recipient Opt-Out Portal
                  </Link>
                </li>
              </ul>
            </div>

            {/* Articleship Pillars */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 font-poppins">
                Articleship Suite
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-center space-x-2">
                  <span className="text-sm">📬</span>
                  <span>Direct HR Outreach in a Click</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-sm">📜</span>
                  <span>ATS-Free CA Resume Templates</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-sm">✉️</span>
                  <span>Active HR Mail IDs of Top Audit Firms</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-sm">🛡️</span>
                  <span>Authentic Direct Gmail API Delivery</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span>&copy; {currentYear} ArticlO. All rights reserved.</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center space-x-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>All Systems Operational</span>
            </span>
          </div>

          <div className="flex items-center space-x-5 font-medium">
            <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition">
              Terms
            </Link>
            <Link href="/unsubscribe" className="hover:text-slate-900 dark:hover:text-white transition">
              Opt-Out
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
