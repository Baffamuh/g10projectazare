import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { propertiesQuery, zonesQuery } from "@/lib/data";
import { CATEGORY_LABEL, type Category } from "@/lib/codes";
import { naira } from "@/lib/brand";
import { CopyLinkButton } from "@/components/g10/copy-link-button";

export const Route = createFileRoute("/admin/properties/")({ component: AdminProps });

const sel = "h-9 rounded-lg border bg-card px-2 text-sm";

function AdminProps() {
  const { data: props = [] } = useQuery(propertiesQuery());
  const { data: zones = [] } = useQuery(zonesQuery());
  const [f, setF] = useState({ q: "", zone: "", cat: "", status: "" });
  const list = useMemo(() => props.filter((p) =>
    (!f.zone || p.zone_id === f.zone) && (!f.cat || p.category === f.cat) && (!f.status || p.status === f.status) &&
    (!f.q || (p.code + p.title + (p.unit_no ?? "")).toLowerCase().includes(f.q.toLowerCase()))), [props, f]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary-deep">Properties</h1>
        <Button asChild><Link to="/admin/properties/$id" params={{ id: "new" }}><Plus /> New listing</Link></Button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <Input className="col-span-2 h-9 sm:w-56" placeholder="Search code, title, plot…" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} />
        <select className={sel} value={f.zone} onChange={(e) => setF({ ...f, zone: e.target.value })}><option value="">All zones</option>{zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}</select>
        <select className={sel} value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}><option value="">All categories</option>{Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select className={sel} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}><option value="">Any status</option><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option></select>
      </div>

      <div className="mt-4 space-y-3 md:hidden">
        {list.map((p) => (
          <Link key={p.id} to="/admin/properties/$id" params={{ id: p.id }} className="block rounded-2xl border bg-card p-4">
            <div className="flex justify-between gap-2 text-xs"><span className="font-semibold text-muted-foreground">{p.code}</span><span className="capitalize">{p.status}</span></div>
            <div className="mt-1 font-semibold">{p.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{p.zones?.name} · {p.unit_no} · {p.units_available} avail.</div>
            <div className="mt-2 font-display font-bold text-primary">{naira(p.price)}</div>
          </Link>
        ))}
      </div>

      <div className="mt-4 hidden overflow-x-auto rounded-2xl border bg-card md:block">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Code</th><th className="p-3">Title</th><th className="p-3">Zone</th><th className="p-3">Category</th><th className="p-3">Unit</th><th className="p-3">Avail.</th><th className="p-3">Price</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-mono text-xs">{p.code}</td>
                <td className="p-3"><Link to="/admin/properties/$id" params={{ id: p.id }} className="font-medium hover:text-primary">{p.title}</Link>{p.easy_buy && <span className="ml-2 rounded bg-gold px-1.5 text-[10px] font-bold text-gold-foreground">EASY BUY</span>}{!p.published && <span className="ml-2 text-[10px] text-muted-foreground">(hidden)</span>}</td>
                <td className="p-3 text-xs">{p.zones?.name}</td>
                <td className="p-3 text-xs">{CATEGORY_LABEL[p.category as Category]}</td>
                <td className="p-3 text-xs">{p.unit_no}</td>
                <td className="p-3">{p.units_available}</td>
                <td className="p-3 font-semibold">{naira(p.price)}</td>
                <td className="p-3 capitalize">{p.status}</td>
                <td className="p-3"><CopyLinkButton code={p.code} label="Link" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
