'use client';

/**
 * ScrollSequence — SVG Mask Blinds Scroll Transitions
 *
 * Architecture:
 *   - 300vh sticky section (outer), 100vh sticky container (inner)
 *   - 3 full-screen layers stacked (position absolute, inset 0)
 *       Layer 1 (Blue Razz) : always visible, no mask
 *       Layer 2 (Mango)     : revealed via 8 horizontal SVG blinds, scroll 0→33%
 *       Layer 3 (Grape)     : revealed via 8 horizontal SVG blinds, scroll 33→66%
 *   - Each layer plays 30-frame autoplay at 80ms/frame, all loops simultaneously
 *   - SVG <image> href updated via ref (no React re-render per frame)
 *   - Text overlay switches via Framer Motion AnimatePresence (y + opacity stagger)
 *   - Progress bar: 3 accent-colored segments driven by scroll progress
 *   - Vignette + accent glow for ambiance
 *   - Lenis is already bootstrapped in LenisProvider; no re-init here
 *   - Full cleanup (intervals + ScrollTriggers) on unmount
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// ─── Register GSAP plugins ────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─── Constants ────────────────────────────────────────────────────────────────
const BLIND_COUNT = 8;
const BLIND_HEIGHT = 100 / BLIND_COUNT; // 12.5 SVG units per blind
const FRAME_COUNT = 30;
const FRAME_INTERVAL_MS = 80;

// ─── Product definitions ──────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 'blue-razz',
    name: 'Blue Razz',
    label: 'ELECTRIC PRE-WORKOUT',
    accent: '#4F9EF8',
    frameDir: '/images/Frames_blue',
    accroche: 'Laser focus. Explosive energy.',
    ingredients: [
      'Caffeine 200mg',
      'L-Theanine 150mg',
      'Beta-Alanine 2000mg',
      'Citrulline 4000mg',
      'Alpha GPC 200mg',
    ],
    cta: 'Shop Blue Razz →',
    textSide: 'right' as const,
  },
  {
    id: 'mango',
    name: 'Mango',
    label: 'ELECTRIC PRE-WORKOUT',
    accent: '#F5B942',
    frameDir: '/images/Frames_orange',
    accroche: 'Tropical surge. Peak performance.',
    ingredients: [
      'Caffeine 200mg',
      'Beta-Alanine 2500mg',
      'Citrulline 6000mg',
      'Vit B6 5mg',
      'Vit B12 100mcg',
    ],
    cta: 'Shop Mango →',
    textSide: 'left' as const,
  },
  {
    id: 'grape',
    name: 'Grape',
    label: 'ELECTRIC PRE-WORKOUT',
    accent: '#9B72F5',
    frameDir: '/images/Frames_purple',
    accroche: 'Dark focus. Night-mode power.',
    ingredients: [
      'Caffeine 200mg',
      'L-Tyrosine 1000mg',
      'Alpha GPC 300mg',
      'Citrulline 6000mg',
      'Grape Seed 100mg',
    ],
    cta: 'Shop Grape →',
    textSide: 'right' as const,
  },
] as const;

// ─── Framer Motion variants ───────────────────────────────────────────────────

/** Stagger container for text lines */
const textContainerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
  exit: {
    transition: { staggerChildren: 0.03 },
  },
};

