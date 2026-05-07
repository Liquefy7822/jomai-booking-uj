"use client";

import Link from "next/link";
import type { Court } from "@/lib/mockData";
import { MapPin, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourtCardProps {
  court: Court;
}

const courtTypeColors: Record<Court["type"], string> = {
  badminton: "bg-emerald-100 text-emerald-800",
  tennis: "bg-amber-100 text-amber-800",
  basketball: "bg-orange-100 text-orange-800",
  futsal: "bg-sky-100 text-sky-800",
};

const courtTypeLabels: Record<Court["type"], string> = {
  badminton: "Badminton",
  tennis: "Tennis",
  basketball: "Basketball",
  futsal: "Futsal",
};

export function CourtCard({ court }: CourtCardProps) {
  return (
    <Link href={`/booking/${court.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
        <CardContent className="p-0">
          {/* Court Image Placeholder */}
          <div className="relative h-32 bg-gradient-to-br from-muted to-muted/50">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl opacity-50">
                {court.type === "badminton" && "🏸"}
                {court.type === "tennis" && "🎾"}
                {court.type === "basketball" && "🏀"}
                {court.type === "futsal" && "⚽"}
              </span>
            </div>
            <Badge
              className={cn(
                "absolute left-3 top-3",
                courtTypeColors[court.type]
              )}
              variant="secondary"
            >
              {courtTypeLabels[court.type]}
            </Badge>
          </div>

          {/* Court Info */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground">{court.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{court.location}</span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Amenities */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {court.amenities.slice(0, 2).map((amenity) => (
                <span
                  key={amenity}
                  className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                >
                  {amenity}
                </span>
              ))}
              {court.amenities.length > 2 && (
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                  +{court.amenities.length - 2} more
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
