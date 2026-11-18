import { createFileRoute } from "@tanstack/react-router";
import { PropertyEditor } from "@/components/g10/property-editor";

export const Route = createFileRoute("/admin/properties/new")({ component: () => <PropertyEditor /> });
