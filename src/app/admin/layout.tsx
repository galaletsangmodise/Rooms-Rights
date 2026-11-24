import { requireRole } from "@/lib/auth";
import { signOut } from "@/app/auth/actions";
import { Wordmark } from "@/components/Wordmark";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireRole("admin");
  return (
    <div className="mx-auto max-w-4xl px-5 py-6">
      <header className="flex items-center justify-between">
        <Wordmark />
        <form action={signOut}>
          <button type="submit" className="text-sm font-semibold text-maroon underline">
            Log out
          </button>
        </form>
      </header>
      {children}
    </div>
  );
}