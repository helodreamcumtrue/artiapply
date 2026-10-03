import { NextRequest, NextResponse } from 'next/server';
import { dispatchRealEmail } from '@/lib/email/dispatcher';
import { replaceVariables } from '@/lib/gmail/service';
import { supabaseAdmin, isAdminConfigured } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contact, subject, bodyTemplate, senderName, senderEmail, smtpConfig, campaignId } = body;

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

    // 1. Personalize subject and body
    const personalizedSubject = replaceVariables(subject, contact);
    const personalizedBody = replaceVariables(bodyTemplate, contact);

    // 2. Dispatch real email
    const result = await dispatchRealEmail({
      to: contact.email,
      subject: personalizedSubject,
      htmlBody: personalizedBody,
      fromName: senderName,
      fromEmail: senderEmail,
      smtpConfig,
    });

    // 3. Update in Supabase if configured
    if (isAdminConfigured() && contact.id) {
      try {
        await supabaseAdmin
          .from('contacts')
          .update({
            status: result.success ? 'sent' : 'failed',
            sent_at: result.success ? new Date().toISOString() : null,
            error_message: result.error || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', contact.id);

        if (result.success && campaignId) {
          const { data: camp } = await supabaseAdmin
            .from('campaigns')
            .select('sent_count')
            .eq('id', campaignId)
            .single();

          if (camp) {
            await supabaseAdmin
              .from('campaigns')
              .update({ sent_count: (camp.sent_count || 0) + 1 })
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
