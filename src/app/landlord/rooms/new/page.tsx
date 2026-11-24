import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RoomForm } from "@/components/RoomForm";
import { createRoom } from "../../actions";

export default async function NewRoomPage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string }>;
}) {
  const { property } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from("properties").select("id, name").order("created_at");
  const properties = data ?? [];

  // A room belongs to a property, so create one first.
  if (properties.length === 0) redirect("/landlord/properties/new");

  return (
    <div className="mx-auto max-w-3xl px-5 pt-6">
      <Link href="/landlord" aria-label="Back" className="inline-block p-1">
        <ArrowLeft />
      </Link>
      <h1 className="mt-4 mb-6 text-3xl font-extrabold">Add a room</h1>
      <RoomForm
        action={createRoom}
        properties={properties}
        defaultPropertyId={property}
        submitLabel="Save room"
      />
      <Link
        href="/landlord/properties/new"
        className="mt-6 block text-center text-sm font-semibold text-maroon underline"
      >
        Add another property
      </Link>
    </div>
  );
}