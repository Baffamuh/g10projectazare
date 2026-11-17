import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, Wallet, MapPinned, Ruler } from "lucide-react";
import heroImg from "@/assets/hero-estate.jpg";
import { Button } from "@/components/ui/button";
import { FeaturedEstates } from "@/components/g10/featured-estates";
import { EasyBuyCalculator } from "@/components/g10/easy-buy-calculator";
import { PropertyCard } from "@/components/g10/property-card";
import { WhatsAppIcon } from "@/components/g10/whatsapp-icon";
import { propertiesQuery, zonesQuery } from "@/lib/data";
import { COMPANY, waLink } from "@/lib/brand";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "G10 City Project — Plots & Houses in Azare with Easy Buy" },
      { name: "description", content: "Buy land, houses, shops and farms in Azare, Bauchi State. Pay small-small with G10 EASY BUY — zero interest." },
      { property: "og:title", content: "G10 City Project — Plots & Houses in Azare" },
      { property: "og:description", content: "Fatara Phase 3, Chara-Chara G.R.A and more. Flexible EASY BUY installments." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data: props = [] } = useQuery(propertiesQuery());
  const { data: zones = [] } = useQuery(zonesQuery());
  const latest = props.filter((p) => p.status !== "sold").slice(0, 6);

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <img src={heroImg} alt="G10 estate in Azare" width={1600} height={640} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="mx-auto max-w-7xl px-4 pb-14 pt-24 sm:pb-20 sm:pt-36">
          <span className="inline-block rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">EASY BUY · Biya a hankali</span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-primary-foreground sm:text-6xl">
            Own land in Azare — <span className="text-gold">without the pressure.</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-primary-foreground/85 sm:text-lg">{COMPANY.motto}. Plots, houses, shops and farmland with flexible zero-interest installments.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="gold" size="lg"><Link to="/properties">Browse properties</Link></Button>
            <Button asChild variant="heroOutline" size="lg">
              <a href={waLink("Hello G10 City Project, I'm interested in your EASY BUY plan.")} target="_blank" rel="noreferrer"><WhatsAppIcon /> Chat on WhatsApp</a>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 lg:grid-cols-4">
          {[
            { icon: Wallet, t: "0% interest", d: "Easy Buy installments" },
            { icon: ShieldCheck, t: "Verified plots", d: "Surveyed 50×100ft" },
            { icon: MapPinned, t: "6 zones", d: "Across Azare" },
            { icon: Ruler, t: "Measure tool", d: "Walk your plot by GPS" },
          ].map(({ icon: I, t, d }) => (
            <div key={t} className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary"><I className="size-5" /></span>
              <div><div className="font-display text-sm font-bold">{t}</div><div className="text-xs text-muted-foreground">{d}</div></div>
            </div>
          ))}
        </div>
      </section>

      <FeaturedEstates />

      <section className="bg-secondary/60">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-2">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wider text-gold">The EASY BUY plan</div>
            <h2 className="mt-1 text-3xl font-bold text-primary-deep">Tsarin biyan kudi a hankali ba tare da matsin lamba ba</h2>
            <p className="mt-4 text-muted-foreground">Built for first-time buyers, young builders and investors. Pay a down payment, then spread the balance over 3 to 24 months — with zero interest.</p>
            <ol className="mt-6 space-y-3">
              {["Pick a plot or house with the EASY BUY badge", "Choose your down payment and duration", "Tap Apply — we reply on WhatsApp"].map((s, i) => (
                <li key={s} className="flex items-center gap-3"><span className="grid size-8 place-items-center rounded-full bg-primary font-bold text-primary-foreground">{i + 1}</span>{s}</li>
              ))}
            </ol>
          </div>
          <EasyBuyCalculator />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-primary-deep sm:text-3xl">Latest listings</h2>
          <Link to="/properties" className="text-sm font-semibold text-primary">See all →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((p) => <PropertyCard key={p.id} p={p} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-bold text-primary-deep">Zones in Azare</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((z) => (
            <Link key={z.id} to="/properties" search={{ zone: z.name }} className="rounded-2xl border bg-card p-4 hover:border-primary">
              <div className="font-display font-semibold">{z.name}</div>
              <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{z.description}</div>
              <div className="mt-2 text-xs font-semibold text-primary">{props.filter((p) => p.zone_id === z.id).length} listings</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
