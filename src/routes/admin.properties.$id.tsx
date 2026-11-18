import { createFileRoute } from "@tanstack/react-router";
import { PropertyEditor } from "@/components/g10/property-editor";

export const Route = createFileRoute("/admin/properties/$id")({ component: EditProperty });

function EditProperty() {
  const { id } = Route.useParams();
  return <PropertyEditor key={id} id={id} />;
}
