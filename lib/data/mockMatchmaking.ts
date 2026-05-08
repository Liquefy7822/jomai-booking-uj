import type { MatchmakingPost } from './types';

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
