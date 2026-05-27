import type { Booking, TimeSlot, User } from "@/lib/data/types";
import type {
  BallotEntry,
  BallotWeek,
  UserBallotProfile,
  UserRole,
} from "@/lib/data/ballotTypes";

export const BALLOT_RULES = {
  advanceBookingDays: 7,
  votingDeadlineDay: 0,
  maxBookingsPerMonth: 2,
  minCancellationHours: 36,
  lateCancellationFeeMultiplier: 0.5,
  elderlyMonthlyOverrideLimit: 1,
  /** Score bonus when elderly uses monthly override with a new partner */
  monthlyOverrideScoreBonus: 65,
} as const;

export const BALLOT_RULES_SUMMARY = [
  "Bookings are allocated week-by-week. You may apply up to 7 days before the target week.",
  "Voting for the upcoming week closes every Sunday at 11:59 PM.",
  "Applicants are ranked by fairness score — not by who applied first.",
  "Residents not chosen last week receive priority this week.",
  "Elderly residents receive weekday priority (higher chance on weekdays, lower on weekends).",
  "Maximum 2 court bookings per calendar month. A second booking is harder when demand is high.",
  "Elderly residents matching a new (different) partner may use one ballot override per month.",
  "Coaches apply with their Community Centre (CC); CCs review statistics before week-round slots are held.",
  "Cancellations need 36+ hours notice or 50% of amount paid is charged. Late cancellations notify the neighbourhood.",
  "Released slots go to the next person on the waitlist (by ballot rank, not booking time).",
] as const;

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function parseSlotStart(date: string, startTime: string): Date {
  return new Date(`${date}T${startTime}:00`);
}

/** Monday of the week containing `date` */
export function getWeekStart(date: Date = new Date()): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function getWeekEnd(weekStart: Date): Date {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  return end;
}

export function formatDateISO(d: Date): string {
  return d.toISOString().split("T")[0];
}

/** Target week users are applying for (next calendar week) */
export function getTargetBallotWeek(base = new Date()): BallotWeek {
  const nextMonday = getWeekStart(base);
  nextMonday.setDate(nextMonday.getDate() + 7);
  const weekEnd = getWeekEnd(nextMonday);

  const votingSunday = new Date(nextMonday);
  votingSunday.setDate(votingSunday.getDate() - 1);
  votingSunday.setHours(23, 59, 59, 999);

  const now = new Date();
  const votingOpen = now <= votingSunday;

  return {
    id: `week-${formatDateISO(nextMonday)}`,
    weekStart: formatDateISO(nextMonday),
    weekEnd: formatDateISO(weekEnd),
    votingDeadline: votingSunday.toISOString(),
    status: votingOpen ? "voting_open" : "voting_closed",
  };
}

export function isVotingOpen(week: BallotWeek): boolean {
  return new Date() <= new Date(week.votingDeadline);
}

export function isDateInBallotWeek(date: string, week: BallotWeek): boolean {
  return date >= week.weekStart && date <= week.weekEnd;
}

