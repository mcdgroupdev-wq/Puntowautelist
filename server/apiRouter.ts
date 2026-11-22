import crypto from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SHEET_TABS = {
  waitlist: 'Lista de espera',
  socials: 'Redes sociales',
  summary: 'Resumen',
} as const;

const OFFICIAL_SOCIAL_ACCOUNTS = [
  {
    platform: 'tiktok',
    name: 'TikTok',
    handle: '@punto_app',
    url: 'https://www.tiktok.com/@punto_app',
    status: 'Activa',
  },
  {
    platform: 'instagram',
    name: 'Instagram',
    handle: '@punto.connect',
    url: 'https://www.instagram.com/punto.connect?dlrf=MXFsdXc3ZnQ4dDloaA==',
    status: 'Activa',
  },
  {
    platform: 'youtube',
    name: 'YouTube',
    handle: '@punto.connect',
    url: 'https://youtube.com/@punto.connect?si=ISIRB4yp44nH7zW6',
    status: 'Activa',
  },
] as const;

type SocialPlatform = (typeof OFFICIAL_SOCIAL_ACCOUNTS)[number]['platform'];

const sessionSocialClicks = new Map<SocialPlatform, { clicks: number; lastClickedAt: string | null }>([
  ['tiktok', { clicks: 0, lastClickedAt: null }],
  ['instagram', { clicks: 0, lastClickedAt: null }],
  ['youtube', { clicks: 0, lastClickedAt: null }],
]);

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string, limit = 15, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= limit) {
    return true;
  }
  entry.count += 1;
  return false;
}

function getSupabaseAdmin(): SupabaseClient | null {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) {
    return null;
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function fetchWaitlistCount(
  supabase: SupabaseClient,
): Promise<{ ready: boolean; count: number | null }> {
  const rpcResult = await supabase.rpc('get_waitlist_count');
  if (!rpcResult.error && rpcResult.data !== null && rpcResult.data !== undefined) {
    return {
      ready: true,
      count: typeof rpcResult.data === 'number' ? rpcResult.data : Number(rpcResult.data),
    };
  }

  // Usamos GET con limit(0) en lugar de HEAD para detectar con precisión PGRST205 / 42P01 sin leer filas
  const countResult = await supabase
    .from('waitlist')
    .select('id', { count: 'exact' })
    .limit(0);

  if (countResult.error) {
    if (countResult.error.code === 'PGRST205' || countResult.error.code === '42P01') {
      return { ready: false, count: null };
    }
    throw countResult.error;
  }

  return { ready: true, count: countResult.count ?? 0 };
}

function signUnsubscribeToken(email: string, secret: string): string {
  const payload = Buffer.from(email, 'utf8').toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function verifyUnsubscribeToken(token: string, secret: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 2) {
    return null;
  }
  const [payload, sig] = parts;
  if (!payload || !sig) {
    return null;
  }

  const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  const sigBuf = Buffer.from(sig, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');

  if (sigBuf.length !== expectedBuf.length) {
    return null;
  }
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const email = Buffer.from(payload, 'base64url').toString('utf8').trim().toLowerCase();
    return EMAIL_REGEX.test(email) ? email : null;
  } catch {
    return null;
  }
}

function safeCompareSecret(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

function formatDateParts(isoString: string | null): { date: string; time: string; full: string } {
  if (!isoString) {
    return { date: '—', time: '—', full: '—' };
  }
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) {
    return { date: '—', time: '—', full: '—' };
  }

  const date = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed);

  const time = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(parsed);

  return { date, time, full: `${date} ${time}` };
}

function getAllowedAdminEmails(): string[] {
  const configured = (
    process.env.ADMIN_ALLOWED_EMAILS ||
    process.env.ADMIN_GOOGLE_EMAIL ||
    'mcdgroup.dev@gmail.com'
  )
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return configured.length > 0 ? configured : ['mcdgroup.dev@gmail.com'];
}

async function verifyGoogleAdminToken(
  authorizationHeader: string | null,
): Promise<
  | { ok: true; accessToken: string; email: string; name: string }
  | { ok: false; status: number; message: string }
