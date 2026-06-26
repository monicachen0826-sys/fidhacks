import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LedgerProvider } from "@/lib/store";
import { OnboardingProvider } from "@/lib/onboarding-store";
import { ProfileProvider } from "@/lib/profile-store";
import { AuthProvider } from "@/lib/auth-store";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "My Multiverse",
  description: "Your timeline across every dimension of life.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f7f7fb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full text-foreground">
        <AuthProvider>
          <LedgerProvider>
            <OnboardingProvider>
              <ProfileProvider>
                <AppShell>{children}</AppShell>
              </ProfileProvider>
            </OnboardingProvider>
          </LedgerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
