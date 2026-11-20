import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Property = Tables<"properties"> & {
  zones: { name: string } | null;
  areas: { name: string } | null;
  property_photos: { url: string; sort: number }[];
};
export type Zone = Tables<"zones"> & { areas: (Tables<"areas"> & { streets?: Tables<"streets">[] })[] };

const SELECT = "*, zones(name), areas(name), property_photos(url, sort)";

export const propertiesQuery = () =>
  queryOptions({
    queryKey: ["properties"],
    queryFn: async () => {
      const { data, error } = await supabase.from("properties").select(SELECT).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Property[];
    },
  });

export const propertyByCodeQuery = (code: string) =>
  queryOptions({
    queryKey: ["property", code],
    queryFn: async () => {
      const { data, error } = await supabase.from("properties").select(SELECT).eq("code", code).maybeSingle();
      if (error) throw error;
      return data as unknown as Property | null;
    },
  });

export const zonesQuery = () =>
  queryOptions({
    queryKey: ["zones"],
    queryFn: async () => {
      const { data, error } = await supabase.from("zones").select("*, areas(*, streets(*))").order("sort");
      if (error) throw error;
      return (data ?? []) as Zone[];
    },
  });

export function coverOf(p: Property): string | null {
  const photos = [...(p.property_photos ?? [])].sort((a, b) => a.sort - b.sort);
  return photos[0]?.url ?? null;
}
