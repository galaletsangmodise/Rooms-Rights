import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { btnOutline, btnPrimary, cardCls } from "@/lib/ui";
import { RoomCard } from "@/components/RoomCard";

export const metadata = { title: "Rooms" };

type PropertyRow = {
  id: string;
  name: string;
  address: string;
  suburb: string;
  rooms: { id: string; label: string; rent_amount: number; archived_at: string | null }[];
};

export default async function RoomsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("id, name, address, suburb, rooms(id, label, rent_amount, archived_at)")
    .order("created_at");

  const properties = (data ?? []) as PropertyRow[];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 pt-8">
      <h1 className="text-3xl font-extrabold">Rooms</h1>

      {properties.length === 0 ? (
        <div className={cardCls}>
          <p className="font-bold">No properties yet</p>
          <p className="mt-1 text-ink-soft">
            Add the property where your rooms are, then add each room.
          </p>
        </div>
      ) : (
        properties.map((property) => {
          const activeRooms = property.rooms.filter((r) => !r.archived_at);
          return (
            <section key={property.id}>
              <h2 className="text-lg font-bold">{property.name}</h2>
              <p className="mb-3 text-sm text-ink-soft">
                {[property.address, property.suburb].filter(Boolean).join(", ")}
              </p>
              {activeRooms.length === 0 ? (
                <p className="text-sm text-ink-soft">No rooms in this property yet.</p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {activeRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={{ ...room, property: { name: property.name } }}
                    />
                  ))}
                </div>
              )}
            </section>
          );
        })
      )}

      <div className="space-y-3">
        <Link href="/landlord/rooms/new" className={btnPrimary}>
          Add a room <Plus size={20} />
        </Link>
        <Link href="/landlord/properties/new" className={btnOutline}>
          Add a property <Plus size={20} />
        </Link>
      </div>
    </div>
  );
}
