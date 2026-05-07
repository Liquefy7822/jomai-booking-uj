"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useBooking } from "@/context/BookingContext";
import {
  getCourtById,
  getSlotsByCourtAndDate,
  formatTime,
  type TimeSlot,
} from "@/lib/mockData";
import { PageHeader } from "@/components/PageHeader";
import { DatePicker } from "@/components/DatePicker";
import { TimeSlotPicker } from "@/components/TimeSlotPicker";
import { BottomNavbar } from "@/components/BottomNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Check, Users } from "lucide-react";

export default function BookingPage({
  params,
}: {
  params: Promise<{ courtId: string }>;
}) {
  const { courtId } = use(params);
  const { user, isLoading: userLoading } = useUser();
  const { bookings, addBooking } = useBooking();
  const router = useRouter();

  // Generate available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split("T")[0];
  });

  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [openToSharing, setOpenToSharing] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // TODO: Replace with API call to fetch court details
  const court = getCourtById(courtId);

  // TODO: Replace with API call to fetch available slots
  const slots = getSlotsByCourtAndDate(courtId, selectedDate);

  // Get booked slot IDs for this court and date
  const bookedSlotIds = bookings
    .filter((b) => b.courtId === courtId && b.date === selectedDate)
    .map((b) => b.slotId);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/");
    }
  }, [user, userLoading, router]);

  // Reset selected slot when date changes
  useEffect(() => {
    setSelectedSlot(null);
  }, [selectedDate]);

  if (userLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!court) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-foreground">
            Court not found
          </h2>
          <p className="text-muted-foreground">
            This facility does not exist.
          </p>
          <Button className="mt-4" onClick={() => router.push("/home")}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!selectedSlot || !user) return;

    setIsBooking(true);

    // TODO: Replace with real API call to create booking
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    addBooking({
      courtId: court.id,
      slotId: selectedSlot.id,
      userId: user.id,
      userName: user.name,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      openToSharing,
    });

    setIsBooking(false);
    setBookingSuccess(true);

    // Redirect to profile after a short delay
    setTimeout(() => {
      router.push("/profile");
    }, 1500);
  };

  if (bookingSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Booking Confirmed!
          </h2>
          <p className="mt-2 text-muted-foreground">
            {court.name} has been booked for{" "}
            {selectedSlot && formatTime(selectedSlot.startTime)} on{" "}
            {new Date(selectedDate).toLocaleDateString("en-SG", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Redirecting to your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <PageHeader title={court.name} subtitle={court.location} showBack />

      <div className="mx-auto max-w-lg space-y-6 px-4 py-4">
        {/* Court Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              {/* Court Image Placeholder */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-muted">
                <span className="text-3xl">
                  {court.type === "badminton" && "🏸"}
                  {court.type === "tennis" && "🎾"}
                  {court.type === "basketball" && "🏀"}
                  {court.type === "futsal" && "⚽"}
                </span>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-foreground">{court.name}</h2>
                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{court.location}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {court.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Date Selection */}
        <DatePicker
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          availableDates={availableDates}
        />

        {/* Time Slot Selection */}
        <TimeSlotPicker
          slots={slots}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
          bookedSlotIds={bookedSlotIds}
        />

        {/* Open to Sharing Toggle */}
        {selectedSlot && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <Label
                      htmlFor="sharing"
                      className="text-sm font-medium text-foreground"
                    >
                      Open to sharing this slot
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Allow others to find and join your game
                    </p>
                  </div>
                </div>
                <Switch
                  id="sharing"
                  checked={openToSharing}
                  onCheckedChange={setOpenToSharing}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Summary */}
        {selectedSlot && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <h3 className="font-medium text-foreground">Booking Summary</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {new Date(selectedDate).toLocaleDateString("en-SG", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">
                    {formatTime(selectedSlot.startTime)} -{" "}
                    {formatTime(selectedSlot.endTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">${selectedSlot.price}.00</span>
                </div>
                {openToSharing && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sharing</span>
                    <Badge
                      variant="secondary"
                      className="bg-emerald-100 text-emerald-800"
                    >
                      Open to players
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-border bg-card p-4">
        <div className="mx-auto max-w-lg">
          <Button
            className="w-full"
            size="lg"
            disabled={!selectedSlot || isBooking}
            onClick={handleBooking}
          >
            {isBooking ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Booking...
              </>
            ) : selectedSlot ? (
              `Confirm Booking - $${selectedSlot.price}.00`
            ) : (
              "Select a time slot"
            )}
          </Button>
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
}
