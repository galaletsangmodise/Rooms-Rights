import Link from "next/link";
import { KeyRound, ShieldCheck, CalendarDays } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { agreementStatus } from "@/lib/agreement";
import { formatRand } from "@/lib/format";
import { currentHourInJohannesburg, greetingForHour } from "@/lib/greeting";
import { loadTenantMoney, nextDueLabel, tenantChecklist } from "@/lib/homeData";
import { btnPrimary, cardCls } from "@/lib/ui";
import { Checklist } from "@/components/Checklist";
import { DashboardHeader } from "@/components/DashboardHeader";
import { KnowYourRights } from "@/components/KnowYourRights";
import { StatTile } from "@/components/StatTile";
import { StatusChip } from "@/components/StatusChip";
import type { AgreementRow } from "@/components/AgreementList";

export const metadata = { title: "Home" };

export default async function TenantHome() {
  const profile = await requireRole("tenant");
  const supabase = await createClient();

  const [{ data }, money] = await Promise.all([
    supabase
      .from("agreements")
      .select("id, type, status, created_at, terms")
      .neq("status", "superseded")
      .order("created_at", { ascending: false })
      .limit(1),
    loadTenantMoney(supabase),
  ]);

  const agreement = ((data ?? []) as unknown as AgreementRow[])[0];
  const greeting = greetingForHour(currentHourInJohannesburg());
  const firstName = profile.full_name.split(" ")[0] || "there";
  const status = agreement ? agreementStatus(agreement.status) : null;
  const active = agreement?.status === "valid" || agreement?.status === "recorded";

  const checklist = tenantChecklist({
    agreementId: agreement?.id,
    agreementStatus: agreement?.status,
    depositPaid: money?.ledger.depositPaid ?? 0,
    rentPaid: money?.rentPaid ?? 0,
    hasDocuments: money?.hasDocuments ?? false,
  });

  return (
    <>
      <DashboardHeader greeting={greeting} name={firstName} />

      <div className="mx-auto -mt-12 max-w-3xl space-y-4 px-5">
        {agreement && status ? (
          <Link href={`/tenant/agreements/${agreement.id}`} className={`${cardCls} block`}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold">My Room</h2>
              {active ? (
                <StatusChip tone="green">Active</StatusChip>
              ) : (
                <StatusChip tone={status.tone}>{status.label}</StatusChip>
              )}
            </div>
            <p className="mt-1 text-ink-soft">
              {agreement.terms.room_label}
              {money ? ` · ${formatRand(money.rent)}/month` : ""}
            </p>
            {agreement.status === "pending" && (
              <p className="mt-2 text-sm font-semibold text-orange">
                Your agreement is waiting for you to review and accept.
              </p>
            )}
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

        {money && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <StatTile
                icon={CalendarDays}
                label="Next payment"
                value={formatRand(money.ledger.arrears > 0 ? money.ledger.arrears : money.rent)}
                note={nextDueLabel(new Date(), money.ledger.currentMonthPaid)}
              />
              <StatTile
                icon={ShieldCheck}
                label="My deposit"
                value={formatRand(money.ledger.depositPaid)}
                note={money.ledger.depositPaid > 0 ? "Recorded" : "Not recorded yet"}
              />
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <Link href="/tenant/money" className="font-bold text-maroon underline">
                See payments and receipts
              </Link>
              <Link href="/tenant/pack" className="font-bold text-maroon underline">
                Print my records pack
              </Link>
            </div>
          </>
        )}

        <Checklist title="Your rental checklist" items={checklist} />

        {!agreement && (
          <Link href="/tenant/join" className={btnPrimary}>
            <KeyRound size={20} /> Join with a code
          </Link>
        )}

        <KnowYourRights />
      </div>
    </>
  );
}
