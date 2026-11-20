import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const MeasureMap = lazy(() => import("@/components/g10/measure-map"));

export const Route = createFileRoute("/admin/measure")({ component: MeasurePage });

function MeasurePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-deep">Plot Measurement Tool</h1>
      <p className="mt-1 text-muted-foreground">Tap the map to drop corners, or walk the boundary with your phone GPS.</p>
      <div className="mt-6">
        <ClientOnly fallback={<div className="h-[60vh] rounded-2xl bg-muted" />}>
          <Suspense fallback={<div className="h-[60vh] rounded-2xl bg-muted" />}><MeasureMap /></Suspense>
        </ClientOnly>
      </div>
    </div>
  );
}
