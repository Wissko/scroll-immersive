"use client";

/**
 * ScrollSequence.tsx — AXION Premium Product Showcase
 * ─────────────────────────────────────────────────────
 * 3 products, 1 image each (frame-1.png).
 * Single 100vh section — products transition via "Vertical Reveal".
 * Clean, editorial magazine luxury aesthetic.
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

// ─────────────────────────────────────────────────────
// PRODUCT DATA
// ─────────────────────────────────────────────────────

interface Product {
  id: string;
  label: string;
  name: string;
  tagline: string;
  description: string;
  specs: string;
  cta: string;
  accent: string;
  /** Subtle background tint at 8% opacity */
  bgTint: string;
  imageSrc: string;
}

const PRODUCTS: Product[] = [
  {
    id: "blue-razz",
    label: "ELECTRIC PRE-WORKOUT",
    name: "Blue Razz",
    tagline: "Razor sharp focus",
    description:
      "Engineered for athletes who demand precision. Blue Razz delivers clean, sustained energy with zero crash — powered by 200mg caffeine, L-Theanine, and 4g Citrulline Malate.",
    specs: "200mg Caffeine · 150mg L-Theanine · 4g Citrulline",
    cta: "Shop Blue Razz",
    accent: "#4F9EF8",
    bgTint: "#4F9EF808",
    imageSrc: "/images/Frames_blue/frame-1.png",
  },
  {
    id: "mango",
    label: "ELECTRIC PRE-WORKOUT",
    name: "Mango",
    tagline: "Tropical surge, peak output",
    description:
      "Fuel your longest sessions with a tropical explosion of flavor and performance. 6g Citrulline Malate, Beta-Alanine complex, and B-vitamins to keep you locked in from rep one to the last.",
    specs: "200mg Caffeine · 2.5g Beta-Alanine · 6g Citrulline",
    cta: "Shop Mango",
    accent: "#F5B942",
    bgTint: "#F5B94208",
    imageSrc: "/images/Frames_orange/frame-1.png",
  },
  {
    id: "grape",
    label: "ELECTRIC PRE-WORKOUT",
    name: "Grape",
    tagline: "Dark focus. Night mode power.",
    description:
      "When the lights go down, your performance doesn't. Grape combines a nootropic stack — Alpha GPC, L-Tyrosine, Grape Seed Extract — with 6g Citrulline for an unmatched mind-muscle connection.",
    specs: "200mg Caffeine · 1g L-Tyrosine · 300mg Alpha GPC",
    cta: "Shop Grape",
    accent: "#9B72F5",
    bgTint: "#9B72F508",
    imageSrc: "/images/Frames_purple/frame-1.png",
  },
];

// ─────────────────────────────────────────────────────
// FRAMER MOTION VARIANTS
// ─────────────────────────────────────────────────────

/** Content block exit: slide up + fade out */
const contentExit = {
  y: -60,
  opacity: 0,
  transition: {
    duration: 0.5,
    ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
  },
};

/** Content block enter: slide up from below + fade in */
const contentEnter = {
  initial: { y: 60, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: 0.2,
    },
  },
  exit: contentExit,
};

