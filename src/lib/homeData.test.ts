import { landlordChecklist, nextDueLabel, tenantChecklist } from "./homeData";

describe("nextDueLabel", () => {
  it("says due this month while the month is unpaid", () => {
    expect(nextDueLabel(new Date("2026-11-24T10:00:00Z"), false)).toBe("Due this month");
  });

  it("points to the first of next month once paid", () => {
    expect(nextDueLabel(new Date("2026-11-24T10:00:00Z"), true)).toBe("Due 01 Dec");
  });

  it("rolls over the year", () => {
    expect(nextDueLabel(new Date("2026-12-10T10:00:00Z"), true)).toBe("Due 01 Jan");
  });
});

describe("tenantChecklist", () => {
  it("marks nothing done for a tenant with no room yet", () => {
    const items = tenantChecklist({ depositPaid: 0, rentPaid: 0, hasDocuments: false });
    expect(items.every((i) => !i.done)).toBe(true);
    expect(items[0].href).toBe("/tenant/join");
  });

  it("marks the agreement done only when valid or recorded", () => {
    const base = { agreementId: "a1", depositPaid: 0, rentPaid: 0, hasDocuments: false };
    expect(tenantChecklist({ ...base, agreementStatus: "pending" })[0].done).toBe(false);
    expect(tenantChecklist({ ...base, agreementStatus: "valid" })[0].done).toBe(true);
    expect(tenantChecklist({ ...base, agreementStatus: "recorded" })[0].done).toBe(true);
  });

  it("marks deposit, rent and vault from the numbers", () => {
    const items = tenantChecklist({
      agreementId: "a1",
      agreementStatus: "valid",
      depositPaid: 1200,
      rentPaid: 1200,
      hasDocuments: true,
    });
    expect(items.every((i) => i.done)).toBe(true);
  });
});

describe("landlordChecklist", () => {
  it("starts with everything to do", () => {
    const items = landlordChecklist({ rooms: 0, agreements: 0, tenants: 0, payments: 0 });
    expect(items.map((i) => i.done)).toEqual([false, false, false, false]);
  });

  it("ticks items as the landlord progresses", () => {
    const items = landlordChecklist({ rooms: 2, agreements: 1, tenants: 0, payments: 0 });
    expect(items.map((i) => i.done)).toEqual([true, true, false, false]);
  });
});
