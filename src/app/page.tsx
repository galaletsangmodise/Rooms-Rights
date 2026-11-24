import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getCurrentProfile } from "@/lib/auth";
import { homePathForRole } from "@/lib/roles";
import { btnPrimary } from "@/lib/ui";
import { Wordmark } from "@/components/Wordmark";

export default async function Welcome() {
  const profile = await getCurrentProfile();
  if (profile) redirect(homePathForRole(profile.role));

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col px-6 pt-6">
      <header>
        <Wordmark />
      </header>

      <section className="mt-12 flex-1">
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
        {/* Add the township illustration from your Stitch export here:
            public/images/welcome-township.png with next/image */}
      </section>

      <div className="space-y-4 pb-10">
        <Link href="/role" className={btnPrimary}>
          Get started <ArrowRight size={20} />
        </Link>
        <Link href="/login" className="block text-center text-sm text-ink-soft underline">
          I already have an account
        </Link>
      </div>
    </main>
  );
}