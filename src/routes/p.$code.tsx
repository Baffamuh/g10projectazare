import { createFileRoute, redirect } from "@tanstack/react-router";
import { codeFromSlug } from "@/lib/codes";

export const Route = createFileRoute("/p/$code")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/properties/$code", params: { code: codeFromSlug(params.code) } });
  },
});
