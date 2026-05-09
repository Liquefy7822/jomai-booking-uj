// Types for the booking system

export interface User {
  id: string;
  email: string;
  name: string;
  priorityScore: number;
  createdAt: string;
  profilePicture?: string;
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
