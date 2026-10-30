/** 1250.5 -> "₱1,250.50". Change the locale and currency to suit your country. */
export function formatMoney(value: number) {
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(value);
}

/** "2026-10-30T08:15:00.000000Z" -> "Oct 30, 2026, 4:15 PM" (in the browser's time zone). */
export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}
