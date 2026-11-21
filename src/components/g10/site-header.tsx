import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { zonesQuery } from "@/lib/data";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "./whatsapp-icon";
import { waLink, COMPANY } from "@/lib/brand";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/find-my-plot", label: "Find My Plot" },
  { to: "/book-inspection", label: "Inspection" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { data: zones = [] } = useQuery(zonesQuery());
  const zs = (z: string) => ({ tx: undefined, cat: undefined, cond: undefined, zone: z, easy: undefined });
  return (
    <header className="no-print sticky top-0 z-[1000] border-b bg-card/95 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <Logo className="h-11 w-11 shrink-0 sm:h-12 sm:w-12" />
          <div className="min-w-0 leading-tight">
            <div className="truncate font-display text-sm font-bold text-primary-deep sm:text-base">G10 CITY PROJECT</div>
            <div className="truncate text-[11px] text-muted-foreground sm:text-xs">Nigeria Limited · Azare</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-primary"
                activeProps={{ className: "bg-secondary text-primary" }}>
                {n.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-primary">Zones <ChevronDown className="size-4" /></DropdownMenuTrigger>
              <DropdownMenuContent className="z-[1100] w-64">
                {zones.map((z) => (
                  <DropdownMenuItem key={z.id} asChild>
                    <Link to="/properties" search={zs(z.name)} className="flex flex-col items-start">
                      <span className="font-semibold">{z.name}</span>
                      {z.description && <span className="line-clamp-1 text-xs text-muted-foreground">{z.description}</span>}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <Button asChild variant="whatsapp" size="sm" className="hidden sm:inline-flex">
            <a href={waLink("Hello G10 City Project, I'd like to know more about your properties.")} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> {COMPANY.phoneLocal}
            </a>
          </Button>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="border-t bg-card px-4 py-2 lg:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 font-medium hover:bg-secondary">
              {n.label}
            </Link>
          ))}
          <details className="rounded-md">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-3 py-2.5 font-medium hover:bg-secondary">Zones <ChevronDown className="size-4" /></summary>
            <div className="ml-3 border-l pl-2">
              {zones.map((z) => (
                <Link key={z.id} to="/properties" search={zs(z.name)} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-secondary">
                  {z.name}{z.description ? <span className="block text-xs text-muted-foreground">{z.description}</span> : null}
                </Link>
              ))}
            </div>
          </details>
          <a href={waLink("Hello G10 City Project")} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-2 rounded-md px-3 py-2.5 font-semibold text-whatsapp">
            <WhatsAppIcon /> WhatsApp {COMPANY.phoneDisplay}
          </a>
        </nav>
      )}
    </header>
  );
}
