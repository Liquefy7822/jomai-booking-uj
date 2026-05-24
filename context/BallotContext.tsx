"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Booking, TimeSlot, User } from "@/lib/data/types";
import type {
  BallotEntry,
  BallotWeek,
  CancellationEvent,
  CoachApplication,
  NeighbourhoodNotice,
  UserBallotProfile,
  UserRole,
} from "@/lib/data/ballotTypes";
import {
  allocateWeekEntries,
  calculateBallotScore,
  evaluateCancellation,
  getNextWaitlistEntry,
  getTargetBallotWeek,
  isVotingOpen,
  rankBallotEntries,
  simulateAllSlotsBooked,
  validateBallotApplication,
} from "@/lib/ballotLogic";
import {
  initialBallotEntries,
  initialBallotProfiles,
  initialCancellationEvents,
  initialCoachApplications,
  initialNeighbourhoodNotices,
} from "@/lib/data/initialBallot";

const STORAGE_KEY = "bookit-ballot";

interface BallotStorage {
  entries: BallotEntry[];
  profiles: UserBallotProfile[];
  coachApplications: CoachApplication[];
  cancellations: CancellationEvent[];
  notices: NeighbourhoodNotice[];
}

interface BallotContextType {
  currentWeek: BallotWeek;
  entries: BallotEntry[];
  rankedEntries: BallotEntry[];
  profiles: UserBallotProfile[];
  coachApplications: CoachApplication[];
  cancellations: CancellationEvent[];
  neighbourhoodNotices: NeighbourhoodNotice[];
  getProfile: (userId: string) => UserBallotProfile;
  submitBallotEntry: (params: {
    user: User;
    role: UserRole;
    slot: TimeSlot;
    courtId: string;
    openToSharing: boolean;
    partnerUserId?: string;
    useMonthlyOverride?: boolean;
    bookings: Booking[];
  }) => { success: boolean; error?: string; entry?: BallotEntry };
  submitCoachApplication: (params: {
    user: User;
    ccName: string;
    ccNotes: string;
  }) => { success: boolean; error?: string };
  runWeeklyAllocation: (addBooking?: (booking: Omit<Booking, "id" | "createdAt">) => void) => void;
  cancelBookingWithPolicy: (
    booking: Booking,
    user: User,
  ) => {
    success: boolean;
    fee: number;
    message: string;
    nextInLine?: string;
  };
  votingOpen: boolean;
}

const BallotContext = createContext<BallotContextType | undefined>(undefined);

function loadStorage(): BallotStorage {
  if (typeof window === "undefined") {
    return {
      entries: initialBallotEntries,
      profiles: initialBallotProfiles,
      coachApplications: initialCoachApplications,
      cancellations: initialCancellationEvents,
      notices: initialNeighbourhoodNotices,
    };
  }
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as BallotStorage;
    } catch {
      /* fall through */
    }
  }
  return {
    entries: initialBallotEntries,
    profiles: initialBallotProfiles,
    coachApplications: initialCoachApplications,
    cancellations: initialCancellationEvents,
    notices: initialNeighbourhoodNotices,
  };
}

