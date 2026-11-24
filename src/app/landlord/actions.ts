"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { propertySchema, roomSchema, roomUpdateSchema } from "@/lib/validators";
import type { FormState } from "@/lib/form-state";

export async function createProperty(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = propertySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("properties")
    .insert({ ...parsed.data, landlord_id: user.id })
    .select("id")
    .single();

  if (error || !data) return { error: "We could not save the property. Please try again." };

  revalidatePath("/landlord", "layout");
  redirect(`/landlord/rooms/new?property=${data.id}`);
}

export async function createRoom(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = roomSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("rooms").insert(parsed.data);
  if (error) return { error: "We could not save the room. Please try again." };

  revalidatePath("/landlord", "layout");
  redirect("/landlord");
}

export async function updateRoom(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = roomUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createClient();
  const { error } = await supabase.from("rooms").update(parsed.data).eq("id", id);
  if (error) return { error: "We could not save your changes. Please try again." };

  revalidatePath("/landlord", "layout");
  redirect("/landlord/rooms");
}

export async function archiveRoom(id: string) {
  const supabase = await createClient();
  await supabase.from("rooms").update({ archived_at: new Date().toISOString() }).eq("id", id);

  revalidatePath("/landlord", "layout");
  redirect("/landlord/rooms");
}