import type { LucideIcon } from "lucide-react";
import { cardCls } from "@/lib/ui";

export function StatTile({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div className={`${cardCls} flex flex-col gap-1`}>
      <Icon size={22} className="text-maroon" aria-hidden="true" />
      <p className="text-sm text-ink-soft">{label}</p>
      <p className="text-xl font-extrabold leading-tight">{value}</p>
      {note && <p className="text-xs text-ink-soft">{note}</p>}
    </div>
  );
}
