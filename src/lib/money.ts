import type { SupabaseClient } from "@supabase/supabase-js";
import type { ReceiptData } from "@/components/Receipt";

export type PaymentRow = {
  id: string;
  kind: "rent" | "deposit";
  amount: number;
  period: string | null;
  paid_on: string;
  method: string;
  note: string | null;
  receipt_no: string;
  voided_at: string | null;
  void_reason: string | null;
};

export async function loadPayments(supabase: SupabaseClient, tenancyId: string) {
  const { data } = await supabase
    .from("payments")
    .select("id, kind, amount, period, paid_on, method, note, receipt_no, voided_at, void_reason")
    .eq("tenancy_id", tenancyId)
    .order("paid_on", { ascending: false })
    .order("created_at", { ascending: false });

  return ((data ?? []) as PaymentRow[]).map((p) => ({ ...p, amount: Number(p.amount) }));
}

export async function loadReceipt(
  supabase: SupabaseClient,
  paymentId: string,
): Promise<ReceiptData | null> {
  const { data } = await supabase.rpc("receipt_details", { p_payment: paymentId });
  const row = Array.isArray(data) ? data[0] : null;
  if (!row) return null;
  return { ...row, amount: Number(row.amount) } as ReceiptData;
}
