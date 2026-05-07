"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { courts, type Court } from "@/lib/mockData";
import { CourtCard } from "@/components/CourtCard";
import { BottomNavbar } from "@/components/BottomNavbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, Search, LogOut } from "lucide-react";

export default function HomePage() {
  const { user, isLoading, logout } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<Court["type"] | "all">("all");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Filter courts based on search and type
  const filteredCourts = courts.filter((court) => {
    const matchesSearch =
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || court.type === selectedType;
    return matchesSearch && matchesType;
  });

  const courtTypes: { value: Court["type"] | "all"; label: string }[] = [
    { value: "all", label: "All" },
    { value: "badminton", label: "Badminton" },
    { value: "tennis", label: "Tennis" },
    { value: "basketball", label: "Basketball" },
    { value: "futsal", label: "Futsal" },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-lg px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">BookIt</h1>
                <p className="text-xs text-muted-foreground">
                  Welcome, {user.name.split(" ")[0]}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="mx-auto max-w-lg px-4 py-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courts or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Type Filter */}
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {courtTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.value)}
              className="shrink-0"
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Courts List */}
      <div className="mx-auto max-w-lg px-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-medium text-foreground">
            Available Facilities ({filteredCourts.length})
          </h2>
        </div>

        {filteredCourts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
            <p className="text-muted-foreground">No facilities found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* TODO: Replace with API call to fetch courts */}
            {filteredCourts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}
