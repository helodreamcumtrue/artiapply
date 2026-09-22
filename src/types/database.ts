export type CampaignStatus = 'draft' | 'queued' | 'in_progress' | 'completed' | 'paused' | 'failed';
export type ContactStatus = 'pending' | 'queued' | 'sending' | 'sent' | 'failed';

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  google_access_token?: string | null;
  google_refresh_token?: string | null;
  token_expires_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  subject: string;
  body_template: string;
  status: CampaignStatus;
  total_contacts: number;
  sent_count: number;
  failed_count: number;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  campaign_id: string;
  user_id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  company?: string | null;
  role?: string | null;
  custom_fields?: Record<string, any>;
  status: ContactStatus;
  error_message?: string | null;
  sent_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailJobData {
  campaignId: string;
  contactId: string;
  userId: string;
  to: string;
  subject: string;
  bodyTemplate: string;
  contactData: {
    first_name?: string | null;
    last_name?: string | null;
    company?: string | null;
    role?: string | null;
    email: string;
    custom_fields?: Record<string, any>;
  };
}
