import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const display = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["600", "700", "800"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Foundation Day Idea Presentation | IIHMR Bangalore",
  description: "Submit your abstract and pitch your idea on stage at the IIHMR Bangalore Foundation Day. Organised with ADMIRE, the Center for Advancing Digital Health.",
  icons: { icon: "/images/iihmr.png" },
};
export const viewport: Viewport = { themeColor: "#241a55", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
