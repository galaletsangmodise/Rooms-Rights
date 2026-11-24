"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { paymentSchema } from "@/lib/ledger";

export type PaymentState = { error?: string; ok?: boolean };

function friendly(error: { code?: string; message: string }): string {
  if (error.code === "42501") return "You are not allowed to do that for this room.";
  if (error.code === "22023") return error.message;
  return "Something went wrong. Please try again.";
}

export async function recordPayment(
  _prev: PaymentState,
  formData: FormData,
): Promise<PaymentState> {
  const parsed = paymentSchema.safeParse({
    tenancy_id: formData.get("tenancy_id"),
    kind: formData.get("kind"),
    amount: formData.get("amount"),
    month: formData.get("month") ?? "",
    paid_on: formData.get("paid_on"),
    method: formData.get("method"),
    note: formData.get("note") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const p = parsed.data;
  const supabase = await createClient();
  const { error } = await supabase.rpc("record_payment", {
    p_tenancy: p.tenancy_id,
    p_kind: p.kind,
    p_amount: p.amount,
    p_period: p.kind === "rent" ? `${p.month}-01` : null,
    p_paid_on: p.paid_on,
    p_method: p.method,
    p_note: p.note || null,
  });
  if (error) return { error: friendly(error) };

  revalidatePath("/landlord", "layout");
  revalidatePath("/tenant", "layout");
  return { ok: true };
}

export async function voidPayment(
  _prev: PaymentState,
  formData: FormData,
): Promise<PaymentState> {
  const paymentId = String(formData.get("payment_id") ?? "");
  const reason = String(formData.get("reason") ?? "").trim();
  if (reason.length < 3) return { error: "Give a short reason for voiding." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("void_payment", {
    p_payment: paymentId,
    p_reason: reason,
  });
  if (error) return { error: friendly(error) };

  revalidatePath("/landlord", "layout");
  revalidatePath("/tenant", "layout");
  return { ok: true };
}
