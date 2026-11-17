export type LatLng = { lat: number; lng: number };
export const M_TO_FT = 3.28084;
export const SQM_TO_SQFT = 10.7639;
export const PLOT_SQFT = 5000; // 50ft x 100ft
export const AZARE: LatLng = { lat: 11.6765, lng: 10.1948 };

const R = 6378137;
const rad = (d: number) => (d * Math.PI) / 180;

export function distanceM(a: LatLng, b: LatLng): number {
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Geodesic polygon area in m² (spherical approximation). */
export function polygonAreaM2(pts: LatLng[]): number {
  if (pts.length < 3) return 0;
  let total = 0;
  for (let i = 0; i < pts.length; i++) {
    const p1 = pts[i];
    const p2 = pts[(i + 1) % pts.length];
    total += rad(p2.lng - p1.lng) * (2 + Math.sin(rad(p1.lat)) + Math.sin(rad(p2.lat)));
  }
  return Math.abs((total * R * R) / 2);
}

export function areaSummary(pts: LatLng[]) {
  const m2 = polygonAreaM2(pts);
  const ft2 = m2 * SQM_TO_SQFT;
  return { m2, ft2, plots: ft2 / PLOT_SQFT };
}
