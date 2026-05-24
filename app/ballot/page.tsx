"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { BallotTransparencyPanel } from "@/components/BallotTransparencyPanel";
import { Navbar } from "@/components/Navbar";
import { CoachBallotForm } from "@/components/CoachBallotForm";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Gavel } from "lucide-react";

export default function BallotPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="border-b border-border bg-muted/30 px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-2xl font-bold text-foreground">Ballot transparency</h1>
          <p className="mt-1 text-muted-foreground">
            See how court slots are allocated fairly — scores, deadlines, and
            cancellation policy in the open.
          </p>
        </div>
      </div>
      <div className="px-4 py-6">
        <div className="mx-auto max-w-5xl space-y-8">
          {user.role === "coach" && <CoachBallotForm />}
          <BallotTransparencyPanel showDemoButton={true} simplified={true} />

          {/* Fake Coach Application Form for Demo */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gavel className="h-5 w-5 text-blue-600" />
                Coach Application Form
              </CardTitle>
              <CardDescription>
                Apply for court allocation through Community Centre (Demo Form)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cc-name">Community Centre Name</Label>
                <Input id="cc-name" placeholder="e.g., Tampines West CC" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cc-notes">Application Notes</Label>
                <Input id="cc-notes" placeholder="Describe your training needs..." />
              </div>
              <Button className="w-full" variant="outline">
                Submit Application
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
