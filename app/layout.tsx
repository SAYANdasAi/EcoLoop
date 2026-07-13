import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", weight: ["400", "500", "600", "700", "800"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["300", "400", "500", "600", "700"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "EcoLoop — AI-Powered Circular Electronics Platform",
  description: "EcoLoop leverages proprietary AI to orchestrate the global second-life electronics market.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#080808] text-slate-100">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}