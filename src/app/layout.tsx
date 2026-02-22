import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { AudioProvider } from "@/context/AudioContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: " Portfolio",
  description: "Quant Developer & Competitive Programmer. High-frequency trading systems, algorithmic optimization, and machine learning applications in finance.",
  keywords: ["Quant Developer", "HFT", "Algorithmic Trading", "Competitive Programming", "C++", "Python", "React", "Portfolio"],
  authors: [{ name: "Quant" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect fill='%23000' width='32' height='32' rx='6'/><text x='50%' y='50%' dominant-baseline='central' text-anchor='middle' fill='%2306b6d4' font-family='monospace' font-weight='bold' font-size='18'>Q</text></svg>",
  },
  openGraph: {
    title: "QUANT | Terminal Luxury Portfolio",
    description: "Quant Developer & Competitive Programmer specializing in HFT and algorithmic systems",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QUANT | Terminal Luxury Portfolio",
    description: "Quant Developer & Competitive Programmer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased bg-black text-white overflow-x-hidden selection:bg-accent/30 selection:text-white`}
      >
        {/* ARIA landmark wrapper for screen readers */}
        <AudioProvider>
          <main id="main-content" role="main" aria-label="Main Portfolio Content">
            {children}
          </main>
        </AudioProvider>
      </body>
    </html>
  );
}
