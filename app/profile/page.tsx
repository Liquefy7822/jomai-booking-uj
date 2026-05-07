"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useBooking } from "@/context/BookingContext";
import { BookingCard } from "@/components/BookingCard";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Mail,
  Trophy,
  Calendar,
  TrendingUp,
} from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading: userLoading } = useUser();
  const { bookings, cancelBooking } = useBooking();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/");
    }
  }, [user, userLoading, router]);

  if (userLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // TODO: Replace with API call to fetch user's bookings
  const userBookings = bookings
    .filter((b) => b.userId === user.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const upcomingBookings = userBookings.filter(
    (b) => new Date(b.date) >= new Date(new Date().toDateString())
  );

  const pastBookings = userBookings.filter(
    (b) => new Date(b.date) < new Date(new Date().toDateString())
  );

  // Calculate priority tier based on score
  const getPriorityTier = (score: number) => {
    if (score >= 90) return { tier: "Gold", color: "text-amber-600" };
    if (score >= 75) return { tier: "Silver", color: "text-slate-500" };
    return { tier: "Bronze", color: "text-orange-700" };
  };

  const priorityTier = getPriorityTier(user.priorityScore);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your bookings and view your priority score
          </p>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column - User Info & Priority */}
            <div className="space-y-6">
              {/* User Info Card */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-7 w-7" />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-foreground">
                        {user.name}
                      </h2>
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{user.email}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>
                          Member since{" "}
                          {new Date(user.createdAt).toLocaleDateString("en-SG", {
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Priority Score Card */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Trophy className={`h-5 w-5 ${priorityTier.color}`} />
                        <span
                          className={`text-sm font-semibold ${priorityTier.color}`}
                        >
                          {priorityTier.tier} Member
                        </span>
                      </div>
                      <h3 className="mt-1 text-2xl font-bold text-foreground">
                        {user.priorityScore}
                        <span className="text-lg text-muted-foreground">/100</span>
                      </h3>
                      <p className="text-sm text-muted-foreground">Priority Score</p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-emerald-600">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-sm font-medium">+5 this month</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Current</span>
                      <span>
                        {user.priorityScore >= 90
                          ? "Max tier reached!"
                          : `${90 - user.priorityScore} points to Gold`}
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${user.priorityScore}%` }}
                      />
                    </div>
                  </div>

                  {/* TODO: Replace with real priority score calculation from backend */}
                  <p className="mt-3 text-xs text-muted-foreground">
                    Priority score affects your booking preferences during peak hours.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Bookings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Bookings */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    Upcoming Bookings ({upcomingBookings.length})
                  </h3>
                </div>

                {upcomingBookings.length === 0 ? (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Calendar className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-3 font-medium text-foreground">
                        No upcoming bookings
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Browse available courts to make a booking
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => router.push("/home")}
                      >
                        Browse Courts
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {upcomingBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        onCancel={() => {
                          // TODO: Replace with API call to cancel booking
                          if (
                            confirm(
                              "Are you sure you want to cancel this booking?"
                            )
                          ) {
                            cancelBooking(booking.id);
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Past Bookings */}
              {pastBookings.length > 0 && (
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">
                      Past Bookings ({pastBookings.length})
                    </h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {pastBookings.slice(0, 4).map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        isPast
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
