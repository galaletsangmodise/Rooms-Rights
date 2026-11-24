import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { btnPrimary } from "@/lib/ui";
import { AgreementList, type AgreementRow } from "@/components/AgreementList";

export default async function LandlordAgreementsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("agreements")
    .select("id, type, status, created_at, terms")
    .order("created_at", { ascending: false });

  const agreements = (data ?? []) as unknown as AgreementRow[];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 pt-8">
      <h1 className="text-3xl font-extrabold">My Agreements</h1>

      <Link href="/landlord/clauses" className="inline-block font-bold text-maroon underline">
        Clause library
      </Link>

      <AgreementList
        agreements={agreements}
        basePath="/landlord/agreements"
        counterpart="tenant"
        emptyMessage="No agreements yet. Create one after you and your tenant agree on the room."
      />

      <Link href="/landlord/agreements/new" className={btnPrimary}>
        Create an agreement <Plus size={20} />
      </Link>
    </div>
  );
}
