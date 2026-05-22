import type {
  BallotEntry,
  CancellationEvent,
  CoachApplication,
  NeighbourhoodNotice,
  UserBallotProfile,
} from "./ballotTypes";
import { getTargetBallotWeek } from "@/lib/ballotLogic";

const week = getTargetBallotWeek();
const weekSaturday = new Date(week.weekStart);
weekSaturday.setDate(weekSaturday.getDate() + 5);
const saturdayISO = weekSaturday.toISOString().split("T")[0];

export const initialBallotEntries: BallotEntry[] = [
  {
    id: "ballot-1",
    weekId: week.id,
    userId: "demo-elderly",
    userName: "Lim Mei Ling",
    userRole: "elderly",
    courtId: "court-5",
    slotId: "slot-court-5-demo",
    date: saturdayISO,
    startTime: "10:00",
    endTime: "11:00",
    submittedAt: "2026-05-10T14:22:00.000Z",
    ballotScore: 95,
    scoreBreakdown: [
      "+25 not chosen last week (priority)",
      "+20 elderly weekend disadvantaged-access priority",
      "+10 community priority score",
    ],
    status: "pending",
    openToSharing: true,
  },
  {
    id: "ballot-2",
    weekId: week.id,
    userId: "demo-resident-a",
    userName: "Tan Wei Ming",
    userRole: "resident",
    courtId: "court-1",
    slotId: "slot-court-1-demo",
    date: week.weekStart,
    startTime: "18:00",
    endTime: "19:00",
    submittedAt: "2026-05-11T09:05:00.000Z",
    ballotScore: 72,
    scoreBreakdown: ["+12 community priority score"],
    status: "pending",
    openToSharing: false,
  },
  {
    id: "ballot-3",
    weekId: week.id,
    userId: "demo-resident-b",
    userName: "Ahmad Rizal",
    userRole: "resident",
    courtId: "court-1",
    slotId: "slot-court-1-demo",
    date: week.weekStart,
    startTime: "18:00",
    endTime: "19:00",
    submittedAt: "2026-05-12T20:41:00.000Z",
    ballotScore: 68,
    scoreBreakdown: [
      "+25 not chosen last week (priority)",
      "+8 community priority score",
    ],
    status: "pending",
    openToSharing: true,
  },
];

export const initialBallotProfiles: UserBallotProfile[] = [
  {
    userId: "demo-elderly",
    wasNotChosenLastWeek: true,
    monthlyOverrideUsed: null,
    bookingsThisMonth: 0,
    playedPartnerIds: [],
  },
  {
    userId: "demo-resident-a",
    wasNotChosenLastWeek: false,
    monthlyOverrideUsed: null,
    bookingsThisMonth: 1,
    playedPartnerIds: ["demo-resident-b"],
  },
  {
    userId: "demo-resident-b",
    wasNotChosenLastWeek: true,
    monthlyOverrideUsed: null,
    bookingsThisMonth: 0,
    playedPartnerIds: [],
  },
];

export const initialCoachApplications: CoachApplication[] = [
  {
    id: "coach-app-1",
    coachId: "coach-1",
    coachName: "Coach Chen",
    ccName: "Tampines West CC",
    ccNotes: "Reviewing utilisation stats for week-round training blocks.",
    weekId: week.id,
    status: "pending_cc_review",
    submittedAt: new Date().toISOString(),
  },
];

export const initialCancellationEvents: CancellationEvent[] = [];

export const initialNeighbourhoodNotices: NeighbourhoodNotice[] = [];
