import { createClient } from "@/lib/supabase/server";
import { toggleClause } from "@/app/actions/clauses";
import type { Clause } from "@/lib/clauses";
import { cardCls } from "@/lib/ui";
import { ClauseAdminForm } from "@/components/ClauseAdminForm";
import { StatusChip } from "@/components/StatusChip";

export default async function AdminTemplatesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("clauses")
    .select("id, title, body, active")
    .order("created_at", { ascending: true });
  const clauses = (data ?? []) as Clause[];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-5 pt-8">
      <h1 className="text-3xl font-extrabold">Clause library</h1>
      <p className="text-ink-soft">
        Landlords see the active clauses and can copy them into their agreements.
      </p>

      <ClauseAdminForm />

      <ul className="space-y-3">
        {clauses.map((clause) => (
          <li key={clause.id} className={cardCls}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-bold">{clause.title}</p>
              <StatusChip tone={clause.active ? "green" : "sand"}>
                {clause.active ? "Active" : "Hidden"}
              </StatusChip>
            </div>
            <p className="mt-1 text-ink-soft">{clause.body}</p>

            <form action={toggleClause} className="mt-3">
              <input type="hidden" name="id" value={clause.id} />
              <input type="hidden" name="active" value={clause.active ? "false" : "true"} />
              <button
                type="submit"
                className="rounded-full border-2 border-maroon px-4 py-2 text-sm font-bold text-maroon"
              >
                {clause.active ? "Hide from landlords" : "Show to landlords"}
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
