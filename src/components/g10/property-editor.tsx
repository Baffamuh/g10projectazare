import { lazy, Suspense, useEffect, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
const MeasureMap = lazy(() => import("@/components/g10/measure-map"));
import { useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zonesQuery } from "@/lib/data";
import { CATEGORY_LABEL, CONDITION_LABEL, allowedConditions, codePrefix, type Category, type Condition, type Transaction } from "@/lib/codes";

const sel = "h-10 w-full rounded-md border bg-card px-3 text-sm";
type Photo = { id: string; url: string; path: string | null; sort: number };

const EMPTY = {
  title: "", description: "", category: "residential_land" as Category, transaction: "sale" as Transaction,
  condition: "" as Condition | "", price: "", easy_buy: false, unit_no: "", units_available: "1", size_text: "",
  contact_phone: "", zone_id: "", area_id: "", status: "available", published: true, featured: false, lat: "", lng: "",
};

export function PropertyEditor({ id }: { id?: string }) {
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data: zones = [] } = useQuery(zonesQuery());
  const [f, setF] = useState(EMPTY);
  const [code, setCode] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<File[]>([]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("properties").select("*, property_photos(id,url,path,sort)").eq("id", id).single().then(({ data }) => {
      if (!data) return;
      setCode(data.code);
      setPhotos(((data.property_photos ?? []) as Photo[]).sort((a, b) => a.sort - b.sort));
      setF({
        title: data.title, description: data.description ?? "", category: data.category as Category, transaction: data.transaction as Transaction,
        condition: (data.condition ?? "") as Condition | "", price: String(data.price), easy_buy: data.easy_buy, unit_no: data.unit_no ?? "",
        units_available: String(data.units_available), size_text: data.size_text ?? "", contact_phone: data.contact_phone ?? "",
        zone_id: data.zone_id ?? "", area_id: data.area_id ?? "", status: data.status, published: data.published, featured: data.featured,
        lat: data.lat?.toString() ?? "", lng: data.lng?.toString() ?? "",
      });
    });
  }, [id]);

  const isHouse = f.category === "house";
  const areas = zones.find((z) => z.id === f.zone_id)?.areas ?? [];
  const set = (k: keyof typeof EMPTY, v: unknown) => setF((o) => ({ ...o, [k]: v }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title.trim()) { toast.error("Enter a title"); return; }
    if (isHouse && !f.condition) { toast.error("Choose the house condition"); return; }
    setBusy(true);
    try {
      const row = {
        title: f.title.trim(), description: f.description || null, category: f.category, transaction: f.transaction,
        condition: isHouse ? (f.condition as Condition) : null, price: Number(f.price) || 0, easy_buy: f.easy_buy,
        unit_no: f.unit_no || null, units_available: Number(f.units_available) || 0, size_text: f.size_text || null,
        contact_phone: f.contact_phone || null, zone_id: f.zone_id || null, area_id: f.area_id || null, status: f.status,
        published: f.published, featured: f.featured, lat: f.lat ? Number(f.lat) : null, lng: f.lng ? Number(f.lng) : null,
        updated_at: new Date().toISOString(),
      };
      if (id) {
        const { error } = await supabase.from("properties").update(row).eq("id", id);
        if (error) throw error;
        toast.success("Saved");
      } else {
        const prefix = codePrefix(f.category, f.transaction, isHouse ? (f.condition as Condition) : null);
        const { data: newCode, error: ce } = await supabase.rpc("next_property_code", { _prefix: prefix });
        if (ce) throw ce;
        const { data, error } = await supabase.from("properties").insert({ ...row, code: newCode as string }).select("id").single();
        if (error) throw error;
        toast.success(`Created ${newCode}`);
        if (pending.length) await uploadTo(data.id, pending, 0);
        qc.invalidateQueries();
        nav({ to: "/admin/properties/$id", params: { id: data.id } });
        return;
      }
      qc.invalidateQueries();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally { setBusy(false); }
  }

  async function upload(files: FileList | null) {
    if (!files) return;
    if (!id) { setPending((p) => [...p, ...Array.from(files)]); return; }
    setBusy(true);
    await uploadTo(id, Array.from(files), photos.length);
    setBusy(false);
    qc.invalidateQueries();
  }

  async function uploadTo(id: string, files: File[], start: number) {
    let sort = start;
    for (const file of files) {
      const path = `${id}/${crypto.randomUUID()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const { error } = await supabase.storage.from("property-photos").upload(path, file, { contentType: file.type });
      if (error) { toast.error(error.message); continue; }
      const { data: s } = await supabase.storage.from("property-photos").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (!s) continue;
      const { data: ph } = await supabase.from("property_photos").insert({ property_id: id, url: s.signedUrl, path, sort: sort++ }).select("id,url,path,sort").single();
      if (ph) setPhotos((p) => [...p, ph as Photo]);
    }
  }

  async function removePhoto(p: Photo) {
    if (p.path) await supabase.storage.from("property-photos").remove([p.path]);
    await supabase.from("property_photos").delete().eq("id", p.id);
    setPhotos((x) => x.filter((y) => y.id !== p.id));
    qc.invalidateQueries();
  }

  async function del() {
    if (!id || !confirm("Delete this listing permanently?")) return;
    const paths = photos.map((p) => p.path).filter(Boolean) as string[];
    if (paths.length) await supabase.storage.from("property-photos").remove(paths);
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries();
    nav({ to: "/admin/properties" });
  }

  const L = ({ t, children }: { t: string; children: React.ReactNode }) => <label className="block space-y-1 text-sm"><span className="font-medium">{t}</span>{children}</label>;

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary-deep">{id ? "Edit listing" : "New listing"}</h1>
        {code && <span className="rounded-lg bg-secondary px-3 py-1 font-mono text-sm font-semibold">{code}</span>}
      </div>
      <div className="grid gap-4 rounded-2xl border bg-card p-5 md:grid-cols-2">
        <div className="md:col-span-2"><L t="Title"><Input value={f.title} onChange={(e) => set("title", e.target.value)} /></L></div>
        <L t="Category"><select className={sel} disabled={!!id} value={f.category} onChange={(e) => set("category", e.target.value)}>{Object.entries(CATEGORY_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></L>
        <L t="For"><select className={sel} disabled={!!id} value={f.transaction} onChange={(e) => { set("transaction", e.target.value); set("condition", ""); }}><option value="sale">Sale</option><option value="rent">Rent</option></select></L>
        {isHouse && <L t="Condition"><select className={sel} disabled={!!id} value={f.condition} onChange={(e) => set("condition", e.target.value)}><option value="">Choose…</option>{allowedConditions(f.transaction).map((c) => <option key={c} value={c}>{CONDITION_LABEL[c]}</option>)}</select></L>}
        <L t="Price (₦)"><Input inputMode="numeric" value={f.price} onChange={(e) => set("price", e.target.value.replace(/\D/g, ""))} /></L>
        <L t="Zone"><select className={sel} value={f.zone_id} onChange={(e) => { set("zone_id", e.target.value); set("area_id", ""); }}><option value="">—</option>{zones.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}</select></L>
        <L t="Area"><select className={sel} value={f.area_id} onChange={(e) => set("area_id", e.target.value)}><option value="">—</option>{areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></L>
        <L t="Plot / unit no."><Input value={f.unit_no} onChange={(e) => set("unit_no", e.target.value)} /></L>
        <L t="Units available"><Input inputMode="numeric" value={f.units_available} onChange={(e) => set("units_available", e.target.value.replace(/\D/g, ""))} /></L>
        <L t="Size"><Input placeholder="50ft × 100ft" value={f.size_text} onChange={(e) => set("size_text", e.target.value)} /></L>
        <L t="Contact phone (optional)"><Input value={f.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} /></L>
        <L t="Status"><select className={sel} value={f.status} onChange={(e) => set("status", e.target.value)}><option value="available">Available</option><option value="reserved">Reserved</option><option value="sold">Sold</option></select></L>
        <div className="grid grid-cols-2 gap-3"><L t="Latitude"><Input value={f.lat} onChange={(e) => set("lat", e.target.value)} /></L><L t="Longitude"><Input value={f.lng} onChange={(e) => set("lng", e.target.value)} /></L></div>
        <div className="md:col-span-2"><L t="Description"><Textarea rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} /></L></div>
        <div className="flex flex-wrap gap-5 text-sm md:col-span-2">
          {(["easy_buy", "published", "featured"] as const).map((k) => (
            <label key={k} className="flex items-center gap-2"><input type="checkbox" checked={f[k]} onChange={(e) => set(k, e.target.checked)} />{k === "easy_buy" ? "Easy Buy" : k === "published" ? "Show on website" : "Featured"}</label>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between"><h2 className="font-display font-bold">Photos</h2>
          <div className="flex gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium"><Upload className="size-4" /> Upload<input type="file" accept="image/*" multiple hidden onChange={(e) => { upload(e.target.files); e.target.value = ""; }} /></label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium">Take photo<input type="file" accept="image/*" capture="environment" hidden onChange={(e) => { upload(e.target.files); e.target.value = ""; }} /></label>
          </div>
        </div>
        {!id ? (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {pending.map((f, i) => (
              <div key={i} className="relative overflow-hidden rounded-xl border">
                <img src={URL.createObjectURL(f)} alt="" className="aspect-square w-full object-cover" />
                <button type="button" onClick={() => setPending((p) => p.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded-md bg-card/90 p-1 text-destructive" aria-label="Remove photo"><Trash2 className="size-4" /></button>
              </div>
            ))}
            {!pending.length && <p className="col-span-full text-sm text-muted-foreground">No photos yet. They upload when you create the listing.</p>}
          </div>
        ) : (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {photos.map((p) => (
              <div key={p.id} className="relative overflow-hidden rounded-xl border">
                <img src={p.url} alt="" className="aspect-square w-full object-cover" />
                <button type="button" onClick={() => removePhoto(p)} className="absolute right-1 top-1 rounded-md bg-card/90 p-1 text-destructive" aria-label="Remove photo"><Trash2 className="size-4" /></button>
              </div>
            ))}
            {!photos.length && <p className="col-span-full text-sm text-muted-foreground">No photos yet.</p>}
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between"><h2 className="font-display font-bold">Measure this property</h2>
          <Button type="button" variant="outline" size="sm" onClick={() => setShowMap((v) => !v)}>{showMap ? "Hide map" : "Open measure tool"}</Button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Mark the corners on the map or walk them with GPS, then tap "Use this measurement" to fill size and location.</p>
        {showMap && <div className="mt-4"><ClientOnly fallback={<div className="h-[60vh] rounded-2xl bg-muted" />}><Suspense fallback={<div className="h-[60vh] rounded-2xl bg-muted" />}>
          <MeasureMap onUse={(r) => { setF((o) => ({ ...o, size_text: `${Math.round(r.m2).toLocaleString()} m² (${Math.round(r.ft2).toLocaleString()} ft², ${r.plots.toFixed(2)} plots)`, lat: r.lat.toFixed(6), lng: r.lng.toFixed(6) })); toast.success("Size and location filled in"); }} />
        </Suspense></ClientOnly></div>}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button size="lg" disabled={busy}>{busy ? "Saving…" : id ? "Save changes" : "Create listing"}</Button>
        {id && <Button type="button" variant="outline" size="lg" className="text-destructive" onClick={del}>Delete</Button>}
      </div>
    </form>
  );
}
