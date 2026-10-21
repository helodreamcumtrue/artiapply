import { isSuppressed } from '../suppression/service';

export interface DispatchComplianceCheckParams {
  to: string;
  fromEmail?: string;
  senderEmail?: string;
  subject?: string;
  htmlBody?: string;
  provider?: 'smtp' | 'gmail_oauth' | 'unconfigured' | string;
  smtpHost?: string;
  purpose?: string;
  isUserInitiated?: boolean;
}

export interface ComplianceValidationResult {
  allowed: boolean;
  code?: 'OK' | 'SUPPRESSED' | 'WARMING_PROHIBITED' | 'INVALID_RECIPIENT' | 'UNAUTHORIZED';
  reason?: string;
}

/**
 * Determines whether an account or transport is a Google / Gmail-connected service.
 * Correctly identifies @gmail.com, @googlemail.com, smtp.gmail.com, and Gmail OAuth connections.
 */
export function isGoogleAccount(
  params?:
    | {
        provider?: string;
        fromEmail?: string;
        senderEmail?: string;
        smtpHost?: string;
      }
    | string
): boolean {
  if (!params) return false;
  if (typeof params === 'string') {
    const email = params.trim().toLowerCase();
    return email.endsWith('@gmail.com') || email.endsWith('@googlemail.com');
  }

  if (params.provider === 'gmail_oauth') {
    return true;
  }

  const email = (params.fromEmail || params.senderEmail || '').trim().toLowerCase();
  if (email.endsWith('@gmail.com') || email.endsWith('@googlemail.com')) {
    return true;
  }

  const host = (params.smtpHost || '').trim().toLowerCase();
  if (
    host === 'smtp.gmail.com' ||
    host === 'smtp.google.com' ||
    host.includes('google.com') ||
    host.includes('gmail.com')
  ) {
    return true;
  }

  return false;
}

/**
 * Strictly verifies that a job or send request is NOT an email warming or engagement manipulation request.
 * Google accounts are strictly prohibited from engaging in any email warming.
 */
export function validateWarmingPolicy(params: {
  purpose?: string;
  provider?: string;
  fromEmail?: string;
  senderEmail?: string;
  smtpHost?: string;
}): { allowed: boolean; error?: string; code?: 'OK' | 'WARMING_PROHIBITED' } {
  const isGoogle = isGoogleAccount(params);
  const purpose = (params.purpose || '').trim().toLowerCase();

  const isWarmingRequest =
    purpose === 'warming' ||
    purpose === 'warmup' ||
    purpose === 'inbox_warming' ||
    purpose.includes('warm');

  if (isWarmingRequest) {
    if (isGoogle) {
      return {
        allowed: false,
        code: 'WARMING_PROHIBITED',
        error:
          'Email warming is strictly prohibited on Google accounts in accordance with Google API User Data Policy and Anti-Spam Guidelines.',
      };
    }

    // Articlo does not offer warming on any provider
    return {
      allowed: false,
      code: 'WARMING_PROHIBITED',
      error: 'Email warming services are not supported on this platform.',
    };
  }

  return { allowed: true, code: 'OK' };
}

/**
 * Validates full compliance before any message can be dispatched via worker or API.
 * 1. Rejects email warming for Google accounts.
 * 2. Rejects any suppressed / unsubscribed recipient.
 * 3. Enforces valid recipient format.
 */
export async function validateDispatchCompliance(
  params: DispatchComplianceCheckParams
): Promise<ComplianceValidationResult> {
  const { to, fromEmail, senderEmail, provider, smtpHost, purpose } = params;

  // 1. Recipient validity
  if (!to || !to.includes('@')) {
    return {
      allowed: false,
      code: 'INVALID_RECIPIENT',
      reason: 'Invalid recipient email address.',
    };
  }

  // 2. Warming Policy Guard (Google compliance check)
  const warmingCheck = validateWarmingPolicy({
    purpose,
    provider,
    fromEmail: fromEmail || senderEmail,
    senderEmail: senderEmail || fromEmail,
    smtpHost,
  });

  if (!warmingCheck.allowed) {
    console.warn(`[PolicyGuard] Blocked warming dispatch attempt to ${to} (Provider: ${provider})`);
    return {
      allowed: false,
      code: 'WARMING_PROHIBITED',
      reason: warmingCheck.error,
    };
  }

  // 3. Server-side Recipient Suppression & Opt-Out Guard
  const suppressed = await isSuppressed(to);
  if (suppressed) {
    console.warn(`[PolicyGuard] Blocked dispatch to unsubscribed recipient: ${to}`);
    return {
      allowed: false,
      code: 'SUPPRESSED',
      reason: `Recipient ${to} has unsubscribed and cannot receive further communications.`,
    };
  }

  return {
    allowed: true,
    code: 'OK',
  };
}
