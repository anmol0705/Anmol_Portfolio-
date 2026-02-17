import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrolling from "../components/smooth-scrolling";
import HudOverlay from "../components/hud-overlay";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Anmol Portfolio",
  description: "High-performance portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} antialiased bg-[#051821] text-white`}>
        <SmoothScrolling>
          <HudOverlay />
          {children}
        </SmoothScrolling>
      </body>
    </html>
  );
}
