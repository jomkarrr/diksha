/**
 * Deterministically formats dates for server and client rendering
 * to guarantee identical HTML output and eliminate SSR hydration mismatches.
 */

export function formatDisplayDate(value: string | number | Date | null | undefined): string {
  if (!value) return "";
  try {
    const date = typeof value === "string" || typeof value === "number" ? new Date(value) : value;
    if (isNaN(date.getTime())) return String(value);

    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: "UTC"
    }).format(date);
  } catch {
    return String(value);
  }
}

export function formatLongDate(value: string | number | Date | null | undefined): string {
  if (!value) return "Recent";
  try {
    const date = typeof value === "string" || typeof value === "number" ? new Date(value) : value;
    if (isNaN(date.getTime())) return "Recent";

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    }).format(date);
  } catch {
    return "Recent";
  }
}
