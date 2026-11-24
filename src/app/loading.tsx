export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="mx-auto max-w-3xl space-y-4 px-5 pt-8">
      <div className="h-8 w-48 animate-pulse rounded-xl bg-sand" />
      <div className="h-28 animate-pulse rounded-2xl bg-sand" />
      <div className="h-28 animate-pulse rounded-2xl bg-sand" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
