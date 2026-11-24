import Link from "next/link";
import { btnPrimary } from "@/lib/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-extrabold text-maroon">We could not find that page</h1>
      <p className="mt-3 text-ink-soft">The link may be old, or you may not have access to it.</p>
      <Link href="/" className={`${btnPrimary} mt-6`}>
        Go home
      </Link>
    </div>
  );
}
