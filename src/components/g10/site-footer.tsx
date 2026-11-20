import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";
import { COMPANY, waLink } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="no-print bg-primary-deep text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-3">
            <Logo className="h-16 w-16" />
            <div>
              <div className="font-display text-lg font-bold">{COMPANY.name}</div>
              <div className="text-sm italic text-gold">“{COMPANY.motto}”</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm text-primary-foreground/75">
            Land, houses, shops and farmland across Azare.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gold">Explore</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/properties">Properties</Link></li>
            <li><Link to="/admin">Staff login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold text-gold">Contact</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li>{COMPANY.address}</li>
            <li><a href={`tel:${COMPANY.phoneLocal}`}>{COMPANY.phoneDisplay}</a></li>
            <li><a href={waLink("Hello G10 City Project")} target="_blank" rel="noreferrer">WhatsApp us</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-4 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
      </div>
    </footer>
  );
}
