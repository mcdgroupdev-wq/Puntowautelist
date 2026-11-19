import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders, jsonResponse, verifyUnsubscribeToken } from '../_shared/security.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return jsonResponse({ ok: false, message: 'Método no permitido.' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const unsubscribeSecret = Deno.env.get('UNSUBSCRIBE_SECRET');

  if (!supabaseUrl || !serviceRoleKey || !unsubscribeSecret) {
    return jsonResponse({ ok: false, message: 'Servicio no configurado.' }, 503);
  }

  let token = '';
  if (req.method === 'GET') {
    token = new URL(req.url).searchParams.get('token') ?? '';
  } else {
    try {
      const body = await req.json();
      token = typeof body.token === 'string' ? body.token : '';
    } catch {
      return jsonResponse({ ok: false, message: 'Solicitud no válida.' }, 400);
    }
  }

  const email = await verifyUnsubscribeToken(token, unsubscribeSecret);
  if (!email) {
    return jsonResponse({ ok: false, message: 'El enlace de baja no es válido o ha caducado.' }, 400);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase
    .from('waitlist')
    .update({ marketing_consent: false })
    .eq('email', email);

  if (error) {
    console.error('Error al cancelar suscripción:', error.code);
    return jsonResponse({ ok: false, message: 'No se pudo procesar la baja en este momento.' }, 500);
  }

  return jsonResponse({
    ok: true,
    message: 'Has cancelado tu suscripción correctamente. Ya no recibirás correos de Punto.',
  });
});
