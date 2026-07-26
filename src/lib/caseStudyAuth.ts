// Signed, expiring tokens used to gate password-protected case studies.
// Runs on the Edge runtime (middleware + auth route), so it relies on the
// Web Crypto API rather than Node's `crypto` module.

export const CASE_STUDY_AUTH_COOKIE = 'case_study_auth';

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function getSigningKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

export async function createCaseStudyAuthToken(secret: string, ttlMs: number): Promise<string> {
  const expiresAt = Date.now() + ttlMs;
  const key = await getSigningKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(String(expiresAt)));
  return `${expiresAt}.${toHex(signature)}`;
}

export async function verifyCaseStudyAuthToken(
  token: string | undefined | null,
  secret: string
): Promise<boolean> {
  if (!token) return false;

  const [expiresAtStr, signatureHex] = token.split('.');
  if (!expiresAtStr || !signatureHex) return false;

  const expiresAt = Number(expiresAtStr);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const key = await getSigningKey(secret);
  const expectedSignature = await crypto.subtle.sign('HMAC', key, encoder.encode(expiresAtStr));

  return timingSafeEqual(toHex(expectedSignature), signatureHex);
}
