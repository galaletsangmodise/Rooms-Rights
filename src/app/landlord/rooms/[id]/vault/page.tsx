import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isDocumentFilter } from "@/lib/documents";
import { loadVault } from "@/lib/vault";
import { VaultView } from "@/components/VaultView";

export default async function LandlordVaultPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { id } = await params;
  const { type } = await searchParams;
  const supabase = await createClient();

  const { data: room } = await supabase.from("rooms").select("id, label").eq("id", id).single();
  if (!room) notFound();

  const { documents, urls } = await loadVault(supabase, id);

  return (
    <div className="mx-auto max-w-3xl px-5 pt-6">
      <Link href={`/landlord/rooms/${id}/edit`} aria-label="Back" className="inline-block p-1">
        <ArrowLeft />
      </Link>
      <h1 className="mt-4 mb-1 text-3xl font-extrabold">Evidence Vault</h1>
      <p className="mb-6 text-ink-soft">{room.label}</p>

      <VaultView
        roomId={id}
        basePath={`/landlord/rooms/${id}/vault`}
        filter={isDocumentFilter(type) ? type : "all"}
        documents={documents}
        urls={urls}
        isLandlord
      />
    </div>
  );
}
