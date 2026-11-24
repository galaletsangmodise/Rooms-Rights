import Link from "next/link";
import { Plus } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { currentHourInJohannesburg, greetingForHour } from "@/lib/greeting";
import { summariseRooms } from "@/lib/dashboard";
import { formatRand } from "@/lib/format";
import { btnPrimary, cardCls } from "@/lib/ui";
import { RoomCard, type RoomRow } from "@/components/RoomCard";

export default async function LandlordHome() {
  const profile = await requireRole("landlord");
  const supabase = await createClient();

  const { data } = await supabase
    .from("rooms")
    .select("id, label, rent_amount, property:properties(name)")
    .is("archived_at", null)
    .order("created_at");

  const rooms = (data ?? []) as unknown as RoomRow[];
  const { roomCount, monthlyRent } = summariseRooms(rooms);
  const greeting = greetingForHour(currentHourInJohannesburg());
  const firstName = profile.full_name.split(" ")[0] || "there";

  return (
    <>
      <header className="bg-maroon px-5 pb-16 pt-8 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-extrabold">
            {greeting}, {firstName}
          </h1>
        </div>
      </header>

      <div className="mx-auto -mt-10 max-w-3xl space-y-6 px-5">
        <section className={`${cardCls} grid grid-cols-2 gap-4`}>
          <div>
            <p className="text-sm text-ink-soft">Rooms</p>
            <p className="text-2xl font-extrabold">{roomCount}</p>
          </div>
          <div>
            <p className="text-sm text-ink-soft">Monthly rent, all rooms</p>
            <p className="text-2xl font-extrabold">{formatRand(monthlyRent)}</p>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-bold">My rooms</h2>
          {rooms.length === 0 ? (
            <div className={cardCls}>
              <p className="font-bold">No rooms yet</p>
              <p className="mt-1 text-ink-soft">
                Add your first room to start creating agreements and tracking rent.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </section>

        <Link href="/landlord/rooms/new" className={btnPrimary}>
          Add a room <Plus size={20} />
        </Link>
      </div>
    </>
  );
}