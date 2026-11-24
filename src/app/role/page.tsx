import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { cardCls } from "@/lib/ui";

const roles = [
  { role: "tenant", label: "I'm renting a room" },
  { role: "landlord", label: "I rent out rooms" },
] as const;

export default function RolePage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-6 pt-6">
      <Link href="/" aria-label="Back" className="inline-block p-1">
        <ArrowLeft />
      </Link>

      <h1 className="mt-6 text-3xl font-extrabold leading-tight">
        Let&apos;s get you
        <br />
        settled.
      </h1>
      <p className="mt-3 text-ink-soft">Choose your role to continue</p>

      <div className="mt-8 space-y-4">
        {roles.map(({ role, label }) => (
          <Link
            key={role}
            href={`/login?mode=signup&role=${role}`}
            className={`${cardCls} flex items-center justify-between py-6`}
          >
            <span className="text-lg font-bold">{label}</span>
            <ChevronRight className="text-ink-soft" />
          </Link>
        ))}
      </div>
      {/* Add the people illustrations from Stitch inside each card later. */}
    </main>
  );
}