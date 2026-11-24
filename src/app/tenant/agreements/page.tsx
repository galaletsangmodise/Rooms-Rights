import Link from "next/link";
import { KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { btnOutline } from "@/lib/ui";
import { AgreementList, type AgreementRow } from "@/components/AgreementList";

export default async function TenantAgreementsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("agreements")
    .select("id, type, status, created_at, terms")
    .order("created_at", { ascending: false });

  const agreements = (data ?? []) as unknown as AgreementRow[];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 pt-8">
      <h1 className="text-3xl font-extrabold">My Agreements</h1>

      <AgreementList
        agreements={agreements}
        basePath="/tenant/agreements"
        counterpart="landlord"
        emptyMessage="No agreements yet. Ask your landlord for an invite code, then join your room."
      />

      <Link href="/tenant/join" className={btnOutline}>
        <KeyRound size={20} /> Join with a code
      </Link>
    </div>
  );
}
