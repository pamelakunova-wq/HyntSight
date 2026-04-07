import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
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
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
