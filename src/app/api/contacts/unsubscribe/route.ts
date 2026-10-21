import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isAdminConfigured } from '@/lib/supabase/admin';
import { recordUnsubscribe } from '@/lib/suppression/service';
import { verifyUnsubscribeToken } from '@/lib/suppression/unsubscribeToken';

export const dynamic = 'force-dynamic';

/**
 * Handles GET requests to the unsubscribe endpoint (e.g. if a recipient opens the one-click URL directly in a browser).
 * Safely redirects the recipient to the human-friendly confirmation page with their signed parameters intact.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email') || '';
  const id = searchParams.get('id') || '';
  const token = searchParams.get('token') || '';

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const targetUrl = new URL(`${baseUrl}/unsubscribe`);
  if (email) targetUrl.searchParams.set('email', email);
  if (id) targetUrl.searchParams.set('id', id);
  if (token) targetUrl.searchParams.set('token', token);

  return NextResponse.redirect(targetUrl.toString());
}

/**
 * Handles POST requests to the unsubscribe endpoint:
 * 1. Web page form confirmation (/unsubscribe) with JSON body { email, id, token }
 * 2. RFC 8058 One-Click POST requests from MUAs (Gmail/Yahoo/Apple) with query params & List-Unsubscribe=One-Click
 */
export async function POST(request: NextRequest) {
  try {
    let email = '';
    let id = '';
    let token = '';

    // 1. Extract from URL query parameters (RFC 8058 standard)
    const searchParams = request.nextUrl.searchParams;
    email = searchParams.get('email') || '';
    id = searchParams.get('id') || '';
    token = searchParams.get('token') || '';

    // 2. If JSON body is present, extract or override parameters
    const contentType = request.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try {
        const body = await request.json();
        if (body.email) email = body.email;
        if (body.id) id = body.id;
        if (body.token) token = body.token;
      } catch {
        // Fall back to query params
      }
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required to process opt-out.' },
        { status: 400 }
      );
    }

    // 3. Cryptographic Token Verification (Fail Closed)
    if (!token) {
      return NextResponse.json(
        { error: 'Cryptographic unsubscribe token is required. Unsigned requests cannot unsubscribe arbitrary recipients.' },
        { status: 400 }
      );
    }

    // Never log the raw token or secret for security
    const verification = verifyUnsubscribeToken(email, id, token);

    if (!verification.valid) {
      console.warn(`[Unsubscribe API] Opt-out rejected for ${email}: ${verification.reason} (${verification.code})`);
      const status = verification.code === 'MISSING_SECRET' ? 500 : 403;
      return NextResponse.json(
        {
          error: verification.reason || 'Invalid or expired unsubscribe token.',
          code: verification.code,
        },
        { status }
      );
    }

    const verifiedEmail = verification.email!;
    const verifiedId = verification.id || id;
    const source = verification.isOlderLink ? 'user_opt_out_older_link' : 'user_opt_out';

    console.log(`[Unsubscribe API] Validated signed opt-out for recipient: ${verifiedEmail} (source: ${source})`);

    // 4. Permanently record in server-side suppression registry (Memory, Redis, file, DB)
    await recordUnsubscribe(verifiedEmail, {
      contactId: verifiedId,
      source,
      ip: request.headers.get('x-forwarded-for') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
    });

    // 5. Update Supabase records across all campaigns
    if (isAdminConfigured()) {
      try {
        if (verifiedId) {
          await supabaseAdmin
            .from('contacts')
            .update({
              status: 'failed',
              error_message: 'Recipient unsubscribed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', verifiedId);
        }

        // Also mark any pending/queued contacts with this email across campaigns
        await supabaseAdmin
          .from('contacts')
          .update({
            status: 'failed',
            error_message: 'Recipient unsubscribed',
            updated_at: new Date().toISOString(),
          })
          .eq('email', verifiedEmail)
          .in('status', ['pending', 'queued']);
      } catch (dbErr) {
        console.warn('[Unsubscribe API] Database update notice:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      email: verifiedEmail,
      message: `Successfully unsubscribed ${verifiedEmail} from future campaigns.`,
    });
  } catch (error: any) {
    console.error('[Unsubscribe API] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process unsubscribe' },
      { status: 500 }
    );
  }
}
