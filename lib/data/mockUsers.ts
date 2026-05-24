import type { User } from './types';

// Mock Users
export const users: User[] = [
  {
    id: "user-1",
    email: "john.tan@email.com",
    name: "John Tan",
    priorityScore: 85,
    createdAt: "2024-01-15",
    creditScoreHistory: [
      { date: "2024-01-15", score: 70, change: 0, reason: "Initial score" },
      { date: "2024-01-22", score: 75, change: 5, reason: "Court left clean after booking" },
      { date: "2024-02-05", score: 80, change: 5, reason: "On-time check-in" },
      { date: "2024-02-19", score: 85, change: 5, reason: "Helped organize community event" },
    ],
  },
  {
    id: "user-2",
    email: "mary.lim@email.com",
    name: "Mary Lim",
    priorityScore: 72,
    createdAt: "2024-02-20",
    creditScoreHistory: [
      { date: "2024-02-20", score: 70, change: 0, reason: "Initial score" },
      { date: "2024-02-27", score: 67, change: -3, reason: "Late cancellation (24h notice)" },
      { date: "2024-03-10", score: 72, change: 5, reason: "Court left in excellent condition" },
    ],
  },
  {
    id: "user-3",
    email: "david.wong@email.com",
    name: "David Wong",
    priorityScore: 91,
    createdAt: "2023-11-10",
    creditScoreHistory: [
      { date: "2023-11-10", score: 70, change: 0, reason: "Initial score" },
      { date: "2023-11-17", score: 75, change: 5, reason: "Court left clean after booking" },
      { date: "2023-12-01", score: 80, change: 5, reason: "On-time check-in" },
      { date: "2023-12-15", score: 85, change: 5, reason: "Reported facility issue" },
      { date: "2024-01-05", score: 88, change: 3, reason: "Consistent on-time arrivals" },
      { date: "2024-01-20", score: 91, change: 3, reason: "Mentored new players" },
    ],
  },
];
