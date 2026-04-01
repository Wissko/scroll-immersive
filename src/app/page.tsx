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
      background: "linear-gradient(180deg, #0f0a00 0%, #0a0700 8%, #070500 20%, #050505 40%, #050505 80%, #030303 100%)",
      position: "relative",
    }}>
      {/* Radial glow that spans the entire page */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "radial-gradient(ellipse 100% 70% at 50% 15%, rgba(240,168,48,0.06) 0%, rgba(240,168,48,0.02) 40%, transparent 75%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />
      <Hero />
      <ScrollSequence />
      <FinalCTA />
    </main>
  );
}
