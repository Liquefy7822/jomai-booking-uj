"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { BallotTransparencyPanel } from "@/components/BallotTransparencyPanel";
import { Navbar } from "@/components/Navbar";
import { CoachBallotForm } from "@/components/CoachBallotForm";
import { useUser } from "@/context/UserContext";

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
        </div>
      </div>
    </div>
  );
}
