"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createInvite(agreementId: string) {
  const supabase = await createClient();
  await supabase.rpc("create_invite", { p_agreement: agreementId });
  revalidatePath(`/landlord/agreements/${agreementId}`);
}

export async function revokeInvite(tenancyId: string, agreementId: string) {
  const supabase = await createClient();
  await supabase.rpc("revoke_invite", { p_tenancy: tenancyId });
  revalidatePath(`/landlord/agreements/${agreementId}`);
}

export async function cancelAgreement(agreementId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("cancel_agreement", { p_agreement: agreementId });
  if (error) {
    redirect(`/landlord/agreements/${agreementId}`);
  }
  revalidatePath("/landlord/agreements");
  redirect("/landlord/agreements");
}
