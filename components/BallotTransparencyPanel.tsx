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
import { BALLOT_RULES } from "@/lib/ballotLogic";
import {
  getPersonalizedSlotQueue,
  getSlotCompetitors,
} from "@/lib/ballotQueueView";
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
  const { replaceBallotBookings, resetDemoData } = useBooking();
  const {
    currentWeek,
    coachApplications,
    cancellations,
    neighbourhoodNotices,
    votingOpen,
    getProfile,
    runWeeklyAllocation,
    entries,
    cancelBallotEntry,
    resetBallot,
  } = useBallot();

  const myProfile = user ? getProfile(user.id) : null;
  const deadline = new Date(currentWeek.votingDeadline);
  const now = new Date();
  const hoursLeft = Math.max(
    0,
    Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60)),
  );

  // Get user's own ballot entries for this week
  const myBallotEntries = user
    ? entries.filter((e) => e.weekId === currentWeek.id && e.userId === user.id)
    : [];

  const clearMyPendingApplications = () => {
    if (!myBallotEntries.length) return;
    const pending = myBallotEntries.filter((e) => e.status === "pending");
    if (pending.length === 0) return;
    pending.forEach((e) => cancelBallotEntry(e.id));
  };

  return (
    <div className={cn("space-y-6", compact && "space-y-4")}>
      {/* User's Ballots Section */}
      {user && (
        <Card className="border-primary/30 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Your Ballot Applications ({myBallotEntries.length})
            </CardTitle>
            <CardDescription>
              Your applications for this ballot week
            </CardDescription>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={() => {
                  if (
                    confirm(
                      "Clear your pending ballot applications for this week?",
                    )
                  ) {
                    clearMyPendingApplications();
                  }
                }}
                disabled={
                  myBallotEntries.filter((e) => e.status === "pending").length === 0
                }
              >
                Clear my pending
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="h-8 text-xs"
                onClick={() => {
                  if (
                    confirm(
                      "Reset demo ballots and bookings back to the seeded data? This affects everyone on this prototype.",
                    )
                  ) {
                    resetBallot();
                    resetDemoData();
                  }
                }}
              >
                Reset demo queues
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {myBallotEntries.length === 0 ? (
              <div className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
                You have no ballot applications yet this week. Apply from a court slot to
                see live status here.
              </div>
            ) : (
              myBallotEntries.map((entry) => {
                const court = getCourtById(entry.courtId);
                const slotPeers = getSlotCompetitors(
                  entries,
                  entry.courtId,
                  entry.slotId,
                  entry.date,
                );
                const { position } = user
                  ? getPersonalizedSlotQueue(slotPeers, user.id)
                  : { position: 0 };
                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-lg border bg-muted/20 p-3"
                  >
                    <div>
                      <div className="font-medium">{court?.name || entry.courtId}</div>
                      <div className="text-sm text-muted-foreground">
                        {entry.date} {entry.startTime} - {entry.endTime}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Slot position: #{position > 0 ? position : "-"} · Score:{" "}
                        {entry.ballotScore}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          entry.status === "selected"
                            ? "default"
                            : entry.status === "not_selected"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {entry.status.replace("_", " ")}
                      </Badge>
                      {entry.status === "pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 h-7 border-destructive/40 text-xs text-destructive hover:bg-destructive/10"
                          onClick={() => cancelBallotEntry(entry.id)}
                        >
                          Cancel ballot
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      )}

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
            {!myProfile.wasNotChosenLastWeek && (
              <Badge variant="outline">Last week chosen: yes</Badge>
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
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <ListOrdered className="size-4" />
              Your slot queue
            </CardTitle>
            <CardDescription>
              Positions ahead of you are shown as numbers only (no names). Then your
              row. Others behind you are hidden.
            </CardDescription>
          </div>
          {showDemoButton && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => runWeeklyAllocation(replaceBallotBookings)}
            >
              Run demo allocation
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {!user ? (
            <p className="text-center text-sm text-muted-foreground">
              Sign in and apply for a slot to see your queue position.
            </p>
          ) : myBallotEntries.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No applications yet. Book a court to join a slot queue.
            </p>
          ) : (
            myBallotEntries.map((myEntry) => {
              const court = getCourtById(myEntry.courtId);
              const slotPeers = getSlotCompetitors(
                entries,
                myEntry.courtId,
                myEntry.slotId,
                myEntry.date,
              );
              const { ahead, you, position } = getPersonalizedSlotQueue(
                slotPeers,
                user.id,
              );

              return (
                <Card key={myEntry.id} className="border-muted">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {court?.name || myEntry.courtId}
                    </CardTitle>
                    <CardDescription>
                      {myEntry.date} · {myEntry.startTime} – {myEntry.endTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {!you ? (
                      <p className="text-sm text-muted-foreground">
                        Queue data unavailable for this slot.
                      </p>
                    ) : (
                      <>
                        {ahead.length > 0 ? (
                          <div>
                            <p className="mb-2 text-xs font-medium text-muted-foreground">
                              Ahead of you ({ahead.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {ahead.map((entry, index) => (
                                <span
                                  key={entry.id}
                                  className="inline-flex size-9 items-center justify-center rounded-full border bg-muted/50 text-sm font-semibold text-muted-foreground"
                                  title={`Position ${index + 1} in queue`}
                                >
                                  {index + 1}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-emerald-700 dark:text-emerald-400">
                            You are first in line for this slot.
                          </p>
                        )}
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">#</TableHead>
                              <TableHead>Applicant</TableHead>
                              <TableHead className="text-right">Score</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="bg-primary/5">
                              <TableCell className="font-medium">{position}</TableCell>
                              <TableCell>
                                <div className="font-semibold text-foreground">You</div>
                                <Badge
                                  className={cn("mt-1 text-xs", roleBadge(you.userRole))}
                                >
                                  {you.userRole}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right font-semibold text-primary">
                                {you.ballotScore}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    you.status === "selected"
                                      ? "default"
                                      : you.status === "not_selected"
                                        ? "secondary"
                                        : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {you.status.replace("_", " ")}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
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
