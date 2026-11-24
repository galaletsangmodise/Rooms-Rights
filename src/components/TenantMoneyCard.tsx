import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { buildLedger } from "@/lib/ledger";
import { loadPayments } from "@/lib/money";
import { MoneySummary } from "./MoneySummary";

export async function TenantMoneyCard() {
  const supabase = await createClient();

  const { data: tenancy } = await supabase
    .from("tenancies")
    .select("id, room_id, created_at")
    .neq("status", "ended")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!tenancy) return null;

  const { data: room } = await supabase
    .from("rooms")
    .select("rent_amount")
    .eq("id", tenancy.room_id)
    .single();
  if (!room) return null;

  const rent = Number(room.rent_amount);
  const payments = await loadPayments(supabase, tenancy.id as string);
  const ledger = buildLedger({
    rent,
    startDate: tenancy.created_at as string,
    today: new Date(),
    payments,
  });

  return (
    <section aria-label="My rent" className="space-y-2">
      <MoneySummary rent={rent} ledger={ledger} />
      <Link href="/tenant/money" className="inline-block font-bold text-maroon underline">
        See payments and receipts
      </Link>
    </section>
  );
}
