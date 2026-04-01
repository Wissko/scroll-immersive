"use client";

/**
 * Shop — premium product showcase with frame-1 images
 */

import { useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";

export default function ShopPage() {
  return (
    <main style={{ background: "#050505", minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{
        textAlign: "center", padding: "10rem 2rem 4rem",
        position: "relative", overflow: "hidden",
      }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.7rem",
          letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
          marginBottom: "1.5rem",
        }}>
          THE COLLECTION
        </p>
        <h1 style={{
          fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
          fontSize: "clamp(3rem, 8vw, 6rem)", color: "#fff", margin: "0 0 1rem",
          lineHeight: 1, letterSpacing: "-0.02em",
        }}>
          Choose Your Weapon
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontStyle: "italic",
          fontSize: "1.05rem", color: "rgba(255,255,255,0.35)", maxWidth: "420px", margin: "0 auto",
        }}>
          Same formula. Different flavor. Same impact.
        </p>
      </section>

      {/* Products */}
      <section style={{
        maxWidth: "1200px", margin: "0 auto", padding: "0 2rem 6rem",
        display: "flex", flexDirection: "column", gap: "0",
      }}>
        {PRODUCTS.map((product, i) => (
          <ProductCard key={product.slug} product={product} index={i} />
        ))}
      </section>
    </main>
  );
}

function ProductCard({ product, index }: { product: typeof PRODUCTS[number]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const isReversed = index % 2 !== 0;

  return (
    <Link
      href={`/shop/${product.slug}`}
      style={{ textDecoration: "none", display: "block" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          display: "flex",
          flexDirection: isReversed ? "row-reverse" : "row",
          minHeight: "70vh",
          borderTop: `1px solid ${product.accent}15`,
          transition: "background 600ms ease",
          background: hovered ? product.background : "transparent",
          position: "relative",
          overflow: "hidden",
        }}
        className="shop-card"
      >
        {/* Image column */}
        <div style={{
          width: "55%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
        className="shop-card-img"
        >
          {/* Glow */}
          <div style={{
            position: "absolute", bottom: "-30px", left: "50%", transform: "translateX(-50%)",
            width: "70%", height: "200px",
            background: `radial-gradient(ellipse, ${product.accent}20 0%, transparent 70%)`,
            filter: "blur(50px)", pointerEvents: "none", zIndex: 0,
            opacity: hovered ? 1 : 0.4,
            transition: "opacity 600ms ease",
          }} />

          {/* Product image — frame-1 */}
          <img
            src={`/images/Frames_${product.slug === "blue-razz" ? "blue" : product.slug === "mango" ? "orange" : "purple"}/frame-1.png`}
            alt={product.name}
            style={{
              maxWidth: "320px",
              maxHeight: "55vh",
              width: "auto",
              height: "auto",
              objectFit: "contain",
              position: "relative",
              zIndex: 1,
              transform: hovered ? "scale(1.05) rotate(-2deg)" : "scale(1)",
              transition: "transform 600ms cubic-bezier(0.16,1,0.3,1)",
              mixBlendMode: "screen",
            }}
          />
        </div>

        {/* Text column */}
        <div style={{
          width: "45%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: isReversed ? "3rem 3rem 3rem 4rem" : "3rem 4rem 3rem 3rem",
        }}
        className="shop-card-text"
        >
          {/* Number */}
          <span style={{
            fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
            fontSize: "0.65rem", letterSpacing: "0.2em",
            color: `${product.accent}30`, marginBottom: "1.5rem",
          }}>
            {product.number}
          </span>

          {/* Label */}
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: "0.6rem",
            letterSpacing: "0.35em", textTransform: "uppercase",
            color: product.accent, marginBottom: "0.8rem",
          }}>
            {product.label}
          </span>

          {/* Name */}
          <h2 style={{
            fontFamily: "'PP Neue Corp Wide', sans-serif", fontWeight: 800,
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)", color: product.accent,
            margin: "0 0 0.6rem", lineHeight: 1,
            transform: hovered ? "translateX(8px)" : "translateX(0)",
            transition: "transform 500ms cubic-bezier(0.16,1,0.3,1)",
          }}>
            {product.name}
          </h2>

          {/* Tagline */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontStyle: "italic",
            fontSize: "1rem", color: `${product.accent}80`, margin: "0 0 1.5rem",
          }}>
            {product.tagline}
          </p>

          {/* Separator */}
          <div style={{
            width: hovered ? "80px" : "50px",
            height: "1px", background: `${product.accent}50`,
            marginBottom: "1.5rem",
            transition: "width 500ms cubic-bezier(0.16,1,0.3,1)",
          }} />

          {/* Description */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: "0.9rem", color: "rgba(255,255,255,0.45)",
            lineHeight: 1.75, maxWidth: "340px", margin: "0 0 1.5rem",
          }}>
            {product.description}
          </p>

          {/* Specs */}
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: "0.7rem", letterSpacing: "0.12em",
            color: `${product.accent}60`, textTransform: "uppercase",
            margin: "0 0 2rem",
          }}>
            {product.specs}
          </p>

          {/* CTA arrow */}
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
            fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase",
            color: product.accent,
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            Explore
            <span style={{
              display: "inline-block",
              transform: hovered ? "translateX(6px)" : "translateX(0)",
              transition: "transform 400ms cubic-bezier(0.16,1,0.3,1)",
            }}>
              →
            </span>
          </span>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .shop-card { flex-direction: column !important; min-height: auto !important; }
          .shop-card-img { width: 100% !important; height: 50vh !important; }
          .shop-card-text { width: 100% !important; padding: 2rem !important; text-align: center; align-items: center; }
        }
      `}</style>
    </Link>
  );
}
