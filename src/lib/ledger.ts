import { z } from "zod";

export const PAYMENT_KINDS = ["rent", "deposit"] as const;
export const METHODS = ["cash", "eft", "other"] as const;
export const MAX_AMOUNT = 1_000_000;

export type PaymentKind = (typeof PAYMENT_KINDS)[number];

const METHOD_LABELS: Record<(typeof METHODS)[number], string> = {
  cash: "Cash",
  eft: "EFT",
  other: "Other",
};

export function methodLabel(method: string): string {
  return METHOD_LABELS[method as keyof typeof METHOD_LABELS] ?? method;
}

export function kindLabel(kind: string): string {
  return kind === "deposit" ? "Deposit" : "Rent";
}

export function ymOf(date: string | Date): string {
  return typeof date === "string" ? date.slice(0, 7) : date.toISOString().slice(0, 7);
}

export function monthsBetween(startYm: string, endYm: string): number {
  const [sy, sm] = startYm.split("-").map(Number);
  const [ey, em] = endYm.split("-").map(Number);
  return Math.max(0, (ey - sy) * 12 + (em - sm) + 1);
}

export function periodLabel(period: string | null): string {
  if (!period) return "";
  const [year, month] = period.slice(0, 7).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-ZA", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const paymentSchema = z
  .object({
    tenancy_id: z.string().uuid(),
    kind: z.enum(PAYMENT_KINDS),
    amount: z.coerce
      .number()
      .positive("Enter an amount above R0.")
      .max(MAX_AMOUNT, "That amount is too big."),
    month: z.string().optional(),
    paid_on: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose the date paid."),
    method: z.enum(METHODS),
    note: z.string().trim().max(200, "Keep the note under 200 characters.").optional(),
  })
  .refine((p) => p.kind === "deposit" || /^\d{4}-\d{2}$/.test(p.month ?? ""), {
    message: "Choose the month this rent is for.",
    path: ["month"],
  })
  .refine((p) => p.paid_on <= new Date().toISOString().slice(0, 10), {
    message: "The payment date cannot be in the future.",
    path: ["paid_on"],
  });

export type LedgerPayment = {
  id: string;
  kind: PaymentKind;
  amount: number;
  period: string | null;
  voided_at: string | null;
};

export type Ledger = {
  monthsDue: number;
  expected: number;
  paidRent: number;
  arrears: number;
  depositPaid: number;
  currentMonthPaid: boolean;
};

/**
 * Simple version-1 rule: rent is owed for every month from the move-in
 * month up to the current month, inclusive. Voided payments are ignored.
 */
export function buildLedger(input: {
  rent: number;
  startDate: string;
  today: Date;
  payments: LedgerPayment[];
}): Ledger {
  const active = input.payments.filter((p) => !p.voided_at);
  const rentPayments = active.filter((p) => p.kind === "rent");

  const currentYm = ymOf(input.today);
  const monthsDue = monthsBetween(ymOf(input.startDate), currentYm);
  const expected = monthsDue * input.rent;
  const paidRent = rentPayments.reduce((sum, p) => sum + Number(p.amount), 0);
  const paidThisMonth = rentPayments
    .filter((p) => p.period && ymOf(p.period) === currentYm)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return {
    monthsDue,
    expected,
    paidRent,
    arrears: Math.max(0, expected - paidRent),
    depositPaid: active
      .filter((p) => p.kind === "deposit")
      .reduce((sum, p) => sum + Number(p.amount), 0),
    currentMonthPaid: paidThisMonth >= input.rent,
  };
}
