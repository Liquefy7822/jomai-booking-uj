export type UserRole = "resident" | "elderly" | "coach";

export type BallotEntryStatus = "pending" | "selected" | "not_selected";

export type BallotWeekStatus = "voting_open" | "voting_closed" | "allocated";

export interface BallotWeek {
  id: string;
  weekStart: string;
  weekEnd: string;
  votingDeadline: string;
  status: BallotWeekStatus;
}

export interface BallotEntry {
  id: string;
  weekId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  courtId: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  /** Stored for audit only — allocation is NOT sorted by this */
  submittedAt: string;
  ballotScore: number;
  scoreBreakdown: string[];
  status: BallotEntryStatus;
  usedMonthlyOverride?: boolean;
  partnerUserId?: string;
  openToSharing: boolean;
}

export interface UserBallotProfile {
  userId: string;
  wasNotChosenLastWeek: boolean;
  monthlyOverrideUsed: string | null;
  bookingsThisMonth: number;
  playedPartnerIds: string[];
}

export interface CoachApplication {
  id: string;
  coachId: string;
  coachName: string;
  ccName: string;
  ccNotes: string;
  weekId: string;
  status: "pending_cc_review" | "approved" | "denied";
  submittedAt: string;
}

export interface CancellationEvent {
  id: string;
  bookingId: string;
  userId: string;
  userName: string;
  courtId: string;
  date: string;
  cancelledAt: string;
  hoursBeforeSlot: number;
  feeCharged: number;
  neighbourhoodNotified: boolean;
  nextInLineUserId?: string;
  nextInLineUserName?: string;
}

export interface NeighbourhoodNotice {
  id: string;
  message: string;
  createdAt: string;
  relatedBookingId: string;
}
