"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DoorOpen, FileText, FolderOpen, Home, User, Wallet, type LucideIcon } from "lucide-react";

type NavItem = { href: string; label: string; icon: LucideIcon };

const NAV: Record<"landlord" | "tenant", NavItem[]> = {
  landlord: [
    { href: "/landlord", label: "Home", icon: Home },
    { href: "/landlord/rooms", label: "Rooms", icon: DoorOpen },
    { href: "/landlord/agreements", label: "Agreements", icon: FileText },
    { href: "/landlord/profile", label: "Profile", icon: User },
  ],
  tenant: [
    { href: "/tenant", label: "Home", icon: Home },
    { href: "/tenant/agreements", label: "Agreements", icon: FileText },
    { href: "/tenant/vault", label: "Vault", icon: FolderOpen },
    { href: "/tenant/money", label: "Money", icon: Wallet },
    { href: "/tenant/profile", label: "Profile", icon: User },
  ],
};

export function BottomNav({ role }: { role: "landlord" | "tenant" }) {
  const pathname = usePathname();
  const items = NAV[role];

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-10 rounded-t-2xl border-t border-tan bg-cream-light shadow-[0_-4px_16px_rgba(42,27,23,0.08)] print:hidden"
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
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
