import { createClient } from "@/lib/supabase/server";
import { isDocumentFilter } from "@/lib/documents";
import { loadVault } from "@/lib/vault";
import { cardCls } from "@/lib/ui";
import { VaultView } from "@/components/VaultView";

export default async function TenantVaultPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const supabase = await createClient();

  // Row level security only returns this tenant's own tenancies.
  const { data: tenancy } = await supabase
    .from("tenancies")
    .select("room_id")
    .neq("status", "ended")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-3xl px-5 pt-8">
      <h1 className="mb-6 text-3xl font-extrabold">Evidence Vault</h1>

      {!tenancy ? (
        <div className={cardCls}>
          <p className="font-bold">No room yet</p>
          <p className="mt-1 text-ink-soft">Join your room with a code from your landlord to use the vault.</p>
        </div>
      ) : (
        <VaultView
          roomId={tenancy.room_id as string}
          basePath="/tenant/vault"
          filter={isDocumentFilter(type) ? type : "all"}
          {...(await loadVault(supabase, tenancy.room_id as string))}
          isLandlord={false}
        />
      )}
    </div>
  );
}
