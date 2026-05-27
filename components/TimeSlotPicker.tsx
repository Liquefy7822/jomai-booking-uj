"use client";

import { useState } from "react";
import type { TimeSlot } from "@/lib/mockData";
import { formatTime } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  bookedSlotIds: string[];
  ballotCountsBySlotId?: Record<string, number>;
  winChanceBySlotId?: Record<string, number>;
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSelectSlot,
  bookedSlotIds,
  ballotCountsBySlotId = {},
  winChanceBySlotId = {},
}: TimeSlotPickerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const slotsPerPage = 8;
  const totalPages = Math.ceil(slots.length / slotsPerPage);

  const visibleSlots = slots.slice(
    currentPage * slotsPerPage,
    (currentPage + 1) * slotsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-foreground">Select Time Slot</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {visibleSlots.map((slot) => {
          const isBooked = bookedSlotIds.includes(slot.id);
          const isUnavailable = !slot.isAvailable || isBooked;
          const isSelected = selectedSlot?.id === slot.id;
          const ballotCount = ballotCountsBySlotId[slot.id] ?? 0;
          const winChance = winChanceBySlotId[slot.id];
          const isPeak = slot.price > 8;

          return (
            <button
              key={slot.id}
              disabled={isUnavailable}
              onClick={() => onSelectSlot(slot)}
              className={cn(
                "flex flex-col items-center rounded-lg border p-2 text-center transition-all",
                isUnavailable &&
                  "cursor-not-allowed border-border bg-muted/50 text-muted-foreground opacity-50",
                !isUnavailable &&
                  !isSelected &&
                  "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
                isSelected && "border-primary bg-primary/10 ring-1 ring-primary"
              )}
            >
              <span className="text-sm font-medium">
                {formatTime(slot.startTime)}
              </span>
              <span className="text-xs text-muted-foreground">${slot.price}</span>
              <span className="text-[11px] text-muted-foreground">
                {ballotCount} ballot{ballotCount === 1 ? "" : "s"}
              </span>
              {winChance !== undefined && (
                <span
                  className={cn(
                    "text-[11px] font-semibold",
                    winChance >= 55
                      ? "text-emerald-700"
                      : winChance >= 35
                        ? "text-amber-700"
                        : "text-red-600",
                  )}
                >
                  {winChance}% chance
                </span>
              )}
              {isPeak && (
                <span className="text-[11px] font-medium text-amber-700">
                  Peak
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border border-border bg-card" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border border-primary bg-primary/10" />
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded border border-border bg-muted/50 opacity-50" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}
