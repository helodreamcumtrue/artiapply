import { Worker, Job } from 'bullmq';
import { getRedisConnection, QUEUE_NAME } from './client';
import { EmailJobData } from '@/types/database';
import { supabaseAdmin, isAdminConfigured } from '../supabase/admin';
import { formatEmailSubject, formatEmailBody } from '../gmail/service';
import { dispatchRealEmail } from '../email/dispatcher';
import { isSuppressed } from '../suppression/service';
import { validateWarmingPolicy } from '../compliance/policyGuard';

let emailWorker: Worker<EmailJobData> | null = null;

export function initWorker(): Worker<EmailJobData> {
  if (emailWorker) {
    return emailWorker;
  }

  const connection = getRedisConnection();

  emailWorker = new Worker<EmailJobData>(
    QUEUE_NAME,
    async (job: Job<EmailJobData>) => {
      const { campaignId, contactId, userId, to, subject, bodyTemplate, contactData, attachments, purpose } = job.data;
      console.log(`[Worker] Processing email job ${job.id} for ${to} in campaign ${campaignId}`);

      // 0a. Check warming policy: Reject and safely cancel any warming jobs
      const warmingCheck = validateWarmingPolicy({
        purpose,
        provider: 'gmail_oauth', // Guard Gmail accounts strictly
      });

      if (!warmingCheck.allowed) {
        console.warn(`[Worker] Job ${job.id} CANCELLED: Email warming is strictly prohibited on Google accounts.`);
        if (isAdminConfigured()) {
          await supabaseAdmin
            .from('contacts')
            .update({
              status: 'failed',
              error_message: 'Cancelled: Email warming is strictly prohibited for Google accounts.',
              updated_at: new Date().toISOString(),
            })
            .eq('id', contactId);
        }
        return {
          contactId,
          to,
          success: false,
          error: 'Cancelled: Email warming is prohibited on Google accounts',
        };
      }

      // 0b. Server-side suppression list check: Never send to opted-out recipients
      if (await isSuppressed(to)) {
        console.warn(`[Worker] Job ${job.id} CANCELLED: Recipient ${to} is on the suppression/opt-out list.`);
        if (isAdminConfigured()) {
          await supabaseAdmin
            .from('contacts')
            .update({
              status: 'failed',
              error_message: 'Recipient unsubscribed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', contactId);
        }
        return {
          contactId,
          to,
          success: false,
          error: 'Recipient unsubscribed',
        };
      }

      // 1. Mark contact as 'sending' in Supabase
      if (isAdminConfigured()) {
        await supabaseAdmin
          .from('contacts')
          .update({ status: 'sending', updated_at: new Date().toISOString() })
          .eq('id', contactId);
      }

      // 2. Personalize email template - clean subject and clean paragraphs
      const personalizedSubject = formatEmailSubject(subject, contactData);
      const { html: personalizedBody, text: plainTextBody, unsubscribeUrl } = formatEmailBody({
        bodyTemplate,
        contact: contactData,
        includeUnsubscribe: true,
      });

      // 3. Fetch user's Google tokens from public.users table
      let userTokens = null;
      let userProfile = null;

      if (isAdminConfigured()) {
        const { data: user, error: userError } = await supabaseAdmin
          .from('users')
          .select('email, name, google_access_token, google_refresh_token, token_expires_at')
          .eq('id', userId)
          .single();

        if (userError || !user) {
          console.warn(`[Worker] Could not fetch user ${userId} tokens:`, userError?.message);
        } else {
          userTokens = {
            access_token: user.google_access_token,
            refresh_token: user.google_refresh_token,
            expiry_date: user.token_expires_at ? new Date(user.token_expires_at).getTime() : undefined,
          };
          userProfile = user;
        }
      }

      // 4. Send email via SMTP, Gmail OAuth API, or mock if credentials not provided
      let sendResult: { success: boolean; error?: string; messageId?: string } = {
        success: false,
      };

      const dispatchResult = await dispatchRealEmail({
        userId,
        to,
        subject: personalizedSubject,
        htmlBody: personalizedBody,
        textBody: plainTextBody,
        unsubscribeUrl,
        fromName: userProfile?.name || undefined,
        fromEmail: userProfile?.email || undefined,
        attachments,
        googleTokens: userTokens || undefined,
        purpose: purpose || 'user_initiated_outreach',
      });

      if (dispatchResult.provider !== 'unconfigured') {
        sendResult = {
          success: dispatchResult.success,
          error: dispatchResult.error,
          messageId: dispatchResult.messageId,
        };
      } else {
        // Fallback / local dev simulation
        console.log(`[Worker - Simulation] Simulated sending email to ${to}: "${personalizedSubject}"`);
        // Artificial small latency to simulate email dispatch network call
        await new Promise((resolve) => setTimeout(resolve, 400));
        sendResult = {
          success: true,
          messageId: `sim-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        };
      }

      // 5. Update contact status & campaign counts in Supabase
      if (isAdminConfigured()) {
        if (sendResult.success) {
          await supabaseAdmin
            .from('contacts')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString(),
              error_message: null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', contactId);

          // Increment sent_count on campaign
          try {
            const { error: rpcError } = await supabaseAdmin.rpc('increment_campaign_sent', { campaign_id: campaignId });
            if (rpcError) throw rpcError;
          } catch {
            // Fallback if stored procedure doesn't exist
            const { data: camp } = await supabaseAdmin
              .from('campaigns')
              .select('sent_count')
              .eq('id', campaignId)
              .single();
            if (camp) {
              await supabaseAdmin
                .from('campaigns')
                .update({ sent_count: (camp.sent_count || 0) + 1, updated_at: new Date().toISOString() })
                .eq('id', campaignId);
            }
          }
        } else {
          await supabaseAdmin
            .from('contacts')
            .update({
              status: 'failed',
              error_message: sendResult.error || 'Failed to send email',
              updated_at: new Date().toISOString(),
            })
            .eq('id', contactId);

          // Increment failed_count on campaign
          const { data: camp } = await supabaseAdmin
            .from('campaigns')
            .select('failed_count')
            .eq('id', campaignId)
            .single();
          if (camp) {
            await supabaseAdmin
              .from('campaigns')
              .update({ failed_count: (camp.failed_count || 0) + 1, updated_at: new Date().toISOString() })
              .eq('id', campaignId);
          }
        }

        // 6. Check if all contacts are processed to mark campaign 'completed'
        const { data: remainingPending } = await supabaseAdmin
          .from('contacts')
          .select('id')
          .eq('campaign_id', campaignId)
          .in('status', ['pending', 'queued', 'sending'])
          .limit(1);

        if (!remainingPending || remainingPending.length === 0) {
          await supabaseAdmin
            .from('campaigns')
            .update({ status: 'completed', updated_at: new Date().toISOString() })
            .eq('id', campaignId);
          console.log(`[Worker] Campaign ${campaignId} marked as completed!`);
        }
      }

      return {
        contactId,
        to,
        success: sendResult.success,
        error: sendResult.error,
      };
    },
    {
      connection,
      concurrency: 2,
      // Rate limit: max 2 emails per second (1000ms) to respect Google API limits and avoid spam flags
      limiter: {
        max: 2,
        duration: 1000,
      },
    }
  );

  emailWorker.on('completed', (job: Job) => {
    console.log(`[Worker] Job ${job.id} completed successfully for contact ${job.data.to}`);
  });

  emailWorker.on('failed', (job: Job | undefined, err: Error) => {
    console.error(`[Worker] Job ${job?.id} failed with error:`, err.message);
  });

  emailWorker.on('error', (err: Error) => {
    console.error('[Worker] Worker encountered error:', err.message);
  });

  return emailWorker;
}

export default initWorker;
