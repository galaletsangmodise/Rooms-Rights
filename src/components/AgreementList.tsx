import Link from "next/link";
import { agreementStatus, type AgreementStatus, type AgreementType } from "@/lib/agreement";
import { formatDate } from "@/lib/format";
import { cardCls } from "@/lib/ui";
import { StatusChip } from "./StatusChip";

export type AgreementRow = {
  id: string;
  type: AgreementType;
  status: AgreementStatus;
  created_at: string;
  terms: { room_label: string; tenant_name: string; landlord_name: string };
};

export function AgreementList({
  agreements,
  basePath,
  counterpart,
  emptyMessage,
}: {
  agreements: AgreementRow[];
  basePath: string;
  counterpart: "tenant" | "landlord";
  emptyMessage: string;
}) {
  if (agreements.length === 0) {
    return (
      <div className={cardCls}>
        <p className="text-ink-soft">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {agreements.map((agreement) => {
        const { label, tone } = agreementStatus(agreement.status);
        const name = counterpart === "tenant" ? agreement.terms.tenant_name : agreement.terms.landlord_name;
        return (
          <li key={agreement.id}>
            <Link
              href={`${basePath}/${agreement.id}`}
              className={`${cardCls} flex items-center justify-between gap-3`}
            >
              <div>
                <p className="font-bold">{agreement.terms.room_label} Agreement</p>
                <p className="text-sm text-ink-soft">
                  Created {formatDate(agreement.created_at)} · {name}
                </p>
              </div>
              <StatusChip tone={tone}>{label}</StatusChip>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
