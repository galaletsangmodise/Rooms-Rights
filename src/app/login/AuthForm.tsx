"use client";

import { useActionState } from "react";
import { signIn, signUp } from "@/app/auth/actions";
import type { FormState } from "@/lib/form-state";
import { btnPrimary, inputCls } from "@/lib/ui";

export function AuthForm({
  mode,
  role,
}: {
  mode: "login" | "signup";
  role?: "landlord" | "tenant";
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    mode === "signup" ? signUp : signIn,
    undefined,
  );

  return (
    <form action={action} className="space-y-4">
      {mode === "signup" && (
        <>
          <input type="hidden" name="role" value={role} />
          <div>
            <label htmlFor="full_name" className="mb-1 block text-sm font-semibold">
              Full name
            </label>
            <input id="full_name" name="full_name" autoComplete="name" required className={inputCls} />
          </div>
        </>
      )}

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          minLength={mode === "signup" ? 8 : undefined}
          required
          className={inputCls}
        />
      </div>

      {state?.error && (
        <p role="alert" className="rounded-xl bg-orange-pale px-4 py-3 text-sm font-semibold text-orange">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Please wait..." : mode === "signup" ? "Create account" : "Log in"}
      </button>

      <p className="text-center text-xs text-ink-soft">Your information stays private.</p>
    </form>
  );
}