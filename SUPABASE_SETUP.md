# Configuración de Supabase y correos de lanzamiento — Punto (MCD Group)

Esta guía resume los pasos necesarios para conectar la base de datos real de **Supabase** y activar el envío manual de lanzamiento con **Resend**.

## 1. Crear tabla y políticas RLS en Supabase

Ejecuta el archivo `supabase/migrations/001_create_waitlist.sql` desde el **SQL Editor** de tu proyecto en Supabase o mediante Supabase CLI:

```bash
supabase db push
```

Qué crea esta migración:
- Tabla `public.waitlist` con columnas: `id` (UUID), `email` (único, en minúsculas), `created_at`, `marketing_consent`, `consent_at`, `notified_at`.
- **Row Level Security (RLS)** activado y denegación total de lectura/escritura directa para `anon` y `authenticated`.
- Función `public.get_waitlist_count()` (`SECURITY DEFINER`) que expone exclusivamente el recuento numérico total sin revelar ningún dato personal.

## 2. Variables de entorno del servidor (`.env` / Secrets)

Configura estas variables en tu entorno de ejecución del servidor (nunca en el frontend con prefijo `VITE_`):

- `SUPABASE_URL`: URL del proyecto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: clave `service_role` (solo servidor).
- `SUPABASE_ANON_KEY`: clave pública anónima (opcional en servidor).
- `RESEND_API_KEY`: clave API de Resend.
- `RESEND_FROM_EMAIL`: remitente verificado (ej. `Punto <hola@tudominio.com>`).
- `UNSUBSCRIBE_SECRET`: cadena aleatoria larga para firmar enlaces de baja HMAC-SHA256.
- `ADMIN_LAUNCH_SECRET`: secreto Bearer para autorizar el envío manual del correo de lanzamiento.
- `APP_URL`: URL pública donde vive la página de Punto.

## 3. Desplegar las Supabase Edge Functions (opcional / serverless)

Si deseas ejecutar los endpoints directamente en Supabase Edge Functions además o en lugar del servidor Express:

```bash
supabase functions deploy waitlist-count --no-verify-jwt
supabase functions deploy waitlist-register --no-verify-jwt
supabase functions deploy waitlist-unsubscribe --no-verify-jwt
supabase functions deploy send-launch-email --no-verify-jwt
```

Y define los secretos en Supabase:

```bash
supabase secrets set RESEND_API_KEY=... RESEND_FROM_EMAIL=... UNSUBSCRIBE_SECRET=... ADMIN_LAUNCH_SECRET=... APP_URL=...
```

## 4. Cómo enviar el correo de lanzamiento cuando Punto esté listo

El envío **nunca** ocurre automáticamente al registrarse. Cuando quieras avisar a quienes marcaron la casilla de consentimiento (`marketing_consent = true` y `notified_at IS NULL`):

1. **Simulación segura (dry-run)** para comprobar cuántos destinatarios pendientes hay:

```bash
curl -X POST https://TU_DOMINIO/api/admin/launch-notify \
  -H "Authorization: Bearer $ADMIN_LAUNCH_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"dryRun": true}'
```

2. **Envío real por lotes** (máximo 100 correos por llamada para evitar envíos masivos accidentales):

```bash
curl -X POST https://TU_DOMINIO/api/admin/launch-notify \
  -H "Authorization: Bearer $ADMIN_LAUNCH_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"dryRun": false, "confirmSend": true, "batchSize": 50}'
```

Cada envío correcto marca `notified_at` con la fecha actual e incluye un enlace único de cancelación de suscripción (`/?unsubscribe=...`) que desactiva `marketing_consent`.

## 5. Seguimiento de redes (TikTok, Instagram, YouTube) y Google Sheets

Opcionalmente, ejecuta también `supabase/migrations/002_create_social_clicks.sql` en el **SQL Editor** de Supabase para guardar de forma persistente los clics recibidos en los enlaces de **TikTok**, **Instagram** y **YouTube** de la pantalla de confirmación.

Desde el botón **Sheets** en el pie de página (o entrando en `/?panel=sheets`), inicia sesión con la cuenta administradora autorizada (`ADMIN_GOOGLE_EMAIL`, por defecto `mcdgroup.dev@gmail.com`) para organizar automáticamente en **Google Sheets** las tres pestañas sincronizadas con Supabase:
- **Lista de espera**: correos ordenados por fecha y hora exacta de registro.
- **Redes sociales**: cuentas oficiales (`@punto_app`, `@punto.connect`), enlaces y clics registrados.
- **Resumen**: métricas totales actualizadas.