/** Max 1 week in advance from today */
export function canApplyForDate(date: string, today = new Date()): boolean {
  const target = startOfDay(new Date(date));
  const t = startOfDay(today);
  const diffDays = (target.getTime() - t.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= BALLOT_RULES.advanceBookingDays;
}

export function isWeekend(date: string): boolean {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
}

export function countUserBookingsInMonth(
  userId: string,
  bookings: Booking[],
  ref = new Date(),
): number {
  const month = ref.getMonth();
  const year = ref.getFullYear();
  return bookings.filter((b) => {
    if (b.userId !== userId) return false;
    const d = new Date(b.date);
    return d.getMonth() === month && d.getFullYear() === year;
  }).length;
}

export function isNewPartner(
  userId: string,
  partnerUserId: string | undefined,
  profile: UserBallotProfile | undefined,
): boolean {
  if (!partnerUserId) return false;
  return !profile?.playedPartnerIds.includes(partnerUserId);
}

export interface BallotScoreContext {
  week: BallotWeek;
  profile: UserBallotProfile;
  existingEntries: BallotEntry[];
  allSlotsBooked: boolean;
  partnerUserId?: string;
  useMonthlyOverride?: boolean;
}

export function calculateBallotScore(
  user: User,
  role: UserRole,
  slot: TimeSlot,
  ctx: BallotScoreContext,
): { score: number; breakdown: string[] } {
  const breakdown: string[] = [];
  let score = 50;

  if (ctx.profile.wasNotChosenLastWeek) {
    score += 25;
    breakdown.push("+25 not chosen last week (priority)");
  }

  if (role === "elderly" && !isWeekend(slot.date)) {
    score += 20;
    breakdown.push("+20 elderly weekday priority");
  }

  if (role === "coach") {
    score += 5;
    breakdown.push("+5 coach (CC-reviewed allocation track)");
  }

  const monthCount = ctx.profile.bookingsThisMonth;
  if (monthCount >= 1) {
    const penalty = ctx.allSlotsBooked ? 18 : 10;
    score -= penalty;
    breakdown.push(
      `-${penalty} second booking this month${ctx.allSlotsBooked ? " (high demand)" : ""}`,
    );
  }

  if (monthCount >= BALLOT_RULES.maxBookingsPerMonth) {
    score -= 100;
    breakdown.push("-100 monthly limit reached (2 max)");
  }

  if (
    role === "elderly" &&
    ctx.useMonthlyOverride &&
    isNewPartner(user.id, ctx.partnerUserId, ctx.profile) &&
    !ctx.profile.monthlyOverrideUsed
  ) {
    score += BALLOT_RULES.monthlyOverrideScoreBonus;
    breakdown.push(
      `+${BALLOT_RULES.monthlyOverrideScoreBonus} one-time monthly ballot override (new partner)`,
    );
  }

  score += Math.min(15, Math.floor((user.priorityScore ?? 50) / 10));
  breakdown.push(`+${Math.min(15, Math.floor((user.priorityScore ?? 50) / 10))} community priority score`);

  return { score: Math.max(0, score), breakdown };
}

/** Rank entries for allocation — explicitly NOT by submittedAt */
export function rankBallotEntries(entries: BallotEntry[]): BallotEntry[] {
  return [...entries].sort((a, b) => {
    if (b.ballotScore !== a.ballotScore) return b.ballotScore - a.ballotScore;
    return a.userName.localeCompare(b.userName);
  });
}

export function validateBallotApplication(
  user: User,
  role: UserRole,
  slot: TimeSlot,
  week: BallotWeek,
  profile: UserBallotProfile,
  bookings: Booking[],
  allSlotsBooked: boolean,
): { valid: boolean; error?: string } {
  if (!isVotingOpen(week)) {
    return {
      valid: false,
      error: "Voting for this week has closed. Applications must finish by Sunday.",
    };
  }

  if (!isDateInBallotWeek(slot.date, week)) {
    return {
      valid: false,
      error: `This slot is outside the ballot week (${week.weekStart} – ${week.weekEnd}).`,
    };
  }

  // Ballot window: bookings can be started up to 7 days before the target week starts.
  // Once within the target ballot week window, allow applying for any day in that week.
  const now = new Date();
  const bookingOpenStart = new Date(week.weekStart);
  bookingOpenStart.setDate(bookingOpenStart.getDate() - BALLOT_RULES.advanceBookingDays);
  if (now < bookingOpenStart) {
    return {
      valid: false,
      error: `Bookings open ${BALLOT_RULES.advanceBookingDays} days before the ballot week.`,
    };
  }

  const monthCount = countUserBookingsInMonth(user.id, bookings);
  if (monthCount >= BALLOT_RULES.maxBookingsPerMonth) {
    return {
      valid: false,
      error: `Maximum ${BALLOT_RULES.maxBookingsPerMonth} bookings per month reached.`,
    };
  }

  if (role === "coach") {
    return {
      valid: false,
      error:
        "Coaches must apply via the coach form with their CC. CC reviews statistics before slots are held.",
    };
  }

  if (monthCount >= 1 && allSlotsBooked) {
    return {
      valid: true,
      error: undefined,
    };
  }

  return { valid: true };
}

export function evaluateCancellation(
  booking: Booking & { amountPaid?: number },
  cancelledAt = new Date(),
): {
  canCancel: boolean;
  fee: number;
  hoursBefore: number;
  neighbourhoodNotify: boolean;
  message: string;
} {
  const slotStart = parseSlotStart(booking.date, booking.startTime);
  const hoursBefore =
    (slotStart.getTime() - cancelledAt.getTime()) / (1000 * 60 * 60);
  const paid = booking.amountPaid ?? 8;

  if (hoursBefore < BALLOT_RULES.minCancellationHours) {
    const fee = paid * BALLOT_RULES.lateCancellationFeeMultiplier;
    return {
      canCancel: true,
      fee,
      hoursBefore,
      neighbourhoodNotify: true,
      message: `Late cancellation: ${BALLOT_RULES.lateCancellationFeeMultiplier * 100}% fee ($${fee.toFixed(2)}). Neighbourhood will be notified.`,
    };
  }

  return {
    canCancel: true,
    fee: 0,
    hoursBefore,
    neighbourhoodNotify: false,
    message: "Cancelled with 36+ hours notice. No fee. Next waitlisted applicant will be offered the slot.",
  };
}

export function getNextWaitlistEntry(
  entries: BallotEntry[],
  courtId: string,
  slotId: string,
  excludeUserId: string,
): BallotEntry | undefined {
  const pending = entries.filter(
    (e) =>
      e.courtId === courtId &&
      e.slotId === slotId &&
      e.userId !== excludeUserId &&
      e.status === "not_selected",
  );
  return rankBallotEntries(pending)[0];
}

export function simulateAllSlotsBooked(
  courtId: string,
  date: string,
  bookings: Booking[],
  entries: BallotEntry[],
): boolean {
  const taken = new Set(
    [...bookings, ...entries.map((e) => ({ courtId: e.courtId, slotId: e.slotId, date: e.date }))]
      .filter((x) => x.courtId === courtId && ("date" in x ? x.date === date : true))
      .map((x) => ("slotId" in x ? `${x.courtId}-${x.slotId}` : "")),
  );
  return taken.size >= 6;
}

/** One winner per court/slot/date; order is by ballot score only */
export function allocateWeekEntries(entries: BallotEntry[]): BallotEntry[] {
  const ranked = rankBallotEntries(
    entries.filter((e) => e.status === "pending"),
  );
  const slotWinners: Record<string, number> = {};
  const statusById = new Map<string, BallotEntry["status"]>();

  for (const entry of ranked) {
    const key = `${entry.courtId}-${entry.slotId}-${entry.date}`;
    const winners = slotWinners[key] ?? 0;
    if (winners < 1) {
      slotWinners[key] = winners + 1;
      statusById.set(entry.id, "selected");
    } else {
      statusById.set(entry.id, "not_selected");
    }
  }

  return entries.map((e) => ({
    ...e,
    status: statusById.get(e.id) ?? e.status,
  }));
}
