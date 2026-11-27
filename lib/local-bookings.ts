import type { LocalUserSummary } from "./local-auth";

export type BookingReference = { id: string; customerName: string };

// Local demo index only. Ticket details remain sourced from the existing booking API.
function storageKey(user: LocalUserSummary | null) {
  return `tix_booking_ids:${user ? `user:${user.email.toLowerCase()}` : "guest"}`;
}

export function readBookingReferences(user: LocalUserSummary | null): BookingReference[] {
  const raw = window.localStorage.getItem(storageKey(user));
  if (!raw) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value) || !value.every((item: unknown) =>
    typeof item === "object" && item !== null && "id" in item && typeof item.id === "string" &&
    "customerName" in item && typeof item.customerName === "string",
  )) throw new Error("Riwayat lokal tidak dapat dibaca.");
  return value;
}

export function rememberBooking(id: string, user: LocalUserSummary | null) {
  const existing = readBookingReferences(user);
  if (existing.some((item) => item.id === id)) return;
  window.localStorage.setItem(storageKey(user), JSON.stringify([
    { id, customerName: user?.name ?? "Tamu" }, ...existing,
  ]));
}