/** Image: scale + opacity + blur reveal */
const imageVariants = {
  initial: {
    scale: 0.92,
    opacity: 0,
    filter: "blur(4px)",
  },
  animate: {
    scale: 1,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      delay: 0.15,
    },
  },
  exit: {
    scale: 0.96,
    opacity: 0,
    filter: "blur(4px)",
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

// ─────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────

export function ScrollSequence() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const product = PRODUCTS[currentIndex];

  /** Touch tracking refs for swipe detection */
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // ── Navigation helpers ──────────────────────────────

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + PRODUCTS.length) % PRODUCTS.length);
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % PRODUCTS.length);
  }, []);

  // ── Touch / Swipe handlers ──────────────────────────

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX;
      if (touchStartX.current !== null && touchEndX.current !== null) {
        const deltaX = touchStartX.current - touchEndX.current;
        if (Math.abs(deltaX) > 50) {
          deltaX > 0 ? goNext() : goPrev();
        }
      }
    },
    [goNext, goPrev]
  );

  // ── Keyboard navigation ─────────────────────────────

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // ─────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────

  return (
    <section
      style={{
        position: "relative",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        /* Background transitions to accent tint on product change */
        backgroundColor: product.bgTint,
        transition: "background-color 800ms ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Deep base layer — always #050505 ────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#050505",
          zIndex: 0,
        }}
      />

      {/* ── Accent tint overlay — transitions with product ─ */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: product.bgTint,
          transition: "background-color 800ms ease",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* ── Vignette radial overlay ──────────────────── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 30%, #050505 100%)",
          opacity: 0.5,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* ── Top-left: product indicator (01 / 03) ───── */}
      <div
        style={{
          position: "absolute",
          top: "2rem",
          left: "2rem",
          zIndex: 10,
          fontFamily: "'PP Neue Corp Wide', sans-serif",
          fontWeight: 800,
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          color: "rgba(255,255,255,0.2)",
          userSelect: "none",
        }}
      >
        {String(currentIndex + 1).padStart(2, "0")} / {String(PRODUCTS.length).padStart(2, "0")}
      </div>

      {/* ── Top-center: product label ─────────────────── */}
      <div
        style={{
          position: "absolute",
          top: "2rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: "0.65rem",
          letterSpacing: "0.3em",
          color: product.accent,
          textTransform: "uppercase",
          transition: "color 600ms ease",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        {product.label}
      </div>

      {/* ── Left arrow ───────────────────────────────── */}
      <button
        onClick={goPrev}
        aria-label="Previous product"
        style={{
          position: "absolute",
          top: "50%",
          left: "2rem",
          transform: "translateY(-50%)",
          zIndex: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: "1.5rem",
          color: "rgba(255,255,255,0.25)",
          transition: "color 200ms ease",
          padding: "0.5rem",
          /* Hidden on mobile via CSS class */
        }}
        className="axion-arrow"
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color =
            "rgba(255,255,255,0.8)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color =
            "rgba(255,255,255,0.25)")
        }
      >
        &#8249;
      </button>

      {/* ── Right arrow ──────────────────────────────── */}
      <button
        onClick={goNext}
        aria-label="Next product"
        style={{
          position: "absolute",
          top: "50%",
          right: "2rem",
          transform: "translateY(-50%)",
          zIndex: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 300,
          fontSize: "1.5rem",
          color: "rgba(255,255,255,0.25)",
          transition: "color 200ms ease",
          padding: "0.5rem",
        }}
        className="axion-arrow"
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color =
            "rgba(255,255,255,0.8)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.color =
            "rgba(255,255,255,0.25)")
        }
      >
        &#8250;
      </button>

      {/* ── Main content — AnimatePresence for clean transitions ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={product.id}
          initial={contentEnter.initial}
          animate={contentEnter.animate}
          exit={contentExit}
          style={{
            position: "relative",
            zIndex: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0",
            width: "100%",
            maxWidth: "600px",
            padding: "6rem 2rem 5rem",
            textAlign: "center",
          }}
        >
          {/* ── Image container ─────────────────────────── */}
          <div
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginBottom: "2.5rem",
            }}
          >
            {/* Glow below image */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                bottom: "-40px",
                width: "60%",
                height: "160px",
                background: `radial-gradient(ellipse, ${product.accent}25 0%, transparent 70%)`,
                filter: "blur(50px)",
                zIndex: 0,
                transition: "background 800ms ease",
                pointerEvents: "none",
              }}
            />

            {/* Product image with reveal transition */}
            <motion.div
              key={`img-${product.id}`}
              variants={imageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                maxWidth: "380px",
              }}
              className="axion-product-image"
            >
              <Image
                src={product.imageSrc}
                alt={product.name}
                width={380}
                height={480}
                priority
                style={{
                  width: "100%",
                  maxWidth: "380px",
                  maxHeight: "55vh",
                  objectFit: "contain",
                  mixBlendMode: "screen",
                  display: "block",
                  margin: "0 auto",
                }}
              />
            </motion.div>
          </div>

          {/* ── Product name ─────────────────────────────── */}
          <h2
            style={{
              fontFamily: "'PP Neue Corp Wide', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2.8rem, 6vw, 4.5rem)",
              color: "#ffffff",
              margin: "0 0 0.6rem",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            {product.name}
          </h2>

          {/* ── Tagline ───────────────────────────────────── */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "1.1rem",
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.05em",
              margin: "0 0 1.5rem",
            }}
          >
            {product.tagline}
          </p>

          {/* ── Description ──────────────────────────────── */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(0.9rem, 1.5vw, 0.95rem)",
              color: "rgba(255,255,255,0.55)",
              maxWidth: "420px",
              lineHeight: 1.7,
              margin: "0 0 1.25rem",
            }}
          >
            {product.description}
          </p>

          {/* ── Specs ─────────────────────────────────────── */}
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              fontSize: "0.75rem",
              color: product.accent,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              margin: "0 0 2rem",
              transition: "color 600ms ease",
            }}
          >
            {product.specs}
          </p>

          {/* ── CTA button ───────────────────────────────── */}
          <CTAButton accent={product.accent} label={product.cta} />
        </motion.div>
      </AnimatePresence>

      {/* ── Navigation dots — bottom center ───────────── */}
      <div
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        {PRODUCTS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => goTo(i)}
            aria-label={`Go to ${p.name}`}
            style={{
              width: i === currentIndex ? "12px" : "8px",
              height: i === currentIndex ? "12px" : "8px",
              borderRadius: "50%",
              border: `1px solid ${p.accent}`,
              backgroundColor: i === currentIndex ? p.accent : "transparent",
              opacity: i === currentIndex ? 1 : 0.4,
              cursor: "pointer",
              padding: 0,
              transition: "all 300ms ease",
              /* Pulse animation on active dot via className */
              animation: i === currentIndex ? "axion-dot-pulse 2s infinite" : "none",
            }}
          />
        ))}
      </div>

      {/* ── Global styles (injected once) ─────────────── */}
      <style>{`
        @keyframes axion-dot-pulse {
          0%, 100% { box-shadow: 0 0 0 0px currentColor; opacity: 1; }
          50% { box-shadow: 0 0 0 4px transparent; opacity: 0.8; }
        }

        /* Hide arrows on mobile */
        @media (max-width: 768px) {
          .axion-arrow { display: none !important; }
        }

        /* Mobile image sizing */
        @media (max-width: 768px) {
          .axion-product-image img {
            max-width: 260px !important;
            max-height: 40vh !important;
          }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────
// CTA BUTTON — outline style with hover fill
// ─────────────────────────────────────────────────────

function CTAButton({ accent, label }: { accent: string; label: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 500,
        fontSize: "0.85rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        padding: "0.8rem 2.5rem",
        border: `1px solid ${accent}`,
        backgroundColor: hovered ? accent : "transparent",
        color: hovered ? "#000000" : accent,
        cursor: "pointer",
        transition: "background-color 300ms ease, color 300ms ease",
        outline: "none",
      }}
    >
      {label}
    </button>
  );
}
