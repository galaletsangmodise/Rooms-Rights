import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { homePathForRole } from "@/lib/roles";
import { btnPrimary } from "@/lib/ui";
import { BorderPattern } from "@/components/BorderPattern";
import { Wordmark } from "@/components/Wordmark";

export default async function Welcome() {
  const profile = await getCurrentProfile();
  if (profile) redirect(homePathForRole(profile.role));

  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pt-6">
        <header>
          <Wordmark />
        </header>

        <section className="mt-10">
          <h1 className="text-4xl font-extrabold leading-tight">
            Rent fairly.
            <br />
            Live securely.
            <br />
            Know your rights.
          </h1>
          <p className="mt-4 text-ink-soft">
            A better way for South African tenants and landlords.
          </p>
        </section>

        <div className="-mx-6 mt-6 flex flex-1 items-end">
          <Image
            src="/images/hero-township.webp"
            alt="A row of backyard rooms along a township street"
            width={1100}
            height={503}
            priority
            className="h-auto max-h-80 min-h-44 w-full object-cover object-left [mask-image:linear-gradient(to_bottom,transparent,black_35%)]"
          />
        </div>

        <div className="space-y-4 pb-8 pt-4">
          <Link href="/role" className={btnPrimary}>
            Get started <ArrowRight size={20} />
          </Link>
          <Link href="/login" className="block text-center text-sm text-ink-soft underline">
            I already have an account
          </Link>
        </div>
      </main>
      <BorderPattern />
    </div>
  );
}
