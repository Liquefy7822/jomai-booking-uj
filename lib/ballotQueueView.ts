import type { BallotEntry } from "@/lib/data/ballotTypes";
import { rankBallotEntries } from "@/lib/ballotLogic";

export function getSlotCompetitors(
  allEntries: BallotEntry[],
  courtId: string,
  slotId: string,
  date: string,
): BallotEntry[] {
  return allEntries.filter(
    (e) => e.courtId === courtId && e.slotId === slotId && e.date === date,
  );
}

/** Rank for one slot; only you + people ahead of you are shown in the UI. */
export function getPersonalizedSlotQueue(
  slotEntries: BallotEntry[],
  userId: string,
): {
  ahead: BallotEntry[];
  you: BallotEntry | null;
  position: number;
} {
  const ranked = rankBallotEntries(slotEntries);
  const you = ranked.find((e) => e.userId === userId) ?? null;
  if (!you) {
    return { ahead: [], you: null, position: 0 };
  }
  const position = ranked.findIndex((e) => e.id === you.id) + 1;
  return {
    ahead: ranked.slice(0, position - 1),
    you,
    position,
  };
}
