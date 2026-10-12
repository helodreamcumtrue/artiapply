import { google } from 'googleapis';
import { supabaseAdmin } from '../supabase/admin';
import { EmailAttachment } from '@/types/database';

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
  textBody?: string;
  unsubscribeUrl?: string;
  fromName?: string;
  fromEmail?: string;
  attachments?: EmailAttachment[];
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
  textBody,
  unsubscribeUrl,
  fromName,
  fromEmail,
  attachments,
}: {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  unsubscribeUrl?: string;
  fromName?: string;
  fromEmail?: string;
  attachments?: EmailAttachment[];
}): string {
  const senderHeader = fromName && fromEmail
    ? `"${fromName.replace(/"/g, '')}" <${fromEmail}>`
    : fromEmail || 'me';

  // Guaranteed clean subject header
  const cleanSubject = subject.replace(/<[^>]*>/g, '').replace(/[\r\n]+/g, ' ').trim();
  const utf8Subject = `=?utf-8?B?${Buffer.from(cleanSubject).toString('base64')}?=`;

  const commonHeaders = [
    `From: ${senderHeader}`,
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'X-Mailer: ArticlO Verified Engine',
  ];

  if (unsubscribeUrl) {
    commonHeaders.push(`List-Unsubscribe: <${unsubscribeUrl}>`);
    commonHeaders.push('List-Unsubscribe-Post: List-Unsubscribe=One-Click');
  }

  if (!attachments || attachments.length === 0) {
    const messageParts = [
      ...commonHeaders,
      'Content-Type: text/html; charset=utf-8',
      'Content-Transfer-Encoding: base64',
      '',
      Buffer.from(htmlBody).toString('base64'),
    ];

    return base64UrlEncode(messageParts.join('\r\n'));
  }

  // Multipart/mixed message for attachments
  const boundary = `====boundary_${Date.now()}_${Math.random().toString(36).substring(2, 9)}====`;
  const headerParts = [
    ...commonHeaders,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
  ];

  const bodyPart = [
    `--${boundary}`,
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    Buffer.from(htmlBody).toString('base64'),
    '',
  ];

  const attachmentParts: string[] = [];
  for (const att of attachments) {
    const cleanBase64 = att.data.replace(/^data:.*?;base64,/, '');
    attachmentParts.push(
      `--${boundary}`,
      `Content-Type: ${att.contentType || 'application/octet-stream'}; name="${att.filename}"`,
      'Content-Transfer-Encoding: base64',
      `Content-Disposition: attachment; filename="${att.filename}"`,
      '',
      cleanBase64,
      ''
    );
  }

  const finalMessage = [
    ...headerParts,
    ...bodyPart,
    ...attachmentParts,
    `--${boundary}--`,
  ].join('\r\n');

  return base64UrlEncode(finalMessage);
}

/**
 * Replaces placeholders like {{first_name}}, {{company}}, etc. with contact attributes.
 * Defaults to NEVER appending an unsubscribe footer (subject and raw templates remain clean).
 */
