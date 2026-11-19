export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((input.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export async function signUnsubscribeToken(email: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const payload = toBase64Url(encoder.encode(email));
  const key = await importHmacKey(secret);
  const sigBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  const sig = toBase64Url(new Uint8Array(sigBuffer));
  return `${payload}.${sig}`;
}

export async function verifyUnsubscribeToken(token: string, secret: string): Promise<string | null> {
  const parts = token.split('.');
  if (parts.length !== 2) {
    return null;
  }
  const [payload, sig] = parts;
  if (!payload || !sig) {
    return null;
  }
  try {
    const encoder = new TextEncoder();
    const key = await importHmacKey(secret);
    const sigBytes = fromBase64Url(sig);
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(payload));
    if (!valid) {
      return null;
    }
    const email = new TextDecoder().decode(fromBase64Url(payload)).trim().toLowerCase();
    return email || null;
  } catch {
    return null;
  }
}
