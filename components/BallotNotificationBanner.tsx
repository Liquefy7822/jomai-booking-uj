"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useBallot } from "@/context/BallotContext";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const AUTO_DISMISS_MS = 8000;

export function BallotNotificationBanner() {
  const { ballotNotification, dismissBallotNotification } = useBallot();

  useEffect(() => {
    if (!ballotNotification) return;
    const timer = setTimeout(dismissBallotNotification, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [ballotNotification, dismissBallotNotification]);

  if (!ballotNotification) return null;

  const { courtName, winChancePercent, usedMonthlyOverride, message } =
    ballotNotification;

  return (
    <>
      <div
        role="alert"
        className={cn(
          "fixed inset-x-0 top-0 z-[100] border-b shadow-md animate-in slide-in-from-top duration-300",
          "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/90 dark:border-emerald-800",
        )}
      >
        <div className="mx-auto flex max-w-5xl items-start gap-3 px-4 py-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground">
              Ballot application submitted
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {courtName} — {message}
            </p>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-medium text-emerald-800 dark:text-emerald-300">
                Estimated chance: {winChancePercent}%
              </span>
              {!usedMonthlyOverride && (
                <span className="inline-flex items-center gap-1 text-amber-800 dark:text-amber-300">
                  <AlertTriangle className="size-3.5" />
                  Not guaranteed — may fail unless monthly priority override is
                  used
                </span>
              )}
              {usedMonthlyOverride && (
                <span className="text-emerald-700 dark:text-emerald-400">
                  Monthly priority override applied
                </span>
              )}
            </p>
            <Button asChild variant="link" className="h-auto p-0 text-sm">
              <Link href="/ballot">View transparency panel</Link>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            aria-label="Dismiss notification"
            onClick={dismissBallotNotification}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
      <div className="h-[7.5rem] shrink-0" aria-hidden />
    </>
  );
}
