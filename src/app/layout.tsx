/**
 * RootLayout
 * App shell — injects global styles, font meta, and the smooth-scroll provider.
 */

import type { Metadata } from "next";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "AXION | Not a Powder. A Shot.",
  description:
    "60mL pre-workout shot. Clinically dosed. No mixing. No compromise. Built for those who train to perform.",
  openGraph: {
    title: "AXION Electric Pre",
    description: "Focus + Drive",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
