import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { buildLedger } from "@/lib/ledger";
import { loadPayments } from "@/lib/money";
import { cardCls } from "@/lib/ui";
import { LedgerList } from "@/components/LedgerList";
import { MoneySummary } from "@/components/MoneySummary";
import { PaymentForm } from "@/components/PaymentForm";

export default async function LandlordMoneyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: room } = await supabase
    .from("rooms")
    .select("id, label, rent_amount")
    .eq("id", id)
    .single();
  if (!room) notFound();

  const { data: tenancy } = await supabase
    .from("tenancies")
    .select("id, created_at")
    .eq("room_id", id)
    .neq("status", "ended")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-3xl px-5 pt-6 pb-8">
      <Link href={`/landlord/rooms/${id}/edit`} aria-label="Back" className="inline-block p-1">
        <ArrowLeft />
      </Link>
      <h1 className="mt-4 mb-1 text-3xl font-extrabold">Rent and deposit</h1>
      <p className="mb-6 text-ink-soft">{room.label}</p>

      {!tenancy ? (
        <div className={cardCls}>
          <p className="font-bold">No tenant in this room yet</p>
          <p className="mt-1 text-ink-soft">
            Create an agreement and invite your tenant. Once they join, you can record payments here.
          </p>
          <Link href="/landlord/agreements/new" className="mt-3 inline-block font-bold text-maroon underline">
            Create an agreement
          </Link>
        </div>
      ) : (
        await (async () => {
          const payments = await loadPayments(supabase, tenancy.id as string);
          const ledger = buildLedger({
            rent: Number(room.rent_amount),
            startDate: tenancy.created_at as string,
            today: new Date(),
            payments,
          });
          return (
            <div className="space-y-6">
              <MoneySummary rent={Number(room.rent_amount)} ledger={ledger} />
              <PaymentForm tenancyId={tenancy.id as string} today={new Date().toISOString().slice(0, 10)} />
              <h2 className="text-lg font-bold">Payments</h2>
              <LedgerList payments={payments} receiptBase="/landlord/receipts" canVoid />
            </div>
          );
        })()
      )}
    </div>
  );
}
