import { createFileRoute, Link } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useState } from "react";
import { MapPin, Phone, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WatermarkedImage } from "@/components/g10/watermarked-image";
import { EasyBuyCalculator } from "@/components/g10/easy-buy-calculator";
import { EASY_BUY_ENABLED } from "@/lib/easybuy";
import { CopyLinkButton } from "@/components/g10/copy-link-button";
import { InquiryForm } from "@/components/g10/inquiry-form";
import { WhatsAppIcon } from "@/components/g10/whatsapp-icon";
import { unitsLabel } from "@/components/g10/property-card";
import { propertyByCodeQuery } from "@/lib/data";
import { fallbackCover } from "@/lib/images";
import { naira, waLink, COMPANY } from "@/lib/brand";
import { CATEGORY_LABEL, CONDITION_LABEL, type Category, type Condition } from "@/lib/codes";
import { cn } from "@/lib/utils";

const LocationMap = lazy(() => import("@/components/g10/location-map"));

export const Route = createFileRoute("/properties/$code")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.code} — G10 City Project, Azare` },
      { name: "description", content: `Property ${params.code} from G10 City Project Nigeria Limited, Azare.` },
      { property: "og:title", content: `${params.code} — G10 City Project` },
      { property: "og:description", content: "View price, photos, location." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { code } = Route.useParams();
  const { data: p, isLoading } = useQuery(propertyByCodeQuery(code));
  const [idx, setIdx] = useState(0);

  if (isLoading) return <div className="mx-auto max-w-7xl px-4 py-16 text-muted-foreground">Loading…</div>;
  if (!p) return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Property not found</h1>
      <p className="mt-2 text-muted-foreground">Reference {code} does not exist or is no longer listed.</p>
      <Button asChild className="mt-6"><Link to="/properties">Browse properties</Link></Button>
    </div>
  );

  const photos = [...p.property_photos].sort((a, b) => a.sort - b.sort).map((x) => x.url);
  if (photos.length === 0) photos.push(fallbackCover(p.cover_key, p.category));
  const phone = p.contact_phone || COMPANY.phoneLocal;
  const msg = `Hello G10 City Project, I'm interested in ${p.code} — ${p.title} (${naira(p.price)}).`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <Link to="/properties" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> All properties</Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0">
          <WatermarkedImage src={photos[idx] ?? photos[0] ?? ""} alt={p.title} eager className="aspect-[4/3] rounded-2xl" />
          {photos.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {photos.map((u, i) => (
                <button key={u} onClick={() => setIdx(i)} className={cn("h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2", i === idx ? "border-primary" : "border-transparent")}>
                  <img src={u} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">For {p.transaction === "sale" ? "Sale" : "Rent"}</span>
            {EASY_BUY_ENABLED && p.easy_buy && <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-gold-foreground">EASY BUY</span>}
            <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-gold-foreground">{unitsLabel(p)}</span>
            {p.status !== "available" && <span className="rounded-full bg-destructive px-3 py-1 text-xs font-semibold capitalize text-destructive-foreground">{p.status}</span>}
          </div>
          <div className="mt-3 text-xs font-semibold tracking-wider text-muted-foreground">REF: {p.code}</div>
          <h1 className="mt-1 text-2xl font-bold text-primary-deep sm:text-3xl">{p.title}</h1>
          <p className="mt-1 flex items-center gap-1 text-muted-foreground"><MapPin className="size-4" /> {[p.areas?.name, p.zones?.name, "Azare"].filter(Boolean).join(", ")}</p>
          <div className="mt-3 font-display text-3xl font-bold text-primary">{naira(p.price)}{p.transaction === "rent" && <span className="text-base font-medium text-muted-foreground"> / year</span>}</div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="whatsapp"><a href={waLink(msg, phone)} target="_blank" rel="noreferrer"><WhatsAppIcon /> WhatsApp</a></Button>
            <Button asChild variant="outline"><a href={`tel:${phone}`}><Phone /> Call {phone}</a></Button>
            <CopyLinkButton code={p.code} size="default" />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ["Category", CATEGORY_LABEL[p.category as Category]],
              ["Condition", p.condition ? CONDITION_LABEL[p.condition as Condition] : "—"],
              ["Plot / Unit No.", p.unit_no ?? "—"],
              ["Size", p.size_text ?? "50ft × 100ft standard"],
              ["Available", String(p.units_available)],
              ["Zone", p.zones?.name ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-secondary p-3"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="mt-0.5 text-sm font-semibold">{v}</dd></div>
            ))}
          </dl>
          {p.description && <p className="mt-6 whitespace-pre-line leading-relaxed">{p.description}</p>}

          {p.lat != null && p.lng != null && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-bold">Location</h2>
              <ClientOnly fallback={<div className="h-64 rounded-2xl bg-muted" />}>
                <Suspense fallback={<div className="h-64 rounded-2xl bg-muted" />}>
                  <LocationMap lat={p.lat} lng={p.lng} label={p.title} />
                </Suspense>
              </ClientOnly>
            </div>
          )}
        </div>
        <aside className="space-y-5">
          {!EASY_BUY_ENABLED ? null : p.easy_buy ? <EasyBuyCalculator price={Number(p.price)} code={p.code} title={p.title} phone={phone} /> : (
            <div className="rounded-2xl border bg-gold-soft p-5 text-sm"><b>Easy Buy</b> is not available on this listing. Ask us about other Easy Buy plots.</div>
          )}
          <InquiryForm propertyId={p.id} propertyCode={p.code} />
        </aside>
      </div>
    </div>
  );
}
