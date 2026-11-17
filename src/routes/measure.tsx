import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const MeasureMap = lazy(() => import("@/components/g10/measure-map"));

export const Route = createFileRoute("/measure")({
  head: () => ({
    meta: [
      { title: "Plot Measurement Tool — G10 City Project Azare" },
      { name: "description", content: "Draw a plot boundary on the map or walk it with GPS to estimate size in m², ft² and 50×100ft plots." },
      { property: "og:title", content: "Measure your plot — G10 City Project" },
      { property: "og:description", content: "Map boundary drawer with GPS walk mode." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-primary-deep">Plot Measurement Tool</h1>
      <p className="mt-1 text-muted-foreground">Estimate land size in Azare — draw corners or walk the boundary with your phone.</p>
      <div className="mt-6">
        <ClientOnly fallback={<div className="h-[60vh] rounded-2xl bg-muted" />}>
          <Suspense fallback={<div className="h-[60vh] rounded-2xl bg-muted" />}><MeasureMap /></Suspense>
        </ClientOnly>
      </div>
    </div>
  ),
});
