import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Clause } from "@/lib/clauses";
import { ClauseLibrary } from "@/components/ClauseLibrary";

export default async function LandlordClausesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clauses")
    .select("id, title, body")
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto max-w-3xl px-5 pt-6 pb-8">
      <Link href="/landlord/agreements" aria-label="Back" className="inline-block p-1">
        <ArrowLeft />
      </Link>
      <h1 className="mt-4 mb-1 text-3xl font-extrabold">Clause library</h1>
      <p className="mb-6 text-ink-soft">
        Copy a clause and paste it into the extra terms of your agreement. Change the parts in [brackets].
      </p>
      <ClauseLibrary clauses={(data ?? []) as Clause[]} />
    </div>
  );
}
