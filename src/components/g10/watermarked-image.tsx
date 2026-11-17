import { LOGO_URL } from "@/lib/images";
import { cn } from "@/lib/utils";

export function WatermarkedImage({ src, alt, className, eager }: { src: string; alt: string; className?: string; eager?: boolean }) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} className="h-full w-full object-cover" />
      <img src={LOGO_URL} alt="" aria-hidden className="pointer-events-none absolute bottom-2 right-2 h-9 w-9 rounded-md bg-card/80 object-contain p-0.5 opacity-80 shadow sm:h-11 sm:w-11" />
    </div>
  );
}
