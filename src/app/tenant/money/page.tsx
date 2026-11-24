import { createClient } from "@/lib/supabase/server";
import { buildLedger } from "@/lib/ledger";
import { loadPayments } from "@/lib/money";
import { cardCls } from "@/lib/ui";
import { LedgerList } from "@/components/LedgerList";
import { MoneySummary } from "@/components/MoneySummary";

export const metadata = { title: "My rent" };

export default async function TenantMoneyPage() {
  const supabase = await createClient();

  const { data: tenancy } = await supabase
    .from("tenancies")
    .select("id, room_id, created_at")
    .neq("status", "ended")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: room } = tenancy
    ? await supabase.from("rooms").select("rent_amount").eq("id", tenancy.room_id).single()
    : { data: null };

  return (
    <div className="mx-auto max-w-3xl px-5 pt-8 pb-8">
      <h1 className="mb-6 text-3xl font-extrabold">My rent</h1>

      {!tenancy || !room ? (
        <div className={cardCls}>
          <p className="font-bold">No room yet</p>
          <p className="mt-1 text-ink-soft">Join your room with a code from your landlord.</p>
        </div>
      ) : (
        await (async () => {
          const payments = await loadPayments(supabase, tenancy.id as string);
          const rent = Number(room.rent_amount);
          const ledger = buildLedger({
            rent,
            startDate: tenancy.created_at as string,
            today: new Date(),
            payments,
          });
          return (
            <div className="space-y-6">
              <MoneySummary rent={rent} ledger={ledger} />
              <h2 className="text-lg font-bold">Payments</h2>
              <LedgerList payments={payments} receiptBase="/tenant/receipts" canVoid={false} />
            </div>
          );
        })()
      )}
    </div>
  );
}
