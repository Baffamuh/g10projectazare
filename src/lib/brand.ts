export const COMPANY = {
  name: "G10 CITY PROJECT NIGERIA LIMITED",
  short: "G10 City Project",
  motto: "Building Tomorrow, Creating Value",
  address: "Azare, Katagum LGA, Bauchi State, Nigeria",
  phoneDisplay: "+234 803 875 7441",
  phoneLocal: "08038757441",
  whatsapp: "2348038757441",
};

export function toWhatsAppNumber(phone?: string | null): string {
  const digits = (phone ?? "").replace(/\D/g, "");
  if (!digits) return COMPANY.whatsapp;
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0")) return "234" + digits.slice(1);
  return digits;
}

export function waLink(message: string, phone?: string | null): string {
  return `https://wa.me/${toWhatsAppNumber(phone)}?text=${encodeURIComponent(message)}`;
}

export function naira(n: number | string | null | undefined): string {
  const v = Math.round(Number(n ?? 0));
  return "₦" + v.toLocaleString("en-NG");
}
