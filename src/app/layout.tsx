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
  title: {
    default: "HyntSight - AI-Powered Clothing Design",
    template: "%s | HyntSight",
  },
  description:
    "Design production-ready clothing schematics with AI. Describe your vision, get professional technical drawings in seconds.",
  keywords: [
    "clothing design",
    "fashion design",
    "AI design",
    "tech pack",
    "garment design",
    "technical drawing",
    "DXF export",
    "fashion schematic",
  ],
  openGraph: {
    title: "HyntSight - AI-Powered Clothing Design",
    description: "Design production-ready clothing schematics with AI.",
    type: "website",
    url: "https://hyntsight.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "HyntSight - AI-Powered Clothing Design",
    description: "Design production-ready clothing schematics with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
