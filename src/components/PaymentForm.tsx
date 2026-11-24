"use client";

import { useActionState, useState } from "react";
import { recordPayment, type PaymentState } from "@/app/actions/payments";
import { btnPrimary, cardCls, inputCls } from "@/lib/ui";
import { Field } from "./Field";

export function PaymentForm({ tenancyId, today }: { tenancyId: string; today: string }) {
  const [state, action, pending] = useActionState<PaymentState, FormData>(recordPayment, {});
  const [kind, setKind] = useState("rent");

  return (
    <form action={action} className={`${cardCls} space-y-4`}>
      <h2 className="text-lg font-bold">Record a payment</h2>
      <input type="hidden" name="tenancy_id" value={tenancyId} />

      <Field label="What was paid?" htmlFor="kind">
        <select
          id="kind"
          name="kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className={inputCls}
        >
          <option value="rent">Rent</option>
          <option value="deposit">Deposit</option>
        </select>
      </Field>

      <Field label="Amount (R)" htmlFor="amount">
        <input
          id="amount"
          name="amount"
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          required
          className={inputCls}
        />
      </Field>

      {kind === "rent" && (
        <Field label="Rent for which month?" htmlFor="month">
          <input
            id="month"
            name="month"
            type="month"
            defaultValue={today.slice(0, 7)}
            required
            className={inputCls}
          />
        </Field>
      )}

      <Field label="Date paid" htmlFor="paid_on">
        <input
          id="paid_on"
          name="paid_on"
          type="date"
          defaultValue={today}
          max={today}
          required
          className={inputCls}
        />
      </Field>

      <Field label="How was it paid?" htmlFor="method">
        <select id="method" name="method" defaultValue="cash" className={inputCls}>
          <option value="cash">Cash</option>
          <option value="eft">EFT</option>
          <option value="other">Other</option>
        </select>
      </Field>

      <Field label="Note (optional)" htmlFor="note">
        <input id="note" name="note" type="text" maxLength={200} className={inputCls} />
      </Field>

      {state.error && (
        <p role="alert" className="rounded-xl bg-orange-pale px-4 py-3 text-sm font-semibold text-orange">
          {state.error}
        </p>
      )}
      {state.ok && !state.error && (
        <p role="status" className="rounded-xl bg-sand px-4 py-3 text-sm font-semibold text-maroon">
          Payment saved. A receipt was created.
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Saving..." : "Save payment"}
      </button>
    </form>
  );
}
