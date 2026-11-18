import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { waLink } from "@/lib/brand";
import { WhatsAppIcon } from "@/components/g10/whatsapp-icon";

export const Route = createFileRoute("/admin/inquiries")({ component: Inquiries });

const REPLIES = [
  { label: "Thanks", text: (n: string, c?: string | null) => `Salam ${n}, thank you for contacting G10 City Project${c ? ` about ${c}` : ""}. How can we help you?` },
  { label: "Inspection", text: (n: string) => `Hello ${n}, you're welcome to inspect the plot. Which day suits you this week?` },
  { label: "Easy Buy", text: (n: string, c?: string | null) => `Hello ${n}, yes${c ? ` ${c}` : ""} is on Easy Buy — 0% interest. Tell us your down payment and number of months and we'll send your plan.` },
];
const sel = "h-8 rounded-lg border bg-card px-2 text-xs";

function Inquiries() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"inq" | "insp">("inq");
  const inq = useQuery({ queryKey: ["inquiries"], queryFn: async () => (await supabase.from("inquiries").select("*").order("created_at", { ascending: false })).data ?? [] });
  const insp = useQuery({ queryKey: ["inspections"], queryFn: async () => (await supabase.from("inspections").select("*").order("preferred_date")).data ?? [] });

  const setStatus = async (table: "inquiries" | "inspections", id: string, status: string) => {
    await supabase.from(table).update({ status }).eq("id", id);
    qc.invalidateQueries({ queryKey: [table] });
  };
  const tabCls = (t: string) => `rounded-xl px-4 py-2 text-sm font-semibold ${tab === t ? "bg-primary text-primary-foreground" : "bg-secondary"}`;

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-deep">Leads</h1>
      <div className="mt-4 flex gap-2">
        <button className={tabCls("inq")} onClick={() => setTab("inq")}>Inquiries ({inq.data?.filter((i) => i.status === "new").length ?? 0} new)</button>
        <button className={tabCls("insp")} onClick={() => setTab("insp")}>Inspections ({insp.data?.filter((i) => i.status === "new").length ?? 0} new)</button>
      </div>
      <div className="mt-4 space-y-3">
        {tab === "inq" && inq.data?.map((i) => (
          <div key={i.id} className="rounded-2xl border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><span className="font-semibold">{i.name}</span> <span className="text-sm text-muted-foreground">· {i.phone}</span>{i.property_code && <span className="ml-2 font-mono text-xs">{i.property_code}</span>}</div>
              <select className={sel} value={i.status} onChange={(e) => setStatus("inquiries", i.id, e.target.value)}><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select>
            </div>
            {i.message && <p className="mt-2 text-sm">{i.message}</p>}
            <div className="mt-1 text-xs text-muted-foreground">{new Date(i.created_at).toLocaleString("en-NG")}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href={`tel:${i.phone}`} className="inline-flex items-center gap-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium"><Phone className="size-3.5" /> Call</a>
              {REPLIES.map((r) => (
                <a key={r.label} href={waLink(r.text(i.name, i.property_code), i.phone)} target="_blank" rel="noreferrer" onClick={() => i.status === "new" && setStatus("inquiries", i.id, "contacted")}
                  className="inline-flex items-center gap-1 rounded-lg bg-whatsapp px-3 py-1.5 text-xs font-medium text-whatsapp-foreground"><WhatsAppIcon className="size-3.5" /> {r.label}</a>
              ))}
            </div>
          </div>
        ))}
        {tab === "insp" && insp.data?.map((i) => (
          <div key={i.id} className="rounded-2xl border bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><span className="font-semibold">{i.name}</span> <span className="text-sm text-muted-foreground">· {i.phone}</span></div>
              <select className={sel} value={i.status} onChange={(e) => setStatus("inspections", i.id, e.target.value)}><option value="new">New</option><option value="confirmed">Confirmed</option><option value="done">Done</option><option value="cancelled">Cancelled</option></select>
            </div>
            <div className="mt-1 text-sm"><b>{i.estate}</b> · {new Date(i.preferred_date).toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short" })} · {i.time_slot}</div>
            {i.note && <p className="mt-1 text-sm text-muted-foreground">{i.note}</p>}
            <a href={waLink(`Hello ${i.name}, your G10 site inspection at ${i.estate} is confirmed for ${i.preferred_date} (${i.time_slot}). See you there!`, i.phone)} target="_blank" rel="noreferrer"
              onClick={() => i.status === "new" && setStatus("inspections", i.id, "confirmed")}
              className="mt-3 inline-flex items-center gap-1 rounded-lg bg-whatsapp px-3 py-1.5 text-xs font-medium text-whatsapp-foreground"><WhatsAppIcon className="size-3.5" /> Confirm on WhatsApp</a>
          </div>
        ))}
        {tab === "inq" && !inq.data?.length && <p className="text-muted-foreground">No inquiries yet.</p>}
        {tab === "insp" && !insp.data?.length && <p className="text-muted-foreground">No inspections booked yet.</p>}
      </div>
    </div>
  );
}
