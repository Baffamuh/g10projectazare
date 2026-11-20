import { EASY_BUY_ENABLED } from "@/lib/easybuy";
import { Link } from "@tanstack/react-router";
import { Stethoscope, GraduationCap, ShoppingBag, Trophy, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WatermarkedImage } from "./watermarked-image";
import { WhatsAppIcon } from "./whatsapp-icon";
import { BROCHURE_URL, LAND_IMG } from "@/lib/images";
import { waLink } from "@/lib/brand";

const AMENITIES = [
  { icon: Stethoscope, label: "Proposed Clinic" },
  { icon: GraduationCap, label: "School & Mosque" },
  { icon: ShoppingBag, label: "Shopping Complex" },
  { icon: Trophy, label: "Sports / Recreation Arena" },
];

export function FeaturedEstates() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-8">
        <div className="text-sm font-semibold uppercase tracking-wider text-gold">Featured Estates</div>
        <h2 className="mt-1 text-2xl font-bold text-primary-deep sm:text-3xl">Our flagship developments in Azare</h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-5">
        <article className="overflow-hidden rounded-3xl border bg-card shadow-card lg:col-span-3">
          <WatermarkedImage src={BROCHURE_URL} alt="Fatara Phase 3 Estate brochure" className="aspect-[16/11]" />
          <div className="p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              {EASY_BUY_ENABLED && <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-gold-foreground">EASY BUY</span>}
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">Residential & Commercial plots</span>
            </div>
            <h3 className="mt-3 text-2xl font-bold text-primary-deep">Fatara Phase 3 Estate</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-4" /> Fatara, Azare, Bauchi State</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {AMENITIES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2.5 rounded-xl bg-secondary p-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"><Icon className="size-4" /></span>
                  <span className="text-sm font-semibold">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Button asChild variant="whatsapp" size="lg">
                <a href={waLink("Hello G10 City Project, I want to inquire about plots in Fatara Phase 3 Estate (residential & commercial). Please send me prices and available plots.")} target="_blank" rel="noreferrer" onClick={() => window.__lovableEvents?.track?.("project.whatsapp_inquiry_clicked", { source: "estate", name: "Fatara Phase 3 Estate" })}>
                  <WhatsAppIcon /> Inquire About Fatara Phase 3
                </a>
              </Button>
              <Button asChild variant="outline" size="lg"><Link to="/properties" search={{ zone: "Fatara Phase 3 Estate" }}>View Fatara plots</Link></Button>
            </div>
          </div>
        </article>
        <article className="flex flex-col overflow-hidden rounded-3xl border bg-card shadow-card lg:col-span-2">
          <WatermarkedImage src={LAND_IMG} alt="Chara-Chara G.R.A plots" className="aspect-[16/11]" />
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            {EASY_BUY_ENABLED && <span className="w-fit rounded-full bg-gold px-2.5 py-1 text-xs font-bold text-gold-foreground">EASY BUY</span>}
            <h3 className="mt-3 text-2xl font-bold text-primary-deep">Chara-Chara G.R.A Azare Phase 2</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-4" /> G.R.A Kan Hanyan Chara-Chara</p>
            <ul className="mt-4 space-y-2 text-sm">
              {["Plot size 14m × 14m", "Form fee ₦10,000", "First payment ₦160,000", "₦40,000 monthly for 6 months", "Mallaki naka a yau"].map((t) => (
                <li key={t} className="flex items-center gap-2"><Check className="size-4 text-primary" /> {t}</li>
              ))}
            </ul>
            <div className="mt-auto pt-5">
              <Button asChild size="lg" className="w-full"><Link to="/properties" search={{ zone: "Chara-Chara G.R.A Azare Phase 2" }}>View Chara-Chara plots</Link></Button>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
