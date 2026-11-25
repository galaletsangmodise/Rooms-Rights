export function DashboardHeader({ greeting, name }: { greeting: string; name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <header className="bg-maroon px-5 pb-20 pt-8 text-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
        <h1 className="text-2xl font-extrabold">
          {greeting}, {name}
        </h1>
        <span
          aria-hidden="true"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-light text-lg font-extrabold text-maroon"
        >
          {initial}
        </span>
      </div>
    </header>
  );
}
