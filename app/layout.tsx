import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LedgerProvider } from "@/lib/store";
import { PhoneFrame } from "@/components/PhoneFrame";
import BottomTabBar from "@/components/BottomTabBar";

export const metadata: Metadata = {
  title: "My Multiverse",
  description: "Your timeline across every dimension of life.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0a1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full text-foreground">
        <LedgerProvider>
          <PhoneFrame>
            <div className="relative flex min-h-full flex-col">
              <main className="flex-1 pb-20">{children}</main>
              <BottomTabBar />
            </div>
          </PhoneFrame>
        </LedgerProvider>
      </body>
    </html>
  );
}
