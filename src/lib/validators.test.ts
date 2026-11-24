import { z } from "zod";

export const ELECTRICITY = ["included", "prepaid_meter", "shared", "none"] as const;
export const WATER = ["included", "shared", "none"] as const;

export const propertySchema = z.object({
  name: z.string().trim().min(1, "Give the property a name, for example 12 Mokoena Street."),
  address: z.string().trim().min(1, "Enter the street address."),
  suburb: z.string().trim().default(""),
  notes: z.string().trim().default(""),
});

export const roomSchema = z.object({
  property_id: z.string().uuid("Choose a property."),
  label: z.string().trim().min(1, "Give the room a name, for example Room 1."),
  rent_amount: z.coerce
    .number()
    .int("Enter the rent in whole rands.")
    .min(1, "Rent must be more than R0."),
  deposit_amount: z.coerce
    .number()
    .int("Enter the deposit in whole rands.")
    .min(0, "The deposit cannot be negative."),
  rent_due_day: z.coerce
    .number()
    .int()
    .min(1, "Choose a day between 1 and 31.")
    .max(31, "Choose a day between 1 and 31."),
  electricity: z.enum(ELECTRICITY),
  water: z.enum(WATER),
  house_rules: z.string().trim().default(""),
});

export const roomUpdateSchema = roomSchema.omit({ property_id: true });