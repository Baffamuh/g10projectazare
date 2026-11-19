import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Printer } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { propertiesQuery } from "@/lib/data";
import { naira } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/sales/")({ component: SalesPage });

const sel = "h-10 w-full rounded-lg border bg-card px-3 text-sm";

function SalesPage() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const { data: props = [] } = useQuery(propertiesQuery());
  const { data: sales = [] } = useQuery({ queryKey: ["sales"], queryFn: async () => (await supabase.from("sales").select("*").order("created_at", { ascending: false })).data ?? [] });
  const [f, setF] = useState({ property_id: "", plot_details: "", buyer_name: "", buyer_phone: "", buyer_address: "", amount: "", amount_paid: "", payment_method: "full", months: "", notes: "", sale_date: new Date().toISOString().slice(0, 10) });
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));
  const prop = props.find((p) => p.id === f.property_id);
  const amount = Number(f.amount || 0), paid = Number(f.amount_paid || 0), months = Number(f.months || 0);
  const monthly = f.payment_method === "installment" && months > 0 ? Math.ceil(Math.max(0, amount - paid) / months) : null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { data: rn, error: e1 } = await supabase.rpc("next_receipt_no");
    if (e1 || !rn) { setBusy(false); toast.error(e1?.message ?? "Could not create receipt number"); return; }
    const { data: u } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("sales").insert({
      receipt_no: rn as string, property_id: prop?.id ?? null, property_code: prop?.code ?? null, property_title: prop?.title ?? null,
      plot_details: f.plot_details || prop?.unit_no || null, buyer_name: f.buyer_name.trim(), buyer_phone: f.buyer_phone.trim(),
      buyer_address: f.buyer_address || null, amount, amount_paid: paid, payment_method: f.payment_method,
      months: f.payment_method === "installment" ? months || null : null, monthly, notes: f.notes || null, sale_date: f.sale_date, created_by: u.user?.id ?? null,
    }).select("id").single();
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Sale recorded — ${rn}`);
    qc.invalidateQueries({ queryKey: ["sales"] });
    nav({ to: "/admin/sales/$id", params: { id: data.id } });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      <form onSubmit={submit} className="space-y-3 rounded-2xl border bg-card p-5 shadow-card">
        <h1 className="text-xl font-bold text-primary-deep">Record a sale</h1>
        <select className={sel} value={f.property_id} onChange={(e) => { const p = props.find((x) => x.id === e.target.value); setF((s) => ({ ...s, property_id: e.target.value, amount: p ? String(p.price) : s.amount, plot_details: p?.unit_no ?? s.plot_details })); }}>
          <option value="">Select property (optional)</option>
          {props.map((p) => <option key={p.id} value={p.id}>{p.code} — {p.title}</option>)}
        </select>
        <Input placeholder="Plot / House / Unit details (e.g. Plot 42)" value={f.plot_details} onChange={(e) => set("plot_details", e.target.value)} />
        <Input placeholder="Buyer full name" required value={f.buyer_name} onChange={(e) => set("buyer_name", e.target.value)} />
        <Input placeholder="Buyer phone" required type="tel" value={f.buyer_phone} onChange={(e) => set("buyer_phone", e.target.value)} />
        <Input placeholder="Buyer address (optional)" value={f.buyer_address} onChange={(e) => set("buyer_address", e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs text-muted-foreground">Total price (₦)<Input type="number" min={0} required value={f.amount} onChange={(e) => set("amount", e.target.value)} /></label>
          <label className="text-xs text-muted-foreground">Amount paid (₦)<Input type="number" min={0} required value={f.amount_paid} onChange={(e) => set("amount_paid", e.target.value)} /></label>
          <label className="text-xs text-muted-foreground">Payment method
            <select className={sel} value={f.payment_method} onChange={(e) => set("payment_method", e.target.value)}>
              <option value="full">Full payment</option><option value="installment">Installment</option>
            </select></label>
          <label className="text-xs text-muted-foreground">Sale date<Input type="date" required value={f.sale_date} onChange={(e) => set("sale_date", e.target.value)} /></label>
          {f.payment_method === "installment" && <label className="col-span-2 text-xs text-muted-foreground">Months for balance<Input type="number" min={1} value={f.months} onChange={(e) => set("months", e.target.value)} /></label>}
        </div>
        <div className="rounded-xl bg-secondary p-3 text-sm">Balance: <b>{naira(Math.max(0, amount - paid))}</b>{monthly !== null && <> · Monthly: <b>{naira(monthly)}</b></>}</div>
        <Textarea placeholder="Notes (optional)" value={f.notes} onChange={(e) => set("notes", e.target.value)} />
        <Button className="w-full" size="lg" disabled={busy}>{busy ? "Saving…" : "Save & create receipt"}</Button>
      </form>
      <div>
        <h2 className="mb-3 text-lg font-bold text-primary-deep">Recent sales ({sales.length})</h2>
        <div className="space-y-2">
          {sales.map((s) => (
            <Link key={s.id} to="/admin/sales/$id" params={{ id: s.id }} className="flex items-center justify-between gap-3 rounded-xl border bg-card p-3 hover:bg-secondary">
              <div className="min-w-0"><div className="font-mono text-xs text-muted-foreground">{s.receipt_no}</div>
                <div className="truncate font-semibold">{s.buyer_name}</div>
                <div className="truncate text-xs text-muted-foreground">{s.property_code ?? "—"} · {s.sale_date}</div></div>
              <div className="text-right"><div className="font-bold">{naira(s.amount_paid)}</div><Printer className="ml-auto mt-1 size-4 text-primary" /></div>
            </Link>
          ))}
          {sales.length === 0 && <p className="text-sm text-muted-foreground">No sales yet.</p>}
        </div>
      </div>
    </div>
  );
}
