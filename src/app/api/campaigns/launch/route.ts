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

    // 1. If Supabase is configured, attempt to persist into PostgreSQL
    if (isAdminConfigured()) {
      let resolvedUserId = userId;

      // Extract user email from body or session cookie
      let activeEmail = body.userEmail;
      if (!activeEmail) {
        try {
          const cookieVal = request.cookies.get('artiapply_user')?.value;
          if (cookieVal) {
            activeEmail = JSON.parse(cookieVal).email;
          }
        } catch {}
      }

      try {
        // Find existing user by ID or by email
        let userQuery = supabaseAdmin.from('users').select('id');
        if (activeEmail) {
          userQuery = userQuery.or(`id.eq.${resolvedUserId},email.eq.${activeEmail}`);
        } else {
          userQuery = userQuery.eq('id', resolvedUserId);
        }

        const { data: userRecord } = await userQuery.limit(1).maybeSingle();

        if (userRecord?.id) {
          resolvedUserId = userRecord.id;
        } else {
          // Attempt to insert user profile
          const { data: newUser } = await supabaseAdmin
            .from('users')
            .insert({
              email: activeEmail || 'outreach@articleapply.io',
              name: body.userName || 'Campaign Manager',
            })
            .select('id')
            .maybeSingle();

          if (newUser?.id) {
            resolvedUserId = newUser.id;
          }
        }
      } catch (uErr) {
        console.warn('[Launch API] Notice during user lookup/insert:', uErr);
      }

      try {
        const { data: campaignData, error: campaignError } = await supabaseAdmin
          .from('campaigns')
          .insert({
            user_id: resolvedUserId,
            name,
            subject,
            body_template: bodyTemplate,
            status: 'queued',
            total_contacts: contacts.length,
            sent_count: 0,
            failed_count: 0,
          })
          .select()
          .maybeSingle();

        if (campaignError) {
          console.warn('[Launch API] Supabase campaign insert notice:', campaignError.message);
          // If foreign key constraint failed or table missing, we continue with in-memory ID
          // so the user's campaign launch is NOT blocked!
        } else if (campaignData?.id) {
          campaignId = campaignData.id;

          // Prepare contacts for Supabase batch insert
          const contactsToInsert = contacts.map((c) => ({
            campaign_id: campaignId,
            user_id: resolvedUserId,
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

          if (!contactsError && contactsData) {
            insertedContacts = contactsData as any;
          }
        }
      } catch (dbErr) {
        console.warn('[Launch API] Database insert bypassed for active queue dispatch:', dbErr);
      }
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
