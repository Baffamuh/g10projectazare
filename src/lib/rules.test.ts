import { describe, it, expect } from "vitest";
import { codePrefix, formatCode, shortSlug, codeFromSlug } from "./codes";
import { easyBuyPlan } from "./easybuy";
import { areaSummary, PLOT_SQFT } from "./geo";
import { toWhatsAppNumber, naira } from "./brand";

describe("reference codes", () => {
  it("house for sale completed", () => expect(formatCode(codePrefix("house", "sale", "completed"), 1)).toBe("G10-S-HC-001"));
  it("house for sale semi", () => expect(codePrefix("house", "sale", "semi_completed")).toBe("G10-S-HS"));
  it("house for sale incomplete", () => expect(codePrefix("house", "sale", "incomplete")).toBe("G10-S-HI"));
  it("house for rent semi", () => expect(codePrefix("house", "rent", "semi_completed")).toBe("G10-R-HS"));
  it("no incomplete house for rent", () => expect(() => codePrefix("house", "rent", "incomplete")).toThrow());
  it("land/farm/shop", () => {
    expect(codePrefix("residential_land", "rent")).toBe("G10-R-RL");
    expect(codePrefix("commercial_land", "sale")).toBe("G10-S-CL");
    expect(codePrefix("farm", "sale")).toBe("G10-S-FM");
    expect(codePrefix("shop", "rent")).toBe("G10-R-SH");
  });
  it("short link", () => {
    expect(shortSlug("G10-S-RL-001")).toBe("S-RL-001");
    expect(codeFromSlug("s-rl-001")).toBe("G10-S-RL-001");
  });
});

describe("easy buy", () => {
  it("30% down over 12 months, no interest", () => {
    const p = easyBuyPlan(2_500_000, 30, 12);
    expect(p.down).toBe(750_000);
    expect(p.monthly).toBe(145_834);
    expect(p.interest).toBe(0);
  });
});

describe("area", () => {
  it("one 50x100ft plot is ~1 plot", () => {
    const ftToDegLat = 1 / (3.28084 * 111320);
    const lat = 11.6765, lng = 10.1948;
    const dLng = ftToDegLat / Math.cos((lat * Math.PI) / 180);
    const pts = [
      { lat, lng },
      { lat, lng: lng + 50 * dLng },
      { lat: lat + 100 * ftToDegLat, lng: lng + 50 * dLng },
      { lat: lat + 100 * ftToDegLat, lng },
    ];
    const s = areaSummary(pts);
    expect(Math.abs(s.ft2 - PLOT_SQFT) / PLOT_SQFT).toBeLessThan(0.01);
  });
});

describe("brand", () => {
  it("whatsapp number", () => {
    expect(toWhatsAppNumber("08038757441")).toBe("2348038757441");
    expect(toWhatsAppNumber(null)).toBe("2348038757441");
  });
  it("naira", () => expect(naira(2500000)).toBe("₦2,500,000"));
});
