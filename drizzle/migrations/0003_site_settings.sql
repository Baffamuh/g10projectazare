CREATE TABLE public.site_settings (id int PRIMARY KEY DEFAULT 1 CHECK (id = 1), easy_buy_enabled boolean NOT NULL DEFAULT false, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "staff settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
INSERT INTO public.site_settings (id) VALUES (1);