> {
  const authHeader = authorizationHeader ?? '';
  const accessToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!accessToken) {
    return {
      ok: false,
      status: 401,
      message: 'Debes iniciar sesión con Google para acceder a Google Sheets.',
    };
  }

  try {
    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userInfoRes.ok) {
      return {
        ok: false,
        status: 401,
        message: 'Tu sesión de Google ha caducado. Inicia sesión de nuevo.',
      };
    }

    const userInfo = (await userInfoRes.json()) as {
      email?: string;
      email_verified?: boolean;
      name?: string;
    };

    const email = userInfo.email?.trim().toLowerCase() ?? '';
    if (!email || !userInfo.email_verified) {
      return {
        ok: false,
        status: 403,
        message: 'La cuenta de Google no tiene un correo verificado.',
      };
    }

    const allowedEmails = getAllowedAdminEmails();
    if (!allowedEmails.includes(email)) {
      return {
        ok: false,
        status: 403,
        message: `La cuenta ${email} no tiene permisos de administración para exportar los correos de Punto.`,
      };
    }

    return {
      ok: true,
      accessToken,
      email,
      name: userInfo.name?.trim() || email,
    };
  } catch {
    return {
      ok: false,
      status: 502,
      message: 'No pudimos verificar tu sesión con Google en este momento.',
    };
  }
}

interface WaitlistDbRow {
  id: string;
  email: string;
  created_at: string;
  marketing_consent: boolean;
  consent_at: string | null;
  notified_at: string | null;
}

async function loadOrganizedSupabaseData(supabase: SupabaseClient) {
  const { data: waitlistRows, error: waitlistError } = await supabase
    .from('waitlist')
    .select('id, email, created_at, marketing_consent, consent_at, notified_at')
    .order('created_at', { ascending: true });

  if (waitlistError) {
    throw waitlistError;
  }

  const typedWaitlist = (waitlistRows ?? []) as WaitlistDbRow[];

  let socialTableReady = true;
  const socialMap = new Map<SocialPlatform, { clicks: number; lastClickedAt: string | null }>();

  const { data: socialRows, error: socialError } = await supabase
    .from('social_clicks')
    .select('platform, clicks, last_clicked_at');

  if (socialError) {
    if (socialError.code === 'PGRST205' || socialError.code === '42P01') {
      socialTableReady = false;
      for (const account of OFFICIAL_SOCIAL_ACCOUNTS) {
        const mem = sessionSocialClicks.get(account.platform) ?? { clicks: 0, lastClickedAt: null };
        socialMap.set(account.platform, mem);
      }
    } else {
      throw socialError;
    }
  } else {
    for (const row of socialRows ?? []) {
      const platform = row.platform as SocialPlatform;
      socialMap.set(platform, {
        clicks: typeof row.clicks === 'number' ? row.clicks : Number(row.clicks ?? 0),
        lastClickedAt: row.last_clicked_at ?? null,
      });
    }
  }

  const waitlistFormatted = typedWaitlist.map((row, index) => {
    const createdParts = formatDateParts(row.created_at);
    const consentParts = formatDateParts(row.consent_at);
    const notifiedParts = formatDateParts(row.notified_at);

    return {
      index: index + 1,
      id: row.id,
      email: row.email,
      createdAt: row.created_at,
      registeredDate: createdParts.date,
      registeredTime: createdParts.time,
      marketingConsent: row.marketing_consent,
      consentLabel: row.marketing_consent ? 'Sí' : 'No',
      consentDateTime: consentParts.full,
      notifiedStatus: row.notified_at ? `Enviado (${notifiedParts.full})` : 'Pendiente',
    };
  });

  const socialsFormatted = OFFICIAL_SOCIAL_ACCOUNTS.map((account) => {
    const stats = socialMap.get(account.platform) ?? { clicks: 0, lastClickedAt: null };
    const lastClickParts = formatDateParts(stats.lastClickedAt);
    return {
      platform: account.platform,
      name: account.name,
      handle: account.handle,
      url: account.url,
      status: account.status,
      clicks: stats.clicks,
      lastClickedAt: lastClickParts.full,
    };
  });

  const totalCount = waitlistFormatted.length;
  const consentCount = waitlistFormatted.filter((r) => r.marketingConsent).length;
  const notifiedCount = typedWaitlist.filter((r) => Boolean(r.notified_at)).length;
  const pendingLaunchCount = typedWaitlist.filter(
    (r) => r.marketing_consent && !r.notified_at,
  ).length;
  const totalSocialClicks = socialsFormatted.reduce((sum, item) => sum + item.clicks, 0);
  const lastRegistration =
    waitlistFormatted.length > 0
      ? `${waitlistFormatted[waitlistFormatted.length - 1].registeredDate} ${waitlistFormatted[waitlistFormatted.length - 1].registeredTime}`
      : '—';

  return {
    socialTableReady,
    waitlist: waitlistFormatted,
    socials: socialsFormatted,
    summary: {
      totalCount,
      consentCount,
      pendingLaunchCount,
      notifiedCount,
      totalSocialClicks,
      lastRegistration,
    },
  };
}

