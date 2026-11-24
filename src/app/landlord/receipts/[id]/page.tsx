import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { loadReceipt } from "@/lib/money";
import { Receipt } from "@/components/Receipt";

export default async function LandlordReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const data = await loadReceipt(supabase, id);
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-xl px-5 pt-6 pb-8">
      <Link href="/landlord/rooms" aria-label="Back" className="inline-block p-1 print:hidden">
        <ArrowLeft />
      </Link>
      <div className="mt-4">
        <Receipt data={data} />
      </div>
    </div>
  );
}