export function BallotProvider({ children }: { children: ReactNode }) {
  const [currentWeek] = useState<BallotWeek>(() => getTargetBallotWeek());
  const [entries, setEntries] = useState<BallotEntry[]>([]);
  const [profiles, setProfiles] = useState<UserBallotProfile[]>([]);
  const [coachApplications, setCoachApplications] = useState<CoachApplication[]>(
    [],
  );
  const [cancellations, setCancellations] = useState<CancellationEvent[]>([]);
  const [notices, setNotices] = useState<NeighbourhoodNotice[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = loadStorage();
    setEntries(data.entries);
    setProfiles(data.profiles);
    setCoachApplications(data.coachApplications);
    setCancellations(data.cancellations);
    setNotices(data.notices);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: BallotStorage = {
      entries,
      profiles,
      coachApplications,
      cancellations,
      notices,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [entries, profiles, coachApplications, cancellations, notices, hydrated]);

  const getProfile = useCallback(
    (userId: string): UserBallotProfile => {
      const found = profiles.find((p) => p.userId === userId);
      if (found) return found;
      return {
        userId,
        wasNotChosenLastWeek: false,
        monthlyOverrideUsed: null,
        bookingsThisMonth: 0,
        playedPartnerIds: [],
      };
    },
    [profiles],
  );

  const upsertProfile = useCallback((profile: UserBallotProfile) => {
    setProfiles((prev) => {
      const idx = prev.findIndex((p) => p.userId === profile.userId);
      if (idx === -1) return [...prev, profile];
      const next = [...prev];
      next[idx] = profile;
      return next;
    });
  }, []);

  const rankedEntries = useMemo(
    () => rankBallotEntries(entries.filter((e) => e.weekId === currentWeek.id)),
    [entries, currentWeek.id],
  );

  const submitBallotEntry = useCallback(
    (params: {
      user: User;
      role: UserRole;
      slot: TimeSlot;
      courtId: string;
      openToSharing: boolean;
      partnerUserId?: string;
      useMonthlyOverride?: boolean;
      bookings: Booking[];
    }): { success: boolean; error?: string; entry?: BallotEntry } => {
      const baseProfile = getProfile(params.user.id);
      const monthBallotCount = entries.filter((e) => {
        if (e.userId !== params.user.id) return false;
        const d = new Date(e.date);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length;
      const profile: UserBallotProfile = {
        ...baseProfile,
        bookingsThisMonth: baseProfile.bookingsThisMonth + monthBallotCount,
      };
      const allSlotsBooked = simulateAllSlotsBooked(
        params.courtId,
        params.slot.date,
        params.bookings,
        entries,
      );

      const validation = validateBallotApplication(
        params.user,
        params.role,
        params.slot,
        currentWeek,
        profile,
        params.bookings,
        allSlotsBooked,
      );
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const duplicate = entries.some(
        (e) =>
          e.weekId === currentWeek.id &&
          e.userId === params.user.id &&
          e.status === "pending",
      );
      if (duplicate) {
        return { success: false, error: "You already have a pending ballot application for this week." };
      }

      const { score, breakdown } = calculateBallotScore(
        params.user,
        params.role,
        params.slot,
        {
          week: currentWeek,
          profile,
          existingEntries: entries,
          allSlotsBooked,
          partnerUserId: params.partnerUserId,
          useMonthlyOverride: params.useMonthlyOverride,
        },
      );

      const entry: BallotEntry = {
        id: `ballot-${Date.now()}`,
        weekId: currentWeek.id,
        userId: params.user.id,
        userName: params.user.name,
        userRole: params.role,
        courtId: params.courtId,
        slotId: params.slot.id,
        date: params.slot.date,
        startTime: params.slot.startTime,
        endTime: params.slot.endTime,
        submittedAt: new Date().toISOString(),
        ballotScore: score,
        scoreBreakdown: breakdown,
        status: "pending",
        openToSharing: params.openToSharing,
        partnerUserId: params.partnerUserId,
        usedMonthlyOverride: params.useMonthlyOverride,
      };

      if (params.useMonthlyOverride && params.role === "elderly") {
        upsertProfile({
          ...profile,
          monthlyOverrideUsed: new Date().toISOString().slice(0, 7),
        });
      }

      setEntries((prev) => [...prev, entry]);
      return { success: true, entry };
    },
    [currentWeek, entries, getProfile, upsertProfile],
  );

  const submitCoachApplication = useCallback(
    (params: { user: User; ccName: string; ccNotes: string }) => {
      const app: CoachApplication = {
        id: `coach-${Date.now()}`,
        coachId: params.user.id,
        coachName: params.user.name,
        ccName: params.ccName,
        ccNotes: params.ccNotes,
        weekId: currentWeek.id,
        status: "pending_cc_review",
        submittedAt: new Date().toISOString(),
      };
      setCoachApplications((prev) => [...prev, app]);
      return { success: true };
    },
    [currentWeek.id],
  );

  const runWeeklyAllocation = useCallback((addBooking?: (booking: Omit<Booking, "id" | "createdAt">) => void) => {
    setEntries((prev) => {
      const weekEntries = prev.filter((e) => e.weekId === currentWeek.id);
      const allocated = allocateWeekEntries(weekEntries);
      const byId = new Map(allocated.map((e) => [e.id, e]));

      setProfiles((profilePrev) =>
        profilePrev.map((p) => {
          const userEntries = allocated.filter((e) => e.userId === p.userId);
          if (userEntries.length === 0) return p;
          const selected = userEntries.some((e) => e.status === "selected");
          return { ...p, wasNotChosenLastWeek: !selected };
        }),
      );

      // Create bookings for selected entries if addBooking is provided
      if (addBooking) {
        allocated.forEach((entry) => {
          if (entry.status === "selected") {
            addBooking({
              courtId: entry.courtId,
              slotId: entry.slotId,
              userId: entry.userId,
              userName: entry.userName,
              date: entry.date,
              startTime: entry.startTime,
              endTime: entry.endTime,
              openToSharing: entry.openToSharing,
              ballotEntryId: entry.id,
              status: "confirmed",
              amountPaid: 8,
            });
          }
        });
      }

      return prev.map((e) => (e.weekId === currentWeek.id ? byId.get(e.id) ?? e : e));
    });
  }, [currentWeek.id]);

  const cancelBookingWithPolicy = useCallback(
    (booking: Booking, user: User) => {
      const result = evaluateCancellation(booking);
      const next = getNextWaitlistEntry(
        entries,
        booking.courtId,
        booking.slotId,
        user.id,
      );

      const event: CancellationEvent = {
        id: `cancel-${Date.now()}`,
        bookingId: booking.id,
        userId: user.id,
        userName: user.name,
        courtId: booking.courtId,
        date: booking.date,
        cancelledAt: new Date().toISOString(),
        hoursBeforeSlot: result.hoursBefore,
        feeCharged: result.fee,
        neighbourhoodNotified: result.neighbourhoodNotify,
        nextInLineUserId: next?.userId,
        nextInLineUserName: next?.userName,
      };
      setCancellations((prev) => [...prev, event]);

      if (result.neighbourhoodNotify) {
        setNotices((prev) => [
          ...prev,
          {
            id: `notice-${Date.now()}`,
            message: `Late cancellation by ${user.name} for ${booking.date} ${booking.startTime}. Neighbourhood players notified — slot may reopen.`,
            createdAt: new Date().toISOString(),
            relatedBookingId: booking.id,
          },
        ]);
      }

      if (next) {
        setEntries((prev) =>
          prev.map((e) =>
            e.id === next.id ? { ...e, status: "selected" } : e,
          ),
        );
      }

      return {
        success: true,
        fee: result.fee,
        message: result.message,
        nextInLine: next?.userName,
      };
    },
    [entries],
  );

  const votingOpen = isVotingOpen(currentWeek);

  return (
    <BallotContext.Provider
      value={{
        currentWeek,
        entries: entries.filter((e) => e.weekId === currentWeek.id),
        rankedEntries,
        profiles,
        coachApplications,
        cancellations,
        neighbourhoodNotices: notices,
        getProfile,
        submitBallotEntry,
        submitCoachApplication,
        runWeeklyAllocation,
        cancelBookingWithPolicy,
        votingOpen,
      }}
    >
      {children}
    </BallotContext.Provider>
  );
}

export function useBallot() {
  const ctx = useContext(BallotContext);
  if (!ctx) {
    throw new Error("useBallot must be used within BallotProvider");
  }
  return ctx;
}
