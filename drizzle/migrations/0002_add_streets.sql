CREATE TABLE public.streets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area_id uuid NOT NULL REFERENCES public.areas(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.streets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.streets TO authenticated;
GRANT ALL ON public.streets TO service_role;
ALTER TABLE public.streets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public streets" ON public.streets FOR SELECT USING (true);
CREATE POLICY "staff streets" ON public.streets FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
ALTER TABLE public.areas DROP CONSTRAINT areas_zone_id_fkey, ADD CONSTRAINT areas_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.zones(id) ON DELETE CASCADE;