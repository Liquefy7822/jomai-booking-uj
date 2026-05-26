import type { Booking } from "@/lib/data/types";

type BookingSlot = Pick<
  Booking,
  "ballotEntryId" | "userId" | "courtId" | "slotId" | "date" | "startTime"
>;

/** Stable key for the same logical reservation (ballot entry or slot). */
export function bookingDedupeKey(booking: BookingSlot): string {
  if (booking.ballotEntryId) {
    return `ballot:${booking.ballotEntryId}`;
  }
  return `slot:${booking.userId}|${booking.courtId}|${booking.slotId}|${booking.date}|${booking.startTime}`;
}

export function isDuplicateBooking(
  existing: Booking[],
  candidate: Omit<Booking, "id" | "createdAt">,
): boolean {
  const key = bookingDedupeKey(candidate);
  return existing.some((b) => bookingDedupeKey(b) === key);
}

/** Keep one booking per ballot entry or slot; prefer the earliest created. */
export function dedupeBookings(bookings: Booking[]): Booking[] {
  const byKey = new Map<string, Booking>();
  for (const booking of bookings) {
    const key = bookingDedupeKey(booking);
    const current = byKey.get(key);
    if (!current || booking.createdAt < current.createdAt) {
      byKey.set(key, booking);
    }
  }
  return Array.from(byKey.values());
}
