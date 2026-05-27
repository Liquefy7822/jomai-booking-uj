import type { BallotEntry, UserRole } from "./ballotTypes";
import { getTargetBallotWeek } from "@/lib/ballotLogic";
import { courts } from "./mockCourts";

const FAKE_APPLICANTS: {
  name: string;
  role: UserRole;
  score: number;
  breakdown: string[];
}[] = [
  { name: "Ahmad R.", role: "resident", score: 72, breakdown: ["+25 not chosen last week"] },
  { name: "Priya S.", role: "resident", score: 58, breakdown: ["+8 community priority"] },
  { name: "Tan Wei L.", role: "resident", score: 65, breakdown: ["+15 community priority"] },
  { name: "Siti N.", role: "elderly", score: 88, breakdown: ["+20 elderly weekday priority", "+18 community priority"] },
  { name: "David K.", role: "resident", score: 52, breakdown: ["+2 community priority"] },
  { name: "Mei Ling C.", role: "elderly", score: 91, breakdown: ["+25 not chosen last week", "+20 elderly weekday priority"] },
  { name: "Raj M.", role: "resident", score: 48, breakdown: ["-10 second booking this month"] },
  { name: "Nurul H.", role: "resident", score: 61, breakdown: ["+11 community priority"] },
  { name: "James O.", role: "resident", score: 55, breakdown: ["+5 community priority"] },
  { name: "Linda T.", role: "elderly", score: 78, breakdown: ["+20 elderly weekday priority"] },
  { name: "Kevin Y.", role: "resident", score: 44, breakdown: ["-6 second booking this month"] },
  { name: "Farah Z.", role: "resident", score: 67, breakdown: ["+17 community priority"] },
  { name: "Marcus L.", role: "resident", score: 59, breakdown: ["+9 community priority"] },
  { name: "Yvonne P.", role: "resident", score: 63, breakdown: ["+13 community priority"] },
  { name: "Hassan B.", role: "resident", score: 70, breakdown: ["+20 not chosen last week"] },
];

/** Hot slots: extra competition on weekday evenings and Saturday */
const HOT_HOURS = [18, 19, 20, 10, 11];

export function buildSeedBallotEntries(): BallotEntry[] {
  const week = getTargetBallotWeek();
  const entries: BallotEntry[] = [];
  let applicantIdx = 0;
  let entryNum = 0;

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(week.weekStart);
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  for (const court of courts) {
    for (const date of dates) {
      for (let hour = 8; hour < 22; hour++) {
        const isHot = HOT_HOURS.includes(hour);
        const queueSize = isHot ? 2 + (hour % 3) : hour % 4 === 0 ? 1 : 0;
        if (queueSize === 0) continue;

        const slotId = `slot-${court.id}-${date}-${hour}`;
        for (let q = 0; q < queueSize; q++) {
          const applicant = FAKE_APPLICANTS[applicantIdx % FAKE_APPLICANTS.length];
          applicantIdx += 1;
          entryNum += 1;

          entries.push({
            id: `seed-ballot-${entryNum}`,
            weekId: week.id,
            userId: `seed-user-${entryNum}`,
            userName: applicant.name,
            userRole: applicant.role,
            courtId: court.id,
            slotId,
            date,
            startTime: `${hour.toString().padStart(2, "0")}:00`,
            endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
            submittedAt: new Date(Date.now() - entryNum * 3600000).toISOString(),
            ballotScore: applicant.score + (q === 0 ? 0 : -3),
            scoreBreakdown: applicant.breakdown,
            status: "pending",
            openToSharing: q % 2 === 0,
          });
        }
      }
    }
  }

  return entries;
}
