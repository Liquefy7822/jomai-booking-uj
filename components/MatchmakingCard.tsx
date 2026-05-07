"use client";

import type { MatchmakingPost } from "@/lib/mockData";
import { formatDate, formatTime } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchmakingCardProps {
  post: MatchmakingPost;
  currentUserName: string | null;
  onJoin: () => void;
  onLeave: () => void;
}

const skillLevelColors: Record<MatchmakingPost["skillLevel"], string> = {
  beginner: "bg-emerald-100 text-emerald-800",
  intermediate: "bg-amber-100 text-amber-800",
  advanced: "bg-rose-100 text-rose-800",
};

export function MatchmakingCard({
  post,
  currentUserName,
  onJoin,
  onLeave,
}: MatchmakingCardProps) {
  const isJoined = currentUserName
    ? post.currentPlayers.includes(currentUserName)
    : false;
  const isFull = post.currentPlayers.length >= post.playersNeeded;
  const spotsLeft = post.playersNeeded - post.currentPlayers.length;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-foreground">{post.courtName}</h3>
            <p className="text-sm text-muted-foreground">
              Posted by {post.userName}
            </p>
          </div>
          <Badge className={skillLevelColors[post.skillLevel]} variant="secondary">
            {post.skillLevel.charAt(0).toUpperCase() + post.skillLevel.slice(1)}
          </Badge>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {formatTime(post.startTime)} - {formatTime(post.endTime)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {post.currentPlayers.length} / {post.playersNeeded} players
            </span>
            {!isFull && (
              <span className="text-primary">
                ({spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left)
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-foreground">{post.description}</p>

        {/* Players List */}
        <div className="mt-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Current Players:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {post.currentPlayers.map((player) => (
              <span
                key={player}
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs",
                  player === currentUserName
                    ? "bg-primary/10 text-primary font-medium"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {player}
                {player === currentUserName && " (You)"}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          {isJoined ? (
            <Button variant="outline" className="w-full" onClick={onLeave}>
              Leave Game
            </Button>
          ) : (
            <Button
              className="w-full"
              disabled={isFull || !currentUserName}
              onClick={onJoin}
            >
              {isFull ? "Game Full" : "Join Game"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
