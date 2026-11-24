"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { documentSchema } from "@/lib/documents";

export async function saveDocument(input: unknown): Promise<{ error?: string }> {
  const parsed = documentSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("documents").insert(parsed.data);
  if (error) return { error: "We could not save the file details. Please try again." };

  revalidatePath("/landlord", "layout");
  revalidatePath("/tenant", "layout");
  return {};
}
