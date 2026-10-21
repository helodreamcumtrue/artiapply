'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Rocket,
  Mail,
  Paperclip,
  RotateCcw,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

interface OnboardingTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: 'dashboard' | 'builder' | 'campaigns' | 'contacts' | 'settings') => void;
  onFinishTour?: () => void;
}

export const OnboardingTourModal: React.FC<OnboardingTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  onFinishTour,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      step: 1,
      badge: 'Welcome to ArticlO',
      title: 'Your Articleship Outreach Command Center',
      description:
        'ArticlO helps CA students reach hundreds of HRs and audit partners with calibrated human delivery (2 emails/sec) to ensure 99.4% primary inbox placement and zero spam flags.',
      tip: 'Click "Create Campaign" on the dashboard whenever you are ready to begin.',
      icon: Rocket,
      iconBg: 'bg-indigo-600 text-white',
      actionText: 'Next: Email Composer',
      actionTab: 'dashboard' as const,
    },
    {
      step: 2,
      badge: 'Familiar & Fast',
      title: 'Gmail-Style Email Crafter & AI Assistant',
      description:
        'Compose your emails in a clean, distraction-free Gmail Compose window. Load the official CA Articleship Statutory Audit demo format in 1 click or personalize with Gemini AI.',
      tip: 'Personalize each email dynamically using {{first_name}}, {{company}}, and {{role}}.',
      icon: Mail,
      iconBg: 'bg-blue-600 text-white',
      actionText: 'Next: Attachments',
      actionTab: 'builder' as const,
    },
    {
      step: 3,
      badge: 'Resumes & Marksheets',
      title: 'Attach Resumes & Certificates Safely',
      description:
        'Easily attach your ATS-ready resume PDF, marksheets, or portfolios (up to 8MB). Attachments are safely encoded automatically into RFC-compliant email streams.',
      tip: 'Keep PDF files under 8MB to ensure ultra-fast primary inbox delivery.',
      icon: Paperclip,
      iconBg: 'bg-emerald-600 text-white',
      actionText: 'Next: Email Sending Setup',
      actionTab: 'contacts' as const,
    },
    {
      step: 4,
      badge: 'Final Step: Email Setup',
      title: 'Email Sending Account Setup',
      description:
        'To send your CA articleship applications directly from your own Gmail address (so HR replies arrive straight to your personal inbox), you will connect your account in the next 60 seconds using a secure Google App Password.',
      tip: 'Requires only a 16-character Google App Password. 100% free, safe, and takes 1 minute.',
      icon: RotateCcw,
      iconBg: 'bg-purple-600 text-white',
      actionText: 'Setup Email Account Now 🚀',
      actionTab: 'dashboard' as const,
    },
  ];

  const current = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('artiapply_onboarded_v2', 'true');
    }
    onClose();
    onFinishTour?.();
  };

  if (!isOpen) return null;

  const IconComponent = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Header with Progress Dots */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full">
              {current.badge}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Step {currentStep} of {steps.length}
            </span>
          </div>

          <button
            onClick={handleComplete}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition"
            title="Close walkthrough"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 rounded-2xl ${current.iconBg} flex items-center justify-center shrink-0 shadow-md`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug font-poppins">
                {current.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {current.description}
              </p>
            </div>
          </div>

          {/* Pro-Tip Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              <span className="font-bold text-slate-900">Pro Tip: </span>
              {current.tip}
            </p>
          </div>

          {/* Step Progress Indicators */}
          <div className="flex items-center justify-center space-x-1.5 pt-2">
            {steps.map((s) => (
              <button
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                className={`h-1.5 rounded-full transition-all ${
                  s.step === currentStep
                    ? 'w-6 bg-slate-900'
                    : s.step < currentStep
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-200'
                }`}
                title={`Go to step ${s.step}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition flex items-center space-x-1.5 shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="text-xs font-medium text-slate-400 hover:text-slate-600 px-2 py-1 transition"
              >
                Skip Tour
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-md transition flex items-center space-x-1.5 active:scale-95"
            >
              <span>{current.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
