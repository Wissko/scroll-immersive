/**
 * Home page
 * Assembles the three main sections: Hero, ScrollSequence, FinalCTA.
 * force-dynamic: page uses client-only components (R3F, framer-motion useInView)
 * that cannot be statically prerendered.
 */
export const dynamic = "force-dynamic";

import { Hero } from "@/components/Hero";
import { ScrollSequence } from "@/components/ScrollSequence";
import { FinalCTA } from "@/components/FinalCTA";

export default function Home() {
  return (
    <main style={{
      background: "linear-gradient(180deg, #0f0a00 0%, #050505 15%, #050505 85%, #030303 100%)",
      position: "relative",
    }}>
      {/* Radial glow that spans the entire page */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "radial-gradient(ellipse 80% 50% at 50% 20%, rgba(240,168,48,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      <Hero />
      <ScrollSequence />
      <FinalCTA />
    </main>
  );
}
