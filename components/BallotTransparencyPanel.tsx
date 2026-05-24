"use client";

import Link from "next/link";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Gavel,
  Info,
  ListOrdered,
  Megaphone,
  Shield,
  Users,
} from "lucide-react";

import { useBallot } from "@/context/BallotContext";
import { useUser } from "@/context/UserContext";
import { useBooking } from "@/context/BookingContext";
import { BALLOT_RULES, BALLOT_RULES_SUMMARY } from "@/lib/ballotLogic";
import { getCourtById } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

function formatDeadline(iso: string): string {
  return new Date(iso).toLocaleString("en-SG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function roleBadge(role: string) {
  if (role === "elderly") return "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200";
  if (role === "coach") return "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200";
  return "bg-secondary text-secondary-foreground";
}

export function BallotTransparencyPanel({ compact = false, showDemoButton = false, simplified = false }: { compact?: boolean; showDemoButton?: boolean; simplified?: boolean }) {
  const { user } = useUser();
  const { addBooking } = useBooking();
  const {
    currentWeek,
    rankedEntries,
    coachApplications,
    cancellations,
    neighbourhoodNotices,
    votingOpen,
    getProfile,
    runWeeklyAllocation,
  } = useBallot();

  const myProfile = user ? getProfile(user.id) : null;
  const deadline = new Date(currentWeek.votingDeadline);
  const now = new Date();
  const hoursLeft = Math.max(
    0,
    Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60)),
  );

  return (
    <div className={cn("space-y-6", compact && "space-y-4")}>
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="size-5 text-primary" />
                Fair ballot system
              </CardTitle>
              <CardDescription className="mt-1 max-w-2xl">
                All applications for {currentWeek.weekStart} – {currentWeek.weekEnd} are
                ranked publicly by score — not by who clicked first. Voting closes
                Sunday.
              </CardDescription>
            </div>
            <Badge variant={votingOpen ? "default" : "secondary"}>
              {votingOpen ? "Voting open" : "Voting closed"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3 text-sm">
          <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
            <Calendar className="size-4 text-primary" />
            <span>
              Week: {currentWeek.weekStart} → {currentWeek.weekEnd}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
            <Clock className="size-4 text-primary" />
            <span>
              {votingOpen
                ? `${hoursLeft}h left · deadline ${formatDeadline(currentWeek.votingDeadline)}`
                : `Closed ${formatDeadline(currentWeek.votingDeadline)}`}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-background px-3 py-2">
            <Gavel className="size-4 text-primary" />
            <span>Max {BALLOT_RULES.maxBookingsPerMonth} bookings / month</span>
          </div>
        </CardContent>
      </Card>

      {user && myProfile && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Your ballot status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2 text-sm">
            {myProfile.wasNotChosenLastWeek && (
              <Badge variant="outline" className="border-emerald-500 text-emerald-700">
                Priority: not chosen last week
              </Badge>
            )}
            <Badge variant="outline">
              Bookings this month: {myProfile.bookingsThisMonth}/
              {BALLOT_RULES.maxBookingsPerMonth}
            </Badge>
            {user.role === "elderly" && (
              <Badge variant="outline">
                Override used:{" "}
                {myProfile.monthlyOverrideUsed ? "yes (this month)" : "available"}
              </Badge>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="size-4" />
            Rules (transparent)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {BALLOT_RULES_SUMMARY.map((rule) => (
              <li key={rule} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListOrdered className="size-4" />
              Ballot queue (not booking order)
            </CardTitle>
            <CardDescription>
              Sorted by fairness score only. Submission time is shown for audit but
              does not affect rank.
            </CardDescription>
          </div>
          {showDemoButton && (
            <Button type="button" variant="outline" size="sm" onClick={() => runWeeklyAllocation(addBooking)}>
              Run demo allocation
            </Button>
          )}
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Slot</TableHead>
                <TableHead className="text-right">Score</TableHead>
                {!simplified && <TableHead>Applied (audit)</TableHead>}
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankedEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={simplified ? 5 : 6} className="text-center text-muted-foreground">
                    No applications yet for this week.
                  </TableCell>
                </TableRow>
              ) : (
                rankedEntries.map((entry, index) => {
                  const court = getCourtById(entry.courtId);
                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="font-medium">{entry.userName}</div>
                        <Badge className={cn("mt-1 text-xs", roleBadge(entry.userRole))}>
                          {entry.userRole}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {court?.name ?? entry.courtId}
                        <br />
                        <span className="text-muted-foreground">
                          {entry.date} {entry.startTime}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold text-primary">
                          {entry.ballotScore}
                        </span>
                        {!simplified && !compact && entry.scoreBreakdown.length > 0 && (
                          <ul className="mt-1 text-xs text-muted-foreground">
                            {entry.scoreBreakdown.slice(0, 2).map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        )}
                      </TableCell>
                      {!simplified && (
                        <TableCell className="text-xs text-muted-foreground">
                          {new Date(entry.submittedAt).toLocaleString("en-SG", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                      )}
                      <TableCell>
                        <Badge
                          variant={
                            entry.status === "selected"
                              ? "default"
                              : entry.status === "not_selected"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {entry.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {coachApplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4" />
              Coach applications (CC review)
            </CardTitle>
            <CardDescription>
              Coaches apply with their Community Centre; CC consults statistics before
              week-round slots are reserved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {coachApplications.map((app) => (
              <div
                key={app.id}
                className="rounded-lg border bg-muted/30 px-4 py-3 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{app.coachName}</span>
                  <Badge variant="outline">{app.status.replace(/_/g, " ")}</Badge>
                </div>
                <p className="mt-1 text-muted-foreground">CC: {app.ccName}</p>
                <p className="mt-1">{app.ccNotes}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="size-4 text-amber-600" />
            Cancellations & waitlist
          </CardTitle>
          <CardDescription>
            Minimum {BALLOT_RULES.minCancellationHours}h notice. Late cancel:{" "}
            {BALLOT_RULES.lateCancellationFeeMultiplier * 100}% fee + neighbourhood
            notice. Next in line by ballot rank.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {cancellations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No cancellations recorded yet.</p>
          ) : (
            cancellations.map((c) => (
              <div key={c.id} className="rounded-lg border px-3 py-2 text-sm">
                <span className="font-medium">{c.userName}</span> cancelled {c.date} ·{" "}
                {c.hoursBeforeSlot.toFixed(0)}h before slot
                {c.feeCharged > 0 && (
                  <span className="text-destructive"> · fee ${c.feeCharged.toFixed(2)}</span>
                )}
                {c.nextInLineUserName && (
                  <span className="text-primary">
                    {" "}
                    → offered to {c.nextInLineUserName}
                  </span>
                )}
                {c.neighbourhoodNotified && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Neighbourhood notified
                  </Badge>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {neighbourhoodNotices.length > 0 && (
        <Card className="border-amber-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone className="size-4" />
              Neighbourhood notices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {neighbourhoodNotices.map((n) => (
              <p key={n.id} className="text-sm text-muted-foreground">
                {n.message}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      {!compact && (
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/home">Book a court (ballot application)</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/profile">View my bookings</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
