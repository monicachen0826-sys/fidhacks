"use client";

import { PhoneFrame } from "@/components/PhoneFrame";
import BottomTabBar from "@/components/BottomTabBar";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { useOnboarding } from "@/lib/onboarding-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { ready, completed } = useOnboarding();

  if (!ready) return null;

  return (
    <PhoneFrame>
      {!completed ? (
        <OnboardingFlow />
      ) : (
        <div className="relative flex flex-1 flex-col">
          <main className="flex flex-1 flex-col pb-20">{children}</main>
          <BottomTabBar />
        </div>
      )}
    </PhoneFrame>
  );
}
