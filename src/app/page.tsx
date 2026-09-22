'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sidebar, NavTab } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { CampaignBuilder } from '@/components/CampaignBuilder';
import { CampaignsList } from '@/components/CampaignsList';
import { ContactsDirectory } from '@/components/ContactsDirectory';
import { AnalyticsView } from '@/components/AnalyticsView';
import { SettingsView } from '@/components/SettingsView';
import { useRealtimeCampaign } from '@/hooks/useRealtimeCampaign';
import { Campaign, Contact } from '@/types/database';

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Initial seed campaigns for instant demonstration
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'camp-seed-1',
      user_id: 'user-1',
      name: 'Y-Combinator Tech Founders Cold Outreach',
      subject: 'Quick question regarding {{company}} outreach workflow',
      body_template: 'Hi {{first_name}},\n\nLoved your recent launch at {{company}}. Would love to share how ArticleApply scales outreach with zero spam flags.\n\nBest,\nAlex',
      status: 'in_progress',
      total_contacts: 24,
      sent_count: 14,
      failed_count: 0,
      created_at: '2026-09-22T12:00:00.000Z',
      updated_at: '2026-09-22T12:00:00.000Z',
    },
    {
      id: 'camp-seed-2',
      user_id: 'user-1',
      name: 'B2B SaaS Growth Directors Q3',
      subject: 'Personalized cold outbound for {{company}}',
      body_template: 'Hi {{first_name}},\n\nSaw your role as {{role}} at {{company}}...',
      status: 'completed',
      total_contacts: 85,
      sent_count: 84,
      failed_count: 1,
      created_at: '2026-09-21T09:30:00.000Z',
      updated_at: '2026-09-21T14:45:00.000Z',
    },
    {
      id: 'camp-seed-3',
      user_id: 'user-1',
      name: 'Enterprise CTO Outreach Series',
      subject: 'Security & deliverability review for {{company}}',
      body_template: 'Hi {{first_name}},\n\n...',
      status: 'queued',
      total_contacts: 40,
      sent_count: 0,
      failed_count: 0,
      created_at: '2026-09-22T08:15:00.000Z',
      updated_at: '2026-09-22T08:15:00.000Z',
    },
  ]);

  // Initial recent contacts feed
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 'c1',
      campaign_id: 'camp-seed-1',
      user_id: 'user-1',
      email: 'jordan.bell@stratasys.io',
      first_name: 'Jordan',
      last_name: 'Bell',
      company: 'StrataSys',
      role: 'Chief Technology Officer',
      status: 'sent',
      sent_at: '2026-09-22T12:15:00.000Z',
      created_at: '2026-09-22T12:00:00.000Z',
      updated_at: '2026-09-22T12:15:00.000Z',
    },
    {
      id: 'c2',
      campaign_id: 'camp-seed-1',
      user_id: 'user-1',
      email: 'samantha.v@novatech.co',
      first_name: 'Samantha',
      last_name: 'Vance',
      company: 'NovaTech',
      role: 'VP Marketing',
      status: 'sent',
      sent_at: '2026-09-22T12:14:00.000Z',
      created_at: '2026-09-22T12:00:00.000Z',
      updated_at: '2026-09-22T12:14:00.000Z',
    },
    {
      id: 'c3',
      campaign_id: 'camp-seed-1',
      user_id: 'user-1',
      email: 'matthew.z@hypergrowth.ai',
      first_name: 'Matthew',
      last_name: 'Zhang',
      company: 'HyperGrowth AI',
      role: 'Growth Lead',
      status: 'sending',
      sent_at: null,
      created_at: '2026-09-22T12:00:00.000Z',
      updated_at: '2026-09-22T12:16:00.000Z',
    },
    {
      id: 'c4',
      campaign_id: 'camp-seed-1',
      user_id: 'user-1',
      email: 'claire.morris@apexcloud.dev',
      first_name: 'Claire',
      last_name: 'Morris',
      company: 'Apex Cloud',
      role: 'Founder',
      status: 'pending',
      sent_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]);

  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(campaigns[0]);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isRedisConnected, setIsRedisConnected] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>('marketer@articleapply.io');
  const [userName, setUserName] = useState<string | null>('Alex Outreach');

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
      const params = new URLSearchParams(window.location.search);
      const authSuccess = params.get('auth_success');
      const email = params.get('email');
      if (authSuccess === 'true') {
        setIsGoogleConnected(true);
        if (email) setUserEmail(decodeURIComponent(email));
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
      }

      // Check queue status
      fetch('/api/queue/status')
        .then((res) => res.json())
        .then((data) => {
          if (data.connected) setIsRedisConnected(true);
        })
        .catch(() => {});

      // Fetch live campaigns from database if available
      fetch('/api/campaigns')
        .then((res) => res.json())
        .then((data) => {
          if (data.campaigns && data.campaigns.length > 0) {
            setCampaigns(data.campaigns);
            setActiveCampaign(data.campaigns[0]);
          }
        })
        .catch(() => {});
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
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCampaigns((prev) => [newCamp, ...prev]);
    setActiveCampaign(newCamp);

    // If new contacts returned, prepend them
    if (data.contacts && Array.isArray(data.contacts)) {
      setContacts((prev) => [...data.contacts, ...prev]);
    }

    // Switch to dashboard so user can watch the live queue
    setActiveTab('dashboard');

    // Simulate BullMQ dispatch at 2 emails/sec if Redis is not running locally
    let sentCount = 0;
    const interval = setInterval(() => {
      sentCount += 1;
      setCampaigns((prev) =>
        prev.map((c) => {
          if (c.id === newCamp.id) {
            const nextSent = Math.min(c.total_contacts, c.sent_count + 1);
            const isFinished = nextSent >= c.total_contacts;
            return {
              ...c,
              sent_count: nextSent,
              status: isFinished ? 'completed' : 'in_progress',
            };
          }
          return c;
        })
      );

      // Update contacts list in real time
      setContacts((prev) => {
        const next = [...prev];
        const pendingIdx = next.findIndex((c) => c.status === 'pending' || c.status === 'queued');
        if (pendingIdx >= 0) {
          next[pendingIdx] = {
            ...next[pendingIdx],
            status: 'sent',
            sent_at: new Date().toISOString(),
          };
        }
        return next;
      });

      if (sentCount >= data.totalContacts) {
        clearInterval(interval);
      }
    }, 500); // 500ms = 2 emails / sec rate limit!
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    if (activeCampaign?.id === id) {
      setActiveCampaign(campaigns.find((c) => c.id !== id) || null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isGoogleConnected={isGoogleConnected}
        isRedisConnected={isRedisConnected}
        userEmail={userEmail}
        userName={userName}
        activeCampaignCount={campaigns.filter((c) => c.status === 'in_progress').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
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
            />
          )}

          {activeTab === 'builder' && (
            <CampaignBuilder
              onLaunchSuccess={handleLaunchSuccess}
              onCancel={() => setActiveTab('dashboard')}
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
              onDeleteCampaign={handleDeleteCampaign}
            />
          )}

          {activeTab === 'contacts' && (
            <ContactsDirectory contacts={contacts} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView campaigns={campaigns} />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              isGoogleConnected={isGoogleConnected}
              isRedisConnected={isRedisConnected}
              userEmail={userEmail}
            />
          )}
        </div>
      </main>
    </div>
  );
}
