import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse } from '../_shared/security.ts';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ ok: false, message: 'Método no permitido.' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse(
      {
        ok: false,
        configured: false,
        message: 'El registro no está disponible todavía porque Supabase no está configurado.',
      },
      503,
    );
  }

  let body: { email?: unknown; marketingConsent?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ ok: false, message: 'Solicitud no válida.' }, 400);
  }

  const rawEmail = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!rawEmail || rawEmail.length > 254 || !EMAIL_REGEX.test(rawEmail)) {
    return jsonResponse({ ok: false, message: 'Introduce un correo electrónico válido.' }, 400);
  }

  const marketingConsent = body.marketingConsent === true;
  const consentAt = marketingConsent ? new Date().toISOString() : null;

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: existingEntry, error: lookupError } = await supabase
    .from('waitlist')
    .select('id')
    .eq('email', rawEmail)
    .maybeSingle();

  if (lookupError) {
    console.error('Error al comprobar correo existente en waitlist:', lookupError.code);
    return jsonResponse(
      {
        ok: false,
        message: 'No pudimos verificar tu registro ahora mismo. Inténtalo de nuevo en unos segundos.',
      },
      500,
    );
  }

  if (existingEntry) {
    return jsonResponse(
      {
        ok: false,
        duplicate: true,
        message: 'Este correo ya fue enviado anteriormente y ya está registrado en la lista de espera.',
      },
      409,
    );
  }

  const { error: insertError } = await supabase.from('waitlist').insert({
    email: rawEmail,
    marketing_consent: marketingConsent,
    consent_at: consentAt,
  });

  if (insertError) {
    if (insertError.code === '23505') {
      return jsonResponse(
        {
          ok: false,
          duplicate: true,
          message: 'Este correo ya fue enviado anteriormente y ya está registrado en la lista de espera.',
        },
        409,
      );
    }

    console.error('Error al registrar correo en waitlist:', insertError.code);
    return jsonResponse(
      {
        ok: false,
        message: 'No pudimos completar tu registro en este momento. Inténtalo de nuevo en unos segundos.',
      },
      500,
    );
  }

  const { data: countData } = await supabase.rpc('get_waitlist_count');

  return jsonResponse(
    {
      ok: true,
      configured: true,
      count: typeof countData === 'number' ? countData : Number(countData ?? 0),
    },
    201,
  );
});
