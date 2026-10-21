'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar, NavTab } from '@/components/Navbar';
import { Dashboard } from '@/components/Dashboard';
import { CampaignBuilder } from '@/components/CampaignBuilder';
import { CampaignsList } from '@/components/CampaignsList';
import { SimpleContactsList } from '@/components/SimpleContactsList';
import { SettingsView } from '@/components/SettingsView';
import { OnboardingTourModal } from '@/components/OnboardingTourModal';
import { TakeFollowUpModal } from '@/components/TakeFollowUpModal';
import { LandingPage } from '@/components/LandingPage';
import { Footer } from '@/components/Footer';
import { EmailAccountSetupModal } from '@/components/EmailAccountSetupModal';
import { useRealtimeCampaign } from '@/hooks/useRealtimeCampaign';
import { Campaign, Contact, CampaignStatus, ContactStatus } from '@/types/database';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isEmailSetupOpen, setIsEmailSetupOpen] = useState(false);
  const [isEmailConfigured, setIsEmailConfigured] = useState(false);
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [followUpCampaign, setFollowUpCampaign] = useState<Campaign | null>(null);

  // Campaigns & Contacts State (Persisted in localStorage & Supabase)
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isRedisConnected, setIsRedisConnected] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>('outreach@artiapply.io');
  const [userName, setUserName] = useState<string | null>('Workspace Manager');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleLogin = (customEmail?: string, customName?: string) => {
    setIsLoggedIn(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('artiapply_session', 'true');
      if (customEmail) {
        setUserEmail(customEmail);
        localStorage.setItem('artiapply_user_email', customEmail);
      }
      if (customName) {
        setUserName(customName);
        localStorage.setItem('artiapply_user_name', customName);
      }

      // Check onboarding & email setup status upon login
      const hasOnboarded = localStorage.getItem('artiapply_onboarded_v2');
      const storedSmtp = localStorage.getItem('artiapply_smtp_config');
      if (!hasOnboarded) {
        setIsTourOpen(true);
      } else if (!storedSmtp) {
        setIsEmailSetupOpen(true);
      }
    }
    showToast('Welcome to ArticlO Command Center!');
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('artiapply_session');
    }
    showToast('Signed out. See you soon!');
  };

  // Supabase Realtime Hook integration
  const { isRealtimeConnected } = useRealtimeCampaign({
    campaignId: activeCampaign?.id,
    onContactUpdate: (updatedContact) => {
      setContacts((prev) => {
        const idx = prev.findIndex((c) => c.id === updatedContact.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updatedContact;
          return next;
        }
        return [updatedContact, ...prev];
      });
    },
    onCampaignUpdate: (updatedCamp) => {
      setCampaigns((prev) =>
        prev.map((c) => (c.id === updatedCamp.id ? updatedCamp : c))
      );
      if (activeCampaign?.id === updatedCamp.id) {
        setActiveCampaign(updatedCamp);
      }
    },
  });

  // Check URL params for OAuth results or inspect cookies
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('artiapply_session');
      const storedEmail = localStorage.getItem('artiapply_user_email');
      const storedName = localStorage.getItem('artiapply_user_name');
      if (storedEmail) setUserEmail(storedEmail);
      if (storedName) setUserName(storedName);

      try {
        const storedSmtp = localStorage.getItem('artiapply_smtp_config');
        if (storedSmtp) {
          const parsed = JSON.parse(storedSmtp);
          if (parsed.user && parsed.pass) {
            setIsEmailConfigured(true);
          }
          if (parsed.fromEmail && !storedEmail) setUserEmail(parsed.fromEmail);
          if (parsed.fromName && !storedName) setUserName(parsed.fromName);
        }
      } catch {}

      // Load saved campaigns and contacts from localStorage
      try {
        const savedContacts = localStorage.getItem('artiapply_contacts');
        let loadedContacts: Contact[] = [];
        if (savedContacts) {
          const parsed = JSON.parse(savedContacts);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedContacts = parsed;
            setContacts(parsed);
          }
        }

        const savedCamps = localStorage.getItem('artiapply_campaigns');
        if (savedCamps) {
          const parsed = JSON.parse(savedCamps);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Reconcile status: if contacts are sent, ensure campaign is marked completed so it never resets to pending on refresh
            const reconciled = parsed.map((c: Campaign) => {
              const campContacts = loadedContacts.filter((ct) => ct.campaign_id === c.id);
              const sentContacts = campContacts.filter((ct) => ct.status === 'sent');
              if (campContacts.length > 0 && sentContacts.length >= campContacts.length) {
                return { ...c, status: 'completed' as const, sent_count: sentContacts.length };
              }
              return c;
            });
            setCampaigns(reconciled);
            setActiveCampaign(reconciled[0]);
            try {
              localStorage.setItem('artiapply_campaigns', JSON.stringify(reconciled));
            } catch {}
          }
        }
      } catch {}

      const params = new URLSearchParams(window.location.search);
      const authSuccess = params.get('auth_success');
      const authNotice = params.get('auth_notice');
      const email = params.get('email');

      if (authSuccess === 'true') {
        setIsLoggedIn(true);
        localStorage.setItem('artiapply_session', 'true');
        setIsGoogleConnected(true);
        if (email) {
          const cleanEmail = decodeURIComponent(email);
          setUserEmail(cleanEmail);
          localStorage.setItem('artiapply_user_email', cleanEmail);
        }
        showToast('Google Workspace connected successfully!');
        window.history.replaceState({}, '', window.location.pathname);
      } else if (session === 'true') {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }

      if (authNotice === 'google_setup_required') {
        showToast('Google OAuth is not configured yet. You can use Direct SMTP in Settings to send immediately.');
        window.history.replaceState({}, '', window.location.pathname);
      }

      // Check queue status
      fetch('/api/queue/status')
        .then((res) => res.json())
        .then((data) => {
          if (data.connected) setIsRedisConnected(true);
        })
        .catch(() => {});

      // Fetch live campaigns from database if available (preserve local completed/sent state)
      fetch('/api/campaigns')
        .then((res) => res.json())
        .then((data) => {
          if (data.campaigns && data.campaigns.length > 0) {
            setCampaigns((prev) => {
              const dbCamps: Campaign[] = data.campaigns;
              const merged = dbCamps.map((dbc) => {
                const local = prev.find((lc) => lc.id === dbc.id);
                if (local && (local.sent_count > dbc.sent_count || local.status === 'completed')) {
                  return { ...dbc, sent_count: local.sent_count, status: local.status };
                }
                return dbc;
              });
              prev.forEach((lc) => {
                if (!merged.some((m) => m.id === lc.id)) {
                  merged.push(lc);
                }
              });
              try {
                localStorage.setItem('artiapply_campaigns', JSON.stringify(merged));
              } catch {}
              return merged;
            });
            setActiveCampaign((prev) => prev || data.campaigns[0]);
          }
        })
        .catch(() => {});

      // Auto-show onboarding tour pop-up for first-time visitors, or Email Setup if tour done but unconfigured
      try {
        const hasOnboarded = localStorage.getItem('artiapply_onboarded_v2');
        const storedSmtp = localStorage.getItem('artiapply_smtp_config');
        if (!hasOnboarded) {
          setIsTourOpen(true);
        } else if (!storedSmtp) {
          setIsEmailSetupOpen(true);
        }
      } catch {}
    }
  }, []);

  // Handle Campaign Launch from Builder
  const handleLaunchSuccess = (data: any) => {
    const newCamp: Campaign = data.campaign || {
      id: data.campaignId,
      user_id: 'user-1',
      name: 'New Campaign',
      subject: '',
      body_template: '',
      status: 'in_progress',
      total_contacts: data.totalContacts,
      sent_count: 0,
      failed_count: 0,
      attachments: data.attachments,
      follow_ups: data.follow_ups,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCampaigns((prev) => {
      const updated = [newCamp, ...prev.filter((c) => c.id !== newCamp.id)];
      try {
        localStorage.setItem('artiapply_campaigns', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    setActiveCampaign(newCamp);

    // If new contacts returned, prepend them and persist
    if (data.contacts && Array.isArray(data.contacts)) {
      setContacts((prev) => {
        const updated = [...data.contacts, ...prev];
        try {
          localStorage.setItem('artiapply_contacts', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }

    // Switch to dashboard so user can watch the live queue
    setActiveTab('dashboard');

    // Dispatch real emails sequentially with 500ms delay (2 emails/second rate limiter)
    const contactsList = Array.isArray(data.contacts) ? data.contacts : [];
    let processedIndex = 0;
    let actualSentCount = 0;
    let actualFailedCount = 0;

    let savedSmtpConfig: any = null;
    try {
      const stored = localStorage.getItem('artiapply_smtp_config');
      if (stored) savedSmtpConfig = JSON.parse(stored);
    } catch {}

    const dispatchNextEmail = async () => {
      if (processedIndex >= contactsList.length) return;
      const target = contactsList[processedIndex];
      processedIndex++;

      // Set target contact to 'sending'
      setContacts((prev) =>
        prev.map((c) =>
          c.id === target.id || c.email === target.email ? { ...c, status: 'sending' } : c
        )
      );

      try {
        const res = await fetch('/api/campaigns/send-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaignId: newCamp.id,
            contact: target,
            subject: data.subject || newCamp.subject,
            bodyTemplate: data.bodyTemplate || newCamp.body_template,
            senderName: data.senderName || userName,
            senderEmail: data.senderEmail || userEmail,
            smtpConfig: savedSmtpConfig,
            attachments: data.attachments || newCamp.attachments,
          }),
        });

        const sendResult = await res.json();

        if (sendResult.success) {
          actualSentCount++;
          setContacts((prev) => {
            const next = prev.map((c) =>
              c.id === target.id || c.email === target.email
                ? {
                    ...c,
                    status: 'sent' as ContactStatus,
                    sent_at: new Date().toISOString(),
                  }
                : c
            );
            try {
              localStorage.setItem('artiapply_contacts', JSON.stringify(next));
            } catch {}
            return next;
          });
        } else {
          actualFailedCount++;
          setContacts((prev) => {
            const next = prev.map((c) =>
              c.id === target.id || c.email === target.email
                ? {
                    ...c,
                    status: 'failed' as ContactStatus,
                  }
                : c
            );
            try {
              localStorage.setItem('artiapply_contacts', JSON.stringify(next));
            } catch {}
            return next;
          });

          if (processedIndex === 1) {
            showToast(
              sendResult.error ||
                'Email sending failed. Please configure your Gmail App Password or SMTP in Settings.'
            );
          }
        }
      } catch (err: any) {
        actualFailedCount++;
        setContacts((prev) => {
          const next = prev.map((c) =>
            c.id === target.id || c.email === target.email
              ? { ...c, status: 'failed' as ContactStatus }
              : c
          );
          try {
            localStorage.setItem('artiapply_contacts', JSON.stringify(next));
          } catch {}
          return next;
        });
      }

      // Update campaign stats and persist to localStorage
      const isFinished = processedIndex >= contactsList.length;
      setCampaigns((prev) => {
        const next = prev.map((c) => {
          if (c.id === newCamp.id) {
            const finalStatus: CampaignStatus = isFinished ? (actualSentCount > 0 ? 'completed' : 'failed') : 'in_progress';
            return {
              ...c,
              sent_count: actualSentCount,
              failed_count: actualFailedCount,
              status: finalStatus,
            };
          }
          return c;
        });
        try {
          localStorage.setItem('artiapply_campaigns', JSON.stringify(next));
        } catch {}
        return next;
      });

      if (isFinished) {
        setActiveCampaign((prev) =>
          prev && prev.id === newCamp.id
            ? {
                ...prev,
                sent_count: actualSentCount,
                failed_count: actualFailedCount,
                status: actualSentCount > 0 ? 'completed' : 'failed',
              }
            : prev
        );

        // Sync final status to server database so it never resets on refresh
        fetch('/api/campaigns', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: newCamp.id,
            status: actualSentCount > 0 ? 'completed' : 'failed',
            sent_count: actualSentCount,
            failed_count: actualFailedCount,
          }),
        }).catch(() => {});
      }

      if (processedIndex < contactsList.length) {
        setTimeout(dispatchNextEmail, 500); // 2 emails/sec pace
      } else {
        if (actualSentCount > 0) {
          showToast(`Campaign dispatch finished: ${actualSentCount} emails delivered!`);
        } else {
          showToast('Delivery alert: No email credentials configured. Go to Settings > Email Setup.');
        }
      }
    };

    if (contactsList.length > 0) {
      setTimeout(dispatchNextEmail, 250);
    }
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem('artiapply_campaigns', JSON.stringify(updated));
      } catch {}
      return updated;
    });
    if (activeCampaign?.id === id) {
      setActiveCampaign(campaigns.find((c) => c.id !== id) || null);
    }
    // Delete in database if Supabase configured
    fetch('/api/campaigns', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {});
    showToast('Campaign removed.');
  };

  const handleOpenFollowUp = (camp: Campaign) => {
    setFollowUpCampaign(camp);
    setIsFollowUpOpen(true);
  };

  const handleFollowUpSuccess = (campaignId: string, updatedContactsList: Contact[]) => {
    setContacts((prev) => {
      const updatedMap = new Map(updatedContactsList.map((c) => [c.id, c]));
      const next = prev.map((c) => updatedMap.get(c.id) || c);
      try {
        localStorage.setItem('artiapply_contacts', JSON.stringify(next));
      } catch {}
      return next;
    });

    setCampaigns((prev) => {
      const next = prev.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            status: 'completed' as const,
            followup_count: (c.followup_count || 0) + 1,
            last_followup_at: new Date().toISOString(),
          };
        }
        return c;
      });
      try {
        localStorage.setItem('artiapply_campaigns', JSON.stringify(next));
      } catch {}
      return next;
    });

    showToast(`Follow-up sent successfully to ${updatedContactsList.length} contact${updatedContactsList.length === 1 ? '' : 's'}!`);
  };

  // If user is not logged in, render the high-converting Landing Page
  if (!isLoggedIn) {
    return (
      <LandingPage
        onLogin={() => handleLogin()}
        onConnectGoogle={() => {
          window.location.href = '/api/auth/google';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Floating Pill Top Navbar matching reference UI */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isGoogleConnected={isGoogleConnected}
        isRedisConnected={isRedisConnected}
        userEmail={userEmail}
        userName={userName}
        activeCampaignCount={campaigns.filter((c) => c.status === 'in_progress').length}
        onOpenTour={() => setIsTourOpen(true)}
        onSignOut={handleSignOut}
        isEmailConfigured={isEmailConfigured}
        onOpenEmailSetup={() => setIsEmailSetupOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              campaigns={campaigns}
              activeCampaign={activeCampaign}
              recentActivity={contacts.slice(0, 10)}
              onNewCampaign={() => setActiveTab('builder')}
              onSelectCampaign={(c) => {
                setActiveCampaign(c);
                setActiveTab('campaigns');
              }}
              onViewContacts={() => setActiveTab('contacts')}
              onTakeFollowUp={handleOpenFollowUp}
              onOpenTour={() => setIsTourOpen(true)}
              isEmailConfigured={isEmailConfigured}
              onOpenEmailSetup={() => setIsEmailSetupOpen(true)}
            />
          )}

          {activeTab === 'builder' && (
            <CampaignBuilder
              onLaunchSuccess={handleLaunchSuccess}
              onCancel={() => setActiveTab('dashboard')}
              userEmail={userEmail}
              userName={userName}
              onNavigateToSettings={() => setActiveTab('settings')}
              onOpenEmailSetup={() => setIsEmailSetupOpen(true)}
            />
          )}

          {activeTab === 'campaigns' && (
            <CampaignsList
              campaigns={campaigns}
              onSelectCampaign={(c) => {
                setActiveCampaign(c);
                setActiveTab('dashboard');
              }}
              onNewCampaign={() => setActiveTab('builder')}
              onTakeFollowUp={handleOpenFollowUp}
              onDeleteCampaign={handleDeleteCampaign}
            />
          )}

          {activeTab === 'contacts' && (
            <SimpleContactsList
              contacts={contacts}
              onUpdateContact={(updated) => {
                setContacts((prev) => {
                  const next = prev.map((c) => (c.id === updated.id || c.email === updated.email ? updated : c));
                  try {
                    localStorage.setItem('artiapply_contacts', JSON.stringify(next));
                  } catch {}
                  return next;
                });
                showToast(`Contact updated successfully.`);
              }}
              onDeleteContact={(id) => {
                setContacts((prev) => {
                  const next = prev.filter((c) => c.id !== id);
                  try {
                    localStorage.setItem('artiapply_contacts', JSON.stringify(next));
                  } catch {}
                  return next;
                });
                showToast(`Contact deleted.`);
              }}
              onAddContact={(newContact) => {
                setContacts((prev) => {
                  const next = [newContact, ...prev];
                  try {
                    localStorage.setItem('artiapply_contacts', JSON.stringify(next));
                  } catch {}
                  return next;
                });
                showToast(`Contact added to platform.`);
              }}
              onNewCampaign={() => setActiveTab('builder')}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              isGoogleConnected={isGoogleConnected}
              isRedisConnected={isRedisConnected}
              userEmail={userEmail}
              userName={userName}
            />
          )}
        </div>
      </main>

      {/* Unified Platform Footer */}
      <Footer />

      {/* Step-by-Step Interactive Onboarding Pop-up */}
      <OnboardingTourModal
        isOpen={isTourOpen}
        onClose={() => {
          setIsTourOpen(false);
          const storedSmtp = typeof window !== 'undefined' ? localStorage.getItem('artiapply_smtp_config') : null;
          if (!storedSmtp) {
            setIsEmailSetupOpen(true);
          }
        }}
        onFinishTour={() => {
          setIsTourOpen(false);
          const storedSmtp = typeof window !== 'undefined' ? localStorage.getItem('artiapply_smtp_config') : null;
          if (!storedSmtp) {
            setIsEmailSetupOpen(true);
          }
        }}
        onNavigateToTab={(tab) => {
          setActiveTab(tab as NavTab);
          setIsTourOpen(false);
        }}
      />

      {/* Guided 60-Second Email Sending Account Setup Modal (Post-Onboarding) */}
      <EmailAccountSetupModal
        isOpen={isEmailSetupOpen}
        onClose={() => setIsEmailSetupOpen(false)}
        initialEmail={userEmail}
        initialName={userName}
        onSuccess={(savedEmail, savedName) => {
          setIsEmailConfigured(true);
          setUserEmail(savedEmail);
          setUserName(savedName);
          setIsEmailSetupOpen(false);
          showToast('Email sending account connected & verified! 🚀');
        }}
      />

      {/* Follow-up Sequence Dispatcher Modal */}
      <TakeFollowUpModal
        isOpen={isFollowUpOpen}
        campaign={followUpCampaign}
        contacts={contacts.filter((c) => !followUpCampaign || c.campaign_id === followUpCampaign.id)}
        onClose={() => {
          setIsFollowUpOpen(false);
          setFollowUpCampaign(null);
        }}
        onFollowUpSuccess={handleFollowUpSuccess}
        userEmail={userEmail}
        userName={userName}
      />

      {/* Floating System Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
