"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/form-state";
import { btnPrimary, inputCls } from "@/lib/ui";
import { Field } from "./Field";

export function JoinForm({
  action,
  defaultCode = "",
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaultCode?: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Invite code" htmlFor="code" hint="Your landlord gave you this code or link.">
        <input
          id="code"
          name="code"
          defaultValue={defaultCode}
          autoComplete="off"
          autoCapitalize="characters"
          maxLength={12}
          required
          className={`${inputCls} text-center text-2xl font-bold uppercase tracking-widest`}
        />
      </Field>

      {state?.error && (
        <p role="alert" className="rounded-xl bg-orange-pale px-4 py-3 text-sm font-semibold text-orange">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Joining..." : "Join room"}
      </button>
    </form>
  );
}
