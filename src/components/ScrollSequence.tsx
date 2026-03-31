'use client';

/**
 * ScrollSequence — Autoplay loop version
 *
 * Philosophy: Space, restraint, every element earns its place.
 * No scroll dependency — frames loop automatically like a background video.
 *
 * Structure:
 *  - 100vh section (not sticky)
 *  - Soft entry: opacity 0→1, scale 1.05→1, blur 8px→0 on viewport entry
 *  - Autoplay: 15 frames × 80ms per product, product changes every 5s
 *  - Image: centered, max-width 420px, mix-blend-mode screen
 *  - Text: right of image, max-width 320px, gap ~8vw
 *  - Crossfade A/B: 80ms ease-in-out
 *  - Nav dots: bottom of section, manual product switch
 *  - Particles: 40 max, opacity 0.04, radius 1px max, ambient drift
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Ingredient {
  name: string;
  dose: string;
}

interface FlavorData {
  id: number;
  name: string;
  label: string;
  accent: string;
  frameDir: string;
  accroche: string;
  ingredients: Ingredient[];
  ctaText: string;
}

// ─── Product data ─────────────────────────────────────────────────────────────
const FLAVORS: FlavorData[] = [
  {
    id: 0,
    name: 'Blue Razz',
    label: 'ELECTRIC PRE-WORKOUT',
    accent: '#4F9EF8',
    frameDir: '/images/Frames_blue',
    accroche: 'Laser focus. Explosive energy.',
    ingredients: [
      { name: 'Caffeine Anhydrous', dose: '200mg' },
      { name: 'L-Theanine',         dose: '150mg' },
      { name: 'Beta-Alanine',       dose: '2,000mg' },
      { name: 'Citrulline Malate',  dose: '4,000mg' },
      { name: 'Alpha GPC',          dose: '200mg' },
    ],
    ctaText: 'Shop Blue Razz →',
  },
  {
    id: 1,
    name: 'Mango',
    label: 'ELECTRIC PRE-WORKOUT',
    accent: '#F5B942',
    frameDir: '/images/Frames_orange',
    accroche: 'Tropical surge. Peak performance.',
    ingredients: [
      { name: 'Caffeine Anhydrous', dose: '200mg' },
      { name: 'Beta-Alanine',       dose: '2,500mg' },
      { name: 'Citrulline Malate',  dose: '6,000mg' },
      { name: 'Vitamin B6',         dose: '5mg' },
      { name: 'Vitamin B12',        dose: '100mcg' },
    ],
    ctaText: 'Shop Mango →',
  },
  {
    id: 2,
    name: 'Grape',
    label: 'ELECTRIC PRE-WORKOUT',
    accent: '#9B72F5',
    frameDir: '/images/Frames_purple',
    accroche: 'Dark focus. Night-mode power.',
    ingredients: [
      { name: 'Caffeine Anhydrous', dose: '200mg' },
      { name: 'L-Tyrosine',         dose: '1,000mg' },
      { name: 'Alpha GPC',          dose: '300mg' },
      { name: 'Citrulline Malate',  dose: '6,000mg' },
      { name: 'Grape Seed Extract', dose: '100mg' },
    ],
    ctaText: 'Shop Grape →',
  },
];

// ─── Frame configuration ──────────────────────────────────────────────────────
// All frames: 1 → 30 per flavor
const FRAME_NUMBERS = Array.from({ length: 30 }, (_, i) => i + 1); // [1,2,...,30]
const FRAMES_PER_FLAVOR = FRAME_NUMBERS.length; // 30
const TOTAL_FRAMES = FRAMES_PER_FLAVOR * FLAVORS.length; // 90

// ─── Utility ──────────────────────────────────────────────────────────────────
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function getFramePath(flavorIdx: number, frameIdx: number): string {
  const frameNum = FRAME_NUMBERS[frameIdx % FRAMES_PER_FLAVOR];
  return `${FLAVORS[flavorIdx].frameDir}/frame-${frameNum}.png`;
}

// ─── Particle type ────────────────────────────────────────────────────────────
interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number; opacity: number;
}

// ─── Framer Motion variants ───────────────────────────────────────────────────

/** Soft entry when section enters viewport */
const sectionEntryVariants = {
  hidden: {
    opacity: 0,
    scale: 1.05,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

/** Image block: blur+opacity transition on flavor change */
const imageVariants = {
  enter: {
    opacity: 0,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    filter: 'blur(4px)',
    transition: {
      duration: 0.4,
      ease: [0.55, 0, 1, 0.45] as [number, number, number, number],
    },
  },
};

/** Text stagger container */
const textContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.3,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
    },
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
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);

  // Track accent color for particles via ref (avoids stale closure)
  const accentRef = useRef<string>(FLAVORS[0].accent);

  // ─── Frame & flavor state ─────────────────────────────────────────────────
  const [flavorIndex, setFlavorIndex] = useState(0);
  const flavorIndexRef = useRef<number>(0); // stable ref for intervals
  const [frameIndex, setFrameIndex]   = useState(0);

  // ─── Crossfade A/B state ──────────────────────────────────────────────────
  const [slotA, setSlotA]               = useState<string>('');
  const [slotB, setSlotB]               = useState<string>('');
  const [slotAOpacity, setSlotAOpacity] = useState(1);
  const [slotBOpacity, setSlotBOpacity] = useState(0);
  const activeSlotRef                   = useRef<'A' | 'B'>('A');
  const lastFrameKeyRef                 = useRef<string>('');
  const crossfadeTimer                  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── Section in-view trigger for entry animation ──────────────────────────
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });

  // ─── Preload: only odd frames for all flavors ─────────────────────────────
  const [loadedCount, setLoadedCount]   = useState(0);
  const [allLoaded, setAllLoaded]       = useState(false);
  const [loaderFading, setLoaderFading] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const total = TOTAL_FRAMES;

    FLAVORS.forEach((flavor) => {
      FRAME_NUMBERS.forEach((n) => {
        const img    = new Image();
        img.src      = `${flavor.frameDir}/frame-${n}.png`;
        const finish = () => {
          loaded++;
          setLoadedCount(loaded);
          if (loaded >= total) {
            setLoaderFading(true);
            setTimeout(() => setAllLoaded(true), 500);
          }
        };
        img.onload  = finish;
        img.onerror = finish;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Init: set first frame in slot A ─────────────────────────────────────
  useEffect(() => {
    const path = getFramePath(0, 0);
    setSlotA(path);
    setSlotAOpacity(1);
  }, []);

  // ─── Crossfade frame update ───────────────────────────────────────────────
  const updateFrame = useCallback((flavor: number, frame: number) => {
    const key = `${flavor}-${frame}`;
    if (key === lastFrameKeyRef.current) return;
    lastFrameKeyRef.current = key;

    const path = getFramePath(flavor, frame);

    if (crossfadeTimer.current) clearTimeout(crossfadeTimer.current);

    if (activeSlotRef.current === 'A') {
      setSlotB(path);
      setSlotBOpacity(1);
      setSlotAOpacity(0);
      crossfadeTimer.current = setTimeout(() => {
        activeSlotRef.current = 'B';
      }, 80);
    } else {
      setSlotA(path);
      setSlotAOpacity(1);
      setSlotBOpacity(0);
      crossfadeTimer.current = setTimeout(() => {
        activeSlotRef.current = 'A';
      }, 80);
    }
  }, []);

  // ─── Autoplay: frame interval (80ms) ─────────────────────────────────────
  useEffect(() => {
    const frameInterval = setInterval(() => {
      setFrameIndex((prev) => {
        const next = (prev + 1) % FRAMES_PER_FLAVOR;
        updateFrame(flavorIndexRef.current, next);
        return next;
      });
    }, 80);

    return () => clearInterval(frameInterval);
  }, [updateFrame]);

  // ─── Sync accent ref when flavorIndex changes ─────────────────────────────
  useEffect(() => {
    accentRef.current = FLAVORS[flavorIndex].accent;
    flavorIndexRef.current = flavorIndex;
  }, [flavorIndex]);

  // ─── Manual product navigation ────────────────────────────────────────────
  const goToFlavor = useCallback((idx: number) => {
    if (idx === flavorIndexRef.current) return;
    setFlavorIndex(idx);
    flavorIndexRef.current = idx;
    accentRef.current = FLAVORS[idx].accent;
    setFrameIndex(0);
    lastFrameKeyRef.current = '';
  }, []);

  // ─── Cleanup crossfade timer ──────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (crossfadeTimer.current) clearTimeout(crossfadeTimer.current);
    };
  }, []);

  // ─── Particle canvas RAF ──────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PARTICLE_COUNT = 40;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () => ({
      x:       Math.random() * canvas.width,
      y:       Math.random() * canvas.height,
      vx:      (Math.random() - 0.5) * 0.25,
      vy:      Math.random() * 0.18 + 0.04,
      radius:  Math.random() * 0.8 + 0.2,
      opacity: Math.random() * 0.03 + 0.01,
    }));

    let rafId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const [r, g, b] = hexToRgb(accentRef.current);

      for (const p of particles) {
        // Ambient drift — no scroll velocity
        p.y += p.vy;
        p.x += p.vx;

        if (p.y > canvas.height + 2) p.y = -2;
        if (p.x < -2)  p.x = canvas.width + 2;
        if (p.x > canvas.width + 2)  p.x = -2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.opacity})`;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  // ─── Derived values ───────────────────────────────────────────────────────
  const flavor      = FLAVORS[flavorIndex];
  const loadPercent = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Preload progress bar (bottom, 2px) ─────────────────────────── */}
      {!allLoaded && (
        <div
          style={{
            position: 'fixed',
            bottom: 0, left: 0,
            width: '100%', height: '2px',
            zIndex: 9999,
            background: 'rgba(255,255,255,0.06)',
            opacity: loaderFading ? 0 : 1,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${loadPercent}%`,
              background: flavor.accent,
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      )}

      {/* ── Section — 100vh, not sticky ─────────────────────────────────── */}
      <section
        ref={sectionRef}
        style={{
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: '#050505',
        }}
        aria-label="Axion flavor showcase"
      >
        {/* ── Soft entry animation wrapper ─────────────────────────────── */}
        <motion.div
          variants={sectionEntryVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          style={{ position: 'absolute', inset: 0 }}
        >
          {/* ── Particle canvas (background layer, z:0) ─────────────────── */}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              zIndex: 0, pointerEvents: 'none',
            }}
          />

          {/* ── Main layout: image + text ──────────────────────────────── */}
          <div
            className="axion-layout-inner"
            style={{
              position: 'absolute', inset: 0,
              zIndex: 1,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8vw',
              padding: '0 5vw',
            }}
          >
            {/* ── Image block ──────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`img-${flavorIndex}`}
                variants={imageVariants}
                initial="enter"
                animate="visible"
                exit="exit"
                className="axion-image-wrap"
                style={{
                  position: 'relative',
                  maxWidth: '420px',
                  width: '100%',
                  aspectRatio: '3 / 4',
                  flexShrink: 0,
                }}
              >
                {/* Crossfade slot A */}
                <img
                  src={slotA}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    objectFit: 'contain',
                    mixBlendMode: 'screen',
                    opacity: slotAOpacity,
                    transition: 'opacity 80ms ease-in-out',
                  }}
                />
                {/* Crossfade slot B */}
                <img
                  src={slotB}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    objectFit: 'contain',
                    mixBlendMode: 'screen',
                    opacity: slotBOpacity,
                    transition: 'opacity 80ms ease-in-out',
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* ── Text block ───────────────────────────────────────────── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${flavorIndex}`}
                variants={textContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="axion-text-wrap"
                style={{
                  maxWidth: '320px',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                {/* Label */}
                <motion.span
                  variants={textLineVariants}
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 300,
                    fontSize: '0.7rem',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    color: flavor.accent,
                    marginBottom: '0.75rem',
                    display: 'block',
                  }}
                >
                  {flavor.label}
                </motion.span>

                {/* Product name */}
                <motion.h2
                  variants={textLineVariants}
                  style={{
                    fontFamily: '"PP Neue Corp Wide", sans-serif',
                    fontWeight: 800,
                    fontSize: '3.2rem',
                    color: '#ffffff',
                    lineHeight: 1.0,
                    margin: 0,
                    marginBottom: '0.6rem',
                  }}
                >
                  {flavor.name}
                </motion.h2>

                {/* Accroche */}
                <motion.p
                  variants={textLineVariants}
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    fontSize: '1rem',
                    color: 'rgba(255,255,255,0.6)',
                    margin: 0,
                    marginBottom: '1.5rem',
                    lineHeight: 1.5,
                  }}
                >
                  {flavor.accroche}
                </motion.p>

                {/* Separator line */}
                <motion.div
                  variants={textLineVariants}
                  style={{
                    width: '40px',
                    height: '1px',
                    background: flavor.accent,
                    marginBottom: '1.5rem',
                  }}
                />

                {/* Ingredient table */}
                <motion.div
                  variants={textLineVariants}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                    marginBottom: '2rem',
                  }}
                >
                  {flavor.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.45rem 0',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                        cursor: 'default',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.querySelectorAll('span').forEach((s: HTMLSpanElement) => {
                          s.style.color = 'rgba(255,255,255,0.8)';
                        });
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.querySelectorAll('span').forEach((s: HTMLSpanElement) => {
                          s.style.color = 'rgba(255,255,255,0.5)';
                        });
                      }}
                    >
                      <span
                        style={{
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 400,
                          fontSize: '0.85rem',
                          color: 'rgba(255,255,255,0.5)',
                          transition: 'color 0.15s ease',
                        }}
                      >
                        {ing.name}
                      </span>
                      <span
                        style={{
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 400,
                          fontSize: '0.85rem',
                          color: 'rgba(255,255,255,0.5)',
                          transition: 'color 0.15s ease',
                        }}
                      >
                        {ing.dose}
                      </span>
                    </div>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.a
                  variants={textLineVariants}
                  href="#"
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontWeight: 400,
                    fontSize: '0.8rem',
                    letterSpacing: '0.2em',
                    color: flavor.accent,
                    textDecoration: 'underline',
                    textDecorationColor: flavor.accent,
                    textDecorationThickness: '1px',
                    textUnderlineOffset: '3px',
                    alignSelf: 'flex-start',
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  {flavor.ctaText}
                </motion.a>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Nav dots — bottom center ──────────────────────────────── */}
          <div
            style={{
              position: 'absolute',
              bottom: '2.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '0.75rem',
            }}
            aria-label="Flavor navigation"
          >
            {FLAVORS.map((f, idx) => (
              <button
                key={f.id}
                onClick={() => goToFlavor(idx)}
                aria-label={`Switch to ${f.name}`}
                style={{
                  appearance: 'none',
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  className={idx === flavorIndex ? 'axion-dot axion-dot-active' : 'axion-dot'}
                  style={{
                    display: 'block',
                    width:  idx === flavorIndex ? '10px' : '7px',
                    height: idx === flavorIndex ? '10px' : '7px',
                    borderRadius: '50%',
                    background: f.accent,
                    opacity: idx === flavorIndex ? 1 : 0.4,
                    transition: 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease',
                    animation: idx === flavorIndex ? 'axion-pulse 2s ease-in-out infinite' : 'none',
                  }}
                />
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Global styles ──────────────────────────────────────────────── */}
      <style>{`
        @keyframes axion-pulse {
          0%, 100% { box-shadow: 0 0 0 0px rgba(255,255,255,0.15); }
          50%       { box-shadow: 0 0 0 4px rgba(255,255,255,0.05); }
        }

        /* Mobile layout: image top, text below, centered */
        @media (max-width: 768px) {
          .axion-layout-inner {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            padding-top: 3rem !important;
            gap: 2rem !important;
          }
          .axion-image-wrap {
            max-width: 280px !important;
          }
          .axion-text-wrap {
            max-width: 90vw !important;
            text-align: center !important;
          }
          .axion-text-wrap a {
            align-self: center !important;
          }
        }
      `}</style>
    </>
  );
}