async function syncOrganizedDataToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  data: Awaited<ReturnType<typeof loadOrganizedSupabaseData>>,
) {
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}?fields=properties.title,sheets.properties`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!metaRes.ok) {
    const errText = await metaRes.text();
    throw new Error(`No se pudo abrir la hoja de cálculo (${metaRes.status}): ${errText}`);
  }

  const meta = (await metaRes.json()) as {
    properties?: { title?: string };
    sheets?: Array<{ properties?: { sheetId?: number; title?: string } }>;
  };

  const existingTabs = new Map<string, number>();
  for (const sheet of meta.sheets ?? []) {
    const title = sheet.properties?.title;
    const sheetId = sheet.properties?.sheetId;
    if (title && typeof sheetId === 'number') {
      existingTabs.set(title, sheetId);
    }
  }

  const requiredTitles = [SHEET_TABS.waitlist, SHEET_TABS.socials, SHEET_TABS.summary];
  const missingTitles = requiredTitles.filter((t) => !existingTabs.has(t));

  if (missingTitles.length > 0) {
    const addRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: missingTitles.map((title) => ({
            addSheet: {
              properties: {
                title,
                gridProperties: { frozenRowCount: 1 },
              },
            },
          })),
        }),
      },
    );

    if (!addRes.ok) {
      const errText = await addRes.text();
      throw new Error(`No se pudieron crear las pestañas en Google Sheets: ${errText}`);
    }

    const addJson = (await addRes.json()) as {
      replies?: Array<{ addSheet?: { properties?: { sheetId?: number; title?: string } } }>;
    };
    for (const reply of addJson.replies ?? []) {
      const title = reply.addSheet?.properties?.title;
      const sheetId = reply.addSheet?.properties?.sheetId;
      if (title && typeof sheetId === 'number') {
        existingTabs.set(title, sheetId);
      }
    }
  }

  const clearRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchClear`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ranges: [
          `'${SHEET_TABS.waitlist}'!A:Z`,
          `'${SHEET_TABS.socials}'!A:Z`,
          `'${SHEET_TABS.summary}'!A:Z`,
        ],
      }),
    },
  );

  if (!clearRes.ok) {
    const errText = await clearRes.text();
    throw new Error(`No se pudo limpiar la hoja antes de actualizar: ${errText}`);
  }

  const syncedAtParts = formatDateParts(new Date().toISOString());

  const waitlistValues: (string | number)[][] = [
    [
      '#',
      'Correo electrónico',
      'Fecha de registro',
      'Hora de registro',
      'Consentimiento novedades',
      'Fecha consentimiento',
      'Estado lanzamiento',
      'ID Supabase',
    ],
    ...data.waitlist.map((row) => [
      row.index,
      row.email,
      row.registeredDate,
      row.registeredTime,
      row.consentLabel,
      row.consentDateTime,
      row.notifiedStatus,
      row.id,
    ]),
  ];

  const socialsValues: (string | number)[][] = [
    ['Red social', 'Cuenta / Usuario', 'Enlace oficial', 'Estado', 'Clics desde la app', 'Último clic'],
    ...data.socials.map((s) => [s.name, s.handle, s.url, s.status, s.clicks, s.lastClickedAt]),
  ];

  const summaryValues: (string | number)[][] = [
    ['Métrica (Supabase · Punto)', 'Valor actual'],
    ['Total personas en lista de espera', data.summary.totalCount],
    ['Con consentimiento para novedades', data.summary.consentCount],
    ['Pendientes de correo de lanzamiento', data.summary.pendingLaunchCount],
    ['Correos ya notificados', data.summary.notifiedCount],
    ['Clics totales en redes (TikTok, Instagram, YouTube)', data.summary.totalSocialClicks],
    ['Último registro recibido', data.summary.lastRegistration],
    ['Última sincronización con Google Sheets', syncedAtParts.full],
  ];

  const updateRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: [
          { range: `'${SHEET_TABS.waitlist}'!A1`, values: waitlistValues },
          { range: `'${SHEET_TABS.socials}'!A1`, values: socialsValues },
          { range: `'${SHEET_TABS.summary}'!A1`, values: summaryValues },
        ],
      }),
    },
  );

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    throw new Error(`No se pudieron escribir los datos en Google Sheets: ${errText}`);
  }

  const formatRequests = requiredTitles
    .map((title) => existingTabs.get(title))
    .filter((id): id is number => typeof id === 'number')
    .flatMap((sheetId) => [
      {
        updateSheetProperties: {
          properties: {
            sheetId,
            gridProperties: { frozenRowCount: 1 },
          },
          fields: 'gridProperties.frozenRowCount',
        },
      },
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.043, green: 0.043, blue: 0.051 },
              textFormat: {
                foregroundColor: { red: 1, green: 1, blue: 1 },
                bold: true,
                fontSize: 10,
              },
              horizontalAlignment: 'LEFT',
              verticalAlignment: 'MIDDLE',
            },
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)',
        },
      },
      {
        autoResizeDimensions: {
          dimensions: {
            sheetId,
            dimension: 'COLUMNS',
            startIndex: 0,
            endIndex: 8,
          },
        },
      },
    ]);

  if (formatRequests.length > 0) {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests: formatRequests }),
      },
    );
  }

  return {
    spreadsheetId,
    spreadsheetTitle: meta.properties?.title || 'Punto — Lista de espera',
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    syncedEmails: data.waitlist.length,
    syncedSocials: data.socials.length,
    syncedAt: syncedAtParts.full,
  };
}

