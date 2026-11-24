"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/form-state";
import { btnPrimary, inputCls } from "@/lib/ui";
import { Field } from "./Field";

export function PropertyForm({
  action,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Property name" htmlFor="name" hint="For example: 12 Mokoena Street">
        <input id="name" name="name" required className={inputCls} />
      </Field>

      <Field label="Street address" htmlFor="address">
        <input id="address" name="address" autoComplete="street-address" required className={inputCls} />
      </Field>

      <Field label="Suburb or area" htmlFor="suburb">
        <input id="suburb" name="suburb" className={inputCls} />
      </Field>

      <Field label="Notes" htmlFor="notes" hint="Optional">
        <textarea id="notes" name="notes" rows={3} className={inputCls} />
      </Field>

      {state?.error && (
        <p role="alert" className="rounded-xl bg-orange-pale px-4 py-3 text-sm font-semibold text-orange">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Saving..." : "Save property"}
      </button>
    </form>
  );
}