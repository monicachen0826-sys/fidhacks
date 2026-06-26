"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { PhoneFrame } from "@/components/PhoneFrame";
import BottomTabBar from "@/components/BottomTabBar";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { useOnboarding } from "@/lib/onboarding-store";
import { useAuth } from "@/lib/auth-store";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { ready, completed } = useOnboarding();
  const { ready: authReady, session, profile } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const needsAuth = authReady && isSupabaseConfigured() && (!session || !profile) && pathname !== "/login";

  useEffect(() => {
    if (needsAuth) router.replace("/login");
  }, [needsAuth, router]);

  if (pathname === "/login") return <PhoneFrame>{children}</PhoneFrame>;

  if (!ready || !authReady) return null;
  if (needsAuth) return null;

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
