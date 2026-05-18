"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";

import { useUser } from "@/context/UserContext";
import { SINGPASS_PERSONAS } from "@/lib/data/singpassPersonas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Step = "intro" | "choose" | "authenticating";

export function SingpassLogin() {
  const [step, setStep] = useState<Step>("intro");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { loginWithSingpass, error } = useUser();
  const router = useRouter();

  const runLogin = async (personaId: string) => {
    setSelectedId(personaId);
    setStep("authenticating");
    await new Promise((r) => setTimeout(r, 1400));
    const success = await loginWithSingpass(personaId);
    if (success) {
      router.push("/home");
    } else {
      setStep("choose");
    }
  };

  return (
    <Card className="w-full max-w-md overflow-hidden border-border/80 shadow-md">
      <div className="bg-[#F4333B] px-6 py-4 text-white">
        <SingpassMark />
        <p className="mt-2 text-sm text-white/90">
          Demo login — not connected to real Singpass
        </p>
      </div>
      <CardHeader className="pb-2 pt-5">
        <CardTitle className="text-xl">BookIt</CardTitle>
        <CardDescription>
          Sign in with Singpass to book Tampines badminton courts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pb-6">
        {error && (
          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {step === "intro" && (
          <>
            <Button
              type="button"
              className="h-12 w-full bg-[#F4333B] text-base font-semibold text-white hover:bg-[#d92b32]"
              onClick={() => setStep("choose")}
            >
              <ShieldCheck className="mr-2 size-5" />
              Log in with Singpass
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              For this prototype, pick a demo profile on the next screen.
            </p>
          </>
        )}

        {step === "choose" && (
          <ChoosePersonaPanel
            onBack={() => setStep("intro")}
            onSelect={(id) => void runLogin(id)}
          />
        )}

        {step === "authenticating" && (
          <div className="flex flex-col items-center gap-3 py-8">
            <Loader2 className="size-10 animate-spin text-[#F4333B]" />
            <p className="text-sm font-medium text-foreground">
              Authenticating with Singpass…
            </p>
            <p className="text-xs text-muted-foreground">
              {SINGPASS_PERSONAS.find((p) => p.id === selectedId)?.name}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SingpassMark() {
  return (
    <div className="flex items-center gap-2">
      <motionlessSingpassMark />
    </div>
  );
}

function motionlessSingpassMark() {
  return (
    <>
      <div className="flex size-9 items-center justify-center rounded bg-white/20 text-sm font-bold">
        SP
      </div>
      <span className="text-lg font-semibold tracking-tight">Singpass</span>
    </>
  );
}

function ChoosePersonaPanel({
  onBack,
  onSelect,
}: {
  onBack: () => void;
  onSelect: (personaId: string) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Select a demo account (schedule & budget are used by the booking
        assistant):
      </p>
      <ul className="space-y-2">
        {SINGPASS_PERSONAS.map((persona) => (
          <li key={persona.id}>
            <button
              type="button"
              onClick={() => onSelect(persona.id)}
              className={cn(
                "w-full rounded-lg border border-border bg-card px-4 py-3 text-left transition-colors",
                "hover:border-[#F4333B]/40 hover:bg-accent/50",
              )}
            >
              <p className="font-medium text-foreground">{persona.name}</p>
              <p className="text-xs text-muted-foreground">
                {persona.nric} · {persona.scheduleLabel} · up to $
                {persona.maxPricePerHour}/hr
              </p>
            </button>
          </li>
        ))}
      </ul>
      <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
        Back
      </Button>
    </div>
  );
}
