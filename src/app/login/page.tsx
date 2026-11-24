import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isSignupRole } from "@/lib/roles";
import { AuthForm } from "./AuthForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; role?: string }>;
}) {
  const { mode, role } = await searchParams;
  const isSignup = mode === "signup";

  if (isSignup && !isSignupRole(role)) redirect("/role");
  const signupRole = isSignupRole(role) ? role : undefined;

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 pt-6">
      <Link href={isSignup ? "/role" : "/"} aria-label="Back" className="inline-block p-1">
        <ArrowLeft />
      </Link>

      <h1 className="mt-6 text-3xl font-extrabold">
        {isSignup ? "Create your account." : "Welcome back."}
      </h1>
      {signupRole && (
        <p className="mt-2 text-ink-soft">
          Signing up as a {signupRole === "landlord" ? "landlord" : "tenant"}.
        </p>
      )}

      <div className="mt-8">
        <AuthForm mode={isSignup ? "signup" : "login"} role={signupRole} />
      </div>

      <p className="mt-6 text-center text-sm text-ink-soft">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-maroon underline">
              Log in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/role" className="font-bold text-maroon underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </main>
  );
}