import { LOGO_URL } from "@/lib/images";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return <img src={LOGO_URL} alt="G10 City Project Nigeria Limited logo" className={cn("rounded-md bg-card object-contain", className)} />;
}
