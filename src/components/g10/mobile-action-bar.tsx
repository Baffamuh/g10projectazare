import { Link } from "@tanstack/react-router";
import { Home, LayoutGrid, Sparkles, Phone } from "lucide-react";
import { WhatsAppIcon } from "./whatsapp-icon";
import { COMPANY, waLink } from "@/lib/brand";

export function MobileActionBar() {
  const c = "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-muted-foreground transition-colors";
  const active = { className: "text-primary" };
  return (
    <nav className="no-print fixed inset-x-0 bottom-0 z-[1000] flex border-t bg-card/95 pb-[env(safe-area-inset-bottom)] shadow-card backdrop-blur sm:hidden">
      <Link to="/" activeOptions={{ exact: true }} activeProps={active} className={c}><Home className="size-5" />Home</Link>
      <Link to="/properties" activeProps={active} className={c}><LayoutGrid className="size-5" />Listings</Link>
      <Link to="/find-my-plot" activeProps={active} className={c}><Sparkles className="size-5" />Find Plot</Link>
      <a href={`tel:${COMPANY.phoneLocal}`} className={c}><Phone className="size-5" />Call</a>
      <a href={waLink("Hello G10 City Project")} target="_blank" rel="noreferrer" className={`${c} text-whatsapp`}><WhatsAppIcon className="size-5" />WhatsApp</a>
    </nav>
  );
}
