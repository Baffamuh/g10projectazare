export type Category = "house" | "residential_land" | "commercial_land" | "farm" | "shop";
export type Transaction = "sale" | "rent";
export type Condition = "completed" | "semi_completed" | "incomplete";

export const CATEGORY_LABEL: Record<Category, string> = {
  house: "House",
  residential_land: "Residential Land",
  commercial_land: "Commercial Land",
  farm: "Farm / Agricultural",
  shop: "Shop / Commercial Unit",
};
export const CONDITION_LABEL: Record<Condition, string> = {
  completed: "Completed",
  semi_completed: "Semi-completed",
  incomplete: "Incomplete",
};

export function allowedConditions(tx: Transaction): Condition[] {
  return tx === "sale" ? ["completed", "semi_completed", "incomplete"] : ["completed", "semi_completed"];
}

const CAT_CODE: Record<Exclude<Category, "house">, string> = {
  residential_land: "RL",
  commercial_land: "CL",
  farm: "FM",
  shop: "SH",
};
const COND_CODE: Record<Condition, string> = { completed: "HC", semi_completed: "HS", incomplete: "HI" };

/** e.g. G10-S-HC, G10-R-RL */
export function codePrefix(category: Category, tx: Transaction, condition?: Condition | null): string {
  const t = tx === "sale" ? "S" : "R";
  if (category === "house") {
    const c = condition ?? "completed";
    if (tx === "rent" && c === "incomplete") throw new Error("Incomplete houses cannot be listed for rent");
    return `G10-${t}-${COND_CODE[c]}`;
  }
  return `G10-${t}-${CAT_CODE[category]}`;
}

export function formatCode(prefix: string, n: number): string {
  return `${prefix}-${String(n).padStart(3, "0")}`;
}

/** Short link slug: G10-S-RL-001 -> S-RL-001 */
export function shortSlug(code: string): string {
  return code.replace(/^G10-/i, "");
}
/** Accepts S-RL-001 or G10-S-RL-001 */
export function codeFromSlug(slug: string): string {
  const s = slug.toUpperCase();
  return s.startsWith("G10-") ? s : `G10-${s}`;
}
