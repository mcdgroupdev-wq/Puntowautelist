import { handleApiRequest } from '../../server/apiRouter.ts';

const MAX_BODY_BYTES = 16 * 1024;

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  let parsedBody: Record<string, unknown> = {};

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const rawText = await req.text();
    if (Buffer.byteLength(rawText, 'utf8') > MAX_BODY_BYTES) {
      return new Response(
        JSON.stringify({ ok: false, message: 'La solicitud supera el tamaño máximo permitido.' }),
        {
          status: 413,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        },
      );
    }

    if (rawText.trim().length > 0) {
      try {
        const parsed = JSON.parse(rawText);
        parsedBody = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {};
      } catch {
        return new Response(
          JSON.stringify({ ok: false, message: 'Formato JSON no válido.' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Cache-Control': 'no-store',
            },
          },
        );
      }
    }
  }

  const clientIp =
    req.headers.get('x-nf-client-connection-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown';

  const result = await handleApiRequest({
    method: req.method,
    pathname: url.pathname,
    origin: url.origin,
    searchParams: url.searchParams,
    authorizationHeader: req.headers.get('authorization'),
    body: parsedBody,
    clientIp,
  });

  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      ...(result.headers ?? {}),
    },
  });
}

export const config = {
  path: '/api/*',
};
