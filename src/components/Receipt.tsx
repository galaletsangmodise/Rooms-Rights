import { formatDate, formatRand } from "@/lib/format";
import { kindLabel, methodLabel, periodLabel } from "@/lib/ledger";
import { PrintButton } from "./PrintButton";

export type ReceiptData = {
  receipt_no: string;
  kind: string;
  amount: number;
  period: string | null;
  paid_on: string;
  method: string;
  note: string | null;
  voided_at: string | null;
  void_reason: string | null;
  room_label: string;
  property_name: string;
  property_address: string;
  landlord_name: string;
  tenant_name: string;
};

export function Receipt({ data }: { data: ReceiptData }) {
  const forWhat =
    data.kind === "rent" ? `Rent for ${periodLabel(data.period)}` : `${kindLabel(data.kind)} payment`;

  return (
    <div className="space-y-4">
      <article className="rounded-2xl border-2 border-dashed border-maroon bg-cream-light p-6">
        <p className="text-sm font-bold uppercase tracking-wide text-maroon">Payment receipt</p>
        <p className="mt-1 text-2xl font-extrabold">{data.receipt_no}</p>

        {data.voided_at && (
          <div className="mt-4 rounded-xl border-2 border-orange p-3">
            <p className="text-xl font-extrabold text-orange">VOID</p>
            {data.void_reason && <p className="text-sm">Reason: {data.void_reason}</p>}
          </div>
        )}

        <p className="mt-5 text-4xl font-extrabold text-maroon">{formatRand(data.amount)}</p>
        <p className="mt-1 font-semibold">{forWhat}</p>

        <dl className="mt-5 space-y-3 text-sm">
          <div>
            <dt className="text-ink-soft">Date paid</dt>
            <dd className="font-bold">
              {formatDate(data.paid_on)} · {methodLabel(data.method)}
            </dd>
          </div>
          <div>
            <dt className="text-ink-soft">Received from (tenant)</dt>
            <dd className="font-bold">{data.tenant_name}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Received by (landlord)</dt>
            <dd className="font-bold">{data.landlord_name}</dd>
          </div>
          <div>
            <dt className="text-ink-soft">Room</dt>
            <dd className="font-bold">
              {data.room_label}, {data.property_name}, {data.property_address}
            </dd>
          </div>
          {data.note && (
            <div>
              <dt className="text-ink-soft">Note</dt>
              <dd className="font-bold">{data.note}</dd>
            </div>
          )}
        </dl>
      </article>

      <PrintButton />
    </div>
  );
}
