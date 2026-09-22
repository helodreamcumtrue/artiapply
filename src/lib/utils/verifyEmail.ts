/**
 * Lead Email Verification Engine
 * Validates email syntax, detects disposable domains, and catches common typos
 * to protect domain deliverability before sending.
 */

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  '10minutemail.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'trashmail.com',
  'yopmail.com',
  'sharklasers.com',
  'fakeinbox.com',
  'dispostable.com',
  'getairmail.com',
  'throwawaymail.com',
]);

const DOMAIN_TYPOS: Record<string, string> = {
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmaill.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
};

const RFC5322_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export interface EmailVerificationResult {
  email: string;
  isValid: boolean;
  isDisposable: boolean;
  hasTypo: boolean;
  suggestedCorrection?: string;
  reason?: string;
}

export function verifyEmail(emailRaw: string): EmailVerificationResult {
  const email = (emailRaw || '').trim().toLowerCase();

  if (!email || !RFC5322_REGEX.test(email)) {
    return {
      email,
      isValid: false,
      isDisposable: false,
      hasTypo: false,
      reason: 'Invalid email syntax format',
    };
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return {
      email,
      isValid: false,
      isDisposable: false,
      hasTypo: false,
      reason: 'Malformed address',
    };
  }

  const domain = parts[1];

  // Check disposable
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      email,
      isValid: false,
      isDisposable: true,
      hasTypo: false,
      reason: 'Disposable or temporary burner domain',
    };
  }

  // Check typo
  if (DOMAIN_TYPOS[domain]) {
    const correction = `${parts[0]}@${DOMAIN_TYPOS[domain]}`;
    return {
      email,
      isValid: true,
      isDisposable: false,
      hasTypo: true,
      suggestedCorrection: correction,
      reason: `Possible domain typo: did you mean ${DOMAIN_TYPOS[domain]}?`,
    };
  }

  return {
    email,
    isValid: true,
    isDisposable: false,
    hasTypo: false,
  };
}

export function verifyLeadList(contacts: any[]): {
  verified: any[];
  risky: any[];
  invalid: any[];
} {
  const verified: any[] = [];
  const risky: any[] = [];
  const invalid: any[] = [];

  for (const c of contacts) {
    const res = verifyEmail(c.email);
    if (!res.isValid) {
      invalid.push({ ...c, verification: res });
    } else if (res.hasTypo) {
      risky.push({ ...c, verification: res });
    } else {
      verified.push({ ...c, verification: res });
    }
  }

  return { verified, risky, invalid };
}
