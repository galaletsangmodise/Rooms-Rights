"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidCode, normaliseCode } from "@/lib/invite";
import type { FormState } from "@/lib/form-state";

export async function joinWithInvite(_prev: FormState, formData: FormData): Promise<FormState> {
  const code = normaliseCode(String(formData.get("code") ?? ""));
  if (!isValidCode(code)) {
    return { error: "Enter the 8-character code your landlord gave you." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("join_with_invite", { p_code: code });

  if (error) {
    return {
      error:
        error.code === "P0001"
          ? "This code is invalid or has expired. Ask your landlord for a new one."
          : "We could not join the room. Please try again.",
    };
  }

  revalidatePath("/tenant", "layout");
  redirect(data ? `/tenant/agreements/${data}` : "/tenant/agreements");
}