/** Each text line: y + opacity */
const textLineVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    y: -10,
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: [0.55, 0, 1, 0.45] as [number, number, number, number],
    },
  },
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function ScrollSequence() {
  // Outer section ref (300vh — scroll trigger anchor)
  const sectionRef = useRef<HTMLElement>(null);

  // ── SVG <image> refs — href updated directly, bypassing React state ────────
  // Layer 1 (Blue Razz)
  const imgRef0 = useRef<SVGImageElement | null>(null);
  // Layer 2 (Mango)
  const imgRef1 = useRef<SVGImageElement | null>(null);
  // Layer 3 (Grape)
  const imgRef2 = useRef<SVGImageElement | null>(null);

  // ── SVG <g> refs for blind rects — animated by GSAP attr tween ────────────
  // Layer 2 blinds
  const blindsRef1 = useRef<SVGGElement | null>(null);
  // Layer 3 blinds
  const blindsRef2 = useRef<SVGGElement | null>(null);

  // ── Progress bar fill refs — width % set directly ─────────────────────────
  const fillRef0 = useRef<HTMLDivElement | null>(null);
  const fillRef1 = useRef<HTMLDivElement | null>(null);
  const fillRef2 = useRef<HTMLDivElement | null>(null);

  // ── Active layer: state (trigger re-render for text) + ref (no stale closure)
  const [activeLayer, setActiveLayer] = useState(0);
  const activeLayerRef = useRef(0);

  // ── Accent glow div ref — color updated directly on layer change ───────────
  const glowRef = useRef<HTMLDivElement | null>(null);

  // ─── Autoplay: all 3 layers loop simultaneously at 80ms ─────────────────────
  useEffect(() => {
    // Each layer maintains its own frame counter
    const frameNums = [1, 1, 1];
    const imgRefs = [imgRef0, imgRef1, imgRef2];

    const intervals = PRODUCTS.map((product, i) => {
      return setInterval(() => {
        // Advance frame, wrap at FRAME_COUNT
        frameNums[i] = frameNums[i] >= FRAME_COUNT ? 1 : frameNums[i] + 1;
        // Update SVG image href directly — no React state, no re-render
        const el = imgRefs[i].current;
        if (el) {
          el.setAttribute('href', `${product.frameDir}/frame-${frameNums[i]}.png`);
        }
      }, FRAME_INTERVAL_MS);
    });

    return () => {
      intervals.forEach(clearInterval);
    };
  }, []);

  // ─── GSAP ScrollTrigger: blind mask animations + progress bar ────────────────
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Collect all ScrollTrigger instances created here for cleanup
    const createdTriggers: ScrollTrigger[] = [];

    // Helper: update active layer without stale closure
    const updateActiveLayer = (newLayer: number) => {
      if (newLayer !== activeLayerRef.current) {
        activeLayerRef.current = newLayer;
        setActiveLayer(newLayer);
        // Update glow color directly
        if (glowRef.current) {
          const accent = PRODUCTS[newLayer].accent;
          glowRef.current.style.background = `radial-gradient(ellipse at center bottom, ${accent}33 0%, transparent 70%)`;
        }
      }
    };

    // ── Layer 2 (Mango): scroll 0% → 33.333% of section ─────────────────────
    // Reveals Mango over Blue Razz via 8 horizontal blinds
    if (blindsRef1.current) {
      const blindRects1 = Array.from(
        blindsRef1.current.querySelectorAll('rect'),
      ) as SVGRectElement[];

      if (blindRects1.length > 0) {
        const tween2 = gsap.to(blindRects1, {
          attr: { width: 100 },
          stagger: 0.04,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '33.333% top',
            scrub: 2,
            onUpdate(self) {
              // Progress bar segment 1 (Blue Razz): fills alongside Mango reveal
              if (fillRef0.current) {
                fillRef0.current.style.width = `${self.progress * 100}%`;
              }
              // Switch text to Mango when blinds are > 50% open
              updateActiveLayer(self.progress > 0.5 ? 1 : 0);
            },
          },
        });
        const st2 = tween2.scrollTrigger;
        if (st2) createdTriggers.push(st2);
      }
    }

    // ── Layer 3 (Grape): scroll 33.333% → 66.666% of section ────────────────
    // Reveals Grape over Mango via 8 horizontal blinds
    if (blindsRef2.current) {
      const blindRects2 = Array.from(
        blindsRef2.current.querySelectorAll('rect'),
      ) as SVGRectElement[];

      if (blindRects2.length > 0) {
        const tween3 = gsap.to(blindRects2, {
          attr: { width: 100 },
          stagger: 0.04,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: section,
            start: '33.333% top',
            end: '66.666% top',
            scrub: 2,
            onUpdate(self) {
              // Progress bar segment 2 (Mango)
              if (fillRef1.current) {
                fillRef1.current.style.width = `${self.progress * 100}%`;
              }
              // Switch text: Mango → Grape at 50% blind progress
              updateActiveLayer(self.progress > 0.5 ? 2 : 1);
            },
          },
        });
        const st3 = tween3.scrollTrigger;
        if (st3) createdTriggers.push(st3);
      }
    }

    // ── Progress bar segment 3 (Grape): scroll 66.666% → 100% ───────────────
    const tweenProgress3 = gsap.to(
      {},
      {
        scrollTrigger: {
          trigger: section,
          start: '66.666% top',
          end: 'bottom bottom',
          scrub: 2,
          onUpdate(self) {
            if (fillRef2.current) {
              fillRef2.current.style.width = `${self.progress * 100}%`;
            }
          },
        },
      },
    );
    const stP3 = tweenProgress3.scrollTrigger;
    if (stP3) createdTriggers.push(stP3);

    // ── Cleanup: kill all triggers created in this effect ────────────────────
    return () => {
      createdTriggers.forEach((t) => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Derived: active product data ────────────────────────────────────────────
  const product = PRODUCTS[activeLayer];

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    /**
     * Outer section — 300vh total height
     * Creates the scroll travel distance for all ScrollTrigger zones
     */
    <section
      ref={sectionRef}
      style={{ height: '300vh', position: 'relative', background: '#050505' }}
      aria-label="Axion product showcase"
    >
      {/**
       * Sticky container — stays at top:0 for the full 300vh scroll
       * All visual layers sit inside here
       */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* ── Layer 1: Blue Razz — always visible, no mask ──────────────────── */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
          aria-hidden="true"
        >
          <image
            ref={imgRef0}
            href="/images/Frames_blue/frame-1.png"
            x="0"
            y="0"
            width="100"
            height="100"
            preserveAspectRatio="xMidYMid slice"
            style={{ mixBlendMode: 'screen' }}
          />
        </svg>

        {/* ── Layer 2: Mango — revealed by 8 horizontal SVG blinds ──────────── */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
          aria-hidden="true"
        >
          <defs>
            {/**
             * SVG mask for Mango layer
             * Black base = hidden. White blind rects = revealed.
             * GSAP animates rect width: 0 → 100 with stagger.
             */}
            <mask id="mask-mango" maskUnits="userSpaceOnUse">
              <rect x="0" y="0" width="100" height="100" fill="black" />
              {/* 8 horizontal blind rects — GSAP animates width 0→100 */}
              <g ref={blindsRef1}>
                {Array.from({ length: BLIND_COUNT }, (_, i) => (
                  <rect
                    key={i}
                    x="0"
                    y={i * BLIND_HEIGHT}
                    width="0"
                    height={BLIND_HEIGHT}
                    fill="white"
                  />
                ))}
              </g>
            </mask>
          </defs>
          {/* Mango product frame — href updated by autoplay interval */}
          <image
            ref={imgRef1}
            href="/images/Frames_orange/frame-1.png"
            x="0"
            y="0"
            width="100"
            height="100"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#mask-mango)"
            style={{ mixBlendMode: 'screen' }}
          />
        </svg>

        {/* ── Layer 3: Grape — revealed by 8 horizontal SVG blinds ──────────── */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}
          aria-hidden="true"
        >
          <defs>
            {/**
             * SVG mask for Grape layer
             * Same structure as Mango mask, independent blind group
             */}
            <mask id="mask-grape" maskUnits="userSpaceOnUse">
              <rect x="0" y="0" width="100" height="100" fill="black" />
              {/* 8 horizontal blind rects — GSAP animates width 0→100 */}
              <g ref={blindsRef2}>
                {Array.from({ length: BLIND_COUNT }, (_, i) => (
                  <rect
                    key={i}
                    x="0"
                    y={i * BLIND_HEIGHT}
                    width="0"
                    height={BLIND_HEIGHT}
                    fill="white"
                  />
                ))}
              </g>
            </mask>
          </defs>
          {/* Grape product frame — href updated by autoplay interval */}
          <image
            ref={imgRef2}
            href="/images/Frames_purple/frame-1.png"
            x="0"
            y="0"
            width="100"
            height="100"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#mask-grape)"
            style={{ mixBlendMode: 'screen' }}
          />
        </svg>

        {/* ── Vignette overlay — radial gradient, darkens edges ─────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at center, transparent 40%, #050505 100%)',
            opacity: 0.6,
          }}
        />

        {/* ── Accent glow — centered bottom, follows active product color ─────── */}
        <div
          ref={glowRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '40%',
            // Initial color for Blue Razz
            background:
              'radial-gradient(ellipse at center bottom, #4F9EF833 0%, transparent 70%)',
            filter: 'blur(60px)',
            zIndex: 4,
            pointerEvents: 'none',
          }}
        />

        {/* ── Text overlay — switches per active layer ─────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${activeLayer}`}
            variants={textContainerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              // Alternated: Blue Razz → right, Mango → left, Grape → right
              ...(product.textSide === 'right'
                ? { right: '5vw' }
                : { left: '5vw' }),
              zIndex: 10,
              maxWidth: '320px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Label — uppercase, accent color, small tracking */}
            <motion.span
              variants={textLineVariants}
              style={{
                fontSize: '0.7rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: product.accent,
                marginBottom: '0.75rem',
                display: 'block',
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 300,
              }}
            >
              {product.label}
            </motion.span>

            {/* Product name — PP Neue Corp Wide 800 */}
            <motion.h2
              variants={textLineVariants}
              style={{
                fontFamily: '"PP Neue Corp Wide", sans-serif',
                fontWeight: 800,
                fontSize: '3rem',
                color: '#ffffff',
                lineHeight: 1,
                margin: 0,
                marginBottom: '0.6rem',
              }}
            >
              {product.name}
            </motion.h2>

            {/* Accroche — italic, 60% white */}
            <motion.p
              variants={textLineVariants}
              style={{
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '1rem',
                margin: 0,
                marginBottom: '1.5rem',
                lineHeight: 1.5,
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 300,
              }}
            >
              {product.accroche}
            </motion.p>

            {/* Accent separator line */}
            <motion.div
              variants={textLineVariants}
              style={{
                width: '40px',
                height: '1px',
                background: product.accent,
                marginBottom: '1.2rem',
              }}
            />

            {/* Ingredient list */}
            <motion.div
              variants={textLineVariants}
              style={{ marginBottom: '1.8rem' }}
            >
              {product.ingredients.map((ing, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.4rem 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.5)',
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  {ing}
                </div>
              ))}
            </motion.div>

            {/* CTA link */}
            <motion.a
              variants={textLineVariants}
              href="#"
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                color: product.accent,
                textDecoration: 'underline',
                textDecorationColor: product.accent,
                textDecorationThickness: '1px',
                textUnderlineOffset: '3px',
                alignSelf: 'flex-start',
                fontFamily: '"DM Sans", sans-serif',
              }}
            >
              {product.cta}
            </motion.a>
          </motion.div>
        </AnimatePresence>

        {/* ── Progress bar — 3 accent segments, bottom center ──────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            gap: '4px',
            width: '200px',
          }}
        >
          {/* Segment 0 — Blue Razz (#4F9EF8) */}
          <div
            style={{
              flex: 1,
              height: '2px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '1px',
              overflow: 'hidden',
            }}
          >
            <div
              ref={fillRef0}
              style={{
                height: '100%',
                width: '0%',
                background: PRODUCTS[0].accent,
                borderRadius: '1px',
              }}
            />
          </div>

          {/* Segment 1 — Mango (#F5B942) */}
          <div
            style={{
              flex: 1,
              height: '2px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '1px',
              overflow: 'hidden',
            }}
          >
            <div
              ref={fillRef1}
              style={{
                height: '100%',
                width: '0%',
                background: PRODUCTS[1].accent,
                borderRadius: '1px',
              }}
            />
          </div>

          {/* Segment 2 — Grape (#9B72F5) */}
          <div
            style={{
              flex: 1,
              height: '2px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '1px',
              overflow: 'hidden',
            }}
          >
            <div
              ref={fillRef2}
              style={{
                height: '100%',
                width: '0%',
                background: PRODUCTS[2].accent,
                borderRadius: '1px',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
