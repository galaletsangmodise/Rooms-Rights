import Link from "next/link";
import { formatDate, formatRand } from "@/lib/format";
import { kindLabel, methodLabel, periodLabel } from "@/lib/ledger";
import type { PaymentRow } from "@/lib/money";
import { cardCls } from "@/lib/ui";
import { StatusChip } from "./StatusChip";
import { VoidForm } from "./VoidForm";

export function LedgerList({
  payments,
  receiptBase,
  canVoid,
}: {
  payments: PaymentRow[];
  receiptBase: string;
  canVoid: boolean;
}) {
  if (payments.length === 0) {
    return (
      <div className={cardCls}>
        <p className="font-bold">No payments yet</p>
        <p className="mt-1 text-ink-soft">Payments and receipts will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {payments.map((p) => {
        const voided = Boolean(p.voided_at);
        return (
          <li key={p.id} className={cardCls}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-bold">
                  {kindLabel(p.kind)}
                  {p.period ? ` · ${periodLabel(p.period)}` : ""}
                </p>
                <p className="text-sm text-ink-soft">
                  {formatDate(p.paid_on)} · {methodLabel(p.method)}
                </p>
              </div>
              <p className={`text-lg font-extrabold ${voided ? "text-ink-soft line-through" : ""}`}>
                {formatRand(p.amount)}
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Link href={`${receiptBase}/${p.id}`} className="text-sm font-bold text-maroon underline">
                Receipt {p.receipt_no}
              </Link>
              {voided && <StatusChip tone="orange">Voided</StatusChip>}
            </div>

            {voided && p.void_reason && (
              <p className="mt-2 text-sm text-ink-soft">Reason: {p.void_reason}</p>
            )}
            {p.note && !voided && <p className="mt-2 text-sm text-ink-soft">{p.note}</p>}

            {canVoid && !voided && <VoidForm paymentId={p.id} />}
          </li>
        );
      })}
    </ul>
  );
}
