"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useBooking } from "@/context/BookingContext";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { courts, users as mockUsers } from "@/lib/mockData";
import {
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  Activity,
  BarChart3,
  UserCheck,
  Percent,
} from "lucide-react";

// Mock stats for demo
const generateMockStats = () => {
  const today = new Date();
  const currentMonth = today.toLocaleString("en-SG", { month: "long" });
  
  return {
    // Overview stats
    totalBookingsToday: Math.floor(Math.random() * 30) + 45,
    totalBookingsWeek: Math.floor(Math.random() * 100) + 280,
    totalBookingsMonth: Math.floor(Math.random() * 500) + 1200,
    revenueToday: Math.floor(Math.random() * 200) + 350,
    revenueWeek: Math.floor(Math.random() * 1000) + 2400,
    revenueMonth: Math.floor(Math.random() * 5000) + 12000,
    
    // User stats
    totalRegisteredUsers: Math.floor(Math.random() * 200) + 1847,
    activeUsersThisMonth: Math.floor(Math.random() * 100) + 423,
    newUsersThisWeek: Math.floor(Math.random() * 20) + 34,
    averagePriorityScore: Math.floor(Math.random() * 10) + 78,
    
    // Court utilization
    overallUtilization: Math.floor(Math.random() * 15) + 72,
    peakHourUtilization: Math.floor(Math.random() * 10) + 88,
    
    // Matchmaking
    activeMatchmakingPosts: Math.floor(Math.random() * 10) + 12,
    successfulMatches: Math.floor(Math.random() * 50) + 156,
    
    // Time-based
    peakHours: ["6:00 PM - 8:00 PM", "7:00 PM - 9:00 PM"],
    busiestDay: "Saturday",
    currentMonth,
  };
};

// Court utilization data
const generateCourtUtilization = () => {
  return courts.map((court) => ({
    ...court,
    utilizationRate: Math.floor(Math.random() * 30) + 60,
    bookingsToday: Math.floor(Math.random() * 10) + 3,
    revenueToday: Math.floor(Math.random() * 50) + 30,
  }));
};

// Recent bookings for demo
const generateRecentBookings = () => {
  const names = ["John Tan", "Mary Lim", "David Wong", "Sarah Chen", "Michael Lee", "Lisa Ng", "Kevin Ong", "Rachel Goh"];
  const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "18:00", "19:00", "20:00"];
  
  return Array.from({ length: 8 }, (_, i) => ({
    id: `recent-${i}`,
    userName: names[i % names.length],
    courtName: courts[i % courts.length].name,
    time: times[i],
    date: i < 4 ? "Today" : "Tomorrow",
    status: Math.random() > 0.2 ? "confirmed" : "pending",
  }));
};

// Hourly distribution data
const hourlyDistribution = [
  { hour: "8AM", bookings: 12 },
  { hour: "9AM", bookings: 18 },
  { hour: "10AM", bookings: 24 },
  { hour: "11AM", bookings: 20 },
  { hour: "12PM", bookings: 15 },
  { hour: "1PM", bookings: 14 },
  { hour: "2PM", bookings: 16 },
  { hour: "3PM", bookings: 19 },
  { hour: "4PM", bookings: 22 },
  { hour: "5PM", bookings: 28 },
  { hour: "6PM", bookings: 35 },
  { hour: "7PM", bookings: 38 },
  { hour: "8PM", bookings: 32 },
  { hour: "9PM", bookings: 25 },
];

const maxBookings = Math.max(...hourlyDistribution.map((h) => h.bookings));

export default function AdminPage() {
  const { user, isLoading } = useUser();
  const { bookings, matchmakingPosts } = useBookings();
  const router = useRouter();

  const stats = generateMockStats();
  const courtUtilization = generateCourtUtilization();
  const recentBookings = generateRecentBookings();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            BookIt facility management overview for {stats.currentMonth}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today&apos;s Bookings</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stats.totalBookingsToday}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stats.totalBookingsWeek} this week
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today&apos;s Revenue</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">${stats.revenueToday}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ${stats.revenueMonth.toLocaleString()} this month
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stats.activeUsersThisMonth}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    +{stats.newUsersThisWeek} new this week
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Court Utilization</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">{stats.overallUtilization}%</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stats.peakHourUtilization}% at peak hours
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Hourly Booking Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="h-5 w-5 text-primary" />
                Hourly Booking Distribution
              </CardTitle>
              <CardDescription>Average bookings per hour today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {hourlyDistribution.map((item) => (
                  <div key={item.hour} className="flex items-center gap-3">
                    <span className="w-10 text-xs text-muted-foreground">{item.hour}</span>
                    <div className="flex-1">
                      <div
                        className="h-6 rounded bg-primary/80 transition-all"
                        style={{ width: `${(item.bookings / maxBookings) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs font-medium text-foreground">
                      {item.bookings}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 border-t border-border pt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Peak: {stats.peakHours[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Busiest: {stats.busiestDay}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Bookings
              </CardTitle>
              <CardDescription>Latest booking activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{booking.userName}</p>
                        <p className="text-xs text-muted-foreground">
                          {booking.courtName} at {booking.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={booking.status === "confirmed" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {booking.status}
                      </Badge>
                      <p className="mt-1 text-xs text-muted-foreground">{booking.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Court Utilization Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-primary" />
              Court Performance
            </CardTitle>
            <CardDescription>Individual court statistics for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left text-sm text-muted-foreground">
                    <th className="pb-3 font-medium">Court</th>
                    <th className="pb-3 font-medium">Location</th>
                    <th className="pb-3 font-medium">Rate/Hr</th>
                    <th className="pb-3 font-medium">Bookings</th>
                    <th className="pb-3 font-medium">Revenue</th>
                    <th className="pb-3 font-medium">Utilization</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {courtUtilization.map((court) => (
                    <tr key={court.id} className="border-b border-border/50 last:border-0">
                      <td className="py-3 font-medium text-foreground">{court.name}</td>
                      <td className="py-3 text-muted-foreground">{court.location}</td>
                      <td className="py-3 text-muted-foreground">${court.pricePerHour}</td>
                      <td className="py-3 text-foreground">{court.bookingsToday}</td>
                      <td className="py-3 text-foreground">${court.revenueToday}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                            <div
                              className={`h-full rounded-full ${
                                court.utilizationRate >= 80
                                  ? "bg-green-500"
                                  : court.utilizationRate >= 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${court.utilizationRate}%` }}
                            />
                          </div>
                          <span className="text-muted-foreground">{court.utilizationRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Additional Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-xl font-bold text-foreground">{stats.totalRegisteredUsers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10">
                  <Activity className="h-5 w-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Matchmaking</p>
                  <p className="text-xl font-bold text-foreground">{matchmakingPosts.length + stats.activeMatchmakingPosts}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                  <UserCheck className="h-5 w-5 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Successful Matches</p>
                  <p className="text-xl font-bold text-foreground">{stats.successfulMatches}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                  <Percent className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Priority Score</p>
                  <p className="text-xl font-bold text-foreground">{stats.averagePriorityScore}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Bookings Count */}
        <div className="mt-8 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-green-500 opacity-75" />
              </div>
              <span className="text-sm text-muted-foreground">
                Live: <span className="font-medium text-foreground">{bookings.length}</span> active bookings in system
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Last updated: {new Date().toLocaleTimeString("en-SG")}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
