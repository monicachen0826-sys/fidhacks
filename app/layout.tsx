import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LedgerProvider } from "@/lib/store";
import BottomTabBar from "@/components/BottomTabBar";

export const metadata: Metadata = {
  title: "My Ledger",
  description: "Your life. Visualized.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f2f2f4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <LedgerProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
            <main className="flex-1 pb-24">{children}</main>
            <BottomTabBar />
          </div>
        </LedgerProvider>
      </body>
    </html>
  );
}
