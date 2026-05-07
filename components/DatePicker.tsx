"use client";

import { cn } from "@/lib/utils";

interface DatePickerProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  availableDates: string[];
}

export function DatePicker({
  selectedDate,
  onSelectDate,
  availableDates,
}: DatePickerProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium text-foreground">Select Date</h3>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {availableDates.map((dateStr) => {
          const date = new Date(dateStr);
          const dayName = date.toLocaleDateString("en-SG", { weekday: "short" });
          const dayNum = date.getDate();
          const month = date.toLocaleDateString("en-SG", { month: "short" });
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === new Date().toISOString().split("T")[0];

          return (
            <button
              key={dateStr}
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                "flex min-w-[72px] flex-col items-center rounded-lg border p-3 transition-all",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <span
                className={cn(
                  "text-xs font-medium uppercase",
                  isSelected ? "text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {dayName}
              </span>
              <span className="text-xl font-semibold">{dayNum}</span>
              <span
                className={cn(
                  "text-xs",
                  isSelected ? "text-primary-foreground" : "text-muted-foreground"
                )}
              >
                {month}
              </span>
              {isToday && (
                <span
                  className={cn(
                    "mt-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                    isSelected
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
