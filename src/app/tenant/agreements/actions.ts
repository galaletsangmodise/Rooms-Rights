"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function acceptAgreement(agreementId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("accept_agreement", { p_agreement: agreementId });

  if (error) {
    redirect(`/tenant/agreements/${agreementId}?error=1`);
  }

  revalidatePath("/tenant", "layout");
  redirect(`/tenant/agreements/${agreementId}`);
}
