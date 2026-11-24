import {
  electricityLabel,
  ordinal,
  waterLabel,
  type AgreementStatus,
  type AgreementTerms,
  type AgreementType,
} from "@/lib/agreement";
import { formatDate, formatRand } from "@/lib/format";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="border-b border-tan pb-1 text-xs font-bold uppercase tracking-wide text-ink-soft">
        {title}
      </h3>
      <dl className="mt-3 space-y-2">{children}</dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4">
      <dt className="text-ink-soft sm:w-40 sm:shrink-0">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

export function AgreementDocument({
  terms,
  type,
  status,
  acceptedAt,
}: {
  terms: AgreementTerms;
  type: AgreementType;
  status: AgreementStatus;
  acceptedAt?: string | null;
}) {
  const isOral = type === "oral";
  const place = [terms.address, terms.suburb].filter(Boolean).join(", ");

  return (
    <article className="rounded-2xl border border-tan bg-white p-6 text-sm leading-relaxed shadow-sm print:border-0 print:p-0 print:shadow-none">
      <h2 className="text-xl font-extrabold">
        {isOral ? "Record of Oral Agreement" : "Rental Agreement"}
      </h2>
      <p className="mt-1 text-ink-soft">
        {isOral
          ? "A written record of what the landlord and tenant agreed in person."
          : "An agreement between the landlord and the tenant for the room described below."}
      </p>

      <Section title="Parties">
        <Row label="Landlord" value={terms.landlord_name} />
        <Row label="Tenant" value={terms.tenant_name} />
        {terms.tenant_phone && <Row label="Tenant phone" value={terms.tenant_phone} />}
      </Section>

      <Section title="The room">
        <Row label="Property" value={terms.property_name} />
        <Row label="Address" value={place} />
        <Row label="Room" value={terms.room_label} />
        <Row label="Start date" value={formatDate(terms.start_date)} />
      </Section>

      <Section title="Rent and deposit">
        <Row label="Rent" value={`${formatRand(terms.rent_amount)} per month`} />
        <Row label="Rent is due on the" value={`${ordinal(terms.rent_due_day)} of each month`} />
        <Row label="Deposit" value={formatRand(terms.deposit_amount)} />
      </Section>

      <Section title="Services">
        <Row label="Electricity" value={electricityLabel(terms.electricity)} />
        <Row label="Water" value={waterLabel(terms.water)} />
      </Section>

      <Section title="Notice">
        <Row label="Notice to end" value={`${terms.notice_days} days, in writing`} />
      </Section>

      {terms.house_rules && (
        <Section title="House rules">
          <dd className="whitespace-pre-line font-semibold">{terms.house_rules}</dd>
        </Section>
      )}

      {isOral && terms.oral_notes && (
        <Section title="What was agreed">
          <dd className="whitespace-pre-line font-semibold">{terms.oral_notes}</dd>
        </Section>
      )}

      <section className="mt-8">
        {acceptedAt && (status === "valid" || status === "recorded") ? (
          <p className="font-semibold text-forest">
            Accepted by the tenant on {formatDate(acceptedAt)}
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-8 pt-6 text-xs text-ink-soft">
            <div className="border-t border-ink pt-1">Landlord signature</div>
            <div className="border-t border-ink pt-1">Tenant signature</div>
          </div>
        )}
      </section>

      <p className="mt-8 border-t border-tan pt-3 text-xs text-ink-soft">
        This document records what the landlord and tenant agreed. It is information, not legal
        advice. A landlord may never lock a tenant out or cut off services to force them to leave.
        Evictions need a court order.
      </p>
    </article>
  );
}
