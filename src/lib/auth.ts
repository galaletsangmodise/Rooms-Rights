import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { homePathForRole, type Role } from "@/lib/roles";

export type Profile = {
  id: string;
  role: Role;
  full_name: string;
  phone: string | null;
  language: string;
};

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, role, full_name, phone, language")
    .eq("id", user.id)
    .single();

  return (data as Profile | null) ?? null;
}

// Use at the top of every role layout. Logged out → login. Wrong role → their own home.
export async function requireRole(role: Role): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== role) redirect(homePathForRole(profile.role));
  return profile;
}