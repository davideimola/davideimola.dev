// Full date for articles: "April 17, 2026"
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Compact stop label for itinerary timelines: "Sep 26"
export function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Month-level label for past talks: "Apr 2026"
export function formatMonthYear(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

// Coarse, drift-tolerant proximity hint for an upcoming date.
// Kept deliberately imprecise (weeks/months) so it ages gracefully between deploys.
export function formatRelative(dateStr: string, today: Date): string {
  const days = Math.round((new Date(dateStr).getTime() - today.getTime()) / 86_400_000);
  if (days <= 7) return "this week";
  if (days <= 21) return "in a few weeks";
  const months = Math.max(1, Math.round(days / 30));
  return months === 1 ? "next month" : `in ${months} months`;
}
