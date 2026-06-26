import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LedgerProvider } from "@/lib/store";
import { OnboardingProvider } from "@/lib/onboarding-store";
import { OnboardingGate } from "@/components/OnboardingGate";
import { IPhoneFrame } from "@/components/IPhoneFrame";
import BottomTabBar from "@/components/BottomTabBar";

export const metadata: Metadata = {
  title: "Probble",
  description: "Your life. Visualized.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f5f5f7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="bg-background text-foreground">
        <IPhoneFrame>
          <LedgerProvider>
            <OnboardingProvider>
              <OnboardingGate>
                <div className="flex h-full w-full flex-col">
                  <main className="flex-1 overflow-y-auto pb-28">{children}</main>
                  <BottomTabBar />
                </div>
              </OnboardingGate>
            </OnboardingProvider>
          </LedgerProvider>
        </IPhoneFrame>
      </body>
    </html>
  );
}
