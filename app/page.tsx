"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { LoginForm } from "@/components/LoginForm";
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
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-accent/20 px-4 pb-8 pt-12">
        <div className="mx-auto max-w-lg text-center">
          {/* Logo */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Calendar className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">BookIt</h1>
          </div>

          <h2 className="text-balance text-xl font-semibold text-foreground">
            Book Sports Facilities in Tampines
          </h2>
          <p className="mt-2 text-pretty text-muted-foreground">
            Reserve badminton courts, tennis courts, and more. Find players to
            join your game.
          </p>

          {/* Feature Highlights */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            <FeatureCard
              icon={<MapPin className="h-5 w-5" />}
              title="5 Facilities"
              description="Multiple courts available"
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
      </div>

      {/* Login Form Section */}
      <div className="flex flex-1 items-start justify-center px-4 py-8">
        <LoginForm />
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-4">
        <p className="text-center text-xs text-muted-foreground">
          A community initiative by Tampines Town Council
        </p>
      </footer>
    </main>
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
