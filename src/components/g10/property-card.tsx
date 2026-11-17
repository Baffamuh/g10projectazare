import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { WatermarkedImage } from "./watermarked-image";
import { CopyLinkButton } from "./copy-link-button";
import { naira } from "@/lib/brand";
import { CATEGORY_LABEL, CONDITION_LABEL, type Category, type Condition } from "@/lib/codes";
import { coverOf, type Property } from "@/lib/data";
import { fallbackCover } from "@/lib/images";

export function unitsLabel(p: Property) {
  const word = p.category === "house" ? "house" : p.category === "shop" ? "unit" : p.category === "farm" ? "farm" : "plot";
  return `${p.units_available} ${word}${p.units_available === 1 ? "" : "s"} available`;
}

export function PropertyCard({ p }: { p: Property }) {
  const img = coverOf(p) ?? fallbackCover(p.cover_key, p.category);
  return (
    <Link to="/properties/$code" params={{ code: p.code }} className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition hover:-translate-y-0.5">
      <div className="relative">
        <WatermarkedImage src={img} alt={p.title} className="aspect-[4/3]" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground">For {p.transaction === "sale" ? "Sale" : "Rent"}</span>
          {p.easy_buy && <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-gold-foreground">EASY BUY</span>}
          {p.status !== "available" && <span className="rounded-full bg-destructive px-2.5 py-1 text-[11px] font-semibold text-destructive-foreground capitalize">{p.status}</span>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="text-[11px] font-semibold tracking-wider text-muted-foreground">{p.code}</div>
        <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold group-hover:text-primary">{p.title}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" /> <span className="truncate">{p.zones?.name ?? "Azare"}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
          <span className="rounded bg-secondary px-2 py-0.5 text-secondary-foreground">{CATEGORY_LABEL[p.category as Category]}</span>
          {p.condition && <span className="rounded bg-secondary px-2 py-0.5 text-secondary-foreground">{CONDITION_LABEL[p.condition as Condition]}</span>}
          {p.unit_no && <span className="rounded bg-secondary px-2 py-0.5 text-secondary-foreground">{p.unit_no}</span>}
          <span className="rounded bg-gold-soft px-2 py-0.5 font-semibold text-gold-foreground">{unitsLabel(p)}</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <div className="font-display text-lg font-bold text-primary-deep">{naira(p.price)}{p.transaction === "rent" && <span className="text-xs font-medium text-muted-foreground"> /yr</span>}</div>
          <CopyLinkButton code={p.code} label="Link" />
        </div>
      </div>
    </Link>
  );
}
