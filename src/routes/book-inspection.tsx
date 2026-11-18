import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { CalendarCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { zonesQuery } from "@/lib/data";
import { waLink, COMPANY } from "@/lib/brand";
import { WhatsAppIcon } from "@/components/g10/whatsapp-icon";

export const Route = createFileRoute("/book-inspection")({
  head: () => ({
    meta: [
      { title: "Book a Site Inspection — G10 City Project, Azare" },
      { name: "description", content: "Pick an estate, date and time to visit G10 plots and houses in Azare, Bauchi State. Our team will confirm on WhatsApp." },
      { property: "og:title", content: "Book a Site Inspection — G10 City Project" },
      { property: "og:description", content: "See your plot before you buy. Free guided site inspections in Azare." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BookInspection,
});

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(120),
  phone: z.string().trim().min(7, "Enter a valid phone").max(30),
  estate: z.string().min(1, "Choose an estate"),
  preferred_date: z.string().min(1, "Choose a date"),
  time_slot: z.enum(["morning", "afternoon"]),
  note: z.string().trim().max(1000).optional(),
});

function BookInspection() {
  const { data: zones = [] } = useQuery(zonesQuery());
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({ name: "", phone: "", estate: "", preferred_date: "", time_slot: "morning" as "morning" | "afternoon", note: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const p = schema.safeParse(f);
    if (!p.success) return toast.error(p.error.issues[0]?.message ?? "Check the form");
    setBusy(true);
    const { error } = await supabase.from("inspections").insert({ ...p.data, note: p.data.note || null });
    setBusy(false);
    if (error) return toast.error("Could not book. Please use WhatsApp.");
    const slot = p.data.time_slot === "morning" ? "Morning (9am–12pm)" : "Afternoon (1pm–5pm)";
    setDone(waLink(`Hello G10 City Project, I booked a site inspection.\nName: ${p.data.name}\nEstate: ${p.data.estate}\nDate: ${p.data.preferred_date}\nTime: ${slot}`));
    toast.success("Inspection booked!");
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-12 lg:grid-cols-2">
      <div>
        <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-primary"><CalendarCheck /></span>
        <h1 className="mt-4 text-3xl font-bold text-primary-deep sm:text-4xl">See it before you buy.</h1>
        <p className="mt-3 text-muted-foreground">Book a free guided site inspection. Our team will meet you at the estate, show you the plot beacons and answer every question about titles and Easy Buy.</p>
        <ul className="mt-6 space-y-2 text-sm">
          <li>✔ Free of charge, no obligation</li>
          <li>✔ Monday – Saturday, morning or afternoon</li>
          <li>✔ Confirmation call from {COMPANY.phoneDisplay}</li>
        </ul>
      </div>
      {done ? (
        <div className="rounded-3xl border bg-card p-6 shadow-card">
          <h2 className="text-xl font-bold text-primary-deep">Booked — thank you!</h2>
          <p className="mt-2 text-sm text-muted-foreground">We'll call you to confirm. Send your booking on WhatsApp for a faster reply.</p>
          <Button asChild variant="whatsapp" className="mt-4 w-full"><a href={done} target="_blank" rel="noreferrer"><WhatsAppIcon /> Send on WhatsApp</a></Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3 rounded-3xl border bg-card p-6 shadow-card">
          <Input placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <Input placeholder="Phone number" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
          <select className="h-10 w-full rounded-md border bg-card px-3 text-sm" value={f.estate} onChange={(e) => setF({ ...f, estate: e.target.value })}>
            <option value="">Which estate?</option>
            {zones.map((z) => <option key={z.id} value={z.name}>{z.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <Input type="date" min={today} value={f.preferred_date} onChange={(e) => setF({ ...f, preferred_date: e.target.value })} />
            <select className="h-10 rounded-md border bg-card px-3 text-sm" value={f.time_slot} onChange={(e) => setF({ ...f, time_slot: e.target.value as "morning" | "afternoon" })}>
              <option value="morning">Morning</option><option value="afternoon">Afternoon</option>
            </select>
          </div>
          <Textarea placeholder="Anything we should know? (optional)" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
          <Button className="w-full" size="lg" disabled={busy}>{busy ? "Booking…" : "Book inspection"}</Button>
        </form>
      )}
    </div>
  );
}
