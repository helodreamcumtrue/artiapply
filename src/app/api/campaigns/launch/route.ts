import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isAdminConfigured } from '@/lib/supabase/admin';
import { enqueueEmailJobs } from '@/lib/queue/client';
import { EmailJobData } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, subject, bodyTemplate, contacts, userId = '00000000-0000-0000-0000-000000000001' } = body;

    if (!name || !subject || !bodyTemplate) {
      return NextResponse.json(
        { error: 'Campaign name, subject, and body template are required.' },
        { status: 400 }
      );
    }

    if (!Array.isArray(contacts) || contacts.length === 0) {
      return NextResponse.json(
        { error: 'At least one contact is required to launch a campaign.' },
        { status: 400 }
      );
    }

    console.log(`[Launch API] Launching campaign "${name}" with ${contacts.length} contacts`);

    let campaignId = `camp-${Date.now()}`;
    let insertedContacts = contacts.map((c, index) => ({
      id: `cont-${Date.now()}-${index}`,
      campaign_id: campaignId,
      user_id: userId,
      email: c.email?.trim() || '',
      first_name: c.first_name || c.firstName || '',
      last_name: c.last_name || c.lastName || '',
      company: c.company || '',
      role: c.role || '',
      custom_fields: c.custom_fields || {},
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    }));

    // 1. If Supabase is configured, insert into PostgreSQL
    if (isAdminConfigured()) {
      // Ensure user exists or use provided userId
      const { data: campaignData, error: campaignError } = await supabaseAdmin
        .from('campaigns')
        .insert({
          user_id: userId,
          name,
          subject,
          body_template: bodyTemplate,
          status: 'queued',
          total_contacts: contacts.length,
          sent_count: 0,
          failed_count: 0,
        })
        .select()
        .single();

      if (campaignError) {
        console.error('[Launch API] Failed to create campaign in Supabase:', campaignError);
        return NextResponse.json({ error: campaignError.message }, { status: 500 });
      }

      campaignId = campaignData.id;

      // Prepare contacts for Supabase batch insert
      const contactsToInsert = contacts.map((c) => ({
        campaign_id: campaignId,
        user_id: userId,
        email: c.email?.trim(),
        first_name: c.first_name || c.firstName || null,
        last_name: c.last_name || c.lastName || null,
        company: c.company || null,
        role: c.role || null,
        custom_fields: c.custom_fields || {},
        status: 'pending',
      }));

      const { data: contactsData, error: contactsError } = await supabaseAdmin
        .from('contacts')
        .insert(contactsToInsert)
        .select();

      if (contactsError) {
        console.error('[Launch API] Failed to insert contacts in Supabase:', contactsError);
        return NextResponse.json({ error: contactsError.message }, { status: 500 });
      }

      insertedContacts = contactsData as any;
    }

    // 2. Prepare jobs for BullMQ email-queue
    const jobs: EmailJobData[] = insertedContacts.map((contact) => ({
      campaignId,
      contactId: contact.id,
      userId,
      to: contact.email,
      subject,
      bodyTemplate,
      contactData: {
        email: contact.email,
        first_name: contact.first_name,
        last_name: contact.last_name,
        company: contact.company,
        role: contact.role,
        custom_fields: contact.custom_fields,
      },
    }));

    // 3. Enqueue to BullMQ
    const queueSuccess = await enqueueEmailJobs(jobs);

    return NextResponse.json({
      success: true,
      campaignId,
      totalContacts: contacts.length,
      queueEnqueued: queueSuccess,
      message: queueSuccess
        ? `Campaign "${name}" queued with ${contacts.length} emails. BullMQ worker is dispatching at 2 emails/sec.`
        : `Campaign created in demo mode. Make sure Redis is running (docker-compose up -d) to dispatch live BullMQ jobs.`,
      campaign: {
        id: campaignId,
        name,
        subject,
        body_template: bodyTemplate,
        total_contacts: contacts.length,
        sent_count: 0,
        failed_count: 0,
        status: 'in_progress',
        created_at: new Date().toISOString(),
      },
      contacts: insertedContacts,
    });
  } catch (error: any) {
    console.error('[Launch API] Error launching campaign:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error while launching campaign' },
      { status: 500 }
    );
  }
}
