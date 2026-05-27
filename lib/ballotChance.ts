import type { BallotEntry } from "@/lib/data/ballotTypes";

/**
 * Estimate win chance (0–100%) for one slot given your projected ballot score
 * and existing queue entries. One winner per slot; queue size lowers odds.
 */
export function estimateSlotWinChance(
  yourScore: number,
  slotEntries: BallotEntry[],
  options?: { usedMonthlyOverride?: boolean },
): number {
  const pending = slotEntries.filter((e) => e.status === "pending");
  const queueSize = pending.length;

  if (queueSize === 0) {
    const solo = 55 + Math.min(35, Math.floor(yourScore / 3));
    return Math.min(92, solo);
  }

  const higherScores = pending.filter((e) => e.ballotScore > yourScore).length;
  const tiedScores = pending.filter((e) => e.ballotScore === yourScore).length;

  let pct: number;

  if (higherScores === 0) {
    pct = 68 - tiedScores * 10 - Math.max(0, queueSize - 1) * 4;
    pct += Math.min(12, Math.floor(yourScore / 8));
  } else {
    pct =
      42 -
      higherScores * 14 -
      queueSize * 3 +
      Math.min(18, Math.floor(yourScore / 6));
  }

  if (options?.usedMonthlyOverride) {
    pct += 22;
  }

  return Math.max(4, Math.min(94, Math.round(pct)));
}

export function getSlotEntries(
  entries: BallotEntry[],
  courtId: string,
  slotId: string,
  date: string,
): BallotEntry[] {
  return entries.filter(
    (e) =>
      e.courtId === courtId &&
      e.slotId === slotId &&
      e.date === date &&
      e.status === "pending",
  );
}
