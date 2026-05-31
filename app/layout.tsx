import type { Metadata } from "next";
import { Space_Grotesk, Syne, JetBrains_Mono, Outfit } from "next/font/google"
import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets:["latin"], variable:"--font-body", weight:["300","400","500","600","700"] })
const syne = Syne({ subsets:["latin"], variable:"--font-display", weight:["400","500","600","700","800"] })
const jetbrainsMono = JetBrains_Mono({ subsets:["latin"], variable:"--font-mono", weight:["400","500"] })
const outfit = Outfit({ subsets:["latin"], variable:"--font-ui", weight:["300","400","500","600"] })

export const metadata: Metadata = {
  title: "EcoLoop — AI-Powered Circular Electronics Platform",
  description: "EcoLoop classifies your phone's condition using AI, then routes it to resale, refurbishment, parts recovery, or recycling automatically.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${syne.variable} ${jetbrainsMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
