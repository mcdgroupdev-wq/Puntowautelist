import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, signUnsubscribeToken } from '../_shared/security.ts';

function buildLaunchEmailHtml(unsubscribeUrl: string, appUrl: string): string {
  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Punto ya está aquí</title>
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
                Gracias por unirte desde el principio a la lista de espera de Punto. Ya puedes acceder a la aplicación para conectar con personas, encontrar colaboradores y crear proyectos juntos.
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
                Recibes este correo porque aceptaste recibir el aviso de lanzamiento.
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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ ok: false, message: 'Método no permitido.' }, 405);
  }

  const adminSecret = Deno.env.get('ADMIN_LAUNCH_SECRET');
  const authHeader = req.headers.get('authorization') ?? '';
  const providedSecret = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';

  if (!adminSecret || !providedSecret || providedSecret !== adminSecret) {
    return jsonResponse({ ok: false, message: 'No autorizado.' }, 401);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const resendFrom = Deno.env.get('RESEND_FROM_EMAIL');
  const unsubscribeSecret = Deno.env.get('UNSUBSCRIBE_SECRET');
  const appUrl = Deno.env.get('APP_URL') ?? 'https://punto.app';

  if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !resendFrom || !unsubscribeSecret) {
    return jsonResponse(
      { ok: false, message: 'Faltan secretos de configuración para el envío de lanzamiento.' },
      503,
    );
  }

  let body: { dryRun?: boolean; batchSize?: number; confirmSend?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const dryRun = body.dryRun !== false;
  const requestedBatch = Number(body.batchSize ?? 50);
  const batchSize = Math.min(Math.max(Number.isFinite(requestedBatch) ? Math.trunc(requestedBatch) : 50, 1), 100);

  if (!dryRun && body.confirmSend !== true) {
    return jsonResponse(
      {
        ok: false,
        message: 'Debes enviar confirmSend: true junto con dryRun: false para evitar envíos masivos accidentales.',
      },
      400,
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { count: totalPending, error: countError } = await supabase
    .from('waitlist')
    .select('id', { count: 'exact', head: true })
    .eq('marketing_consent', true)
    .is('notified_at', null);

  if (countError) {
    console.error('Error al contar destinatarios pendientes:', countError.code);
    return jsonResponse({ ok: false, message: 'Error al consultar la base de datos.' }, 500);
  }

  if (dryRun) {
    return jsonResponse({
      ok: true,
      dryRun: true,
      pendingRecipients: totalPending ?? 0,
      batchSize,
    });
  }

  const { data: recipients, error: queryError } = await supabase
    .from('waitlist')
    .select('id, email')
    .eq('marketing_consent', true)
    .is('notified_at', null)
    .order('created_at', { ascending: true })
    .limit(batchSize);

  if (queryError) {
    console.error('Error al leer lote de destinatarios:', queryError.code);
    return jsonResponse({ ok: false, message: 'Error al obtener destinatarios.' }, 500);
  }

  let sent = 0;
  let failed = 0;

  for (const row of recipients ?? []) {
    try {
      const token = await signUnsubscribeToken(row.email, unsubscribeSecret);
      const unsubscribeUrl = `${appUrl.replace(/\/$/, '')}/?unsubscribe=${encodeURIComponent(token)}`;
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

  return jsonResponse({
    ok: true,
    dryRun: false,
    sent,
    failed,
    remainingEstimate: Math.max((totalPending ?? 0) - sent, 0),
  });
});
