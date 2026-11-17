import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "@/components/g10/logo";
import { COMPANY } from "@/lib/brand";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About G10 City Project Nigeria Limited — Azare" },
      { name: "description", content: "Real estate developer in Azare, Katagum LGA, Bauchi State: land, property, general contracts and land consultation." },
      { property: "og:title", content: "About G10 City Project Nigeria Limited" },
      { property: "og:description", content: "Building Tomorrow, Creating Value." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <Logo className="h-28 w-28" />
      <h1 className="mt-6 text-3xl font-bold text-primary-deep">{COMPANY.name}</h1>
      <p className="mt-1 italic text-gold">“{COMPANY.motto}”</p>
      <div className="mt-6 space-y-4 leading-relaxed text-foreground/85">
        <p>G10 City Project Nigeria Limited is a real estate, land and property company based in {COMPANY.address}. We provide general contracts, land & property sales, real estate development and land consultation.</p>
        <p>Our developments include Fatara Phase 3 Estate — with a proposed clinic, school, mosque, shopping complex and sports arena — and Chara-Chara G.R.A Azare Phase 2.</p>
        <p>Through our EASY BUY plan, first-time buyers, young builders and investors can own land and homes by paying gradually, with zero interest and no pressure.</p>
      </div>
    </div>
  ),
});
