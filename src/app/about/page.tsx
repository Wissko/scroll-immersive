/**
 * About page - AXION story
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | AXION",
  description: "Built by lifters who were tired of underdosed pre-workouts.",
};

export default function AboutPage() {
  return (
    <main style={{ background: "#050505", minHeight: "100vh", paddingTop: "8rem", paddingBottom: "4rem", overflowX: "hidden" }}>
      <section style={{ maxWidth: "680px", margin: "0 auto", padding: "0 2rem" }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.7rem",
          letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
          marginBottom: "1.5rem",
        }}>
          OUR STORY
        </p>

        <h1 style={{
          fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#fff",
          margin: "0 0 2rem", lineHeight: 1.05,
        }}>
          Built different.
        </h1>

        <div style={{ width: "60px", height: "1px", background: "rgba(255,255,255,0.15)", marginBottom: "2.5rem" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, margin: 0,
          }}>
            No mixing. No filler. No wasted effort. AXION was built by lifters who were tired of underdosed
            pre-workouts and overcomplicated routines. We wanted something that works. Fast.
          </p>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, margin: 0,
          }}>
            60mL. Clinically dosed. No compromise. Every ingredient earns its place. Nothing hidden.
            Nothing underdosed. Fully transparent formula with no proprietary blends.
          </p>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: "1rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, margin: 0,
          }}>
            Grab it. Shoot it. Go. Whether you train at 5 AM or midnight, AXION is built for those
            who train to perform. Trusted by 50+ lifters pre-launch.
          </p>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontStyle: "italic",
            fontSize: "1.1rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, margin: "1rem 0 0",
          }}>
            "No crash. Just clean focus."
          </p>
        </div>

        {/* Values */}
        <div style={{ marginTop: "4rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
          {[
            { title: "No Mixing", text: "Grab it. Shoot it. Go. 60mL pre-workout shot ready when you are." },
            { title: "Only What Works", text: "Clinically dosed ingredients. No fluff. No fillers. No proprietary blends." },
            { title: "Hits in Minutes", text: "Fast-acting formula. Real results. Designed to kick in before your warm-up is over." },
          ].map((v) => (
            <div key={v.title} style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.2rem" }}>
              <h3 style={{
                fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
                fontSize: "0.85rem", color: "#fff", letterSpacing: "0.1em", margin: "0 0 0.5rem",
              }}>
                {v.title}
              </h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                fontSize: "0.9rem", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: 1.6,
              }}>
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
