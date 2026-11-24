"use client";

import { useActionState, useState } from "react";
import { FileText, MessageSquareText } from "lucide-react";
import type { FormState } from "@/lib/form-state";
import { btnPrimary, inputCls } from "@/lib/ui";
import { Field } from "./Field";

export type RoomOption = { id: string; label: string; propertyName: string };

export function AgreementForm({
  action,
  rooms,
  defaultRoomId,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  rooms: RoomOption[];
  defaultRoomId?: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(action, undefined);
  const [type, setType] = useState<"written" | "oral">("written");

  const choices = [
    {
      value: "written" as const,
      title: "Written agreement",
      text: "We build a printable agreement.",
      Icon: FileText,
    },
    {
      value: "oral" as const,
      title: "Record oral terms",
      text: "Write down what you both agreed.",
      Icon: MessageSquareText,
    },
  ];

  return (
    <form action={formAction} className="space-y-5">
      <fieldset>
        <legend className="mb-2 text-sm font-semibold">How was it agreed?</legend>
        <div className="grid gap-3">
          {choices.map(({ value, title, text, Icon }) => (
            <label
              key={value}
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${
                type === value ? "border-maroon bg-cream-light ring-2 ring-maroon" : "border-tan bg-cream-light"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={value}
                checked={type === value}
                onChange={() => setType(value)}
                className="sr-only"
              />
              <Icon className="mt-0.5 text-maroon" />
              <span>
                <span className="block font-bold">{title}</span>
                <span className="text-sm text-ink-soft">{text}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field
        label="Room"
        htmlFor="room_id"
        hint="Rent, deposit and house rules come from the room. Edit the room first if anything is wrong."
      >
        <select id="room_id" name="room_id" required defaultValue={defaultRoomId} className={inputCls}>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.label} · {room.propertyName}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Tenant's full name" htmlFor="tenant_name">
        <input id="tenant_name" name="tenant_name" required className={inputCls} />
      </Field>

      <Field label="Tenant's phone" htmlFor="tenant_phone" hint="Optional">
        <input id="tenant_phone" name="tenant_phone" type="tel" className={inputCls} />
      </Field>

      <Field label="Start date" htmlFor="start_date">
        <input id="start_date" name="start_date" type="date" required className={inputCls} />
      </Field>

      <Field label="Notice to end (days)" htmlFor="notice_days" hint="Between 1 and 90 days">
        <input
          id="notice_days"
          name="notice_days"
          type="number"
          inputMode="numeric"
          min={1}
          max={90}
          defaultValue={30}
          required
          className={inputCls}
        />
      </Field>

      {type === "oral" && (
        <Field label="What was agreed" htmlFor="oral_notes" hint="Write it in plain words, as you both understood it.">
          <textarea id="oral_notes" name="oral_notes" rows={5} required className={inputCls} />
        </Field>
      )}

      {state?.error && (
        <p role="alert" className="rounded-xl bg-orange-pale px-4 py-3 text-sm font-semibold text-orange">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={btnPrimary}>
        {pending ? "Creating..." : "Create agreement"}
      </button>
    </form>
  );
}
