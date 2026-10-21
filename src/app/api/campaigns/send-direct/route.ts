import { NextRequest, NextResponse } from 'next/server';
import { dispatchRealEmail } from '@/lib/email/dispatcher';
import { formatEmailSubject, formatEmailBody } from '@/lib/gmail/service';
import { supabaseAdmin, isAdminConfigured } from '@/lib/supabase/admin';
import { isSuppressed } from '@/lib/suppression/service';
import { validateWarmingPolicy } from '@/lib/compliance/policyGuard';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contact, subject, bodyTemplate, senderName, senderEmail, smtpConfig, campaignId, attachments, isFollowUp, purpose } = body;

    if (!contact || !contact.email) {
      return NextResponse.json(
        { error: 'Contact with valid email is required.' },
        { status: 400 }
      );
    }

    if (!subject || !bodyTemplate) {
      return NextResponse.json(
        { error: 'Subject and body template are required.' },
        { status: 400 }
      );
    }

    // 0a. Compliance Policy: Block any email warming requests
    const warmingCheck = validateWarmingPolicy({
      purpose,
      fromEmail: senderEmail || smtpConfig?.fromEmail || smtpConfig?.user,
      smtpHost: smtpConfig?.host,
    });

    if (!warmingCheck.allowed) {
      return NextResponse.json(
        { error: warmingCheck.error || 'Email warming is strictly prohibited on Google accounts.' },
        { status: 403 }
      );
    }

    // 0b. Suppression List Check: Never send to unsubscribed recipients
    const recipientSuppressed = await isSuppressed(contact.email);
    if (recipientSuppressed) {
      console.warn(`[SendDirect] Blocked send to suppressed recipient: ${contact.email}`);
      return NextResponse.json(
        {
          success: false,
          skipped: true,
          error: `Recipient ${contact.email} has unsubscribed and cannot be emailed.`,
          status: 'failed',
        },
        { status: 400 }
      );
    }

    // Safeguard against duplicate sends: If already marked sent and not a follow-up, do not resend!
    if (contact.status === 'sent' && !isFollowUp && contact.sent_at) {
      return NextResponse.json({
        success: true,
        contactId: contact.id,
        email: contact.email,
        skipped: true,
        message: 'Email already delivered to this contact.',
        status: 'sent',
      });
    }

    // 1. Personalize subject - 100% clean plain text, no HTML tags, no newlines, no footer
    const personalizedSubject = formatEmailSubject(subject, contact);

    // 2. Personalize body - formats into clean paragraphs and matching plain text with subtle opt-out footer
    const { html: formattedHtmlBody, text: formattedTextBody, unsubscribeUrl } = formatEmailBody({
      bodyTemplate,
      contact,
      includeUnsubscribe: true,
    });

    // 3. Dispatch real email with attachments and deliverability headers
    const result = await dispatchRealEmail({
      to: contact.email,
      subject: personalizedSubject,
      htmlBody: formattedHtmlBody,
      textBody: formattedTextBody,
      unsubscribeUrl,
      fromName: senderName,
      fromEmail: senderEmail,
      attachments,
      smtpConfig,
    });

    // 4. Update in Supabase if configured
    if (isAdminConfigured() && contact.id) {
      try {
        const contactUpdates: Record<string, any> = {
          status: result.success ? 'sent' : 'failed',
          sent_at: result.success ? (contact.sent_at || new Date().toISOString()) : null,
          error_message: result.error || null,
          updated_at: new Date().toISOString(),
        };

        if (isFollowUp && result.success) {
          contactUpdates.followup_sent_at = new Date().toISOString();
          contactUpdates.followup_count = (contact.followup_count || 0) + 1;
        }

        await supabaseAdmin
          .from('contacts')
          .update(contactUpdates)
          .eq('id', contact.id);

        if (result.success && campaignId) {
          const { data: camp } = await supabaseAdmin
            .from('campaigns')
            .select('sent_count, total_contacts, followup_count')
            .eq('id', campaignId)
            .single();

          if (camp) {
            const nextSentCount = (camp.sent_count || 0) + 1;
            const isCompleted = !isFollowUp && camp.total_contacts > 0 && nextSentCount >= camp.total_contacts;

            const campUpdates: Record<string, any> = {
              sent_count: nextSentCount,
              updated_at: new Date().toISOString(),
            };
            if (isCompleted) {
              campUpdates.status = 'completed';
            }
            if (isFollowUp) {
              campUpdates.followup_count = (camp.followup_count || 0) + 1;
              campUpdates.last_followup_at = new Date().toISOString();
            }
            await supabaseAdmin
              .from('campaigns')
              .update(campUpdates)
              .eq('id', campaignId);
          }
        }
      } catch (dbErr) {
        console.warn('[SendDirect] DB update notice:', dbErr);
      }
    }

    return NextResponse.json({
      success: result.success,
      contactId: contact.id,
      email: contact.email,
      messageId: result.messageId,
      error: result.error,
      provider: result.provider,
      status: result.success ? 'sent' : 'failed',
    });
  } catch (error: any) {
    console.error('[API /api/campaigns/send-direct] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to dispatch email' },
      { status: 500 }
    );
  }
}
