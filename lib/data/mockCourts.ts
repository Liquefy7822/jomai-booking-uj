import type { Court } from './types';

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
