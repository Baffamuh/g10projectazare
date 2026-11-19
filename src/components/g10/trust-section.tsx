import { Link } from "@tanstack/react-router";
import { Download, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BROCHURE_URL } from "@/lib/images";

const STATS = [
  { n: "500+", t: "Plots allocated" },
  { n: "6", t: "Zones in Azare" },
  { n: "6", t: "Zones in Azare" },
  { n: "24", t: "Months max. to pay" },
];
const TESTIMONIALS = [
  { name: "Aminu B.", role: "Teacher, Azare", text: "I paid for my Chara-Chara plot monthly without stress. The team showed me the beacons themselves." },
  { name: "Hauwa M.", role: "Trader", text: "My shop plot at Fatara is right by the proposed shopping complex. Everything was clear from day one." },
  { name: "Ibrahim S.", role: "Civil servant", text: "Honest people. I got my receipt the same day and my papers followed as promised." },
];

export function TrustStats() {
  return (
    <section className="bg-primary-deep text-primary-foreground">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 text-center lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.t}><div className="font-display text-4xl font-extrabold text-gold">{s.n}</div><div className="mt-1 text-sm text-primary-foreground/80">{s.t}</div></div>
        ))}
      </div>
    </section>
  );
}

export function TestimonialsAndCta() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="text-sm font-semibold uppercase tracking-wider text-gold">Testimonials</div>
        <h2 className="mt-1 text-2xl font-bold text-primary-deep sm:text-3xl">What our buyers say</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="rounded-2xl border bg-card p-5">
              <Quote className="size-6 text-gold" />
              <blockquote className="mt-2 text-sm">{t.text}</blockquote>
              <figcaption className="mt-3 text-sm font-semibold">{t.name} <span className="font-normal text-muted-foreground">· {t.role}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="bg-secondary/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-deep">Seize the moment.</h2>
            <p className="text-muted-foreground">Visit the estate or take the Fatara Phase 3 brochure home.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/book-inspection">Book site inspection</Link></Button>
            <Button asChild size="lg" variant="outline"><a href={BROCHURE_URL} download="G10-Fatara-Phase-3-Brochure.jpg" target="_blank" rel="noreferrer"><Download /> Download brochure</a></Button>
          </div>
        </div>
      </section>
    </>
  );
}
