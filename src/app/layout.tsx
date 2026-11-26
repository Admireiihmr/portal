import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const display = Inter_Tight({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["500"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Foundation Day Idea Presentation | IIHMR Bangalore",
  description: "Submit your prototype and pitch your idea on stage at the IIHMR Bangalore Foundation Day. Organised with ADMIRE, the Center for Advancing Digital Health.",
  icons: { icon: "/images/iihmr.png" },
};
export const viewport: Viewport = { themeColor: "#120f24", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
