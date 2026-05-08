"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { RegisterForm } from "@/components/RegisterForm";
import { Navbar } from "@/components/Navbar";

export default function RegisterPage() {
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
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <RegisterForm />
      </div>
    </div>
  );
}
