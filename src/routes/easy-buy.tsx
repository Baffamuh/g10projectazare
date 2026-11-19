import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { EASY_BUY_ENABLED } from "@/lib/easybuy";
import { EasyBuyCalculator } from "@/components/g10/easy-buy-calculator";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/easy-buy")({
  beforeLoad: () => { if (!EASY_BUY_ENABLED) throw redirect({ to: "/properties" }); },
  head: () => ({
    meta: [
      { title: "EASY BUY Installment Plan — G10 City Project Azare" },
      { name: "description", content: "Zero-interest installment plan for plots and houses in Azare. Pay over 3, 6, 12 or 24 months." },
      { property: "og:title", content: "G10 EASY BUY — pay small-small, no interest" },
      { property: "og:description", content: "Calculate your monthly payment and apply on WhatsApp." },
    ],
  }),
  component: () => (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2">
      <div>
        <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">EASY BUY</span>
        <h1 className="mt-4 text-4xl font-extrabold text-primary-deep">Pay small-small. Own it for life.</h1>
        <p className="mt-4 text-lg text-muted-foreground">Tsarin biyan kudi a hankali ba tare da matsin lamba ba — a flexible installment plan for first-time buyers, young builders and investors.</p>
        <ul className="mt-6 space-y-3">
          {["Zero interest — you pay exactly the listed price", "Down payment from 20%", "Durations of 3, 6, 12 or 24 months", "Allocation on completion of payment"].map((t) => (
            <li key={t} className="rounded-xl border bg-card p-3 font-medium">{t}</li>
          ))}
        </ul>
        <Button asChild size="lg" className="mt-6"><Link to="/properties" search={{ easy: true }}>See Easy Buy properties</Link></Button>
      </div>
      <EasyBuyCalculator />
    </div>
  ),
});
