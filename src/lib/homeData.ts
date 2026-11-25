import type { SupabaseClient } from "@supabase/supabase-js";
import type { ChecklistItem } from "@/components/Checklist";
import { buildLedger, type Ledger } from "./ledger";
import { loadPayments } from "./money";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Due this month" until the month is paid, then "Due 01 <next month>". */
export function nextDueLabel(today: Date, currentMonthPaid: boolean): string {
  if (!currentMonthPaid) return "Due this month";
  const next = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 1));
  return `Due 01 ${MONTHS[next.getUTCMonth()]}`;
}

export function tenantChecklist(input: {
  agreementId?: string;
  agreementStatus?: string;
  depositPaid: number;
  rentPaid: number;
  hasDocuments: boolean;
}): ChecklistItem[] {
  return [
    {
      label: "Agreement documented",
      done: input.agreementStatus === "valid" || input.agreementStatus === "recorded",
      href: input.agreementId ? `/tenant/agreements/${input.agreementId}` : "/tenant/join",
    },
    { label: "Deposit recorded", done: input.depositPaid > 0, href: "/tenant/money" },
    { label: "First rent payment recorded", done: input.rentPaid > 0, href: "/tenant/money" },
    { label: "Add photos or papers to your Vault", done: input.hasDocuments, href: "/tenant/vault" },
  ];
}

export function landlordChecklist(input: {
  rooms: number;
  agreements: number;
  tenants: number;
  payments: number;
}): ChecklistItem[] {
  return [
    { label: "Add your first room", done: input.rooms > 0, href: "/landlord/rooms/new" },
    { label: "Create an agreement", done: input.agreements > 0, href: "/landlord/agreements/new" },
    { label: "Invite your tenant to join", done: input.tenants > 0, href: "/landlord/agreements" },
    { label: "Record the first payment", done: input.payments > 0, href: "/landlord/rooms" },
  ];
}

export type TenantMoney = {
  rent: number;
  ledger: Ledger;
  rentPaid: number;
  hasDocuments: boolean;
};

export async function loadTenantMoney(supabase: SupabaseClient): Promise<TenantMoney | null> {
  const { data: tenancy } = await supabase
    .from("tenancies")
    .select("id, room_id, created_at")
    .neq("status", "ended")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!tenancy) return null;

  const { data: room } = await supabase
    .from("rooms")
    .select("rent_amount")
    .eq("id", tenancy.room_id)
    .single();
  if (!room) return null;

  const rent = Number(room.rent_amount);
  const payments = await loadPayments(supabase, tenancy.id as string);
  const ledger = buildLedger({
    rent,
    startDate: tenancy.created_at as string,
    today: new Date(),
    payments,
  });
  const { count } = await supabase.from("documents").select("id", { count: "exact", head: true });

  return { rent, ledger, rentPaid: ledger.paidRent, hasDocuments: (count ?? 0) > 0 };
}
