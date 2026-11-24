import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/PropertyForm";
import { createProperty } from "../../actions";

export default function NewPropertyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-6">
      <Link href="/landlord/rooms" aria-label="Back" className="inline-block p-1">
        <ArrowLeft />
      </Link>
      <h1 className="mt-4 mb-6 text-3xl font-extrabold">Add a property</h1>
      <PropertyForm action={createProperty} />
    </div>
  );
}