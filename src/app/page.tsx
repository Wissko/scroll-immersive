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
    <main>
      <Hero />
      <ScrollSequence />
      <FinalCTA />
    </main>
  );
}
