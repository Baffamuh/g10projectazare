import { Link } from "@tanstack/react-router";
import { Phone, CalendarCheck } from "lucide-react";
import { WhatsAppIcon } from "./whatsapp-icon";
import { COMPANY, waLink } from "@/lib/brand";

export function MobileActionBar() {
  const c = "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold";
  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-[1000] flex border-t bg-card/95 backdrop-blur sm:hidden">
      <a href={`tel:${COMPANY.phoneLocal}`} className={`${c} text-primary`}><Phone className="size-5" />Call</a>
      <a href={waLink("Hello G10 City Project")} target="_blank" rel="noreferrer" className={`${c} text-whatsapp`}><WhatsAppIcon className="size-5" />WhatsApp</a>
      <Link to="/book-inspection" className={`${c} text-primary-deep`}><CalendarCheck className="size-5" />Inspection</Link>
    </div>
  );
}
