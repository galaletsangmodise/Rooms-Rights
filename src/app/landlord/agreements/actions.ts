"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { agreementSchema, buildTerms } from "@/lib/agreement";
import type { FormState } from "@/lib/form-state";

type RoomWithProperty = {
  id: string;
  label: string;
  rent_amount: number;
  deposit_amount: number;
  rent_due_day: number;
  electricity: string;
  water: string;
  house_rules: string;
  property: { name: string; address: string; suburb: string } | null;
};

export async function createAgreement(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = agreementSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "landlord") redirect("/login");

  const supabase = await createClient();
  const { data } = await supabase
    .from("rooms")
    .select(
      "id, label, rent_amount, deposit_amount, rent_due_day, electricity, water, house_rules, property:properties(name, address, suburb)",
    )
    .eq("id", parsed.data.room_id)
    .single();

  const room = data as unknown as RoomWithProperty | null;
  if (!room || !room.property) return { error: "We could not find that room." };

  const terms = buildTerms({
    landlordName: profile.full_name,
    property: room.property,
    room,
    input: parsed.data,
  });

  const { data: agreementId, error } = await supabase.rpc("create_agreement", {
    p_room: room.id,
    p_type: parsed.data.type,
    p_terms: terms,
  });

  if (error || !agreementId) {
    return {
      error:
        error?.code === "P0001"
          ? "This room already has an agreement in progress."
          : "We could not create the agreement. Please try again.",
    };
  }

  revalidatePath("/landlord/agreements");
  redirect(`/landlord/agreements/${agreementId}`);
}
