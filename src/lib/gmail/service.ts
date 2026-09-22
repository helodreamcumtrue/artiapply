import { google } from 'googleapis';
import { supabaseAdmin } from '../supabase/admin';

export interface GoogleTokens {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
}

export interface SendEmailParams {
  userId: string;
  tokens: GoogleTokens;
  to: string;
  subject: string;
  htmlBody: string;
  fromName?: string;
  fromEmail?: string;
}

/**
 * Creates and configures a Google OAuth2 client for the specified tokens
 */
export function getOAuth2Client(tokens: GoogleTokens, userId?: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`;

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );

  oauth2Client.setCredentials({
    access_token: tokens.access_token || undefined,
    refresh_token: tokens.refresh_token || undefined,
    expiry_date: tokens.expiry_date || undefined,
  });

  // Listen to refresh events and update tokens in Supabase
  if (userId) {
    oauth2Client.on('tokens', async (newTokens) => {
      try {
        const updateData: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };

        if (newTokens.access_token) {
          updateData.google_access_token = newTokens.access_token;
        }
        if (newTokens.refresh_token) {
          updateData.google_refresh_token = newTokens.refresh_token;
        }
        if (newTokens.expiry_date) {
          updateData.token_expires_at = new Date(newTokens.expiry_date).toISOString();
        }

        await supabaseAdmin
          .from('users')
          .update(updateData)
          .eq('id', userId);

        console.log(`[GmailService] Tokens refreshed and saved for user ${userId}`);
      } catch (err) {
        console.error('[GmailService] Error saving refreshed tokens:', err);
      }
    });
  }

  return oauth2Client;
}

/**
 * Encodes string to URL-safe Base64 as required by the Gmail API
 */
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Generates an RFC 2822 compliant MIME email string
 */
export function createMimeMessage({
  to,
  subject,
  htmlBody,
  fromName,
  fromEmail,
}: {
  to: string;
  subject: string;
  htmlBody: string;
  fromName?: string;
  fromEmail?: string;
}): string {
  const senderHeader = fromName && fromEmail
    ? `"${fromName.replace(/"/g, '')}" <${fromEmail}>`
    : fromEmail || 'me';

  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;

  const messageParts = [
    `From: ${senderHeader}`,
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(htmlBody).toString('base64'),
  ];

  return base64UrlEncode(messageParts.join('\r\n'));
}

/**
 * Replaces placeholders like {{first_name}}, {{company}}, etc. with contact attributes
 */
export function replaceVariables(
  template: string,
  contact: {
    first_name?: string | null;
    last_name?: string | null;
    company?: string | null;
    role?: string | null;
    email: string;
    custom_fields?: Record<string, any>;
  }
): string {
  let result = template;

  const replacements: Record<string, string> = {
    first_name: contact.first_name || '',
    firstName: contact.first_name || '',
    last_name: contact.last_name || '',
    lastName: contact.last_name || '',
    name: [contact.first_name, contact.last_name].filter(Boolean).join(' ') || 'there',
    company: contact.company || 'your company',
    role: contact.role || 'Professional',
    email: contact.email || '',
  };

  // Add custom fields
  if (contact.custom_fields && typeof contact.custom_fields === 'object') {
    Object.entries(contact.custom_fields).forEach(([k, v]) => {
      replacements[k] = String(v ?? '');
    });
  }

  // Replace {{var}} and {var}
  for (const [key, value] of Object.entries(replacements)) {
    const doubleRegex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
    const singleRegex = new RegExp(`{\\s*${key}\\s*}`, 'gi');
    result = result.replace(doubleRegex, value).replace(singleRegex, value);
  }

  return result;
}

/**
 * Sends an email using the Gmail API
 */
export async function sendEmail({
  userId,
  tokens,
  to,
  subject,
  htmlBody,
  fromName,
  fromEmail,
}: SendEmailParams): Promise<{ messageId?: string; success: boolean; error?: string }> {
  try {
    const auth = getOAuth2Client(tokens, userId);
    const gmail = google.gmail({ version: 'v1', auth });

    const raw = createMimeMessage({
      to,
      subject,
      htmlBody,
      fromName,
      fromEmail,
    });

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw,
      },
    });

    return {
      messageId: res.data.id || undefined,
      success: true,
    };
  } catch (error: any) {
    console.error(`[GmailService] Failed to send email to ${to}:`, error?.message || error);
    return {
      success: false,
      error: error?.message || 'Failed to send email via Gmail API',
    };
  }
}
