import Link from "next/link";
import { DoorOpen, FileText, FolderOpen, Plus, UserPlus, Wallet } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { currentHourInJohannesburg, greetingForHour } from "@/lib/greeting";
import { summariseRooms } from "@/lib/dashboard";
import { formatRand } from "@/lib/format";
import { landlordChecklist } from "@/lib/homeData";
import { btnPrimary, cardCls } from "@/lib/ui";
import { Checklist } from "@/components/Checklist";
import { DashboardHeader } from "@/components/DashboardHeader";
import { KnowYourRights } from "@/components/KnowYourRights";
import { RoomCard, type RoomRow } from "@/components/RoomCard";
import { StatTile } from "@/components/StatTile";

export const metadata = { title: "Dashboard" };

const actionCls =
  "flex flex-col items-start gap-2 rounded-2xl border border-tan bg-cream-light p-4 font-bold shadow-sm";

export default async function LandlordHome() {
  const profile = await requireRole("landlord");
  const supabase = await createClient();

  const [roomsResult, tenanciesResult, agreementsResult, paymentsResult] = await Promise.all([
    supabase
      .from("rooms")
      .select("id, label, rent_amount, property:properties(name)")
      .is("archived_at", null)
      .order("created_at"),
    supabase.from("tenancies").select("room_id").neq("status", "ended"),
    supabase.from("agreements").select("id", { count: "exact", head: true }).neq("status", "superseded"),
    supabase.from("payments").select("id", { count: "exact", head: true }),
  ]);

  const rooms = (roomsResult.data ?? []) as unknown as RoomRow[];
  const occupiedIds = new Set((tenanciesResult.data ?? []).map((t) => t.room_id as string));
  const { roomCount, monthlyRent } = summariseRooms(rooms);
  const greeting = greetingForHour(currentHourInJohannesburg());
  const firstName = profile.full_name.split(" ")[0] || "there";

  const checklist = landlordChecklist({
    rooms: roomCount,
    agreements: agreementsResult.count ?? 0,
    tenants: occupiedIds.size,
    payments: paymentsResult.count ?? 0,
  });

  return (
    <>
      <DashboardHeader greeting={greeting} name={firstName} />

      <div className="mx-auto -mt-12 max-w-3xl space-y-6 px-5">
        <section className="grid grid-cols-3 gap-3">
          <StatTile icon={DoorOpen} label="Rooms" value={String(roomCount)} />
          <StatTile icon={UserPlus} label="Occupied" value={`${occupiedIds.size} of ${roomCount}`} />
          <StatTile icon={Wallet} label="Rent a month" value={formatRand(monthlyRent)} />
        </section>

        <section aria-label="Quick actions" className="grid grid-cols-2 gap-3">
          <Link href="/landlord/agreements/new" className={actionCls}>
            <UserPlus className="text-maroon" aria-hidden="true" />
            Invite a tenant
          </Link>
          <Link href="/landlord/agreements" className={actionCls}>
            <FileText className="text-maroon" aria-hidden="true" />
            Agreements
          </Link>
          <Link href="/landlord/rooms" className={actionCls}>
            <Wallet className="text-maroon" aria-hidden="true" />
            Record rent
          </Link>
          <Link href="/landlord/rooms" className={actionCls}>
            <FolderOpen className="text-maroon" aria-hidden="true" />
            Evidence Vault
          </Link>
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
            <div className="grid gap-3 md:grid-cols-2">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} occupied={occupiedIds.has(room.id)} />
              ))}
            </div>
          )}
        </section>

        <Link href="/landlord/rooms/new" className={btnPrimary}>
          Add a room <Plus size={20} />
        </Link>

        <Checklist title="Your setup checklist" items={checklist} />

        <KnowYourRights />
      </div>
    </>
  );
}
