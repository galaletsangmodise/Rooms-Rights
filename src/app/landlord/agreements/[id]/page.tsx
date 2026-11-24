import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { agreementStatus, type AgreementStatus, type AgreementTerms, type AgreementType } from "@/lib/agreement";
import { formatDate } from "@/lib/format";
import { joinLink, whatsappMessage, whatsappUrl } from "@/lib/invite";
import { siteOrigin } from "@/lib/site";
import { btnOutline, cardCls } from "@/lib/ui";
import { AgreementDocument } from "@/components/AgreementDocument";
import { InvitePanel } from "@/components/InvitePanel";
import { PrintButton } from "@/components/PrintButton";
import { StatusChip } from "@/components/StatusChip";
import { cancelAgreement } from "../invite-actions";

type AgreementData = {
  id: string;
  tenancy_id: string;
  type: AgreementType;
  status: AgreementStatus;
  terms: AgreementTerms;
  accepted_at: string | null;
};

export default async function LandlordAgreementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("agreements")
    .select("id, tenancy_id, type, status, terms, accepted_at")
    .eq("id", id)
    .single();

  // Row level security returns nothing if this agreement belongs to someone else.
  if (!data) notFound();
  const agreement = data as unknown as AgreementData;
  const { label, tone } = agreementStatus(agreement.status);
  const open = agreement.status === "draft" || agreement.status === "pending";

  let panel: React.ReactNode = null;

  if (open) {
    const [{ data: tenancy }, { data: inviteRow }] = await Promise.all([
      supabase.from("tenancies").select("tenant_id").eq("id", agreement.tenancy_id).single(),
      supabase
        .from("invites")
        .select("code, expires_at")
        .eq("tenancy_id", agreement.tenancy_id)
        .is("used_at", null)
        .is("revoked_at", null)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    if (tenancy?.tenant_id) {
      panel = (
        <div className={cardCls}>
          <p className="font-bold">Waiting for {agreement.terms.tenant_name} to accept</p>
          <p className="mt-1 text-ink-soft">They have joined the room and can review the agreement.</p>
        </div>
      );
    } else {
      let invite = null;
      if (inviteRow) {
        const link = joinLink(await siteOrigin(), inviteRow.code);
        invite = {
          code: inviteRow.code as string,
          link,
          qrDataUrl: await QRCode.toDataURL(link, { margin: 1, width: 220 }),
          expiresAt: inviteRow.expires_at as string,
          whatsappUrl: whatsappUrl(
            whatsappMessage({
              tenantName: agreement.terms.tenant_name,
              roomLabel: agreement.terms.room_label,
              link,
              code: inviteRow.code as string,
            }),
          ),
        };
      }
      panel = <InvitePanel agreementId={agreement.id} tenancyId={agreement.tenancy_id} invite={invite} />;
    }
  } else if (agreement.accepted_at) {
    panel = (
      <div className={cardCls}>
        <p className="font-bold text-forest">Accepted on {formatDate(agreement.accepted_at)}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 pt-6">
      <div className="print:hidden">
        <Link href="/landlord/agreements" aria-label="Back" className="inline-block p-1">
          <ArrowLeft />
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold">{agreement.terms.room_label}</h1>
          <StatusChip tone={tone}>{label}</StatusChip>
        </div>
      </div>

      <div className="print:hidden">{panel}</div>

      <AgreementDocument
        terms={agreement.terms}
        type={agreement.type}
        status={agreement.status}
        acceptedAt={agreement.accepted_at}
      />

      <div className="space-y-3 print:hidden">
        <PrintButton />
        {open && (
          <form action={cancelAgreement.bind(null, agreement.id)}>
            <button type="submit" className={`${btnOutline} border-orange text-orange`}>
              Cancel this agreement
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
