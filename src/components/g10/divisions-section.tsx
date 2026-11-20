import { Home, Boxes, UtensilsCrossed, Megaphone, Tractor, Trees, Baby } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "./whatsapp-icon";
import { waLink } from "@/lib/brand";
import { DIVISIONS } from "@/lib/divisions";

const ICONS = { Home, Boxes, UtensilsCrossed, Megaphone, Tractor, Trees, Baby };

export function DivisionsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <h2 className="text-2xl font-bold text-primary-deep sm:text-3xl">Our Group Enterprises</h2>
      <p className="mt-1 text-muted-foreground">G10 City Project Nigeria Limited is more than land — seven business arms serving Azare.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DIVISIONS.map((d) => {
          const I = ICONS[d.icon];
          return (
            <div key={d.name} className="flex flex-col rounded-2xl border bg-card p-5 shadow-card">
              <div className="grid size-11 place-items-center rounded-xl bg-secondary text-primary"><I className="size-5" /></div>
              <h3 className="mt-3 font-display font-bold">{d.name}</h3>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{d.desc}</p>
              <Button asChild variant="whatsapp" size="sm" className="mt-4 self-start">
                <a href={waLink(`Hello G10, I'm interested in ${d.name}.`)} target="_blank" rel="noreferrer" onClick={() => window.__lovableEvents?.track?.("project.whatsapp_inquiry_clicked", { source: "division", name: d.name })}><WhatsAppIcon className="size-4" /> {d.cta}</a>
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
