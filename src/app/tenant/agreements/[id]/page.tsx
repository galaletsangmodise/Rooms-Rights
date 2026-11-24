import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { agreementStatus, type AgreementStatus, type AgreementTerms, type AgreementType } from "@/lib/agreement";
import { btnPrimary, cardCls } from "@/lib/ui";
import { AgreementDocument } from "@/components/AgreementDocument";
import { PrintButton } from "@/components/PrintButton";
import { StatusChip } from "@/components/StatusChip";
import { acceptAgreement } from "../actions";

type AgreementData = {
  id: string;
  type: AgreementType;
  status: AgreementStatus;
  terms: AgreementTerms;
  accepted_at: string | null;
};

export default async function TenantAgreementPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const { data } = await supabase
    .from("agreements")
    .select("id, type, status, terms, accepted_at")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const agreement = data as unknown as AgreementData;
  const { label, tone } = agreementStatus(agreement.status);
  const isOral = agreement.type === "oral";

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 pt-6">
      <div className="print:hidden">
        <Link href="/tenant/agreements" aria-label="Back" className="inline-block p-1">
          <ArrowLeft />
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">Review your agreement</h1>
          <StatusChip tone={tone}>{label}</StatusChip>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-orange-pale px-4 py-3 text-sm font-semibold text-orange print:hidden">
          We could not accept the agreement. Please try again.
        </p>
      )}

      <AgreementDocument
        terms={agreement.terms}
        type={agreement.type}
        status={agreement.status}
        acceptedAt={agreement.accepted_at}
      />

      {agreement.status === "pending" && (
        <form action={acceptAgreement.bind(null, agreement.id)} className={`${cardCls} space-y-4 print:hidden`}>
          <label className="flex items-start gap-3">
            <input type="checkbox" required className="mt-1 size-5 accent-maroon" />
            <span className="text-sm font-semibold">
              {isOral
                ? "These terms match what we agreed."
                : "I have read the agreement and I agree."}
            </span>
          </label>
          <button type="submit" className={btnPrimary}>
            {isOral ? "Confirm terms" : "Accept agreement"}
          </button>
          <p className="text-center text-xs text-ink-soft">You will keep a copy in your agreements.</p>
        </form>
      )}

      <div className="print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}
