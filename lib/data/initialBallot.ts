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

export const initialBallotEntries: BallotEntry[] = [];

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
