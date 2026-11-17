import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const schema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(120),
  phone: z.string().trim().min(7, "Enter a valid phone").max(30),
  message: z.string().trim().max(2000).optional(),
});

export function InquiryForm({ propertyId, propertyCode }: { propertyId?: string; propertyCode?: string }) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Check the form"); return; }
    setBusy(true);
    const { error } = await supabase.from("inquiries").insert({
      name: parsed.data.name, phone: parsed.data.phone, message: parsed.data.message || null,
      property_id: propertyId ?? null, property_code: propertyCode ?? null,
    });
    setBusy(false);
    if (error) { toast.error("Could not send. Please try WhatsApp."); return; }
    setDone(true);
    toast.success("Thank you! We'll call you shortly.");
  }

  if (done) return <div className="rounded-2xl border bg-secondary p-5 text-sm font-medium">Thank you — our team will contact you shortly.</div>;
  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border bg-card p-5">
      <h3 className="font-display font-bold">Request a call back</h3>
      <Input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input placeholder="Phone number" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Textarea placeholder="Message (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      <Button type="submit" disabled={busy} className="w-full">{busy ? "Sending…" : "Send inquiry"}</Button>
    </form>
  );
}
