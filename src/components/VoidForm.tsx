"use client";

import { useActionState } from "react";
import { voidPayment, type PaymentState } from "@/app/actions/payments";
import { inputCls } from "@/lib/ui";

export function VoidForm({ paymentId }: { paymentId: string }) {
  const [state, action, pending] = useActionState<PaymentState, FormData>(voidPayment, {});

  return (
    <details className="mt-3">
      <summary className="cursor-pointer text-sm font-semibold text-maroon underline">
        Void this payment
      </summary>
      <form action={action} className="mt-2 space-y-2">
        <input type="hidden" name="payment_id" value={paymentId} />
        <label htmlFor={`reason-${paymentId}`} className="block text-sm font-semibold">
          Why is it being voided?
        </label>
        <input
          id={`reason-${paymentId}`}
          name="reason"
          type="text"
          maxLength={200}
          required
          className={inputCls}
        />
        {state.error && (
          <p role="alert" className="text-sm font-semibold text-orange">
            {state.error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full border-2 border-maroon px-5 py-2 text-sm font-bold text-maroon"
        >
          {pending ? "Voiding..." : "Confirm void"}
        </button>
      </form>
    </details>
  );
}
