import type { SupabaseClient } from "@supabase/supabase-js";

export type VaultDocument = {
  id: string;
  file_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  type: string;
  visibility: string;
  created_at: string;
};

export async function loadVault(supabase: SupabaseClient, roomId: string) {
  const { data } = await supabase
    .from("documents")
    .select("id, file_path, file_name, file_size, mime_type, type, visibility, created_at")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false });

  const documents = (data ?? []) as VaultDocument[];
  const urls: Record<string, string> = {};

  if (documents.length > 0) {
    const { data: signed } = await supabase.storage
      .from("evidence")
      .createSignedUrls(
        documents.map((d) => d.file_path),
        600,
      );

    for (const item of signed ?? []) {
      if (item.path && item.signedUrl) urls[item.path] = item.signedUrl;
    }
  }

  return { documents, urls };
}
