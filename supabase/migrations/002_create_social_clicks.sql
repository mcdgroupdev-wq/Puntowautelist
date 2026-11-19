-- =============================================================================
-- PUNTO (MCD Group) — Seguimiento de clics en redes sociales (TikTok, Instagram, YouTube)
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.social_clicks (
  platform text PRIMARY KEY CHECK (platform IN ('tiktok', 'instagram', 'youtube')),
  clicks bigint NOT NULL DEFAULT 0 CHECK (clicks >= 0),
  last_clicked_at timestamptz NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.social_clicks (platform, clicks)
VALUES
  ('tiktok', 0),
  ('instagram', 0),
  ('youtube', 0)
ON CONFLICT (platform) DO NOTHING;

ALTER TABLE public.social_clicks ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.social_clicks FROM anon, authenticated;

DROP POLICY IF EXISTS "Deny all public reads on social_clicks" ON public.social_clicks;
CREATE POLICY "Deny all public reads on social_clicks"
  ON public.social_clicks
  FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "Deny all public writes on social_clicks" ON public.social_clicks;
CREATE POLICY "Deny all public writes on social_clicks"
  ON public.social_clicks
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE OR REPLACE FUNCTION public.increment_social_click(p_platform text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_platform NOT IN ('tiktok', 'instagram', 'youtube') THEN
    RAISE EXCEPTION 'Plataforma no válida: %', p_platform;
  END IF;

  INSERT INTO public.social_clicks (platform, clicks, last_clicked_at, updated_at)
  VALUES (p_platform, 1, now(), now())
  ON CONFLICT (platform)
  DO UPDATE SET
    clicks = public.social_clicks.clicks + 1,
    last_clicked_at = now(),
    updated_at = now();
END;
$$;

REVOKE ALL ON FUNCTION public.increment_social_click(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_social_click(text) TO service_role;
