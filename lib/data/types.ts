// Types for the booking system

import type { PreferredSchedule } from "./singpassPersonas";
import type { UserRole } from "./ballotTypes";

export interface UserBookingPreferences {
  preferredSchedule: PreferredSchedule;
  maxPricePerHour: number;
  scheduleLabel: string;
}

export interface CreditScoreHistory {
  date: string;
  score: number;
  change: number;
  reason: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  priorityScore: number;
  createdAt: string;
  profilePicture?: string;
  nric?: string;
  bookingPreferences?: UserBookingPreferences;
  role?: UserRole;
  creditScoreHistory?: CreditScoreHistory[];
}

export interface Court {
  id: string;
  name: string;
  type: "badminton";
  location: string;
  description: string;
  imageUrl: string;
  amenities: string[];
  pricePerHour: number;
}

export interface TimeSlot {
  id: string;
  courtId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
  price: number;
}

export interface Booking {
  id: string;
  courtId: string;
  slotId: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  openToSharing: boolean;
  createdAt: string;
  checkedIn?: boolean;
  checkInTime?: string;
  amountPaid?: number;
  ballotEntryId?: string;
  status?: "confirmed" | "ballot_pending" | "ballot_won" | "cancelled";
}

export interface MatchmakingPost {
  id: string;
  courtId: string;
  courtName: string;
  userId: string;
  userName: string;
  date: string;
  startTime: string;
  endTime: string;
  playersNeeded: number;
  currentPlayers: string[];
  skillLevel: "beginner" | "intermediate" | "advanced";
  description: string;
  createdAt: string;
}