function buildLaunchEmailHtml(unsubscribeUrl: string, appUrl: string): string {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Punto ya está disponible</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f7f8fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0b0b0d;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#ffffff;border-radius:24px;padding:40px 32px;border:1px solid #eceef2;">
            <tr>
              <td style="font-size:20px;font-weight:700;letter-spacing:-0.02em;padding-bottom:24px;">
                Punto
              </td>
            </tr>
            <tr>
              <td style="font-size:28px;font-weight:700;line-height:1.15;letter-spacing:-0.03em;padding-bottom:16px;">
                El momento ha llegado.
              </td>
            </tr>
            <tr>
              <td style="font-size:15px;line-height:1.6;color:#52525b;padding-bottom:28px;">
                Gracias por apuntarte a la lista de espera de Punto. Ya puedes entrar para conectar con personas, encontrar colaboradores y crear proyectos juntos.
              </td>
            </tr>
            <tr>
              <td style="padding-bottom:32px;">
                <a href="${appUrl}" style="display:inline-block;background-color:#0b0b0d;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 28px;border-radius:14px;">
                  Descubrir Punto
                </a>
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #f1f2f4;padding-top:20px;font-size:12px;line-height:1.6;color:#86868b;">
                Punto · MCD Group<br />
                Recibes este mensaje porque aceptaste recibir novedades sobre el lanzamiento.
                <a href="${unsubscribeUrl}" style="color:#52525b;text-decoration:underline;">Cancelar suscripción</a>.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export interface ApiRequestContext {
  method: string;
  pathname: string;
  origin?: string;
  searchParams: URLSearchParams;
  authorizationHeader: string | null;
  body: Record<string, unknown>;
  clientIp: string;
}

export interface ApiResponsePayload {
  status: number;
  headers?: Record<string, string>;
  body: unknown;
}

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store',
};

function normalizeApiPath(pathname: string): string {
  if (pathname.startsWith('/.netlify/functions/api')) {
    const rest = pathname.slice('/.netlify/functions/api'.length);
    return `/api${rest.startsWith('/') ? rest : `/${rest}`}`;
  }
  return pathname;
}

