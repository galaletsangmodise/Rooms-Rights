type Tone = "green" | "orange" | "sand";

const TONES: Record<Tone, string> = {
  green: "bg-forest-pale text-forest",
  orange: "bg-orange-pale text-orange",
  sand: "bg-sand text-ink-soft",
};

export function StatusChip({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${TONES[tone]}`}>
      {children}
    </span>
  );
}