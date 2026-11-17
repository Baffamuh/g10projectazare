# G10 City Project — Real Estate Portal & Admin

## Key decisions
- Official phone / WhatsApp everywhere: **+234 803 875 7441 (08038757441)** — replaces 08108926746 in all WhatsApp buttons, Easy Buy apply, Fatara inquiry, and as the default listing contact.
- Logo: uploaded G10 logo used in header, footer (with motto), favicon, receipts, and photo watermarks.
- Brochure image: cover for Fatara Phase 3 Estate.
- Look: deep emerald (#0D472B), white, subtle gold; Sora headings, Manrope body.

## Public website
- **Home**: hero, Easy Buy highlight + calculator, Featured Estates (Fatara Phase 3 with brochure cover + amenities: Clinic, School & Mosque, Shopping Complex, Sports Arena, "Inquire About Fatara Phase 3" WhatsApp button; Chara-Chara G.R.A Phase 2), latest listings, zones.
- **Listings** (`/properties`): For Sale / For Rent, filters by category, condition, zone, Easy Buy.
- **Property details** (`/properties/$code`): photos with watermark, price in ₦, units-available badge, plot/house no., Easy Buy calculator (20/30/50% down; 3/6/12/24 months; zero interest), Apply for Easy Buy (WhatsApp with reference), Copy Short Link, location map.
- **Short links** `/p/$code` redirect to the listing.
- **Measure tool** (`/measure`): Leaflet map on Azare, street/satellite switch, no scroll-wheel zoom, numbered corner pins, edge lengths in ft and m, area in m², ft² and 50×100ft plots, cadastral notice, GPS Walk Mode (Start/Pause/Resume/Finish).
- About and Contact pages.

## Admin portal (`/admin`)
- Staff email + password login (no confirmation email).
- Dashboard: total listings, active plots in Fatara and Chara-Chara, units available, inquiries, sales.
- Properties: card view on phone, table on desktop; filters; form with all brief fields, photo upload, automatic reference codes (G10-S-HC-001 etc.) with manual override and duplicate check.
- Locations manager (zones and areas) using inline dialogs; pre-filled with the 6 Azare zones.
- Inquiries: lead list with status and WhatsApp quick-reply.
- Sales & receipts: record sale (full or Easy Buy), printable A4 receipt `G10-RCP-YYYY-####` with logo, company name/address, buyer details, plot details, QR code, two signature lines.

## Technical details
- Enable Lovable Cloud: tables for zones, areas, properties, property_photos, inquiries, sales, user_roles (admin/staff) with RLS; public read of published listings; storage bucket for photos.
- Reference codes generated server-side per prefix with unique constraint; receipt numbers per year.
- Watermark applied in-browser on upload (canvas) and as a CSS overlay on displayed images.
- Leaflet + OpenStreetMap / Esri satellite tiles, loaded client-only; geodesic area math; `navigator.geolocation.watchPosition` for walk mode.
- QR via `qrcode` library; print styles for A4.
- Seed migration with zones, areas, and a few sample listings so pages aren't empty.
