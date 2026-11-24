import { z } from "zod";

export type AgreementType = "written" | "oral";
export type AgreementStatus = "draft" | "pending" | "valid" | "recorded" | "superseded";

export type AgreementTerms = {
  landlord_name: string;
  tenant_name: string;
  tenant_phone: string;
  property_name: string;
  address: string;
  suburb: string;
  room_label: string;
  start_date: string;
  notice_days: number;
  rent_amount: number;
  rent_due_day: number;
  deposit_amount: number;
  electricity: string;
  water: string;
  house_rules: string;
  oral_notes: string;
};

export const agreementSchema = z
  .object({
    room_id: z.string().uuid("Choose a room."),
    type: z.enum(["written", "oral"]),
    tenant_name: z.string().trim().min(1, "Enter the tenant's full name."),
    tenant_phone: z.string().trim().default(""),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose the start date."),
    notice_days: z.coerce
      .number()
      .int()
      .min(1, "Notice must be between 1 and 90 days.")
      .max(90, "Notice must be between 1 and 90 days."),
    oral_notes: z.string().trim().default(""),
  })
  .refine((data) => data.type !== "oral" || data.oral_notes.length > 0, {
    message: "Write down what you both agreed.",
    path: ["oral_notes"],
  });

export type AgreementInput = z.infer<typeof agreementSchema>;

export function buildTerms(args: {
  landlordName: string;
  property: { name: string; address: string; suburb: string };
  room: {
    label: string;
    rent_amount: number;
    deposit_amount: number;
    rent_due_day: number;
    electricity: string;
    water: string;
    house_rules: string;
  };
  input: Pick<AgreementInput, "tenant_name" | "tenant_phone" | "start_date" | "notice_days" | "oral_notes">;
}): AgreementTerms {
  const { landlordName, property, room, input } = args;
  return {
    landlord_name: landlordName,
    tenant_name: input.tenant_name,
    tenant_phone: input.tenant_phone,
    property_name: property.name,
    address: property.address,
    suburb: property.suburb,
    room_label: room.label,
    start_date: input.start_date,
    notice_days: input.notice_days,
    rent_amount: room.rent_amount,
    rent_due_day: room.rent_due_day,
    deposit_amount: room.deposit_amount,
    electricity: room.electricity,
    water: room.water,
    house_rules: room.house_rules,
    oral_notes: input.oral_notes,
  };
}

export function agreementStatus(status: AgreementStatus): {
  label: string;
  tone: "green" | "orange" | "sand";
} {
  switch (status) {
    case "draft":
      return { label: "Draft", tone: "sand" };
    case "pending":
      return { label: "Pending", tone: "orange" };
    case "valid":
      return { label: "Valid", tone: "green" };
    case "recorded":
      return { label: "Recorded", tone: "sand" };
    case "superseded":
      return { label: "Cancelled", tone: "sand" };
  }
}

export function ordinal(n: number): string {
  const lastTwo = n % 100;
  if (lastTwo >= 11 && lastTwo <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

const ELECTRICITY: Record<string, string> = {
  included: "Included in the rent",
  prepaid_meter: "Prepaid meter (tenant buys)",
  shared: "Shared meter",
  none: "Not available",
};

const WATER: Record<string, string> = {
  included: "Included in the rent",
  shared: "Shared tap",
  none: "Not available",
};

export const electricityLabel = (value: string) => ELECTRICITY[value] ?? value;
export const waterLabel = (value: string) => WATER[value] ?? value;
