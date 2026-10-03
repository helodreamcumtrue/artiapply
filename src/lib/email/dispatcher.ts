import nodemailer from 'nodemailer';
import { sendEmail as sendGmailOAuthEmail } from '../gmail/service';

export interface SmtpConfig {
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  fromEmail?: string;
  fromName?: string;
}

export interface SendEmailPayload {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  fromName?: string;
  fromEmail?: string;
  smtpConfig?: SmtpConfig;
  googleTokens?: {
    access_token?: string | null;
    refresh_token?: string | null;
    expiry_date?: number | null;
  };
  userId?: string;
}

/**
 * Resolves active SMTP configuration from parameters or environment variables
 */
export function getActiveSmtpConfig(custom?: SmtpConfig): SmtpConfig | null {
  const user = custom?.user || process.env.SMTP_USER || process.env.GMAIL_USER;
  const pass = custom?.pass || process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;
  const host = custom?.host || process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = custom?.port || Number(process.env.SMTP_PORT) || 465;
  const secure = custom?.secure ?? (port === 465);
  const fromEmail = custom?.fromEmail || process.env.SMTP_FROM_EMAIL || user;
  const fromName = custom?.fromName || process.env.SMTP_FROM_NAME || 'ArticlO Outreach';

  if (!user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure,
    user,
    pass,
    fromEmail,
    fromName,
  };
}

/**
 * Checks whether any real sending service (SMTP or Google OAuth) is configured
 */
export function isEmailConfigured(customSmtp?: SmtpConfig): boolean {
  if (getActiveSmtpConfig(customSmtp)) return true;
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) return true;
  return false;
}

/**
 * Verifies SMTP connection credentials
 */
export async function verifySmtpConnection(config: SmtpConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = nodemailer.createTransport({
      host: config.host || 'smtp.gmail.com',
      port: config.port || 465,
      secure: config.secure ?? (config.port === 465),
      auth: {
        user: config.user,
        pass: config.pass,
      },
      connectionTimeout: 8000,
      greetingTimeout: 5000,
    });

    await transporter.verify();
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Failed to authenticate with SMTP server',
    };
  }
}

/**
 * Dispatches an email via the best available transport:
 * 1. Custom / Environment SMTP (Gmail App Password or custom SMTP)
 * 2. Google OAuth Gmail API (if tokens available)
 */
export async function dispatchRealEmail({
  to,
  subject,
  htmlBody,
  textBody,
  fromName,
  fromEmail,
  smtpConfig,
  googleTokens,
  userId = '00000000-0000-0000-0000-000000000001',
}: SendEmailPayload): Promise<{ success: boolean; messageId?: string; error?: string; provider: 'smtp' | 'gmail_oauth' | 'unconfigured' }> {
  // 1. Check SMTP / Gmail App Password
  const smtp = getActiveSmtpConfig(smtpConfig);

  if (smtp && smtp.user && smtp.pass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: {
          user: smtp.user,
          pass: smtp.pass,
        },
      });

      const senderDisplayName = fromName || smtp.fromName || 'ArticlO Outreach';
      const senderAddress = fromEmail || smtp.fromEmail || smtp.user;

      const info = await transporter.sendMail({
        from: `"${senderDisplayName.replace(/"/g, '')}" <${senderAddress}>`,
        to,
        subject,
        html: htmlBody,
        text: textBody || htmlBody.replace(/<[^>]*>/g, ''),
      });

      console.log(`[EmailDispatcher] Real email sent via SMTP to ${to}. Message ID: ${info.messageId}`);
      return {
        success: true,
        messageId: info.messageId,
        provider: 'smtp',
      };
    } catch (err: any) {
      console.error(`[EmailDispatcher] SMTP failed to send to ${to}:`, err.message);
      return {
        success: false,
        error: err.message || 'SMTP delivery failed',
        provider: 'smtp',
      };
    }
  }

  // 2. Check Google OAuth Gmail API
  if (googleTokens?.access_token || googleTokens?.refresh_token) {
    try {
      const gResult = await sendGmailOAuthEmail({
        userId,
        tokens: googleTokens,
        to,
        subject,
        htmlBody,
        fromName,
        fromEmail,
      });

      return {
        success: gResult.success,
        messageId: gResult.messageId,
        error: gResult.error,
        provider: 'gmail_oauth',
      };
    } catch (gErr: any) {
      return {
        success: false,
        error: gErr?.message || 'Gmail OAuth API delivery failed',
        provider: 'gmail_oauth',
      };
    }
  }

  // 3. No real credentials configured!
  return {
    success: false,
    error: 'No email service configured. Please enter your Gmail App Password or SMTP in Settings to send real emails.',
    provider: 'unconfigured',
  };
}
