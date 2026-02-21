import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QUANT | Terminal Luxury Portfolio",
  description: "Quant Developer & Competitive Programmer. High-frequency trading systems, algorithmic optimization, and machine learning applications in finance.",
  keywords: ["Quant Developer", "HFT", "Algorithmic Trading", "Competitive Programming", "C++", "Python", "React", "Portfolio"],
  authors: [{ name: "Quant" }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect fill='%23000' width='32' height='32' rx='4'/><text x='50%' y='50%' dominant-baseline='central' text-anchor='middle' fill='%2300ff88' font-family='monospace' font-weight='bold' font-size='18'>Q</text></svg>",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
