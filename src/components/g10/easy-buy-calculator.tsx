import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { DOWN_OPTIONS, MONTH_OPTIONS, easyBuyPlan } from "@/lib/easybuy";
import { naira, waLink } from "@/lib/brand";
import { WhatsAppIcon } from "./whatsapp-icon";
import { cn } from "@/lib/utils";

export function EasyBuyCalculator({ price: fixedPrice, code, title, phone }: { price?: number; code?: string; title?: string; phone?: string | null }) {
  const [price, setPrice] = useState(fixedPrice ?? 2_500_000);
  const [down, setDown] = useState(30);
  const [months, setMonths] = useState(12);
  const plan = easyBuyPlan(price, down, months);
  const msg = `Hello G10 City Project, I want to apply for EASY BUY${code ? ` on ${code}` : ""}${title ? ` (${title})` : ""}. Price ${naira(price)}, ${down}% down (${naira(plan.down)}) and ${naira(plan.monthly)} monthly for ${months} months.`;

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-primary-deep">Easy Buy Calculator</h3>
        <span className="rounded-full bg-gold-soft px-2.5 py-1 text-xs font-semibold text-gold-foreground">0% interest</span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Biyan kudi a hankali — no interest, no pressure.</p>

      {fixedPrice == null && (
        <label className="mt-4 block text-sm font-medium">
          Property price (₦)
          <Input type="number" inputMode="numeric" min={0} value={price} onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))} className="mt-1" />
        </label>
      )}

      <div className="mt-4">
        <div className="flex justify-between text-sm font-medium"><span>Down payment</span><span className="text-primary">{down}% · {naira(plan.down)}</span></div>
        <Slider className="mt-3" min={10} max={90} step={5} value={[down]} onValueChange={(v) => setDown(v[0] ?? 30)} />
        <div className="mt-3 flex gap-2">
          {DOWN_OPTIONS.map((d) => (
            <button key={d} type="button" onClick={() => setDown(d)} className={cn("flex-1 rounded-lg border py-1.5 text-sm font-semibold", down === d ? "border-primary bg-primary text-primary-foreground" : "hover:bg-secondary")}>{d}%</button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-sm font-medium">Duration</div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {MONTH_OPTIONS.map((m) => (
            <button key={m} type="button" onClick={() => setMonths(m)} className={cn("rounded-lg border py-1.5 text-sm font-semibold", months === m ? "border-primary bg-primary text-primary-foreground" : "hover:bg-secondary")}>{m} mo</button>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-emerald-gradient p-4 text-primary-foreground">
        <div className="text-xs uppercase tracking-wider text-primary-foreground/70">Monthly payment</div>
        <div className="font-display text-3xl font-bold">{naira(plan.monthly)}</div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-primary-foreground/80">
          <div>Down: <b className="text-primary-foreground">{naira(plan.down)}</b></div>
          <div>Balance: <b className="text-primary-foreground">{naira(plan.balance)}</b></div>
          <div>Total: <b className="text-primary-foreground">{naira(plan.total)}</b></div>
          <div>Interest: <b className="text-gold">₦0</b></div>
        </div>
      </div>

      <Button asChild variant="whatsapp" size="lg" className="mt-4 w-full">
        <a href={waLink(msg, phone)} target="_blank" rel="noreferrer"><WhatsAppIcon /> Apply for Easy Buy</a>
      </Button>
    </div>
  );
}
