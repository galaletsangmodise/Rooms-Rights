import { requireRole } from "@/lib/auth";
import { currentHourInJohannesburg, greetingForHour } from "@/lib/greeting";
import { cardCls } from "@/lib/ui";

export default async function TenantHome() {
  const profile = await requireRole("tenant");
  const greeting = greetingForHour(currentHourInJohannesburg());
  const firstName = profile.full_name.split(" ")[0] || "there";

  return (
    <>
      <header className="bg-maroon px-5 pb-16 pt-8 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-extrabold">
            {greeting}, {firstName}
          </h1>
        </div>
      </header>

      <section className="mx-auto -mt-10 max-w-3xl px-5">
        <div className={cardCls}>
          <h2 className="text-lg font-bold">No room yet</h2>
          <p className="mt-2 text-ink-soft">
            Ask your landlord for an invite code or link. Once you join, your agreement, payments
            and receipts will appear here.
          </p>
        </div>
      </section>
    </>
  );
}