"use client";

import type { Booking } from "@/lib/mockData";
import { formatDate, formatTime, getCourtById } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

interface BookingCardProps {
  booking: Booking;
  onCancel: () => void;
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const court = getCourtById(booking.courtId);
  const isPast = new Date(booking.date) < new Date(new Date().toDateString());

  return (
    <Card className={isPast ? "opacity-60" : ""}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground">
              {court?.name || "Unknown Court"}
            </h3>
            {court && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{court.location}</span>
              </div>
            )}
          </div>
          {booking.openToSharing && (
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
              <Users className="mr-1 h-3 w-3" />
              Open
            </Badge>
          )}
        </div>

        {/* Details */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
            </span>
          </div>
        </div>

        {/* Action */}
        {!isPast && (
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={onCancel}>
              Cancel Booking
            </Button>
          </div>
        )}

        {isPast && (
          <p className="mt-4 text-sm text-muted-foreground">
            This booking has passed
          </p>
        )}
      </CardContent>
    </Card>
  );
}
