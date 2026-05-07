"use client";

import Link from "next/link";
import type { Court } from "@/lib/mockData";
import { MapPin, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CourtCardProps {
  court: Court;
}

export function CourtCard({ court }: CourtCardProps) {
  return (
    <Link href={`/booking/${court.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/30">
        <CardContent className="p-0">
          {/* Court Image Placeholder */}
          <div className="relative h-32 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-16 w-16 text-primary/20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="6" width="20" height="12" rx="1" />
                <line x1="12" y1="6" x2="12" y2="18" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <Badge
              className="absolute left-3 top-3 bg-primary/90 text-primary-foreground"
              variant="secondary"
            >
              ${court.pricePerHour}/hr
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
