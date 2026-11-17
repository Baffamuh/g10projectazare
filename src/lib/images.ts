import houseImg from "@/assets/house-sample.jpg";
import landImg from "@/assets/land-sample.jpg";
import brochure from "@/assets/fatara-brochure.jpg.asset.json";
import logo from "@/assets/g10-logo.jpg.asset.json";

export const LOGO_URL = logo.url;
export const BROCHURE_URL = brochure.url;
export const HOUSE_IMG = houseImg;
export const LAND_IMG = landImg;

export function fallbackCover(coverKey: string | null | undefined, category: string): string {
  if (coverKey === "brochure") return BROCHURE_URL;
  if (coverKey === "house") return HOUSE_IMG;
  if (coverKey === "land") return LAND_IMG;
  return category === "house" || category === "shop" ? HOUSE_IMG : LAND_IMG;
}
