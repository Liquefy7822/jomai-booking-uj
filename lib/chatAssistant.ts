import { courts } from "@/lib/data/mockCourts";
import type { Court } from "@/lib/data/types";
import type { PreferredSchedule } from "@/lib/data/singpassPersonas";

export type ChatLink = {
  label: string;
  href: string;
  description?: string;
};

export type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
  links?: ChatLink[];
};

export type BookingPreferences = {
  preferredSchedule: PreferredSchedule;
  maxPricePerHour: number;
  scheduleLabel: string;
};

const BOOKING_INTENT =
  /\b(help|book|booking|recommend|suggest|court|courts|slot|slots|available|reserve|play)\b/i;

const GREETING_INTENT =
  /\b(hi|hello|hey|start|thanks|thank you)\b/i;

function scoreCourt(
  court: Court,
  prefs: BookingPreferences,
): { court: Court; score: number; reason: string } {
  let score = 0;
  const reasons: string[] = [];

  if (court.pricePerHour <= prefs.maxPricePerHour) {
    score += 40;
    reasons.push(`$${court.pricePerHour}/hr fits your budget (up to $${prefs.maxPricePerHour})`);
  } else {
    score -= 20;
    reasons.push(`slightly above budget at $${court.pricePerHour}/hr`);
  }

  const priceGap = prefs.maxPricePerHour - court.pricePerHour;
  score += Math.min(20, priceGap * 4);

  switch (prefs.preferredSchedule) {
    case "evening":
      if (court.location.includes("Hub")) {
        score += 15;
        reasons.push("good evening access at Tampines Hub");
      }
      break;
    case "weekend":
      if (court.pricePerHour <= 10) {
        score += 10;
        reasons.push("popular for weekend recreational play");
      }
      break;
    case "morning":
      if (court.amenities.some((a) => /competition|professional/i.test(a))) {
        score += 12;
        reasons.push("suited for morning training sessions");
      }
      break;
    default:
      break;
  }

  if (court.pricePerHour === Math.min(...courts.map((c) => c.pricePerHour))) {
    score += 8;
    reasons.push("lowest price on the platform");
  }

  return {
    court,
    score,
    reason: reasons.slice(0, 2).join("; ") || "available for your preferred times",
  };
}

export function getRecommendedCourts(
  prefs: BookingPreferences,
  limit = 3,
): Array<{ court: Court; reason: string }> {
  const ranked = courts
    .map((court) => scoreCourt(court, prefs))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return ranked.map(({ court, reason }) => ({ court, reason }));
}

export function getAssistantReply(
  userText: string,
  prefs: BookingPreferences | null,
): AssistantMessage {
  const trimmed = userText.trim();
  if (!trimmed) {
    return {
      role: "assistant",
      content:
        "Send a message like “I need help booking” and I’ll suggest courts that match your schedule and budget.",
    };
  }

  if (BOOKING_INTENT.test(trimmed)) {
    if (!prefs) {
      return {
        role: "assistant",
        content:
          "Sign in with Singpass first so I can match courts to your profile schedule and budget.",
      };
    }

    const picks = getRecommendedCourts(prefs);
    const links: ChatLink[] = picks.map(({ court, reason }) => ({
      label: court.name,
      href: `/booking/${court.id}`,
      description: `$${court.pricePerHour}/hr · ${court.location} · ${reason}`,
    }));

    return {
      role: "assistant",
      content: `Based on your usual ${prefs.scheduleLabel} and budget up to $${prefs.maxPricePerHour}/hr, here are my top picks:`,
      links,
    };
  }

  if (GREETING_INTENT.test(trimmed)) {
    return {
      role: "assistant",
      content:
        "Hi! I’m the BookIt assistant. Try: “I need help booking” for court recommendations tailored to your schedule and price.",
    };
  }

  return {
    role: "assistant",
    content:
      "I can help you find a court. Say something like “I need help booking” and I’ll share links to courts that fit your schedule and budget.",
  };
}

export const WELCOME_MESSAGE: AssistantMessage = {
  role: "assistant",
  content:
    "Hi! Need help choosing a court? Try: “I need help booking” — I’ll recommend options based on your Singpass profile (schedule & budget).",
};
