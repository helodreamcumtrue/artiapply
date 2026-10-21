import crypto from 'crypto';

export interface VerifyTokenResult {
  valid: boolean;
  code:
    | 'OK'
    | 'OK_OLDER_LINK'
    | 'MISSING_SECRET'
    | 'INVALID_EMAIL'
    | 'MALFORMED_TOKEN'
    | 'EXPIRED_TOKEN'
    | 'INVALID_SIGNATURE';
  reason?: string;
  email?: string;
  id?: string;
  isOlderLink?: boolean;
}

/**
 * Retrieves the dedicated server-side secret used for HMAC-SHA256 signing.
 * NEVER expose this secret to client-side code (do NOT prefix with NEXT_PUBLIC_).
 * Fails closed if the secret is missing or empty.
 */
export function getUnsubscribeSigningSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SIGNING_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new Error('UNSUBSCRIBE_SIGNING_SECRET is not configured. Failing closed for security.');
  }
  return secret.trim();
}

/**
 * Checks if signing secret is configured without throwing.
 */
export function isUnsubscribeSecretConfigured(): boolean {
  const secret = process.env.UNSUBSCRIBE_SIGNING_SECRET;
  return Boolean(secret && secret.trim().length > 0);
}

/**
 * Generates a cryptographically signed, tamper-resistant unsubscribe token.
 * Uses HMAC-SHA256 bound to the normalized email, contact/campaign identifier, and expiration timestamp.
 */
export function generateUnsubscribeToken(
  email: string,
  id: string = '',
  options?: { ttlMs?: number; expiresAt?: number }
): string {
  const secret = getUnsubscribeSigningSecret();
  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error('Email is required to generate an unsubscribe token.');
  }

  const normalizedId = (id || '').trim().toLowerCase();
  // Default TTL: 365 days (1 year)
  const defaultTtl = 365 * 24 * 60 * 60 * 1000;
  const expiresAt = options?.expiresAt ?? (Date.now() + (options?.ttlMs ?? defaultTtl));

  const dataToSign = `${normalizedEmail}:${normalizedId}:${expiresAt}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(dataToSign)
    .digest('hex');

  return `${expiresAt}.${signature}`;
}

/**
 * Validates an unsubscribe token using timing-safe comparison.
 * Authenticates HMAC signature FIRST to ensure link authenticity.
 * If signature is valid but link was sent > TTL ago, permits safe opt-out for this exact recipient
 * without permitting unsigned or tampered arbitrary-recipient suppression.
 */
export function verifyUnsubscribeToken(
  email: string,
  id: string = '',
  token: string,
  options?: { rejectExpired?: boolean }
): VerifyTokenResult {
  let secret: string;
  try {
    secret = getUnsubscribeSigningSecret();
  } catch {
    return {
      valid: false,
      code: 'MISSING_SECRET',
      reason: 'Server signing secret is not configured. Request rejected.',
    };
  }

  const normalizedEmail = (email || '').trim().toLowerCase();
  if (!normalizedEmail) {
    return {
      valid: false,
      code: 'INVALID_EMAIL',
      reason: 'A valid email address is required.',
    };
  }

  if (!token || typeof token !== 'string') {
    return {
      valid: false,
      code: 'MALFORMED_TOKEN',
      reason: 'Unsubscribe token is missing or malformed.',
    };
  }

  const trimmedToken = token.trim();
  const parts = trimmedToken.split('.');
  if (parts.length !== 2) {
    return {
      valid: false,
      code: 'MALFORMED_TOKEN',
      reason: 'Unsubscribe token structure is invalid.',
    };
  }

  const [expiresAtStr, providedSignature] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || expiresAt < 0) {
    return {
      valid: false,
      code: 'MALFORMED_TOKEN',
      reason: 'Token expiration timestamp is invalid.',
    };
  }

  // Provided signature must be a 64-character hex string
  if (!/^[0-9a-f]{64}$/i.test(providedSignature)) {
    return {
      valid: false,
      code: 'MALFORMED_TOKEN',
      reason: 'Token signature format is invalid.',
    };
  }

  // 1. Verify HMAC Signature FIRST (Guarantees token was genuinely issued for this exact email & ID)
  const normalizedId = (id || '').trim().toLowerCase();
  const dataToSign = `${normalizedEmail}:${normalizedId}:${expiresAt}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(dataToSign)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  const providedBuffer = Buffer.from(providedSignature, 'hex');

  if (expectedBuffer.length !== providedBuffer.length) {
    return {
      valid: false,
      code: 'INVALID_SIGNATURE',
      reason: 'Token signature length mismatch.',
    };
  }

  const isMatch = crypto.timingSafeEqual(expectedBuffer, providedBuffer);
  if (!isMatch) {
    return {
      valid: false,
      code: 'INVALID_SIGNATURE',
      reason: 'Token signature is invalid or has been tampered with.',
    };
  }

  // 2. Signature is authentically verified! Now check timestamp
  const isOlderLink = expiresAt > 0 && Date.now() > expiresAt;
  if (isOlderLink && options?.rejectExpired) {
    return {
      valid: false,
      code: 'EXPIRED_TOKEN',
      reason: 'Unsubscribe link has expired.',
      email: normalizedEmail,
      id: normalizedId,
      isOlderLink: true,
    };
  }

  return {
    valid: true,
    code: isOlderLink ? 'OK_OLDER_LINK' : 'OK',
    reason: isOlderLink ? 'Authentic older email link verified' : undefined,
    email: normalizedEmail,
    id: normalizedId,
    isOlderLink,
  };
}

/**
 * Builds both the web unsubscribe URL (for humans) and one-click URL (for MUAs / RFC 8058).
 */
export function generateUnsubscribeUrls(
  email: string,
  id: string = '',
  options?: { baseUrl?: string; ttlMs?: number; expiresAt?: number }
): { webUrl: string; oneClickUrl: string; token: string } {
  const token = generateUnsubscribeToken(email, id, options);
  const normalizedEmail = (email || '').trim().toLowerCase();
  const cleanId = (id || '').trim();
  const base = (options?.baseUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/+$/, '');

  const params = new URLSearchParams({
    email: normalizedEmail,
    id: cleanId,
    token,
  });

  return {
    webUrl: `${base}/unsubscribe?${params.toString()}`,
    oneClickUrl: `${base}/api/contacts/unsubscribe?${params.toString()}`,
    token,
  };
}
