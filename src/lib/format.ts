export function formatRand(amount: number): string {
  return `R${amount.toLocaleString("en-US")}`;
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Johannesburg",
  });
}
