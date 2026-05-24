"use client";

import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BALLOT_RULES, BALLOT_RULES_SUMMARY } from "@/lib/ballotLogic";
import { CheckCircle2, Gavel, Clock, Users, AlertTriangle } from "lucide-react";

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-foreground">Ballot Rules</h1>
          <p className="mt-1 text-muted-foreground">
            Transparent rules for court booking allocation
          </p>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Summary Rules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Ballot System Rules
              </CardTitle>
              <CardDescription>
                Key rules that govern how court bookings are allocated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                {BALLOT_RULES_SUMMARY.map((rule) => (
                  <li key={rule} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Detailed Rules */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="h-4 w-4 text-primary" />
                  Booking Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Advance booking</span>
                  <span className="font-medium">{BALLOT_RULES.advanceBookingDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Voting deadline</span>
                  <span className="font-medium">Sunday 11:59 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max bookings/month</span>
                  <span className="font-medium">{BALLOT_RULES.maxBookingsPerMonth}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Cancellation Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Min notice</span>
                  <span className="font-medium">{BALLOT_RULES.minCancellationHours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Late cancel fee</span>
                  <span className="font-medium">{BALLOT_RULES.lateCancellationFeeMultiplier * 100}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Neighbourhood notify</span>
                  <span className="font-medium">Yes (late cancel)</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-primary" />
                  Priority Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Residents not chosen last week receive priority</p>
                <p>• Elderly residents get weekend priority</p>
                <p>• Elderly can use 1 monthly override with new partner</p>
                <p>• Coaches apply via Community Centre</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Gavel className="h-4 w-4 text-primary" />
                  Allocation Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Ranked by fairness score only</p>
                <p>• Not first-come-first-served</p>
                <p>• Submission time shown for audit only</p>
                <p>• Released slots go to next in waitlist by rank</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
