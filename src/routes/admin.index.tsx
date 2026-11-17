import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { propertiesQuery } from "@/lib/data";
import { naira } from "@/lib/brand";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const { data: props = [] } = useQuery(propertiesQuery());
  const { data: inq = 0 } = useQuery({ queryKey: ["inq-count"], queryFn: async () => (await supabase.from("inquiries").select("id", { count: "exact", head: true })).count ?? 0 });
  const { data: newInq = 0 } = useQuery({ queryKey: ["inq-new"], queryFn: async () => (await supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new")).count ?? 0 });
  const { data: sales = [] } = useQuery({ queryKey: ["sales"], queryFn: async () => (await supabase.from("sales").select("*").order("created_at", { ascending: false })).data ?? [] });

  const activePlots = (zone: string) => props.filter((p) => p.zones?.name?.startsWith(zone) && p.status === "available" && p.category !== "house").reduce((s, p) => s + p.units_available, 0);
  const units = props.filter((p) => p.status === "available").reduce((s, p) => s + p.units_available, 0);
  const revenue = sales.reduce((s, x) => s + Number(x.amount_paid), 0);

  const cards = [
    ["Total listings", props.length],
    ["Active plots · Fatara", activePlots("Fatara")],
    ["Active plots · Chara-Chara", activePlots("Chara-Chara")],
    ["Units available", units],
    ["Inquiries", `${inq} (${newInq} new)`],
    ["Sales", sales.length],
    ["Payments received", naira(revenue)],
    ["Easy Buy listings", props.filter((p) => p.easy_buy).length],
  ] as const;

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-deep">Dashboard</h1>
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(([k, v]) => (
          <div key={k} className="rounded-2xl border bg-card p-4 shadow-card">
            <div className="text-xs text-muted-foreground">{k}</div>
            <div className="mt-1 font-display text-2xl font-bold text-primary-deep">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
