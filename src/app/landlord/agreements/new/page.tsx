import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cardCls } from "@/lib/ui";
import { AgreementForm, type RoomOption } from "@/components/AgreementForm";
import { createAgreement } from "../actions";

export default async function NewAgreementPage({
  searchParams,
}: {
  searchParams: Promise<{ room?: string }>;
}) {
  const { room } = await searchParams;
  const supabase = await createClient();

  const [roomsResult, tenanciesResult] = await Promise.all([
    supabase
      .from("rooms")
      .select("id, label, property:properties(name)")
      .is("archived_at", null)
      .order("created_at"),
    supabase.from("tenancies").select("room_id").neq("status", "ended"),
  ]);

  const busy = new Set((tenanciesResult.data ?? []).map((t) => t.room_id as string));
  const rows = (roomsResult.data ?? []) as unknown as {
    id: string;
    label: string;
    property: { name: string } | null;
  }[];

  const options: RoomOption[] = rows
    .filter((r) => !busy.has(r.id))
    .map((r) => ({ id: r.id, label: r.label, propertyName: r.property?.name ?? "" }));

  return (
    <div className="mx-auto max-w-3xl px-5 pt-6">
      <Link href="/landlord/agreements" aria-label="Back" className="inline-block p-1">
        <ArrowLeft />
      </Link>
      <h1 className="mt-4 mb-6 text-3xl font-extrabold">Create an agreement</h1>

      {options.length === 0 ? (
        <div className={cardCls}>
          <p className="font-bold">No room is free for a new agreement</p>
          <p className="mt-1 text-ink-soft">
            Add a room first, or cancel the pending agreement on a room you want to redo.
          </p>
          <Link href="/landlord/rooms/new" className="mt-3 inline-block font-bold text-maroon underline">
            Add a room
          </Link>
        </div>
      ) : (
        <AgreementForm action={createAgreement} rooms={options} defaultRoomId={room} />
      )}
    </div>
  );
}
