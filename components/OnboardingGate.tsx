"use client";

import { useOnboarding } from "@/lib/onboarding-store";
import { OnboardingFlow } from "@/components/OnboardingFlow";

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const { ready, completed } = useOnboarding();

  if (!ready) return null;
  if (!completed) return <OnboardingFlow />;
  return <>{children}</>;
}
