// Types for the booking system
export interface User {
  id: string;
  email: string;
  name: string;
  priorityScore: number;
  createdAt: string;
}

export interface Court {
  id: string;
  name: string;
  type: "badminton" | "tennis" | "basketball" | "futsal";
  location: string;
  description: string;
  imageUrl: string;
  amenities: string[];
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

// Mock Courts Data
export const courts: Court[] = [
  {
    id: "court-1",
    name: "Badminton Court A",
    type: "badminton",
    location: "Tampines Hub, Level 2",
    description:
      "Professional-grade indoor badminton court with excellent lighting and air conditioning.",
    imageUrl: "/courts/badminton-a.jpg",
    amenities: ["Air-conditioned", "Professional lighting", "Shower facilities"],
  },
  {
    id: "court-2",
    name: "Badminton Court B",
    type: "badminton",
    location: "Tampines Hub, Level 2",
    description:
      "Standard indoor badminton court suitable for recreational play and practice.",
    imageUrl: "/courts/badminton-b.jpg",
    amenities: ["Air-conditioned", "Standard lighting", "Locker rooms"],
  },
  {
    id: "court-3",
    name: "Tennis Court 1",
    type: "tennis",
    location: "Tampines Sports Complex",
    description:
      "Outdoor hard court tennis facility with night lighting available.",
    imageUrl: "/courts/tennis-1.jpg",
    amenities: ["Night lighting", "Spectator seating", "Equipment rental"],
  },
  {
    id: "court-4",
    name: "Basketball Court",
    type: "basketball",
    location: "Our Tampines Hub, Rooftop",
    description:
      "Full-sized outdoor basketball court with great views of Tampines.",
    imageUrl: "/courts/basketball.jpg",
    amenities: ["Night lighting", "Drinking fountain", "Spectator area"],
  },
  {
    id: "court-5",
    name: "Futsal Pitch",
    type: "futsal",
    location: "Tampines Sports Hall",
    description:
      "Indoor futsal pitch with synthetic turf and professional goals.",
    imageUrl: "/courts/futsal.jpg",
    amenities: ["Indoor facility", "Changing rooms", "First aid station"],
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

        slots.push({
          id: `slot-${court.id}-${dateStr}-${hour}`,
          courtId: court.id,
          date: dateStr,
          startTime,
          endTime,
          isAvailable: Math.random() > 0.3, // 70% availability
          price: court.type === "badminton" ? 8 : court.type === "tennis" ? 12 : 15,
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
    courtName: "Badminton Court A",
    userId: "user-1",
    userName: "John Tan",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "18:00",
    endTime: "19:00",
    playersNeeded: 2,
    currentPlayers: ["John Tan"],
    skillLevel: "intermediate",
    description:
      "Looking for doubles partners! Casual game after work. All skill levels welcome.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "match-2",
    courtId: "court-3",
    courtName: "Tennis Court 1",
    userId: "user-3",
    userName: "David Wong",
    date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    playersNeeded: 1,
    currentPlayers: ["David Wong"],
    skillLevel: "advanced",
    description:
      "Need one more for singles practice. Intermediate to advanced players preferred.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "match-3",
    courtId: "court-4",
    courtName: "Basketball Court",
    userId: "user-2",
    userName: "Mary Lim",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    startTime: "16:00",
    endTime: "17:00",
    playersNeeded: 8,
    currentPlayers: ["Mary Lim", "Alex Ng"],
    skillLevel: "beginner",
    description:
      "Organizing a friendly 4v4 game. Beginners welcome! Come join us for some fun.",
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

export const getCourtTypeIcon = (type: Court["type"]): string => {
  const icons: Record<Court["type"], string> = {
    badminton: "🏸",
    tennis: "🎾",
    basketball: "🏀",
    futsal: "⚽",
  };
  return icons[type];
};

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
