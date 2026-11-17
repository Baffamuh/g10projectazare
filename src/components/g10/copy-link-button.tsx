import { Link2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { shortSlug } from "@/lib/codes";

export function CopyLinkButton({ code, size = "sm", label = "Copy Short Link" }: { code: string; size?: "sm" | "default"; label?: string }) {
  return (
    <Button type="button" variant="outline" size={size} onClick={async (e) => {
      e.preventDefault(); e.stopPropagation();
      const url = `${window.location.origin}/p/${shortSlug(code)}`;
      try { await navigator.clipboard.writeText(url); toast.success("Short link copied", { description: url }); }
      catch { toast.error("Could not copy", { description: url }); }
    }}>
      <Link2 /> {label}
    </Button>
  );
}
