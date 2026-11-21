import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/g10/property-card";
import { propertiesQuery, zonesQuery } from "@/lib/data";
import { recommendProperties } from "@/lib/recommend.functions";

export const Route = createFileRoute("/find-my-plot")({
  head: () => ({
    meta: [
      { title: "Find My Plot — Smart Property Match | G10 City Project" },
      { name: "description", content: "Tell us your budget, preferred zone and needs, and get matching plots and houses in Azare." },
      { property: "og:title", content: "Find My Plot — G10 City Project" },
      { property: "og:description", content: "Get property suggestions in Azare that match your budget and zone." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FindMyPlot,
});

const field = "h-11 w-full rounded-lg border bg-card px-3 text-sm";

function FindMyPlot() {
  const { data: zones = [] } = useQuery(zonesQuery());
  const { data: props = [] } = useQuery(propertiesQuery());
  const [budget, setBudget] = useState("");
  const [zone, setZone] = useState("");
  const [needs, setNeeds] = useState("");
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<{ picks: { code: string; reason: string }[]; error: string | null } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await recommendProperties({ data: { budget: Number(budget.replace(/\D/g, "")), zone, needs } });
      setRes(r);
      window.__lovableEvents?.track?.("project.plot_recommendation_requested", { zone: zone || "any", results: r.picks.length });
    } catch { setRes({ picks: [], error: "Something went wrong. Please try again." }); }
    finally { setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 pb-24">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-gold-foreground"><Sparkles className="size-3.5" /> Smart match</span>
      <h1 className="mt-3 text-3xl font-bold text-primary-deep">Find My Plot</h1>
      <p className="mt-1 text-muted-foreground">Tell us what you need and we'll suggest the best available properties.</p>
      <form onSubmit={submit} className="mt-6 grid gap-4 rounded-2xl border bg-card p-5 shadow-card sm:grid-cols-2">
        <label className="text-sm font-medium">Budget (₦)
          <input className={`${field} mt-1`} inputMode="numeric" placeholder="e.g. 2,500,000" value={budget} onChange={(e) => setBudget(e.target.value)} />
        </label>
        <label className="text-sm font-medium">Preferred zone
          <select className={`${field} mt-1`} value={zone} onChange={(e) => setZone(e.target.value)}>
            <option value="">Any zone</option>
            {zones.map((z) => <option key={z.id} value={z.name}>{z.name}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium sm:col-span-2">What are you looking for?
          <textarea className="mt-1 min-h-24 w-full rounded-lg border bg-card p-3 text-sm" placeholder="e.g. 2 residential plots near the road to build a family house" value={needs} onChange={(e) => setNeeds(e.target.value)} />
        </label>
        <Button type="submit" size="lg" disabled={busy} className="sm:col-span-2">{busy ? "Finding matches…" : "Find matching properties"}</Button>
      </form>
      {res?.error && <p className="mt-6 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{res.error}</p>}
      {res && !res.error && res.picks.length === 0 && <p className="mt-6 text-muted-foreground">No close matches right now. Try a different budget or zone, or chat with us on WhatsApp.</p>}
      {res && res.picks.length > 0 && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {res.picks.map((pk) => { const p = props.find((x) => x.code === pk.code); return p ? (
            <div key={pk.code} className="space-y-2"><PropertyCard p={p} /><p className="rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">{pk.reason}</p></div>
          ) : null; })}
        </div>
      )}
    </div>
  );
}
