import { useEffect, useRef } from "react";

export default function LocationMap({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !ref.current) return;
      map = L.map(ref.current, { scrollWheelZoom: false }).setView([lat, lng], 15);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors", maxZoom: 19 }).addTo(map);
      L.circleMarker([lat, lng], { radius: 10, color: "#0D472B", fillColor: "#C9A227", fillOpacity: 0.9, weight: 3 }).addTo(map).bindPopup(label);
    });
    return () => { cancelled = true; map?.remove(); };
  }, [lat, lng, label]);
  return <div ref={ref} className="h-64 w-full overflow-hidden rounded-2xl border" />;
}
