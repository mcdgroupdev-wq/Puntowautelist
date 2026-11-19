-- =============================================================================
-- PUNTO (MCD Group) — Migración inicial de la lista de espera
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  marketing_consent boolean NOT NULL DEFAULT false,
  consent_at timestamptz NULL,
  notified_at timestamptz NULL,
  CONSTRAINT waitlist_email_lowercase_check CHECK (email = lower(trim(email))),
  CONSTRAINT waitlist_email_format_check CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_waitlist_launch_pending
  ON public.waitlist (created_at ASC)
  WHERE marketing_consent = true AND notified_at IS NULL;

-- Activar Row Level Security (RLS)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Denegar cualquier acceso directo desde roles públicos (anon / authenticated)
-- para proteger los correos y evitar lecturas o manipulaciones no autorizadas.
REVOKE ALL ON TABLE public.waitlist FROM anon, authenticated;

DROP POLICY IF EXISTS "Deny all public reads on waitlist" ON public.waitlist;
CREATE POLICY "Deny all public reads on waitlist"
  ON public.waitlist
  FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "Deny all public inserts on waitlist" ON public.waitlist;
CREATE POLICY "Deny all public inserts on waitlist"
  ON public.waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS "Deny all public updates on waitlist" ON public.waitlist;
CREATE POLICY "Deny all public updates on waitlist"
  ON public.waitlist
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

DROP POLICY IF EXISTS "Deny all public deletes on waitlist" ON public.waitlist;
CREATE POLICY "Deny all public deletes on waitlist"
  ON public.waitlist
  FOR DELETE
  TO anon, authenticated
  USING (false);

-- Función segura (SECURITY DEFINER) que devuelve ÚNICAMENTE el total de personas
-- registradas sin exponer correos ni ningún dato personal.
CREATE OR REPLACE FUNCTION public.get_waitlist_count()
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::bigint FROM public.waitlist;
$$;

REVOKE ALL ON FUNCTION public.get_waitlist_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_waitlist_count() TO anon, authenticated, service_role;
