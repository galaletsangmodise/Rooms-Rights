import { formatRand } from "@/lib/format";
import type { Ledger } from "@/lib/ledger";
import { cardCls } from "@/lib/ui";
import { StatusChip } from "./StatusChip";

export function MoneySummary({ rent, ledger }: { rent: number; ledger: Ledger }) {
  return (
    <div className={`${cardCls} space-y-3`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-ink-soft">{formatRand(rent)} a month</p>
        {ledger.currentMonthPaid ? (
          <StatusChip tone="green">Paid this month</StatusChip>
        ) : (
          <StatusChip tone="orange">Rent due this month</StatusChip>
        )}
      </div>

      {ledger.arrears > 0 ? (
        <p className="text-3xl font-extrabold text-maroon">{formatRand(ledger.arrears)} owing</p>
      ) : (
        <p className="text-3xl font-extrabold text-maroon">Up to date</p>
      )}

      <p className="text-sm text-ink-soft">Deposit paid: {formatRand(ledger.depositPaid)}</p>
    </div>
  );
}
