import Link from "next/link";
import { ChevronRight, Scale } from "lucide-react";

export function KnowYourRights() {
  return (
    <Link
      href="/support"
      className="flex items-center gap-4 rounded-2xl border border-tan bg-orange-pale p-4"
    >
      <Scale size={28} className="shrink-0 text-maroon" aria-hidden="true" />
      <span className="flex-1">
        <span className="block font-bold">Know your rights</span>
        <span className="block text-sm text-ink-soft">Get guidance on rental law.</span>
      </span>
      <ChevronRight size={18} className="text-ink-soft" aria-hidden="true" />
    </Link>
  );
}
