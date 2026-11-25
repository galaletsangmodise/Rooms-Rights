import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { CornerPattern } from "@/components/BorderPattern";
import { cardCls } from "@/lib/ui";

const roles = [
  { role: "tenant", label: "I'm renting a room", image: "/images/role-tenant.webp", w: 420, h: 388 },
  { role: "landlord", label: "I rent out rooms", image: "/images/role-landlord.webp", w: 420, h: 437 },
] as const;

export default function RolePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <CornerPattern className="absolute right-0 top-0 h-28 w-28" />

      <main className="relative mx-auto w-full max-w-md px-6 pt-6">
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
          {roles.map(({ role, label, image, w, h }) => (
            <Link
              key={role}
              href={`/login?mode=signup&role=${role}`}
              className={`${cardCls} flex items-center gap-4 p-3`}
            >
              <span className="flex h-24 w-24 shrink-0 items-end justify-center overflow-hidden rounded-xl bg-sand">
                <Image
                  src={image}
                  alt=""
                  width={w}
                  height={h}
                  className="h-full w-full object-cover object-top"
                />
              </span>
              <span className="flex-1 text-lg font-bold leading-snug">{label}</span>
              <ChevronRight className="text-ink-soft" />
            </Link>
          ))}
        </div>
      </main>

      <div className="relative mt-auto h-40 w-full">
        <Image
          src="/images/hero-township.webp"
          alt=""
          width={1100}
          height={503}
          className="h-full w-full object-cover object-right [mask-image:linear-gradient(to_bottom,transparent,black_60%)]"
        />
      </div>
    </div>
  );
}
