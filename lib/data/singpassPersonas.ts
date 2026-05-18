export type PreferredSchedule = "morning" | "evening" | "weekend" | "flexible";

export interface SingpassPersona {
  id: string;
  nric: string;
  name: string;
  preferredSchedule: PreferredSchedule;
  maxPricePerHour: number;
  scheduleLabel: string;
}

/** Demo Singpass identities for prototype login */
export const SINGPASS_PERSONAS: SingpassPersona[] = [
  {
    id: "persona-evening-budget",
    nric: "S1234567A",
    name: "Tan Wei Ming",
    preferredSchedule: "evening",
    maxPricePerHour: 8,
    scheduleLabel: "Weekday evenings (after 6pm)",
  },
  {
    id: "persona-weekend",
    nric: "S7654321B",
    name: "Lim Mei Ling",
    preferredSchedule: "weekend",
    maxPricePerHour: 10,
    scheduleLabel: "Weekends",
  },
  {
    id: "persona-morning-premium",
    nric: "S9876543C",
    name: "Kumar Rajesh",
    preferredSchedule: "morning",
    maxPricePerHour: 12,
    scheduleLabel: "Weekday mornings",
  },
];

export function getSingpassPersona(id: string): SingpassPersona | undefined {
  return SINGPASS_PERSONAS.find((p) => p.id === id);
}

export function singpassEmailForNric(nric: string): string {
  return `${nric.toLowerCase()}@singpass.bookit`;
}
