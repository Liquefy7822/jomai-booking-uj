"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useBallot } from "@/context/BallotContext";
import { courts } from "@/lib/mockData";
import { CourtCard } from "@/components/CourtCard";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Search, Scale, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { user, isLoading } = useUser();
  const { entries } = useBallot();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter courts based on search
  const filteredCourts = courts.filter((court) => {
    const matchesSearch =
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-foreground">
            Badminton Courts
          </h1>
          <p className="mt-1 text-muted-foreground">
            Select a court to view availability and book a slot
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-border px-4 py-4">
        <div className="mx-auto max-w-5xl">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search courts or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="border-b border-border bg-primary/5 px-4 py-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Scale className="size-4 text-primary" />
            <span className="text-foreground">
              Courts are allocated by weekly ballot — not first-come-first-served.
            </span>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/ballot">
              View transparency panel
              <ArrowRight className="ml-1 size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Courts List */}
      <div className="px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-foreground">
              Available Courts ({filteredCourts.length})
            </h2>
          </div>

          {filteredCourts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-8 text-center">
              <p className="text-muted-foreground">No courts found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* TODO: Replace with API call to fetch courts */}
              {filteredCourts.map((court) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  ballotCount={entries.filter((entry) => entry.courtId === court.id).length}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
