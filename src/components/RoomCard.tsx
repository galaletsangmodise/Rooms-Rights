import Link from "next/link";
import { formatRand } from "@/lib/format";
import { cardCls } from "@/lib/ui";
import { StatusChip } from "./StatusChip";

export type RoomRow = {
  id: string;
  label: string;
  rent_amount: number;
  property: { name: string } | null;
};

export function RoomCard({ room }: { room: RoomRow }) {
  return (
    <Link
      href={`/landlord/rooms/${room.id}/edit`}
      className={`${cardCls} flex items-center justify-between`}
    >
      <div>
        <p className="font-bold">{room.label}</p>
        <p className="text-sm text-ink-soft">
          {room.property?.name} · {formatRand(room.rent_amount)}/month
        </p>
      </div>
      {/* Phase 3 changes this to the tenant name, and Phase 5 to Paid / Due / Overdue */}
      <StatusChip tone="sand">Empty</StatusChip>
    </Link>
  );
}