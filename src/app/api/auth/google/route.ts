import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  // Auto-detect base URL from request headers if available, or fall back to env/localhost
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  const proto = request.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
  const detectedUrl = host ? `${proto}://${host}` : null;
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || detectedUrl || 'http://localhost:3000').replace(/\/+$/, '');
  const redirectUri = `${baseUrl}/auth/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.' },
      { status: 500 }
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  // Crucial: access_type: 'offline' and prompt: 'consent' guarantees a refresh_token is returned
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'openid',
      'email',
      'profile',
      'https://www.googleapis.com/auth/gmail.send',
    ],
  });

  return NextResponse.redirect(authUrl);
}
