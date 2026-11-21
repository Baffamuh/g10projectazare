import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { generateResponse, GatewayError } from "@lovable.dev/ai-gateway";

type Input = { budget: number; zone: string; needs: string };

export const recommendProperties = createServerFn({ method: "POST" })
  .inputValidator((d: Input) => ({
    budget: Math.max(0, Number(d.budget) || 0),
    zone: String(d.zone ?? "").slice(0, 80),
    needs: String(d.needs ?? "").slice(0, 600),
  }))
  .handler(async ({ data }) => {
    const sb = createClient(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, { auth: { persistSession: false } });
    const { data: rows, error } = await sb
      .from("properties")
      .select("code, title, category, transaction, condition, price, size_text, units_available, zones(name), areas(name)")
      .eq("status", "available")
      .limit(80);
    if (error) return { picks: [], error: "Could not load listings" };
    const list = (rows ?? []).map((r: any) => ({ code: r.code, title: r.title, category: r.category, tx: r.transaction, condition: r.condition, price: r.price, size: r.size_text, units: r.units_available, zone: r.zones?.name, area: r.areas?.name }));
    if (!list.length) return { picks: [], error: null };
    try {
      const res = await generateResponse({
        model: "openai/gpt-6.1-sol",
        instructions: "You are a property advisor for G10 City Project in Azare, Nigeria. Pick up to 4 listings from the JSON list that best match the buyer. Only use codes from the list. Reply ONLY with JSON: {\"picks\":[{\"code\":\"...\",\"reason\":\"one short sentence\"}]}. Prefer price <= budget and the preferred zone.",
        input: `Buyer budget (NGN): ${data.budget || "not stated"}\nPreferred zone: ${data.zone || "any"}\nNeeds: ${data.needs || "not stated"}\nListings: ${JSON.stringify(list)}`,
      });
      const text = (res as any).output_text ?? ((res as any).output ?? []).flatMap((o: any) => o.content ?? []).filter((c: any) => c.type === "output_text").map((c: any) => c.text).join("");
      const m = String(text).match(/\{[\s\S]*\}/);
      const parsed = m ? JSON.parse(m[0]) : { picks: [] };
      const codes = new Set(list.map((l) => l.code));
      const picks = (parsed.picks ?? []).filter((p: any) => codes.has(p.code)).slice(0, 4).map((p: any) => ({ code: String(p.code), reason: String(p.reason ?? "") }));
      return { picks, error: null };
    } catch (e) {
      console.error("recommend failed", e instanceof GatewayError ? e.code : e);
      return { picks: [], error: "The assistant is busy right now. Please try again shortly." };
    }
  });
