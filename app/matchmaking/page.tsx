"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useBooking } from "@/context/BookingContext";
import { courts, type MatchmakingPost } from "@/lib/mockData";
import { MatchmakingCard } from "@/components/MatchmakingCard";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Users } from "lucide-react";

export default function MatchmakingPage() {
  const { user, isLoading: userLoading } = useUser();
  const {
    matchmakingPosts,
    addMatchmakingPost,
    joinMatchmakingPost,
    leaveMatchmakingPost,
  } = useBooking();
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [playersNeeded, setPlayersNeeded] = useState("4");
  const [skillLevel, setSkillLevel] =
    useState<MatchmakingPost["skillLevel"]>("intermediate");
  const [description, setDescription] = useState("");

  // Generate available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toISOString().split("T")[0];
  });

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

  const handleCreatePost = () => {
    if (!selectedCourt || !selectedDate || !startTime || !user) return;

    const court = courts.find((c) => c.id === selectedCourt);
    if (!court) return;

    // Calculate end time (1 hour later)
    const [hours] = startTime.split(":");
    const endHour = (parseInt(hours) + 1).toString().padStart(2, "0");
    const endTime = `${endHour}:00`;

    // TODO: Replace with API call to create matchmaking post
    addMatchmakingPost({
      courtId: selectedCourt,
      courtName: court.name,
      userId: user.id,
      userName: user.name,
      date: selectedDate,
      startTime,
      endTime,
      playersNeeded: parseInt(playersNeeded),
      currentPlayers: [user.name],
      skillLevel,
      description: description || "Looking for players to join!",
    });

    // Reset form
    setSelectedCourt("");
    setSelectedDate("");
    setStartTime("");
    setPlayersNeeded("4");
    setSkillLevel("intermediate");
    setDescription("");
    setIsDialogOpen(false);
  };

  // Sort posts by date (upcoming first)
  const sortedPosts = [...matchmakingPosts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Page Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-foreground">Find Players</h1>
          <p className="mt-1 text-muted-foreground">
            Join a game or create a post to find players
          </p>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="mx-auto max-w-5xl">
          {/* Create Post Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mb-6">
                <Plus className="mr-2 h-4 w-4" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Looking for Players</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Court Selection */}
                <div className="space-y-2">
                  <Label>Select Court</Label>
                  <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a court" />
                    </SelectTrigger>
                    <SelectContent>
                      {courts.map((court) => (
                        <SelectItem key={court.id} value={court.id}>
                          {court.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a date" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map((date) => (
                        <SelectItem key={date} value={date}>
                          {new Date(date).toLocaleDateString("en-SG", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Select value={startTime} onValueChange={setStartTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
                        <SelectItem
                          key={hour}
                          value={`${hour.toString().padStart(2, "0")}:00`}
                        >
                          {hour > 12 ? hour - 12 : hour}:00{" "}
                          {hour >= 12 ? "PM" : "AM"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Players Needed */}
                <div className="space-y-2">
                  <Label>Total Players Needed</Label>
                  <Select value={playersNeeded} onValueChange={setPlayersNeeded}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 players (Singles)</SelectItem>
                      <SelectItem value="4">4 players (Doubles)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Skill Level */}
                <div className="space-y-2">
                  <Label>Skill Level</Label>
                  <Select
                    value={skillLevel}
                    onValueChange={(v) =>
                      setSkillLevel(v as MatchmakingPost["skillLevel"])
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Textarea
                    placeholder="Tell others about your game..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  className="w-full"
                  onClick={handleCreatePost}
                  disabled={!selectedCourt || !selectedDate || !startTime}
                >
                  Create Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Posts List */}
          {sortedPosts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 font-medium text-foreground">No posts yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Be the first to look for players!
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* TODO: Replace with API call to fetch matchmaking posts */}
              {sortedPosts.map((post) => (
                <MatchmakingCard
                  key={post.id}
                  post={post}
                  currentUserName={user.name}
                  onJoin={() => joinMatchmakingPost(post.id, user.name)}
                  onLeave={() => leaveMatchmakingPost(post.id, user.name)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
