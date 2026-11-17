import { useEffect, useRef, useState } from "react";
import type * as LT from "leaflet";
import { Button } from "@/components/ui/button";
import { AZARE, areaSummary, distanceM, M_TO_FT, type LatLng } from "@/lib/geo";
import { MapPin, Undo2, Trash2, Play, Pause, Flag, Crosshair } from "lucide-react";
import { toast } from "sonner";

type WalkState = "idle" | "walking" | "paused" | "done";
const fmt = (n: number, d = 1) => n.toLocaleString("en-NG", { maximumFractionDigits: d, minimumFractionDigits: d });

export default function MeasureMap() {
  const el = useRef<HTMLDivElement>(null);
  const L = useRef<typeof LT | null>(null);
  const map = useRef<LT.Map | null>(null);
  const layers = useRef<{ street?: LT.TileLayer; sat?: LT.TileLayer; group?: LT.LayerGroup; me?: LT.CircleMarker }>({});
  const [pts, setPts] = useState<LatLng[]>([]);
  const [base, setBase] = useState<"street" | "sat">("street");
  const [walk, setWalk] = useState<WalkState>("idle");
  const [pos, setPos] = useState<{ lat: number; lng: number; acc: number } | null>(null);
  const watchId = useRef<number | null>(null);
  const walkRef = useRef<WalkState>("idle");
  walkRef.current = walk;

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((Lmod) => {
      if (cancelled || !el.current) return;
      L.current = Lmod;
      const m = Lmod.map(el.current, { scrollWheelZoom: false, zoomControl: true }).setView([AZARE.lat, AZARE.lng], 16);
      layers.current.street = Lmod.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors", maxZoom: 19 }).addTo(m);
      layers.current.sat = Lmod.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Imagery © Esri", maxZoom: 19 });
      layers.current.group = Lmod.layerGroup().addTo(m);
      m.on("click", (e: LT.LeafletMouseEvent) => {
        if (walkRef.current === "walking") return;
        setPts((p) => [...p, { lat: e.latlng.lat, lng: e.latlng.lng }]);
      });
      map.current = m;
    });
    return () => { cancelled = true; map.current?.remove(); map.current = null; if (watchId.current != null) navigator.geolocation.clearWatch(watchId.current); };
  }, []);

  useEffect(() => {
    const m = map.current; const { street, sat } = layers.current;
    if (!m || !street || !sat) return;
    if (base === "sat") { m.removeLayer(street); sat.addTo(m); } else { m.removeLayer(sat); street.addTo(m); }
  }, [base]);

  useEffect(() => {
    const Lm = L.current; const g = layers.current.group;
    if (!Lm || !g) return;
    g.clearLayers();
    const ll = pts.map((p) => [p.lat, p.lng] as [number, number]);
    if (pts.length >= 3) Lm.polygon(ll, { color: "#0D472B", weight: 3, fillColor: "#C9A227", fillOpacity: 0.25 }).addTo(g);
    else if (pts.length === 2) Lm.polyline(ll, { color: "#0D472B", weight: 3 }).addTo(g);
    const n = pts.length;
    const edges = n >= 3 ? n : n - 1;
    for (let i = 0; i < edges; i++) {
      const a = pts[i], b = pts[(i + 1) % n];
      const d = distanceM(a, b);
      Lm.marker([(a.lat + b.lat) / 2, (a.lng + b.lng) / 2], {
        interactive: false,
        icon: Lm.divIcon({ className: "", html: `<div style="background:#fff;border:1px solid #0D472B;color:#0D472B;border-radius:6px;padding:1px 5px;font:600 11px Manrope,sans-serif;white-space:nowrap;transform:translate(-50%,-50%);display:inline-block">${fmt(d * M_TO_FT)} ft · ${fmt(d)} m</div>`, iconSize: [0, 0] }),
      }).addTo(g);
    }
    pts.forEach((p, i) => {
      const mk = Lm.marker([p.lat, p.lng], {
        draggable: walkRef.current !== "walking",
        icon: Lm.divIcon({ className: "", html: `<div style="width:26px;height:26px;border-radius:50%;background:#0D472B;color:#fff;border:2px solid #C9A227;display:grid;place-items:center;font:700 12px Sora,sans-serif;transform:translate(-50%,-50%)">${i + 1}</div>`, iconSize: [0, 0] }),
      }).addTo(g);
      mk.on("dragend", () => { const q = mk.getLatLng(); setPts((arr) => arr.map((x, j) => (j === i ? { lat: q.lat, lng: q.lng } : x))); });
    });
  }, [pts]);

  useEffect(() => {
    const Lm = L.current; const m = map.current;
    if (!Lm || !m) return;
    if (!pos) { layers.current.me?.remove(); layers.current.me = undefined; return; }
    if (!layers.current.me) layers.current.me = Lm.circleMarker([pos.lat, pos.lng], { radius: 8, color: "#fff", weight: 3, fillColor: "#2563eb", fillOpacity: 1 }).addTo(m);
    else layers.current.me.setLatLng([pos.lat, pos.lng]);
  }, [pos]);

  function startWalk() {
    if (!("geolocation" in navigator)) return toast.error("GPS is not available on this device");
    setWalk("walking");
    if (watchId.current != null) return;
    let first = true;
    watchId.current = navigator.geolocation.watchPosition(
      (g) => {
        const p = { lat: g.coords.latitude, lng: g.coords.longitude, acc: g.coords.accuracy };
        setPos(p);
        if (first) { map.current?.setView([p.lat, p.lng], 19); first = false; }
      },
      (err) => { toast.error("GPS error: " + err.message); },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 },
    );
  }
  function stopWatch() { if (watchId.current != null) navigator.geolocation.clearWatch(watchId.current); watchId.current = null; }
  function markCorner() {
    if (!pos) return toast.error("Waiting for GPS signal…");
    setPts((p) => [...p, { lat: pos.lat, lng: pos.lng }]);
    toast.success(`Corner ${pts.length + 1} recorded (±${Math.round(pos.acc)} m)`);
  }

  const s = areaSummary(pts);
  const perimeter = pts.length >= 2 ? pts.reduce((sum, p, i) => (i === pts.length - 1 && pts.length < 3 ? sum : sum + distanceM(p, pts[(i + 1) % pts.length])), 0) : 0;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-lg border bg-card p-1">
            {(["street", "sat"] as const).map((b) => (
              <button key={b} onClick={() => setBase(b)} className={`rounded-md px-3 py-1.5 text-sm font-semibold ${base === b ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{b === "street" ? "Street" : "Satellite"}</button>
            ))}
          </div>
          <Button size="sm" variant="outline" onClick={() => setPts((p) => p.slice(0, -1))} disabled={!pts.length}><Undo2 /> Undo</Button>
          <Button size="sm" variant="outline" onClick={() => setPts([])} disabled={!pts.length}><Trash2 /> Clear</Button>
        </div>
        <div ref={el} className="h-[60vh] min-h-[380px] w-full overflow-hidden rounded-2xl border" />
        <p className="mt-2 text-xs text-muted-foreground">Tap the map to drop numbered corner pins. Drag pins to adjust.</p>
      </div>
      <aside className="space-y-4">
        <div className="rounded-2xl border bg-card p-5 shadow-card">
          <h3 className="font-display font-bold text-primary-deep">Area</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Stat label="Square metres" value={`${fmt(s.m2)} m²`} />
            <Stat label="Square feet" value={`${fmt(s.ft2, 0)} ft²`} />
            <Stat label="50×100ft plots" value={fmt(s.plots, 2)} highlight />
            <Stat label="Perimeter" value={`${fmt(perimeter)} m`} />
          </div>
          <div className="mt-3 text-xs text-muted-foreground">{pts.length} corner{pts.length === 1 ? "" : "s"}{pts.length < 3 && " · add at least 3"}</div>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="flex items-center gap-2 font-display font-bold text-primary-deep"><MapPin className="size-4" /> GPS Walk Mode</h3>
          <p className="mt-1 text-sm text-muted-foreground">Walk to each corner of the plot and tap “Mark corner”.</p>
          {pos && <p className="mt-2 text-xs">GPS accuracy: ±{Math.round(pos.acc)} m</p>}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {walk === "idle" || walk === "done" ? (
              <Button className="col-span-2" onClick={() => { if (walk === "done") setPts([]); startWalk(); }}><Play /> Start</Button>
            ) : walk === "walking" ? (
              <>
                <Button variant="gold" className="col-span-2" onClick={markCorner}><Crosshair /> Mark corner</Button>
                <Button variant="outline" onClick={() => setWalk("paused")}><Pause /> Pause</Button>
                <Button onClick={() => { stopWatch(); setPos(null); setWalk("done"); }}><Flag /> Finish</Button>
              </>
            ) : (
              <>
                <Button onClick={() => setWalk("walking")}><Play /> Resume</Button>
                <Button variant="outline" onClick={() => { stopWatch(); setPos(null); setWalk("done"); }}><Flag /> Finish</Button>
              </>
            )}
          </div>
          {walk === "done" && pts.length >= 3 && <p className="mt-3 text-sm font-medium text-primary">Walk finished — boundary closed.</p>}
        </div>
        <div className="rounded-2xl border border-gold bg-gold-soft p-4 text-sm font-medium text-gold-foreground">
          Estimated Map Boundary Calculation — For indicative planning only. Not a certified cadastral survey.
        </div>
      </aside>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ${highlight ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
      <div className={`text-[11px] ${highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{label}</div>
      <div className="font-display text-base font-bold">{value}</div>
    </div>
  );
}
