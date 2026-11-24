import Link from "next/link";
import { KeyRound } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { agreementStatus } from "@/lib/agreement";
import { currentHourInJohannesburg, greetingForHour } from "@/lib/greeting";
import { btnPrimary, cardCls } from "@/lib/ui";
import { StatusChip } from "@/components/StatusChip";
import type { AgreementRow } from "@/components/AgreementList";

export default async function TenantHome() {
  const profile = await requireRole("tenant");
  const supabase = await createClient();

  const { data } = await supabase
    .from("agreements")
    .select("id, type, status, created_at, terms")
    .neq("status", "superseded")
    .order("created_at", { ascending: false })
    .limit(1);

  const agreement = ((data ?? []) as unknown as AgreementRow[])[0];
  const greeting = greetingForHour(currentHourInJohannesburg());
  const firstName = profile.full_name.split(" ")[0] || "there";

  return (
    <>
      <header className="bg-maroon px-5 pb-16 pt-8 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-extrabold">
            {greeting}, {firstName}
          </h1>
        </div>
      </header>

      <div className="mx-auto -mt-10 max-w-3xl space-y-4 px-5">
        {agreement ? (
          <Link href={`/tenant/agreements/${agreement.id}`} className={`${cardCls} block`}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{agreement.terms.room_label}</h2>
              <StatusChip tone={agreementStatus(agreement.status).tone}>
                {agreementStatus(agreement.status).label}
              </StatusChip>
            </div>
            <p className="mt-1 text-ink-soft">
              {agreement.status === "pending"
                ? "Your agreement is waiting for you to review and accept."
                : "View your agreement."}
            </p>
          </Link>
        ) : (
          <div className={cardCls}>
            <h2 className="text-lg font-bold">No room yet</h2>
            <p className="mt-2 text-ink-soft">
              Ask your landlord for an invite code or link. Once you join, your agreement, payments
              and receipts will appear here.
            </p>
          </div>
        )}

        {!agreement && (
          <Link href="/tenant/join" className={btnPrimary}>
            <KeyRound size={20} /> Join with a code
          </Link>
        )}
      </div>
    </>
  );
}
