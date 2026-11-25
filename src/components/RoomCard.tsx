import Link from "next/link";
import { UserPlus } from "lucide-react";
import { formatRand } from "@/lib/format";
import { cardCls } from "@/lib/ui";
import { StatusChip } from "./StatusChip";

export type RoomRow = {
  id: string;
  label: string;
  rent_amount: number;
  property: { name: string } | null;
};

export function RoomCard({ room, occupied = false }: { room: RoomRow; occupied?: boolean }) {
  return (
    <div className={cardCls}>
      <Link href={`/landlord/rooms/${room.id}/edit`} className="flex items-center justify-between">
        <div>
          <p className="font-bold">{room.label}</p>
          <p className="text-sm text-ink-soft">
            {room.property?.name} · {formatRand(room.rent_amount)}/month
          </p>
        </div>
        {occupied ? (
          <StatusChip tone="green">Occupied</StatusChip>
        ) : (
          <StatusChip tone="sand">Empty</StatusChip>
        )}
      </Link>
      {!occupied && (
        <Link
          href={`/landlord/agreements/new?room=${room.id}`}
          className="mt-3 flex items-center gap-2 border-t border-tan pt-3 text-sm font-bold text-maroon"
        >
          <UserPlus size={16} aria-hidden="true" /> Invite a tenant
        </Link>
      )}
    </div>
  );
}
