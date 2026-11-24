import { buildLedger, monthsBetween, paymentSchema, ymOf } from "./ledger";

const tenancyId = "7b1d2f1e-3c4a-4b5d-8e6f-1a2b3c4d5e6f";

const validRent = {
  tenancy_id: tenancyId,
  kind: "rent",
  amount: "1200",
  month: "2026-11",
  paid_on: "2026-11-05",
  method: "cash",
};

describe("paymentSchema", () => {
  it("accepts a normal rent payment and turns the amount into a number", () => {
    const result = paymentSchema.safeParse(validRent);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.amount).toBe(1200);
  });

  it("accepts a deposit with no month", () => {
    expect(
      paymentSchema.safeParse({ ...validRent, kind: "deposit", month: "" }).success,
    ).toBe(true);
  });

  it("requires a month for rent", () => {
    expect(paymentSchema.safeParse({ ...validRent, month: "" }).success).toBe(false);
  });

  it("rejects zero, negative and huge amounts", () => {
    expect(paymentSchema.safeParse({ ...validRent, amount: "0" }).success).toBe(false);
    expect(paymentSchema.safeParse({ ...validRent, amount: "-50" }).success).toBe(false);
    expect(paymentSchema.safeParse({ ...validRent, amount: "5000000" }).success).toBe(false);
  });

  it("rejects an empty amount", () => {
    expect(paymentSchema.safeParse({ ...validRent, amount: "" }).success).toBe(false);
  });

  it("rejects a date in the future", () => {
    expect(paymentSchema.safeParse({ ...validRent, paid_on: "2999-01-01" }).success).toBe(false);
  });

  it("rejects an unknown payment method", () => {
    expect(paymentSchema.safeParse({ ...validRent, method: "bitcoin" }).success).toBe(false);
  });
});

describe("ymOf and monthsBetween", () => {
  it("reads the year and month from a date string", () => {
    expect(ymOf("2026-09-15")).toBe("2026-09");
  });

  it("counts months inclusively", () => {
    expect(monthsBetween("2026-09", "2026-11")).toBe(3);
    expect(monthsBetween("2026-11", "2026-11")).toBe(1);
    expect(monthsBetween("2025-12", "2026-02")).toBe(3);
  });

  it("never goes below zero", () => {
    expect(monthsBetween("2027-01", "2026-11")).toBe(0);
  });
});

describe("buildLedger", () => {
  const today = new Date("2026-11-23T10:00:00Z");
  const base = { rent: 1200, startDate: "2026-09-15", today };

  const rent = (period: string, amount = 1200, voided = false) => ({
    id: period,
    kind: "rent" as const,
    amount,
    period,
    voided_at: voided ? "2026-11-01T00:00:00Z" : null,
  });

  it("works out months due and the expected total from the move-in month", () => {
    const ledger = buildLedger({ ...base, payments: [] });
    expect(ledger.monthsDue).toBe(3);
    expect(ledger.expected).toBe(3600);
    expect(ledger.arrears).toBe(3600);
  });

  it("subtracts rent already paid", () => {
    const ledger = buildLedger({ ...base, payments: [rent("2026-09-01"), rent("2026-10-01")] });
    expect(ledger.paidRent).toBe(2400);
    expect(ledger.arrears).toBe(1200);
    expect(ledger.currentMonthPaid).toBe(false);
  });

  it("marks the current month as paid when enough was paid for it", () => {
    const ledger = buildLedger({ ...base, payments: [rent("2026-11-01")] });
    expect(ledger.currentMonthPaid).toBe(true);
  });

  it("ignores voided payments", () => {
    const ledger = buildLedger({ ...base, payments: [rent("2026-11-01", 1200, true)] });
    expect(ledger.paidRent).toBe(0);
    expect(ledger.currentMonthPaid).toBe(false);
  });

  it("never shows negative arrears when the tenant overpaid", () => {
    const ledger = buildLedger({ ...base, payments: [rent("2026-09-01", 5000)] });
    expect(ledger.arrears).toBe(0);
  });

  it("adds up deposits separately", () => {
    const ledger = buildLedger({
      ...base,
      payments: [
        { id: "d1", kind: "deposit", amount: 600, period: null, voided_at: null },
        { id: "d2", kind: "deposit", amount: 600, period: null, voided_at: null },
      ],
    });
    expect(ledger.depositPaid).toBe(1200);
    expect(ledger.paidRent).toBe(0);
  });
});
