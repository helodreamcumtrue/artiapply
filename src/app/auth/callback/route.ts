import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { supabaseAdmin, isAdminConfigured } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
  const detectedUrl = host ? `${proto}://${host}` : null;
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || detectedUrl || 'http://localhost:3000').replace(/\/+$/, '');
  const redirectUri = `${appUrl}/auth/callback`;

  if (error) {
    console.error('[OAuth Callback] Google auth error:', error);
    return NextResponse.redirect(`${appUrl}?auth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}?auth_error=missing_code`);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    console.log('[OAuth Callback] Successfully authenticated user:', userInfo.email);

    // If Supabase is configured, upsert into public.users
    if (isAdminConfigured() && userInfo.email) {
      const updateData: Record<string, any> = {
        email: userInfo.email,
        name: userInfo.name || null,
        avatar_url: userInfo.picture || null,
        google_access_token: tokens.access_token || null,
        updated_at: new Date().toISOString(),
      };

      if (tokens.refresh_token) {
        updateData.google_refresh_token = tokens.refresh_token;
      }
      if (tokens.expiry_date) {
        updateData.token_expires_at = new Date(tokens.expiry_date).toISOString();
      }

      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', userInfo.email)
        .maybeSingle();

      if (existingUser?.id) {
        await supabaseAdmin
          .from('users')
          .update(updateData)
          .eq('id', existingUser.id);
      } else {
        await supabaseAdmin
          .from('users')
          .insert(updateData);
      }
    }

    const response = NextResponse.redirect(`${appUrl}?auth_success=true&email=${encodeURIComponent(userInfo.email || '')}`);
    
    // Set a lightweight session cookie for client UI awareness
    response.cookies.set('artiapply_user', JSON.stringify({
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      googleConnected: true,
      hasRefreshToken: Boolean(tokens.refresh_token),
    }), {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false, // Accessible to client-side header
    });

    return response;
  } catch (err: any) {
    console.error('[OAuth Callback] Exception while exchanging code:', err);
    return NextResponse.redirect(`${appUrl}?auth_error=${encodeURIComponent(err.message || 'Token exchange failed')}`);
  }
}
