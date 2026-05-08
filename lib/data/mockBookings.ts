import type { Booking } from './types';

// Mock Bookings (some pre-populated)
export const initialBookings: Booking[] = [
  {
    id: "booking-1",
    courtId: "court-1",
    slotId: "slot-court-1-2024-03-15-14",
    userId: "user-1",
    userName: "John Tan",
    date: new Date().toISOString().split("T")[0],
    startTime: "14:00",
    endTime: "15:00",
    openToSharing: true,
    createdAt: "2024-03-10",
  },
  {
    id: "booking-2",
    courtId: "court-2",
    slotId: "slot-court-2-2024-03-16-10",
    userId: "user-2",
    userName: "Mary Lim",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "11:00",
    openToSharing: false,
    createdAt: "2024-03-11",
  },
];
