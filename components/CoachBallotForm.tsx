"use client";

import { useState } from "react";

import { useBallot } from "@/context/BallotContext";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function CoachBallotForm() {
  const { user } = useUser();
  const { submitCoachApplication } = useBallot();
  const [ccName, setCcName] = useState("");
  const [ccNotes, setCcNotes] = useState("");
  const [done, setDone] = useState(false);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ccName.trim()) return;
    submitCoachApplication({
      user,
      ccName: ccName.trim(),
      ccNotes:
        ccNotes.trim() ||
        "Requesting CC review of facility statistics for week-round coaching slots.",
    });
    setDone(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Coach application</CardTitle>
        <CardDescription>
          Coaches apply with their Community Centre. Your CC will consult booking
          statistics before week-round slots are held for training.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {done ? (
          <p className="text-sm text-emerald-700">
            Application submitted — pending CC review. Track status in the panel
            below.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ccName">Community Centre</Label>
              <Input
                id="ccName"
                value={ccName}
                onChange={(e) => setCcName(e.target.value)}
                placeholder="e.g. Tampines West CC"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ccNotes">Notes for CC review</Label>
              <Textarea
                id="ccNotes"
                value={ccNotes}
                onChange={(e) => setCcNotes(e.target.value)}
                placeholder="Training programme, preferred times, utilisation needs…"
                rows={3}
              />
            </div>
            <Button type="submit">Submit to CC</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
