import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FolderOpen, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RoomForm, type RoomDefaults } from "@/components/RoomForm";
import { btnOutline } from "@/lib/ui";
import { archiveRoom, updateRoom } from "../../../actions";

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("rooms")
    .select("label, rent_amount, deposit_amount, rent_due_day, electricity, water, house_rules")
    .eq("id", id)
    .single();

  // Row level security returns nothing if this room belongs to someone else.
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-3xl px-5 pt-6">
      <Link href="/landlord/rooms" aria-label="Back" className="inline-block p-1">
        <ArrowLeft />
      </Link>
      <h1 className="mt-4 mb-6 text-3xl font-extrabold">Edit room</h1>

      <Link
        href={`/landlord/rooms/${id}/vault`}
        className="mb-6 flex items-center gap-2 font-bold text-maroon underline"
      >
        <FolderOpen size={20} /> Open Evidence Vault
      </Link>

      <Link
        href={`/landlord/rooms/${id}/money`}
        className="mb-6 flex items-center gap-2 font-bold text-maroon underline"
      >
        <Wallet size={20} /> Rent and deposit
      </Link>

      <RoomForm
        action={updateRoom.bind(null, id)}
        room={data as RoomDefaults}
        submitLabel="Save changes"
      />

      <form action={archiveRoom.bind(null, id)} className="mt-4">
        <button type="submit" className={btnOutline}>
          Archive this room
        </button>
      </form>
    </div>
  );
}