export async function handleApiRequest(ctx: ApiRequestContext): Promise<ApiResponsePayload> {
  const method = ctx.method.toUpperCase();
  const route = normalizeApiPath(ctx.pathname);

  if (method === 'GET' && route === '/api/waitlist/count') {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return { status: 200, headers: NO_STORE_HEADERS, body: { configured: false, count: null } };
    }

    try {
      const result = await fetchWaitlistCount(supabase);
      if (!result.ready) {
        return { status: 200, headers: NO_STORE_HEADERS, body: { configured: false, count: null } };
      }
      return { status: 200, headers: NO_STORE_HEADERS, body: { configured: true, count: result.count } };
    } catch (err) {
      console.error('[waitlist-count] error:', err);
      return {
        status: 500,
        headers: NO_STORE_HEADERS,
        body: {
          configured: true,
          count: null,
          message: 'No pudimos consultar el contador en este momento.',
        },
      };
    }
  }

  if (method === 'POST' && route === '/api/waitlist/register') {
    if (isRateLimited(ctx.clientIp || 'unknown')) {
      return {
        status: 429,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'Has realizado demasiados intentos seguidos. Espera unos minutos antes de volver a intentarlo.',
        },
      };
    }

    const rawEmail = typeof ctx.body?.email === 'string' ? ctx.body.email.trim().toLowerCase() : '';
    if (!rawEmail || rawEmail.length > 254 || !EMAIL_REGEX.test(rawEmail)) {
      return {
        status: 400,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'Introduce un correo electrónico válido.',
        },
      };
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return {
        status: 503,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          configured: false,
          message:
            'La conexión con Supabase aún está pendiente de configuración. No se ha guardado ningún registro.',
        },
      };
    }

    const { data: existingEntry, error: lookupError } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', rawEmail)
      .maybeSingle();

    if (lookupError) {
      console.error('[waitlist-register] Supabase lookupError:', {
        code: lookupError.code,
        message: lookupError.message,
      });

      if (lookupError.code === 'PGRST205' || lookupError.code === '42P01') {
        return {
          status: 503,
          headers: NO_STORE_HEADERS,
          body: {
            ok: false,
            configured: false,
            message:
              'El registro aún no está activo porque falta crear la tabla en Supabase. No se ha guardado ningún dato.',
          },
        };
      }

      if (lookupError.code === '42501') {
        return {
          status: 503,
          headers: NO_STORE_HEADERS,
          body: {
            ok: false,
            configured: false,
            message:
              'No hay permisos de lectura disponibles en este momento. Revisa las credenciales del servidor.',
          },
        };
      }

      return {
        status: 500,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'No pudimos verificar tu registro ahora mismo. Inténtalo de nuevo en unos instantes.',
        },
      };
    }

    if (existingEntry) {
      return {
        status: 409,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          duplicate: true,
          message: 'Este correo ya fue enviado anteriormente y ya está registrado en la lista de espera.',
        },
      };
    }

    const marketingConsent = ctx.body?.marketingConsent === true;
    const consentAt = marketingConsent ? new Date().toISOString() : null;

    const { error: insertError } = await supabase.from('waitlist').insert({
      email: rawEmail,
      marketing_consent: marketingConsent,
      consent_at: consentAt,
    });

    if (insertError) {
      console.error('[waitlist-register] Supabase insertError:', {
        code: insertError.code,
        message: insertError.message,
      });

      if (insertError.code === '23505') {
        return {
          status: 409,
          headers: NO_STORE_HEADERS,
          body: {
            ok: false,
            duplicate: true,
            message:
              'Este correo ya fue enviado anteriormente y ya está registrado en la lista de espera.',
          },
        };
      }

      if (insertError.code === 'PGRST205' || insertError.code === '42P01') {
        return {
          status: 503,
          headers: NO_STORE_HEADERS,
          body: {
            ok: false,
            configured: false,
            message:
              'El registro aún no está activo porque falta crear la tabla en Supabase. No se ha guardado ningún dato.',
          },
        };
      }

      if (insertError.code === '42501') {
        return {
          status: 503,
          headers: NO_STORE_HEADERS,
          body: {
            ok: false,
            configured: false,
            message:
              'No hay permisos de escritura disponibles en este momento. Revisa las credenciales del servidor.',
          },
        };
      }

      return {
        status: 500,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'No pudimos completar tu registro ahora mismo. Inténtalo de nuevo en unos instantes.',
        },
      };
    }

    try {
      const result = await fetchWaitlistCount(supabase);
      return {
        status: 201,
        headers: NO_STORE_HEADERS,
        body: { ok: true, configured: true, count: result.count },
      };
    } catch {
      return {
        status: 201,
        headers: NO_STORE_HEADERS,
        body: { ok: true, configured: true, count: null },
      };
    }
  }

  if (method === 'GET' && route === '/api/waitlist/unsubscribe') {
    const supabase = getSupabaseAdmin();
    const secret = process.env.UNSUBSCRIBE_SECRET?.trim();
    const token = ctx.searchParams.get('token') ?? '';

    if (!supabase || !secret) {
      return {
        status: 503,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'La gestión de bajas no está configurada todavía.',
        },
      };
    }

    const email = verifyUnsubscribeToken(token, secret);
    if (!email) {
      return {
        status: 400,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'El enlace para cancelar la suscripción no es válido o ha caducado.',
        },
      };
    }

    const { error } = await supabase
      .from('waitlist')
      .update({ marketing_consent: false })
      .eq('email', email);

    if (error) {
      return {
        status: 500,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'No pudimos tramitar tu baja en este momento. Inténtalo de nuevo más tarde.',
        },
      };
    }

    return {
      status: 200,
      headers: NO_STORE_HEADERS,
      body: {
        ok: true,
        message: 'Has cancelado tu suscripción correctamente. Ya no recibirás correos de novedades de Punto.',
      },
    };
  }

  if (method === 'POST' && route === '/api/admin/launch-notify') {
    const adminSecret = process.env.ADMIN_LAUNCH_SECRET?.trim();
    const authHeader = ctx.authorizationHeader ?? '';
    const providedSecret = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

    if (!adminSecret || !providedSecret || !safeCompareSecret(providedSecret, adminSecret)) {
      return { status: 401, headers: NO_STORE_HEADERS, body: { ok: false, message: 'No autorizado.' } };
    }

    const supabase = getSupabaseAdmin();
    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    const resendFrom = process.env.RESEND_FROM_EMAIL?.trim();
    const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET?.trim();
    const appUrl = (process.env.APP_URL?.trim() || ctx.origin || 'http://localhost:3000').replace(
      /\/$/,
      '',
    );

    if (!supabase || !resendApiKey || !resendFrom || !unsubscribeSecret) {
      return {
        status: 503,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'Faltan variables de entorno de Supabase, Resend o UNSUBSCRIBE_SECRET.',
        },
      };
    }

    const dryRun = ctx.body?.dryRun !== false;
    const requestedBatch = Number(ctx.body?.batchSize ?? 50);
    const batchSize = Math.min(
      Math.max(Number.isFinite(requestedBatch) ? Math.trunc(requestedBatch) : 50, 1),
      100,
    );

    if (!dryRun && ctx.body?.confirmSend !== true) {
      return {
        status: 400,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'Debes confirmar el envío con confirmSend: true y dryRun: false.',
        },
      };
    }

    const { count: totalPending, error: countError } = await supabase
      .from('waitlist')
      .select('id', { count: 'exact', head: true })
      .eq('marketing_consent', true)
      .is('notified_at', null);

    if (countError) {
      return {
        status: 500,
        headers: NO_STORE_HEADERS,
        body: { ok: false, message: 'No se pudo consultar la lista pendiente.' },
      };
    }

    if (dryRun) {
      return {
        status: 200,
        headers: NO_STORE_HEADERS,
        body: {
          ok: true,
          dryRun: true,
          pendingRecipients: totalPending ?? 0,
          batchSize,
        },
      };
    }

    const { data: recipients, error: queryError } = await supabase
      .from('waitlist')
      .select('id, email')
      .eq('marketing_consent', true)
      .is('notified_at', null)
      .order('created_at', { ascending: true })
      .limit(batchSize);

    if (queryError) {
      return {
        status: 500,
        headers: NO_STORE_HEADERS,
        body: { ok: false, message: 'Error al obtener el lote de destinatarios.' },
      };
    }

    let sent = 0;
    let failed = 0;

    for (const row of recipients ?? []) {
      try {
        const token = signUnsubscribeToken(row.email, unsubscribeSecret);
        const unsubscribeUrl = `${appUrl}/?unsubscribe=${encodeURIComponent(token)}`;
        const html = buildLaunchEmailHtml(unsubscribeUrl, appUrl);

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
            'Idempotency-Key': `punto-launch-${row.id}`,
          },
          body: JSON.stringify({
            from: resendFrom,
            to: [row.email],
            subject: 'Punto ya está disponible — Tu acceso a la lista de espera',
            html,
            headers: {
              'List-Unsubscribe': `<${unsubscribeUrl}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
            },
          }),
        });

        if (!resendRes.ok) {
          failed += 1;
          continue;
        }

        const { error: updateError } = await supabase
          .from('waitlist')
          .update({ notified_at: new Date().toISOString() })
          .eq('id', row.id)
          .is('notified_at', null);

        if (updateError) {
          failed += 1;
        } else {
          sent += 1;
        }
      } catch {
        failed += 1;
      }
    }

    return {
      status: 200,
      headers: NO_STORE_HEADERS,
      body: {
        ok: true,
        dryRun: false,
        sent,
        failed,
        remainingEstimate: Math.max((totalPending ?? 0) - sent, 0),
      },
    };
  }

  if (method === 'POST' && route === '/api/social/click') {
    const platform = typeof ctx.body?.platform === 'string' ? ctx.body.platform.trim().toLowerCase() : '';
    if (platform !== 'tiktok' && platform !== 'instagram' && platform !== 'youtube') {
      return {
        status: 400,
        headers: NO_STORE_HEADERS,
        body: { ok: false, message: 'Plataforma no válida.' },
      };
    }

    const memCurrent = sessionSocialClicks.get(platform) ?? { clicks: 0, lastClickedAt: null };
    sessionSocialClicks.set(platform, {
      clicks: memCurrent.clicks + 1,
      lastClickedAt: new Date().toISOString(),
    });

    const supabase = getSupabaseAdmin();
    if (supabase) {
      try {
        await supabase.rpc('increment_social_click', { p_platform: platform });
      } catch {
        // Ignorar si la tabla/función social_clicks aún no ha sido creada en Supabase
      }
    }

    return { status: 200, headers: NO_STORE_HEADERS, body: { ok: true } };
  }

  if (method === 'GET' && route === '/api/sheets/preview') {
    const authCheck = await verifyGoogleAdminToken(ctx.authorizationHeader);
    if (!authCheck.ok) {
      return {
        status: authCheck.status,
        headers: NO_STORE_HEADERS,
        body: { ok: false, message: authCheck.message },
      };
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return {
        status: 503,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'Supabase no está configurado todavía en el servidor.',
        },
      };
    }

    try {
      const data = await loadOrganizedSupabaseData(supabase);
      return {
        status: 200,
        headers: NO_STORE_HEADERS,
        body: {
          ok: true,
          adminEmail: authCheck.email,
          ...data,
        },
      };
    } catch (err) {
      console.error('[sheets/preview] error:', err);
      return {
        status: 500,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'No pudimos consultar los registros de Supabase en este momento.',
        },
      };
    }
  }

  if (method === 'GET' && route === '/api/sheets/spreadsheets') {
    const authCheck = await verifyGoogleAdminToken(ctx.authorizationHeader);
    if (!authCheck.ok) {
      return {
        status: authCheck.status,
        headers: NO_STORE_HEADERS,
        body: { ok: false, message: authCheck.message },
      };
    }

    try {
      const query = encodeURIComponent(
        "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
      );
      const fields = encodeURIComponent('files(id,name,modifiedTime,webViewLink)');
      const driveRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime%20desc&pageSize=20`,
        {
          headers: { Authorization: `Bearer ${authCheck.accessToken}` },
        },
      );

      if (!driveRes.ok) {
        const errText = await driveRes.text();
        return {
          status: driveRes.status,
          headers: NO_STORE_HEADERS,
          body: {
            ok: false,
            message: `Google Drive devolvió un error (${driveRes.status}): ${errText}`,
          },
        };
      }

      const driveJson = (await driveRes.json()) as {
        files?: Array<{
          id?: string;
          name?: string;
          modifiedTime?: string;
          webViewLink?: string;
        }>;
      };

      return {
        status: 200,
        headers: NO_STORE_HEADERS,
        body: {
          ok: true,
          files: (driveJson.files ?? []).filter((f) => Boolean(f.id && f.name)),
        },
      };
    } catch {
      return {
        status: 502,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'No pudimos listar tus hojas de cálculo de Google Drive.',
        },
      };
    }
  }

  if (method === 'POST' && route === '/api/sheets/create') {
    const authCheck = await verifyGoogleAdminToken(ctx.authorizationHeader);
    if (!authCheck.ok) {
      return {
        status: authCheck.status,
        headers: NO_STORE_HEADERS,
        body: { ok: false, message: authCheck.message },
      };
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return {
        status: 503,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'Supabase no está configurado todavía en el servidor.',
        },
      };
    }

    const customTitle =
      typeof ctx.body?.title === 'string' && ctx.body.title.trim().length > 0
        ? ctx.body.title.trim().slice(0, 120)
        : 'Punto — Lista de espera';

    try {
      const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authCheck.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: {
            title: customTitle,
            locale: 'es_ES',
            timeZone: 'Europe/Madrid',
          },
          sheets: [
            { properties: { title: SHEET_TABS.waitlist, gridProperties: { frozenRowCount: 1 } } },
            { properties: { title: SHEET_TABS.socials, gridProperties: { frozenRowCount: 1 } } },
            { properties: { title: SHEET_TABS.summary, gridProperties: { frozenRowCount: 1 } } },
          ],
        }),
      });

      if (!createRes.ok) {
        const errText = await createRes.text();
        return {
          status: createRes.status,
          headers: NO_STORE_HEADERS,
          body: {
            ok: false,
            message: `No se pudo crear la hoja en Google Sheets (${createRes.status}): ${errText}`,
          },
        };
      }

      const created = (await createRes.json()) as { spreadsheetId?: string };
      if (!created.spreadsheetId) {
        return {
          status: 500,
          headers: NO_STORE_HEADERS,
          body: {
            ok: false,
            message: 'Google Sheets no devolvió el identificador de la nueva hoja.',
          },
        };
      }

      const data = await loadOrganizedSupabaseData(supabase);
      const syncResult = await syncOrganizedDataToSpreadsheet(
        authCheck.accessToken,
        created.spreadsheetId,
        data,
      );

      return {
        status: 201,
        headers: NO_STORE_HEADERS,
        body: {
          ok: true,
          ...syncResult,
        },
      };
    } catch (err) {
      console.error('[sheets/create] error:', err);
      return {
        status: 500,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message:
            err instanceof Error
              ? err.message
              : 'No pudimos crear y sincronizar la hoja en Google Sheets.',
        },
      };
    }
  }

  if (method === 'POST' && route === '/api/sheets/sync') {
    const authCheck = await verifyGoogleAdminToken(ctx.authorizationHeader);
    if (!authCheck.ok) {
      return {
        status: authCheck.status,
        headers: NO_STORE_HEADERS,
        body: { ok: false, message: authCheck.message },
      };
    }

    const spreadsheetId =
      typeof ctx.body?.spreadsheetId === 'string' ? ctx.body.spreadsheetId.trim() : '';
    if (!spreadsheetId || !/^[a-zA-Z0-9_-]{10,120}$/.test(spreadsheetId)) {
      return {
        status: 400,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'Identificador de hoja de cálculo no válido.',
        },
      };
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return {
        status: 503,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message: 'Supabase no está configurado todavía en el servidor.',
        },
      };
    }

    try {
      const data = await loadOrganizedSupabaseData(supabase);
      const syncResult = await syncOrganizedDataToSpreadsheet(
        authCheck.accessToken,
        spreadsheetId,
        data,
      );

      return {
        status: 200,
        headers: NO_STORE_HEADERS,
        body: {
          ok: true,
          ...syncResult,
        },
      };
    } catch (err) {
      console.error('[sheets/sync] error:', err);
      return {
        status: 500,
        headers: NO_STORE_HEADERS,
        body: {
          ok: false,
          message:
            err instanceof Error
              ? err.message
              : 'No pudimos sincronizar los datos con Google Sheets.',
        },
      };
    }
  }

  return {
    status: 404,
    headers: NO_STORE_HEADERS,
    body: { ok: false, message: 'Ruta de API no encontrada.' },
  };
}
