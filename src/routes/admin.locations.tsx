import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zonesQuery } from "@/lib/data";

export const Route = createFileRoute("/admin/locations")({ component: Locations });

function Locations() {
  const qc = useQueryClient();
  const { data: zones = [] } = useQuery(zonesQuery());
  const [zone, setZone] = useState({ name: "", description: "" });
  const [areaName, setAreaName] = useState<Record<string, string>>({});
  const [streetName, setStreetName] = useState<Record<string, string>>({});
  const refresh = () => qc.invalidateQueries({ queryKey: ["zones"] });
  const run = async (p: PromiseLike<{ error: { message: string } | null }>) => { const { error } = await p; if (error) toast.error(error.message); else refresh(); return !error; };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary-deep">Locations</h1>
      <form className="grid gap-2 rounded-2xl border bg-card p-4 sm:grid-cols-[1fr_2fr_auto]" onSubmit={async (e) => {
        e.preventDefault(); if (!zone.name.trim()) return;
        if (await run(supabase.from("zones").insert({ name: zone.name.trim(), description: zone.description || null, sort: zones.length + 1 }))) setZone({ name: "", description: "" });
      }}>
        <Input placeholder="New zone name" value={zone.name} onChange={(e) => setZone({ ...zone, name: e.target.value })} />
        <Input placeholder="Short description" value={zone.description} onChange={(e) => setZone({ ...zone, description: e.target.value })} />
        <Button>Add zone</Button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {zones.map((z) => (
          <div key={z.id} className="rounded-2xl border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div><div className="font-display font-bold">{z.name}</div><div className="text-xs text-muted-foreground">{z.description}</div></div>
              <button aria-label="Delete zone" className="text-destructive" onClick={() => confirm(`Delete zone "${z.name}" and its areas?`) && run(supabase.from("zones").delete().eq("id", z.id))}><Trash2 className="size-4" /></button>
            </div>
            <ul className="mt-3 space-y-1">
              {z.areas.map((a) => (
                <li key={a.id} className="rounded-lg bg-secondary px-3 py-2 text-sm">
                  <div className="flex items-center justify-between font-medium">{a.name}
                    <button aria-label="Delete area" className="text-destructive" onClick={() => confirm(`Delete area "${a.name}" and its streets?`) && run(supabase.from("areas").delete().eq("id", a.id))}><Trash2 className="size-3.5" /></button>
                  </div>
                  <ul className="mt-1 space-y-0.5 pl-3">
                    {(a.streets ?? []).map((st) => (
                      <li key={st.id} className="flex items-center justify-between text-xs text-muted-foreground">• {st.name}
                        <button aria-label="Delete street" className="text-destructive" onClick={() => run(supabase.from("streets").delete().eq("id", st.id))}><Trash2 className="size-3" /></button>
                      </li>
                    ))}
                  </ul>
                  <form className="mt-1.5 flex gap-1.5" onSubmit={async (e) => {
                    e.preventDefault(); const n = (streetName[a.id] ?? "").trim(); if (!n) return;
                    if (await run(supabase.from("streets").insert({ area_id: a.id, name: n }))) setStreetName({ ...streetName, [a.id]: "" });
                  }}>
                    <Input className="h-8 bg-card text-xs" placeholder="Add street" value={streetName[a.id] ?? ""} onChange={(e) => setStreetName({ ...streetName, [a.id]: e.target.value })} />
                    <Button size="sm" variant="outline" className="h-8">Add</Button>
                  </form>
                </li>
              ))}
            </ul>
            <form className="mt-3 flex gap-2" onSubmit={async (e) => {
              e.preventDefault(); const n = (areaName[z.id] ?? "").trim(); if (!n) return;
              if (await run(supabase.from("areas").insert({ zone_id: z.id, name: n }))) setAreaName({ ...areaName, [z.id]: "" });
            }}>
              <Input className="h-9" placeholder="Add area" value={areaName[z.id] ?? ""} onChange={(e) => setAreaName({ ...areaName, [z.id]: e.target.value })} />
              <Button size="sm" variant="outline">Add</Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
