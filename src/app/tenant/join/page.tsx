import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { normaliseCode } from "@/lib/invite";
import { JoinForm } from "@/components/JoinForm";
import { joinWithInvite } from "./actions";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-5 pt-6">
      <Link href="/tenant" aria-label="Back" className="inline-block p-1">
        <ArrowLeft />
      </Link>
      <h1 className="mt-4 mb-6 text-3xl font-extrabold">Join your room</h1>
      <JoinForm action={joinWithInvite} defaultCode={normaliseCode(code ?? "")} />
    </div>
  );
}
