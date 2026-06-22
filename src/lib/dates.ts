// Coarse, drift-tolerant proximity hint for an upcoming date.
// Kept deliberately imprecise (weeks/months) so it ages gracefully between deploys.
export function formatRelative(dateStr: string, today: Date): string {
  const days = Math.round((new Date(dateStr).getTime() - today.getTime()) / 86_400_000);
  if (days <= 7) return "this week";
  if (days <= 21) return "in a few weeks";
  const months = Math.max(1, Math.round(days / 30));
  return months === 1 ? "next month" : `in ${months} months`;
}
