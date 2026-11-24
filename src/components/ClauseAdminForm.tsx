"use client";

import { useActionState } from "react";
import { addClause, type ClauseState } from "@/app/actions/clauses";
import { btnPrimary, cardCls, inputCls } from "@/lib/ui";
import { Field } from "./Field";

export function ClauseAdminForm() {
  const [state, action, pending] = useActionState<ClauseState, FormData>(addClause, {});

  return (
    <form action={action} className={`${cardCls} space-y-4`}>
      <h2 className="text-lg font-bold">Add a clause</h2>

      <Field label="Title" htmlFor="title">
        <input id="title" name="title" type="text" maxLength={80} required className={inputCls} />
      </Field>

      <Field label="Clause text" htmlFor="body">
        <textarea id="body" name="body" rows={4} maxLength={1000} required className={inputCls} />
      </Field>

      {state.error && (
        <p role="alert" className="rounded-xl bg-orange-pale px-4 py-3 text-sm font-semibold text-orange">
          {state.error}
        </p>
      )}
      {state.ok && !state.error && (
        <p role="status" className="rounded-xl bg-sand px-4 py-3 text-sm font-semibold text-maroon">
          Clause added.
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Saving..." : "Add clause"}
      </button>
    </form>
  );
}
