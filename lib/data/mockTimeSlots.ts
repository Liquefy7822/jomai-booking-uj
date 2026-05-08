import type { TimeSlot } from './types';
import { courts } from './mockCourts';

// Generate time slots for next 7 days
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dayOffset);
    const dateStr = date.toISOString().split("T")[0];

    for (const court of courts) {
      // Generate slots from 8am to 10pm in 1-hour increments
      for (let hour = 8; hour < 22; hour++) {
        const startTime = `${hour.toString().padStart(2, "0")}:00`;
        const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

        // Simulate some slots being unavailable (about 30%)
        const isAvailable = Math.random() > 0.3;

        slots.push({
          id: `slot-${court.id}-${dateStr}-${hour}`,
          courtId: court.id,
          date: dateStr,
          startTime,
          endTime,
          isAvailable,
          price: court.pricePerHour,
        });
      }
    }
  }

  return slots;
};

export const timeSlots: TimeSlot[] = generateTimeSlots();

export const getSlotsByCourtAndDate = (
  courtId: string,
  date: string
): TimeSlot[] =>
  timeSlots.filter((s) => s.courtId === courtId && s.date === date);
