// Types for the booking system
export interface User {
  id: string;
  email: string;
  name: string;
  priorityScore: number;
  createdAt: string;
  isAdmin?: boolean;
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

// Mock Courts Data - Badminton only
export const courts: Court[] = [
  {
    id: "court-1",
    name: "Badminton Court 1",
    type: "badminton",
    location: "Tampines Hub, Level 2",
    description:
      "Professional-grade indoor badminton court with excellent lighting and air conditioning. Ideal for competitive play.",
    imageUrl: "/courts/badminton-1.jpg",
    amenities: ["Air-conditioned", "Professional lighting", "Shower facilities", "Spectator seating"],
    pricePerHour: 8,
  },
  {
    id: "court-2",
    name: "Badminton Court 2",
    type: "badminton",
    location: "Tampines Hub, Level 2",
    description:
      "Standard indoor badminton court suitable for recreational play and practice sessions.",
    imageUrl: "/courts/badminton-2.jpg",
    amenities: ["Air-conditioned", "Standard lighting", "Locker rooms"],
    pricePerHour: 8,
  },
  {
    id: "court-3",
    name: "Badminton Court 3",
    type: "badminton",
    location: "Tampines Hub, Level 2",
    description:
      "Spacious court with premium flooring. Perfect for doubles matches and training.",
    imageUrl: "/courts/badminton-3.jpg",
    amenities: ["Air-conditioned", "Professional lighting", "Equipment rental"],
    pricePerHour: 10,
  },
  {
    id: "court-4",
    name: "Badminton Court 4",
    type: "badminton",
    location: "Our Tampines Hub, Level 3",
    description:
      "Modern facility with state-of-the-art ventilation and cushioned flooring.",
    imageUrl: "/courts/badminton-4.jpg",
    amenities: ["Air-conditioned", "Professional lighting", "Shower facilities", "Pro shop nearby"],
    pricePerHour: 10,
  },
  {
    id: "court-5",
    name: "Badminton Court 5",
    type: "badminton",
    location: "Our Tampines Hub, Level 3",
    description:
      "Budget-friendly court ideal for casual games and beginners. Well-maintained facility.",
    imageUrl: "/courts/badminton-5.jpg",
    amenities: ["Ventilated", "Standard lighting", "Water cooler"],
    pricePerHour: 6,
  },
  {
    id: "court-6",
    name: "Badminton Court 6",
    type: "badminton",
    location: "Tampines Sports Hall",
    description:
      "Competition-grade court used for tournaments. Premium Yonex flooring installed.",
    imageUrl: "/courts/badminton-6.jpg",
    amenities: ["Air-conditioned", "Competition lighting", "Referee stand", "Scoreboard"],
    pricePerHour: 12,
  },
];

// Generate time slots for the next 7 days
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

// Mock Users
export const users: User[] = [
  {
    id: "user-1",
    email: "john.tan@email.com",
    name: "John Tan",
    priorityScore: 85,
    createdAt: "2024-01-15",
  },
  {
    id: "user-2",
    email: "mary.lim@email.com",
    name: "Mary Lim",
    priorityScore: 72,
    createdAt: "2024-02-20",
  },
  {
    id: "user-3",
    email: "david.wong@email.com",
    name: "David Wong",
    priorityScore: 91,
    createdAt: "2023-11-10",
  },
];

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

// Mock Matchmaking Posts
export const initialMatchmakingPosts: MatchmakingPost[] = [
  {
    id: "match-1",
    courtId: "court-1",
    courtName: "Badminton Court 1",
    userId: "user-1",
    userName: "John Tan",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "18:00",
    endTime: "19:00",
    playersNeeded: 4,
    currentPlayers: ["John Tan"],
    skillLevel: "intermediate",
    description:
      "Looking for doubles partners! Casual game after work. All skill levels welcome.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "match-2",
    courtId: "court-3",
    courtName: "Badminton Court 3",
    userId: "user-3",
    userName: "David Wong",
    date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    playersNeeded: 2,
    currentPlayers: ["David Wong"],
    skillLevel: "advanced",
    description:
      "Need one more for singles practice. Intermediate to advanced players preferred.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "match-3",
    courtId: "court-4",
    courtName: "Badminton Court 4",
    userId: "user-2",
    userName: "Mary Lim",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "16:00",
    endTime: "17:00",
    playersNeeded: 4,
    currentPlayers: ["Mary Lim", "Alex Ng"],
    skillLevel: "beginner",
    description:
      "Friendly doubles game for beginners. Come join us for some fun!",
    createdAt: new Date().toISOString(),
  },
];

// Helper functions
export const getCourtById = (id: string): Court | undefined =>
  courts.find((c) => c.id === id);

export const getSlotsByCourtAndDate = (
  courtId: string,
  date: string
): TimeSlot[] =>
  timeSlots.filter((s) => s.courtId === courtId && s.date === date);

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-SG", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};
