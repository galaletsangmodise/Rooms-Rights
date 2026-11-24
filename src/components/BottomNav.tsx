"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DoorOpen, Home, User, type LucideIcon } from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };

// Only show tabs for pages that exist. Add the rest as you build them:
//   Phase 3: Agreements (FileText)   Phase 5: Money (Wallet)
const NAV: Record<"landlord" | "tenant", NavItem[]> = {
  landlord: [
    { href: "/landlord", label: "Home", icon: Home },
    { href: "/landlord/rooms", label: "Rooms", icon: DoorOpen },
    { href: "/landlord/profile", label: "Profile", icon: User },
  ],
  tenant: [
    { href: "/tenant", label: "Home", icon: Home },
    { href: "/tenant/profile", label: "Profile", icon: User },
  ],
};

export function BottomNav({ role }: { role: "landlord" | "tenant" }) {
  const pathname = usePathname();
  const items = NAV[role];

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-10 border-t border-tan bg-cream-light"
    >
      <ul className="mx-auto flex max-w-3xl">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === `/${role}` ? pathname === href : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-3 text-xs font-semibold ${
                  active ? "text-maroon" : "text-ink-soft"
                }`}
              >
                <Icon size={22} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}