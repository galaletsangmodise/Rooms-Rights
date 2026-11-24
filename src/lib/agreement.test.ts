import { agreementSchema, agreementStatus, buildTerms, ordinal } from "./agreement";

const validInput = {
  room_id: "7b1d2f1e-3c4a-4b5d-8e6f-1a2b3c4d5e6f",
  type: "written",
  tenant_name: "Thandeka Dlamini",
  tenant_phone: "0821234567",
  start_date: "2026-12-01",
  notice_days: "30",
  oral_notes: "",
};

describe("agreementSchema", () => {
  it("accepts a written agreement and turns notice days into a number", () => {
    const result = agreementSchema.safeParse(validInput);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.notice_days).toBe(30);
  });

  it("requires the tenant's name", () => {
    expect(agreementSchema.safeParse({ ...validInput, tenant_name: " " }).success).toBe(false);
  });

  it("requires a valid start date", () => {
    expect(agreementSchema.safeParse({ ...validInput, start_date: "" }).success).toBe(false);
    expect(agreementSchema.safeParse({ ...validInput, start_date: "01/12/2026" }).success).toBe(false);
  });

  it("keeps notice between 1 and 90 days", () => {
    expect(agreementSchema.safeParse({ ...validInput, notice_days: "0" }).success).toBe(false);
    expect(agreementSchema.safeParse({ ...validInput, notice_days: "91" }).success).toBe(false);
  });

  it("requires the agreed terms to be written down for an oral agreement", () => {
    expect(agreementSchema.safeParse({ ...validInput, type: "oral" }).success).toBe(false);
    expect(
      agreementSchema.safeParse({ ...validInput, type: "oral", oral_notes: "Rent R1,200, no visitors after 10pm" })
        .success,
    ).toBe(true);
  });

  it("rejects an unknown agreement type", () => {
    expect(agreementSchema.safeParse({ ...validInput, type: "verbal" }).success).toBe(false);
  });
});

describe("agreementStatus", () => {
  it("maps each status to a label and a colour", () => {
    expect(agreementStatus("draft")).toEqual({ label: "Draft", tone: "sand" });
    expect(agreementStatus("pending")).toEqual({ label: "Pending", tone: "orange" });
    expect(agreementStatus("valid")).toEqual({ label: "Valid", tone: "green" });
    expect(agreementStatus("recorded")).toEqual({ label: "Recorded", tone: "sand" });
    expect(agreementStatus("superseded")).toEqual({ label: "Cancelled", tone: "sand" });
  });
});

describe("ordinal", () => {
  it("adds the right suffix", () => {
    expect(ordinal(1)).toBe("1st");
    expect(ordinal(2)).toBe("2nd");
    expect(ordinal(3)).toBe("3rd");
    expect(ordinal(4)).toBe("4th");
    expect(ordinal(11)).toBe("11th");
    expect(ordinal(21)).toBe("21st");
    expect(ordinal(22)).toBe("22nd");
  });
});

describe("buildTerms", () => {
  it("copies the room settings and the landlord details into the agreement", () => {
    const terms = buildTerms({
      landlordName: "Mama Dineo",
      property: { name: "12 Mokoena Street", address: "12 Mokoena Street", suburb: "Soweto" },
      room: {
        label: "Room 1",
        rent_amount: 1200,
        deposit_amount: 1000,
        rent_due_day: 1,
        electricity: "prepaid_meter",
        water: "included",
        house_rules: "No loud music",
      },
      input: {
        tenant_name: "Thandeka Dlamini",
        tenant_phone: "",
        start_date: "2026-12-01",
        notice_days: 30,
        oral_notes: "",
      },
    });

    expect(terms.landlord_name).toBe("Mama Dineo");
    expect(terms.tenant_name).toBe("Thandeka Dlamini");
    expect(terms.room_label).toBe("Room 1");
    expect(terms.rent_amount).toBe(1200);
    expect(terms.deposit_amount).toBe(1000);
    expect(terms.house_rules).toBe("No loud music");
    expect(terms.notice_days).toBe(30);
  });
});
