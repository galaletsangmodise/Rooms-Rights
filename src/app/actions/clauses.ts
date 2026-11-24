"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { clauseSchema } from "@/lib/clauses";

export type ClauseState = { error?: string; ok?: boolean };

export async function addClause(_prev: ClauseState, formData: FormData): Promise<ClauseState> {
  const parsed = clauseSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.rpc("add_clause", {
    p_title: parsed.data.title,
    p_body: parsed.data.body,
  });
  if (error) {
    return {
      error: error.code === "42501" ? "Only the admin can add clauses." : "Something went wrong. Please try again.",
    };
  }

  revalidatePath("/admin/templates");
  revalidatePath("/landlord/clauses");
  return { ok: true };
}

export async function toggleClause(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";

  const supabase = await createClient();
  await supabase.rpc("set_clause_active", { p_id: id, p_active: active });

  revalidatePath("/admin/templates");
  revalidatePath("/landlord/clauses");
}
