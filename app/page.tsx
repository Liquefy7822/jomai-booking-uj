"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { SingpassLogin } from "@/components/SingpassLogin";
import { Navbar } from "@/components/Navbar";
import { Calendar, Users, MapPin, Clock } from "lucide-react";

export default function LandingPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  // Redirect to home if already logged in
  useEffect(() => {
    if (!isLoading && user) {
      router.push("/home");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="flex flex-col">
        {/* Hero Section */}
        <div className="border-b border-border bg-gradient-to-b from-primary/5 to-background px-4 py-12 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
              {/* Left: Content */}
              <div className="text-center md:text-left">
                <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                  Book Badminton Courts in Tampines
                </h1>
                <p className="mt-4 text-pretty text-lg text-muted-foreground">
                  Reserve your court in seconds. Find players to join your game.
                  Serving Tampines residents since 2024.
                </p>

                {/* Feature Highlights */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <FeatureCard
                    icon={<MapPin className="h-5 w-5" />}
                    title="6 Courts"
                    description="Multiple locations"
                  />
                  <FeatureCard
                    icon={<Clock className="h-5 w-5" />}
                    title="Easy Booking"
                    description="Reserve in seconds"
                  />
                  <FeatureCard
                    icon={<Users className="h-5 w-5" />}
                    title="Find Players"
                    description="Matchmaking board"
                  />
                  <FeatureCard
                    icon={<Calendar className="h-5 w-5" />}
                    title="7-Day Advance"
                    description="Plan ahead"
                  />
                </div>
              </div>

              {/* Right: Login Form */}
              <div className="flex justify-center md:justify-end">
                <SingpassLogin />
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-xl font-semibold text-foreground md:text-2xl">
              How It Works
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <StepCard
                step={1}
                title="Sign in with Singpass"
                description="Use your Singpass demo profile to access the booking system"
              />
              <StepCard
                step={2}
                title="Choose a Court"
                description="Browse available courts and select your preferred time slot"
              />
              <StepCard
                step={3}
                title="Play!"
                description="Show up at your booked time and enjoy your game"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-border bg-muted/30 px-4 py-6">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm text-muted-foreground">
              A community initiative by Tampines Town Council
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              For support, contact facilities@tampines.gov.sg
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-left">
      <div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
        {step}
      </div>
      <h3 className="mt-3 font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
