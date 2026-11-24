import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { cardCls } from "@/lib/ui";

export default async function AdminHome() {
  const supabase = await createClient();

  const [landlords, tenants, rooms] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "landlord"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "tenant"),
    supabase.from("rooms").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Landlords", value: landlords.count ?? 0 },
    { label: "Tenants", value: tenants.count ?? 0 },
    { label: "Rooms", value: rooms.count ?? 0 },
  ];

  return (
    <>
      <h1 className="mt-8 text-3xl font-extrabold">Admin</h1>
      <div className="mt-6 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={cardCls}>
            <p className="text-sm text-ink-soft">{s.label}</p>
            <p className="text-2xl font-extrabold">{s.value}</p>
          </div>
        ))}
      </div>

      <Link href="/admin/templates" className="mt-6 inline-block font-bold text-maroon underline">
        Manage the clause library
      </Link>
    </>
  );
}
