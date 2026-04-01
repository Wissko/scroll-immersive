/**
 * Science page - The Formula
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Science | AXION",
  description: "Clinically dosed. No BS. Every ingredient earns its place.",
};

const INGREDIENTS = [
  { name: "Caffeine", dose: "200mg", desc: "Energy. Focus. No crash. Fast-acting stimulant that hits in minutes and keeps you locked in." },
  { name: "L-Citrulline", dose: "4g", desc: "Improved blood flow and stronger pumps. Nitric oxide precursor for maximum oxygen delivery." },
  { name: "L-Tyrosine", dose: "2g", desc: "Enhanced focus and mental drive. Dopamine precursor that builds stress resilience under load." },
  { name: "Beta-Alanine", dose: "2g", desc: "Muscular endurance and performance. Buffers lactic acid so you push through every set." },
  { name: "L-Theanine", dose: "100mg", desc: "Smooth energy. Reduced jitters. Works with caffeine for clean, controlled focus." },
  { name: "Taurine", dose: "500mg", desc: "Hydration and performance support. Regulates cell volume and supports muscle contractions." },
  { name: "Sodium", dose: "150mg", desc: "Electrolyte balance and muscle function. Essential for hydration during intense sessions." },
];

export default function SciencePage() {
  return (
    <main style={{ background: "#050505", minHeight: "100vh", paddingTop: "8rem", paddingBottom: "4rem", overflowX: "hidden" }}>
      {/* Hero */}
      <section style={{ textAlign: "center", padding: "0 2rem", marginBottom: "5rem" }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.7rem",
          letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
          marginBottom: "1.5rem",
        }}>
          CLINICALLY DOSED. NO BS.
        </p>
        <h1 style={{
          fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
          fontSize: "clamp(2.5rem, 6vw, 5rem)", color: "#fff", margin: "0 0 1rem",
          letterSpacing: "-0.02em", lineHeight: 1,
        }}>
          Every Ingredient Earns Its Place
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontStyle: "italic",
          fontSize: "1.1rem", color: "rgba(255,255,255,0.4)", maxWidth: "500px", margin: "0 auto",
        }}>
          Nothing hidden. Nothing underdosed. Fully transparent formula. No proprietary blends.
        </p>
      </section>

      {/* Ingredients grid */}
      <section style={{
        maxWidth: "900px", margin: "0 auto", padding: "0 2rem",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(350px, 100%), 1fr))", gap: "2.5rem",
      }}>
        {INGREDIENTS.map((ing) => (
          <div key={ing.name} style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.6rem" }}>
              <h3 style={{
                fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
                fontSize: "0.9rem", color: "#fff", letterSpacing: "0.05em", margin: 0,
              }}>
                {ing.name}
              </h3>
              <span style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                fontSize: "0.75rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em",
              }}>
                {ing.dose}
              </span>
            </div>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
              fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0,
            }}>
              {ing.desc}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}
