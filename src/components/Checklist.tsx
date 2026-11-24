import Link from "next/link";
import { Check, ChevronRight, Plus } from "lucide-react";
import { cardCls } from "@/lib/ui";

export type ChecklistItem = { label: string; done: boolean; href: string };

export function Checklist({ title, items }: { title: string; items: ChecklistItem[] }) {
  return (
    <section className={cardCls} aria-label={title}>
      <h2 className="text-lg font-bold">{title}</h2>
      <ul className="mt-3 divide-y divide-tan">
        {items.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="flex items-center gap-3 py-3">
              <span
                aria-hidden="true"
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  item.done ? "bg-forest text-white" : "bg-orange-pale text-orange"
                }`}
              >
                {item.done ? <Check size={16} /> : <Plus size={16} />}
              </span>
              <span className={`flex-1 ${item.done ? "font-semibold" : "font-semibold text-orange"}`}>
                {item.label}
              </span>
              <span className="sr-only">{item.done ? "Done" : "To do"}</span>
              <ChevronRight size={18} className="text-ink-soft" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
