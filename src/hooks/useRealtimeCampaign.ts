'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Campaign, Contact } from '@/types/database';

interface UseRealtimeCampaignOptions {
  campaignId?: string | null;
  onContactUpdate?: (contact: Contact) => void;
  onCampaignUpdate?: (campaign: Campaign) => void;
}

export function useRealtimeCampaign({
  campaignId,
  onContactUpdate,
  onCampaignUpdate,
}: UseRealtimeCampaignOptions = {}) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  const onContactUpdateRef = useRef(onContactUpdate);
  const onCampaignUpdateRef = useRef(onCampaignUpdate);

  useEffect(() => {
    onContactUpdateRef.current = onContactUpdate;
    onCampaignUpdateRef.current = onCampaignUpdate;
  }, [onContactUpdate, onCampaignUpdate]);

  // Set up Supabase Realtime subscription
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = createClient();
    const channelName = campaignId ? `campaign-${campaignId}` : 'campaigns-all';
    const channel = supabase.channel(channelName);

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contacts',
          filter: campaignId ? `campaign_id=eq.${campaignId}` : undefined,
        },
        (payload) => {
          const updatedContact = payload.new as Contact;
          if (updatedContact) {
            setContacts((prev) => {
              const index = prev.findIndex((c) => c.id === updatedContact.id);
              if (index >= 0) {
                const next = [...prev];
                next[index] = updatedContact;
                return next;
              }
              return [updatedContact, ...prev];
            });

            if (onContactUpdateRef.current) {
              onContactUpdateRef.current(updatedContact);
            }
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'campaigns',
          filter: campaignId ? `id=eq.${campaignId}` : undefined,
        },
        (payload) => {
          const updatedCamp = payload.new as Campaign;
          if (updatedCamp) {
            setActiveCampaign(updatedCamp);
            if (onCampaignUpdateRef.current) {
              onCampaignUpdateRef.current(updatedCamp);
            }
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsRealtimeConnected(true);
        } else {
          setIsRealtimeConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  return {
    contacts,
    setContacts,
    activeCampaign,
    setActiveCampaign,
    isRealtimeConnected,
  };
}
