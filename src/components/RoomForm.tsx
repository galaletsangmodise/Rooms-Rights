"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/form-state";
import { btnPrimary, inputCls } from "@/lib/ui";
import { Field } from "./Field";

export type RoomDefaults = {
  label: string;
  rent_amount: number;
  deposit_amount: number;
  rent_due_day: number;
  electricity: string;
  water: string;
  house_rules: string;
};

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  submitLabel: string;
  properties?: { id: string; name: string }[]; // only when creating
  defaultPropertyId?: string;
  room?: RoomDefaults; // only when editing
};

export function RoomForm({ action, submitLabel, properties, defaultPropertyId, room }: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {properties && (
        <Field label="Property" htmlFor="property_id">
          <select
            id="property_id"
            name="property_id"
            required
            defaultValue={defaultPropertyId ?? properties[0]?.id}
            className={inputCls}
          >
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field label="Room name" htmlFor="label" hint="For example: Room 1 or Backroom">
        <input id="label" name="label" required defaultValue={room?.label} className={inputCls} />
      </Field>

      <Field label="Monthly rent (R)" htmlFor="rent_amount">
        <input
          id="rent_amount"
          name="rent_amount"
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          required
          defaultValue={room?.rent_amount}
          className={inputCls}
        />
      </Field>

      <Field label="Deposit (R)" htmlFor="deposit_amount">
        <input
          id="deposit_amount"
          name="deposit_amount"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          required
          defaultValue={room?.deposit_amount ?? 0}
          className={inputCls}
        />
      </Field>

      <Field label="Rent due on day" htmlFor="rent_due_day" hint="Day of the month, 1 to 31">
        <input
          id="rent_due_day"
          name="rent_due_day"
          type="number"
          inputMode="numeric"
          min={1}
          max={31}
          required
          defaultValue={room?.rent_due_day ?? 1}
          className={inputCls}
        />
      </Field>

      <Field label="Electricity" htmlFor="electricity">
        <select
          id="electricity"
          name="electricity"
          defaultValue={room?.electricity ?? "included"}
          className={inputCls}
        >
          <option value="included">Included in the rent</option>
          <option value="prepaid_meter">Prepaid meter (tenant buys)</option>
          <option value="shared">Shared meter</option>
          <option value="none">Not available</option>
        </select>
      </Field>

      <Field label="Water" htmlFor="water">
        <select id="water" name="water" defaultValue={room?.water ?? "included"} className={inputCls}>
          <option value="included">Included in the rent</option>
          <option value="shared">Shared tap</option>
          <option value="none">Not available</option>
        </select>
      </Field>

      <Field label="House rules" htmlFor="house_rules" hint="Optional. These go into the agreement.">
        <textarea
          id="house_rules"
          name="house_rules"
          rows={4}
          defaultValue={room?.house_rules}
          className={inputCls}
        />
      </Field>

      {state?.error && (
        <p role="alert" className="rounded-xl bg-orange-pale px-4 py-3 text-sm font-semibold text-orange">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}