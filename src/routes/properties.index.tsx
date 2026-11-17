import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { PropertyCard } from "@/components/g10/property-card";
import { propertiesQuery, zonesQuery } from "@/lib/data";
import { CATEGORY_LABEL, CONDITION_LABEL } from "@/lib/codes";
import { cn } from "@/lib/utils";

type Search = { tx?: "sale" | "rent"; cat?: string; cond?: string; zone?: string; easy?: boolean };

export const Route = createFileRoute("/properties/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    tx: s.tx === "sale" || s.tx === "rent" ? s.tx : undefined,
    cat: typeof s.cat === "string" ? s.cat : undefined,
    cond: typeof s.cond === "string" ? s.cond : undefined,
    zone: typeof s.zone === "string" ? s.zone : undefined,
    easy: s.easy === true || s.easy === "true" ? true : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Properties for Sale & Rent in Azare — G10 City Project" },
      { name: "description", content: "Browse houses, residential and commercial plots, farms and shops in Azare, Bauchi State." },
      { property: "og:title", content: "Properties in Azare — G10 City Project" },
      { property: "og:description", content: "Houses, plots, farms and shops for sale and rent. EASY BUY available." },
    ],
  }),
  component: PropertiesPage,
});

const selectCls = "h-10 rounded-lg border bg-card px-3 text-sm";

function PropertiesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/properties/" });
  const { data: props = [], isLoading } = useQuery(propertiesQuery());
  const { data: zones = [] } = useQuery(zonesQuery());
  const set = (patch: Partial<Search>) => navigate({ search: (s) => ({ ...s, ...patch }) });

  const list = useMemo(() => props.filter((p) =>
    (!search.tx || p.transaction === search.tx) &&
    (!search.cat || p.category === search.cat) &&
    (!search.cond || p.condition === search.cond) &&
    (!search.zone || p.zones?.name === search.zone) &&
    (!search.easy || p.easy_buy)), [props, search]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-primary-deep">Properties</h1>
      <div className="mt-4 inline-flex rounded-xl border bg-card p-1">
        {([undefined, "sale", "rent"] as const).map((t) => (
          <button key={t ?? "all"} onClick={() => set({ tx: t })} className={cn("rounded-lg px-4 py-2 text-sm font-semibold", search.tx === t ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>
            {t === "sale" ? "For Sale" : t === "rent" ? "For Rent" : "All"}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <select className={selectCls} value={search.cat ?? ""} onChange={(e) => set({ cat: e.target.value || undefined })}>
          <option value="">All categories</option>
          {Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className={selectCls} value={search.cond ?? ""} onChange={(e) => set({ cond: e.target.value || undefined })}>
          <option value="">Any condition</option>
          {Object.entries(CONDITION_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className={cn(selectCls, "col-span-2")} value={search.zone ?? ""} onChange={(e) => set({ zone: e.target.value || undefined })}>
          <option value="">All zones</option>
          {zones.map((z) => <option key={z.id} value={z.name}>{z.name}</option>)}
        </select>
        <label className="col-span-2 flex h-10 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium">
          <input type="checkbox" checked={!!search.easy} onChange={(e) => set({ easy: e.target.checked || undefined })} /> Easy Buy only
        </label>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{isLoading ? "Loading…" : `${list.length} properties`}</p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => <PropertyCard key={p.id} p={p} />)}
      </div>
      {!isLoading && list.length === 0 && <div className="mt-6 rounded-2xl border border-dashed p-10 text-center text-muted-foreground">No properties match these filters.</div>}
    </div>
  );
}