export function replaceVariables(
  template: string,
  contact: {
    id?: string;
    first_name?: string | null;
    last_name?: string | null;
    company?: string | null;
    role?: string | null;
    email: string;
    custom_fields?: Record<string, any>;
  },
  appendUnsubscribeFooter: boolean = false
): string {
  let result = template;

  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(contact.email)}&id=${contact.id || ''}`;

  const replacements: Record<string, string> = {
    first_name: contact.first_name || '',
    firstName: contact.first_name || '',
    last_name: contact.last_name || '',
    lastName: contact.last_name || '',
    name: [contact.first_name, contact.last_name].filter(Boolean).join(' ') || 'there',
    company: contact.company || 'your company',
    role: contact.role || 'Professional',
    email: contact.email || '',
    unsubscribe_url: unsubscribeUrl,
    unsubscribe: unsubscribeUrl,
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

  // Only append if explicitly requested (never for subjects)
  if (appendUnsubscribeFooter && !result.toLowerCase().includes('unsubscribe')) {
    result += `\n\n<div style="font-size:11px;color:#94a3b8;margin-top:28px;border-top:1px solid #e2e8f0;padding-top:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">To opt out of future emails, <a href="${unsubscribeUrl}" style="color:#64748b;text-decoration:underline;">unsubscribe here</a>.</div>`;
  }

  return result;
}

/**
 * Generates an RFC 2822 compliant, pure plain-text email subject.
 * Guaranteed to NEVER contain HTML tags, newlines, or unsubscribe footers.
 */
export function formatEmailSubject(
  subjectTemplate: string,
  contact: {
    id?: string;
    first_name?: string | null;
    last_name?: string | null;
    company?: string | null;
    role?: string | null;
    email: string;
    custom_fields?: Record<string, any>;
  }
): string {
  const personalized = replaceVariables(subjectTemplate, contact, false);
  // Strip any HTML tags and collapse whitespace/newlines into a single line
  return personalized
    .replace(/<[^>]*>/g, '')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Converts newline-separated text into clean HTML paragraphs with standard Gmail styling.
 */
export function convertTextToEmailHtml(text: string): string {
  // If text already has block HTML elements, return as is
  if (/<(p|div|table|h[1-6]|ul|ol|br)\b/i.test(text)) {
    return text;
  }

  const paragraphs = text
    .split(/\r?\n\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return `<p style="margin:0 0 16px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#1e293b;">${text.replace(/\r?\n/g, '<br/>')}</p>`;
  }

  return paragraphs
    .map((p) => {
      const withLineBreaks = p.replace(/\r?\n/g, '<br/>');
      return `<p style="margin:0 0 16px 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#1e293b;">${withLineBreaks}</p>`;
    })
    .join('\n');
}

/**
 * Formats email body into both responsive HTML and clean text with subtle opt-out footer.
 */
export function formatEmailBody({
  bodyTemplate,
  contact,
  includeUnsubscribe = true,
  appUrl,
}: {
  bodyTemplate: string;
  contact: {
    id?: string;
    first_name?: string | null;
    last_name?: string | null;
    company?: string | null;
    role?: string | null;
    email: string;
    custom_fields?: Record<string, any>;
  };
  includeUnsubscribe?: boolean;
  appUrl?: string;
}): { html: string; text: string; unsubscribeUrl: string } {
  const baseUrl = (appUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
  const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(contact.email)}&id=${contact.id || ''}`;

  // 1. Personalize text (without footer appended)
  const personalized = replaceVariables(bodyTemplate, contact, false);

  // 2. Build clean plain text version
  let text = personalized;
  if (includeUnsubscribe && !personalized.toLowerCase().includes('unsubscribe')) {
    text += `\n\n---\nTo opt out of future emails: ${unsubscribeUrl}`;
  }

  // 3. Build responsive HTML paragraphs
  const paragraphsHtml = convertTextToEmailHtml(personalized);

  const footerHtml = includeUnsubscribe && !personalized.toLowerCase().includes('unsubscribe')
    ? `<div style="margin-top:32px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:11px;line-height:1.5;color:#94a3b8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">To opt out of future emails, <a href="${unsubscribeUrl}" style="color:#64748b;text-decoration:underline;">unsubscribe here</a>.</div>`
    : '';

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#1e293b;background-color:#ffffff;">
  <div style="max-width:600px;padding:8px 0;">
    ${paragraphsHtml}
    ${footerHtml}
  </div>
</body>
</html>`;

  return { html, text, unsubscribeUrl };
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
  textBody,
  unsubscribeUrl,
  fromName,
  fromEmail,
  attachments,
}: SendEmailParams): Promise<{ messageId?: string; success: boolean; error?: string }> {
  try {
    const auth = getOAuth2Client(tokens, userId);
    const gmail = google.gmail({ version: 'v1', auth });

    const raw = createMimeMessage({
      to,
      subject,
      htmlBody,
      textBody,
      unsubscribeUrl,
      fromName,
      fromEmail,
      attachments,
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
