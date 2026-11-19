import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InquiryForm } from "@/components/g10/inquiry-form";
import { WhatsAppIcon } from "@/components/g10/whatsapp-icon";
import { COMPANY, waLink } from "@/lib/brand";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact G10 City Project — Azare, Bauchi State" },
      { name: "description", content: `Call or WhatsApp ${COMPANY.phoneDisplay} for plots, houses in Azare.` },
      { property: "og:title", content: "Contact G10 City Project" },
      { property: "og:description", content: "Reach our sales team on WhatsApp or by phone." },
    ],
  }),
  component: () => (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold text-primary-deep">Talk to us</h1>
        <p className="mt-2 text-muted-foreground">We respond fastest on WhatsApp.</p>
        <div className="mt-6 space-y-3">
          <Button asChild variant="whatsapp" size="lg" className="w-full"><a href={waLink("Hello G10 City Project")} target="_blank" rel="noreferrer"><WhatsAppIcon /> WhatsApp {COMPANY.phoneDisplay}</a></Button>
          <Button asChild variant="outline" size="lg" className="w-full"><a href={`tel:${COMPANY.phoneLocal}`}><Phone /> Call {COMPANY.phoneLocal}</a></Button>
          <div className="flex items-start gap-2 rounded-xl border bg-card p-4 text-sm"><MapPin className="mt-0.5 size-4 text-primary" /> {COMPANY.address}</div>
        </div>
      </div>
      <InquiryForm />
    </div>
  ),
});
