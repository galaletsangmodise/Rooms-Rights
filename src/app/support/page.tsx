import Link from "next/link";
import { ArrowLeft, Building2, Phone, Scale, Users } from "lucide-react";
import { cardCls } from "@/lib/ui";

export const metadata = { title: "Find your support" };

export default function SupportPage() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-6 pb-12 pt-6">
      <Link href="/" aria-label="Back" className="inline-block p-1">
        <ArrowLeft />
      </Link>

      <h1 className="mt-6 text-3xl font-extrabold leading-tight">Find your support</h1>
      <p className="mt-3 text-ink-soft">Get help from trusted community resources.</p>

      <ul className="mt-8 space-y-4">
        <li className={`${cardCls} flex gap-4`}>
          <Scale className="mt-1 shrink-0 text-maroon" aria-hidden="true" />
          <div>
            <h2 className="font-bold">Legal Aid South Africa</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Free legal advice for people who cannot afford a lawyer. The advice line is open
              weekdays, 7am to 7pm.
            </p>
            <a
              href="tel:0800110110"
              className="mt-3 inline-flex items-center gap-2 font-bold text-maroon underline"
            >
              <Phone size={16} aria-hidden="true" /> 0800 110 110
            </a>
            <p className="mt-2 text-xs text-ink-soft">
              Calling from a cellphone? Send a Please Call Me to 079 835 7179 and they call you
              back.
            </p>
          </div>
        </li>

        <li className={`${cardCls} flex gap-4`}>
          <Building2 className="mt-1 shrink-0 text-maroon" aria-hidden="true" />
          <div>
            <h2 className="font-bold">Rental Housing Tribunal</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Every province has a tribunal that helps tenants and landlords settle disputes. Ask
              your provincial Department of Human Settlements how to lodge a complaint.
            </p>
          </div>
        </li>

        <li className={`${cardCls} flex gap-4`}>
          <Users className="mt-1 shrink-0 text-maroon" aria-hidden="true" />
          <div>
            <h2 className="font-bold">Community advice offices and paralegals</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Many areas have a community advice office run by paralegals. Ask at your ward
              councillor&apos;s office or local library where the nearest one is.
            </p>
          </div>
        </li>
      </ul>

      <p className="mt-8 text-xs text-ink-soft">
        Rooms&amp;Rights gives information to help you keep records. It is not legal advice.
      </p>
    </main>
  );
}
