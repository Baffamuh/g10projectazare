import houseImg from "@/assets/house-sample.jpg";
import landImg from "@/assets/land-sample.jpg";
import brochureImg from "@/assets/fatara-brochure.jpg";
import logoImg from "@/assets/g10-logo.jpg";

export const LOGO_URL = logoImg;
export const BROCHURE_URL = brochureImg;
export const HOUSE_IMG = houseImg;
export const LAND_IMG = landImg;

export function fallbackCover(coverKey: string | null | undefined, category: string): string {
  if (coverKey === "brochure") return BROCHURE_URL;
  if (coverKey === "house") return HOUSE_IMG;
  if (coverKey === "land") return LAND_IMG;
  return category === "house" || category === "shop" ? HOUSE_IMG : LAND_IMG;
}
