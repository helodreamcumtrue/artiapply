import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isAdminConfigured } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, id } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    console.log(`[Unsubscribe API] Opt-out request received for: ${email}`);

    if (isAdminConfigured()) {
      // Mark contact by ID or email
      if (id) {
        await supabaseAdmin
          .from('contacts')
          .update({
            status: 'failed',
            error_message: 'Recipient unsubscribed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
      }

      // Also mark all pending contacts with this email across campaigns
      await supabaseAdmin
        .from('contacts')
        .update({
          status: 'failed',
          error_message: 'Recipient unsubscribed',
          updated_at: new Date().toISOString(),
        })
        .eq('email', email.trim().toLowerCase())
        .in('status', ['pending', 'queued']);
    }

    return NextResponse.json({
      success: true,
      message: `Successfully unsubscribed ${email} from future campaigns.`,
    });
  } catch (error: any) {
    console.error('[Unsubscribe API] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process unsubscribe' },
      { status: 500 }
    );
  }
}
