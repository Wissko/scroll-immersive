'use client';

/**
 * ScrollSequence — Video scroll-driven premium component
 * Layout alterné par produit avec crossfade d'images et kinetic typography
 * Fond noir total, mix-blend-mode: screen pour effacer le fond des frames
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ─── Registration GSAP plugins ───────────────────────────────────────────────
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface FlavorData {
  id: number;
  name: string;
  accent: string;
  frameDir: string;
  headline: string;
  accroche: string;
  benefits: string[];
  imagePosition: 'left' | 'right';
}

// ─── Données produits ─────────────────────────────────────────────────────────
const FLAVORS: FlavorData[] = [
  {
    id: 0,
    name: 'BLUE RAZZ',
    accent: '#3B82F6',
    frameDir: '/images/Frames_blue',
    headline: 'RAZOR SHARP FOCUS',
    accroche: 'Chaque rep compte. Chaque seconde aussi.',
    benefits: [
      'Concentration laser des les premieres minutes',
      'Energie explosive sans crash post-entrainement',
      'Endurance mentale et physique prolongee',
      'Cafeine naturelle + L-Theanine',
      'Saveur Blue Razz glacee — sans sucre ajoute',
    ],
    imagePosition: 'left',
  },
  {
    id: 1,
    name: 'MANGO',
    accent: '#F0A830',
    frameDir: '/images/Frames_orange',
    headline: 'TROPICAL SURGE',
    accroche: "L'energie du soleil, la puissance du terrain.",
    benefits: [
      'Boost cardio intense pour les seances longues',
      "Beta-Alanine pour repousser l'acide lactique",
      'Vitamine B6 + B12 pour le metabolisme energetique',
      'Hydratation optimisee avec electrolytes naturels',
      'Saveur Mango tropicale — zero compromis',
    ],
    imagePosition: 'right',
  },
  {
    id: 2,
    name: 'GRAPE',
    accent: '#8B5CF6',
    frameDir: '/images/Frames_purple',
    headline: 'DARK GRAPE FOCUS',
    accroche: 'La nuit appartient a ceux qui preparent leur victoire.',
    benefits: [
      'Pump musculaire puissant — Citrulline Malate',
      'Antioxydants naturels pour la recuperation',
      'Focus nocturne sans perturber le sommeil',
      'Tyrosine + Alpha GPC',
      'Saveur Grape intense — profonde, pas sucree',
    ],
    imagePosition: 'left',
  },
];

const TOTAL_FRAMES = 90;
const FRAMES_PER_FLAVOR = 30;

// ─── Framer Motion variants ───────────────────────────────────────────────────
const textContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
  exit: {},
};

const textItemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.55, 0, 1, 0.45] as [number, number, number, number],
    },
  },
};

const imageBlockVariants = {
  enterLeft: { x: '-60px', opacity: 0 },
  enterRight: { x: '60px', opacity: 0 },
  center: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exitLeft: {
    x: '-60px',
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.55, 0, 1, 0.45] as [number, number, number, number],
    },
  },
  exitRight: {
    x: '60px',
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.55, 0, 1, 0.45] as [number, number, number, number],
    },
  },
};

// ─── Composant principal ──────────────────────────────────────────────────────
// Named export for page.tsx compatibility
export function ScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const kineticRef = useRef<HTMLDivElement>(null);

  // Frame & flavor state
  const [frameIndex, setFrameIndex] = useState(0);
  const [flavorIndex, setFlavorIndex] = useState(0);
  const [prevFlavorIndex, setPrevFlavorIndex] = useState(-1);

  // Crossfade A/B swap
  const [activeSlot, setActiveSlot] = useState<'A' | 'B'>('A');
  const [slotA, setSlotA] = useState<string>('');
  const [slotB, setSlotB] = useState<string>('');
  const [slotAOpacity, setSlotAOpacity] = useState(1);
  const [slotBOpacity, setSlotBOpacity] = useState(0);
  const crossfadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastFrameRef = useRef(-1);

  // Preload state
  const [loadedCount, setLoadedCount] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);
  const [loaderFading, setLoaderFading] = useState(false);

  // ─── Preload toutes les frames au mount ───────────────────────────────────
  useEffect(() => {
    let loaded = 0;
    const total = TOTAL_FRAMES;

    FLAVORS.forEach((flavor) => {
      for (let i = 1; i <= FRAMES_PER_FLAVOR; i++) {
        const img = new Image();
        img.src = `${flavor.frameDir}/frame-${i}.png`;
        img.onload = () => {
          loaded++;
          setLoadedCount(loaded);
          if (loaded >= total) {
            // Fade out loader
            setLoaderFading(true);
            setTimeout(() => setAllLoaded(true), 500);
          }
        };
        img.onerror = () => {
          loaded++;
          setLoadedCount(loaded);
          if (loaded >= total) {
            setLoaderFading(true);
            setTimeout(() => setAllLoaded(true), 500);
          }
        };
      }
    });
  }, []);

  // ─── Calcul du path d'une frame ──────────────────────────────────────────
  const getFramePath = useCallback((globalFrameIdx: number): string => {
    const fIdx = Math.min(Math.floor(globalFrameIdx / FRAMES_PER_FLAVOR), 2);
    const localFrame = (globalFrameIdx % FRAMES_PER_FLAVOR) + 1;
    return `${FLAVORS[fIdx].frameDir}/frame-${localFrame}.png`;
  }, []);

  // ─── Crossfade A/B ────────────────────────────────────────────────────────
  const updateFrame = useCallback(
    (newFrameIndex: number) => {
      if (newFrameIndex === lastFrameRef.current) return;
      lastFrameRef.current = newFrameIndex;

      const newPath = getFramePath(newFrameIndex);

      if (crossfadeTimeoutRef.current) {
        clearTimeout(crossfadeTimeoutRef.current);
      }

      if (activeSlot === 'A') {
        // Charge dans slot B, fade A→0, B→1
        setSlotB(newPath);
        setSlotBOpacity(1);
        setSlotAOpacity(0);
        crossfadeTimeoutRef.current = setTimeout(() => {
          setActiveSlot('B');
        }, 60);
      } else {
        // Charge dans slot A, fade B→0, A→1
        setSlotA(newPath);
        setSlotAOpacity(1);
        setSlotBOpacity(0);
        crossfadeTimeoutRef.current = setTimeout(() => {
          setActiveSlot('A');
        }, 60);
      }
    },
    [activeSlot, getFramePath]
  );

  // ─── Init slot A avec frame 0 ─────────────────────────────────────────────
  useEffect(() => {
    const initialPath = getFramePath(0);
    setSlotA(initialPath);
    setSlotAOpacity(1);
  }, [getFramePath]);

  // ─── Kinetic typography GSAP ──────────────────────────────────────────────
  useEffect(() => {
    if (prevFlavorIndex === flavorIndex || prevFlavorIndex === -1) return;
    if (!kineticRef.current) return;

    const flavor = FLAVORS[flavorIndex];
    gsap.fromTo(
      kineticRef.current,
      { x: '100%' },
      {
        x: '-120%',
        duration: 0.8,
        ease: 'power3.inOut',
        overwrite: true,
      }
    );

    // Update kinetic text color and content via CSS vars
    kineticRef.current.style.color = flavor.accent;
    kineticRef.current.setAttribute('data-text', flavor.name);
  }, [flavorIndex, prevFlavorIndex]);

  // ─── ScrollTrigger setup ──────────────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress; // 0 → 1
        const newFrameIndex = Math.min(
          Math.floor(progress * (TOTAL_FRAMES - 1)),
          TOTAL_FRAMES - 1
        );
        const newFlavorIndex = Math.min(
          Math.floor(newFrameIndex / FRAMES_PER_FLAVOR),
          2
        );

        setFrameIndex(newFrameIndex);
        updateFrame(newFrameIndex);

        if (newFlavorIndex !== flavorIndex) {
          setPrevFlavorIndex(flavorIndex);
          setFlavorIndex(newFlavorIndex);
        }
      },
    });

    return () => {
      trigger.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateFrame]);

  // ─── Cleanup crossfade timeout ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (crossfadeTimeoutRef.current) {
        clearTimeout(crossfadeTimeoutRef.current);
      }
    };
  }, []);

  const flavor = FLAVORS[flavorIndex];
  const loadPercent = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  // ─── Progress dot labels ───────────────────────────────────────────────────
  const progressLabel = String(flavorIndex + 1).padStart(2, '0') + ' / 03';

  return (
    <>
      {/* ── Preload loader bar ──────────────────────────────────────────── */}
      {!allLoaded && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '2px',
            zIndex: 9999,
            background: 'rgba(255,255,255,0.08)',
            opacity: loaderFading ? 0 : 1,
            transition: 'opacity 0.5s ease',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${loadPercent}%`,
              background: '#3B82F6',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      )}

      {/* ── Section sticky principale ───────────────────────────────────── */}
      <section
        ref={sectionRef}
        style={{
          height: '500vh',
          position: 'relative',
        }}
        aria-label="Présentation des saveurs Axion"
      >
        {/* Inner sticky container */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            background: '#000',
          }}
        >
          {/* ── Kinetic typography (fond) ────────────────────────────────── */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              zIndex: 0,
              pointerEvents: 'none',
              opacity: 0.07,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              ref={kineticRef}
              data-text={flavor.name}
              style={{
                fontSize: 'clamp(5rem, 28vw, 38vw)',
                fontFamily: '"PP Neue Corp Wide", sans-serif',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: flavor.accent,
                whiteSpace: 'nowrap',
                willChange: 'transform',
                lineHeight: 1,
              }}
            >
              {flavor.name}
            </div>
          </div>

          {/* ── Layout produit (AnimatePresence pour slide) ──────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`layout-${flavorIndex}`}
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
              }}
            >
              {/* ── Bloc image ─────────────────────────────────────────── */}
              <motion.div
                key={`img-block-${flavorIndex}`}
                variants={imageBlockVariants}
                initial={flavor.imagePosition === 'left' ? 'enterLeft' : 'enterRight'}
                animate="center"
                exit={flavor.imagePosition === 'left' ? 'exitLeft' : 'exitRight'}
                style={{
                  position: 'absolute',
                  top: 0,
                  [flavor.imagePosition]: 0,
                  width: 'clamp(0px, 65%, 65%)',
                  height: '100%',
                }}
              >
                {/* Crossfade slot A */}
                <img
                  src={slotA}
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    mixBlendMode: 'screen',
                    opacity: slotAOpacity,
                    transition: `opacity 60ms linear`,
                    willChange: 'opacity',
                  }}
                />
                {/* Crossfade slot B */}
                <img
                  src={slotB}
                  alt=""
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    mixBlendMode: 'screen',
                    opacity: slotBOpacity,
                    transition: `opacity 60ms linear`,
                    willChange: 'opacity',
                  }}
                />
              </motion.div>

              {/* ── Bloc texte ─────────────────────────────────────────── */}
              <motion.div
                key={`text-block-${flavorIndex}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  [flavor.imagePosition === 'left' ? 'right' : 'left']: 0,
                  width: '35%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4rem',
                  zIndex: 2,
                  // Mobile : géré via media query inline impossible, voir styles globaux
                }}
                variants={textContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div style={{ width: '100%' }}>
                  {/* Headline */}
                  <motion.h2
                    variants={textItemVariants}
                    style={{
                      fontFamily: '"PP Neue Corp Wide", sans-serif',
                      fontWeight: 800,
                      fontSize: 'clamp(1.8rem, 4.5vw, 5rem)',
                      textTransform: 'uppercase',
                      color: flavor.accent,
                      lineHeight: 1.05,
                      marginBottom: '1rem',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {flavor.headline}
                  </motion.h2>

                  {/* Accroche */}
                  <motion.p
                    variants={textItemVariants}
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 300,
                      fontStyle: 'italic',
                      fontSize: '1.2rem',
                      color: 'rgba(255,255,255,0.8)',
                      marginBottom: '2rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {flavor.accroche}
                  </motion.p>

                  {/* Bénéfices */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {flavor.benefits.map((benefit, i) => (
                      <motion.li
                        key={i}
                        variants={textItemVariants}
                        style={{
                          fontFamily: '"DM Sans", sans-serif',
                          fontWeight: 400,
                          fontSize: '0.95rem',
                          color: 'rgba(255,255,255,0.65)',
                          lineHeight: 1.8,
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '0.6rem',
                        }}
                      >
                        {/* Trait accent */}
                        <span
                          style={{
                            color: flavor.accent,
                            fontWeight: 700,
                            flexShrink: 0,
                            fontSize: '0.9rem',
                          }}
                          aria-hidden="true"
                        >
                          {'\u2500'}
                        </span>
                        {benefit}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* ── Indicateur de progression ────────────────────────────────── */}
          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.6rem',
            }}
            aria-label={`Produit ${flavorIndex + 1} sur 3`}
          >
            {/* Pastilles */}
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {FLAVORS.map((f, i) => (
                <div
                  key={f.id}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: f.accent,
                    opacity: i === flavorIndex ? 1 : 0.3,
                    transform: i === flavorIndex ? 'scale(1.4)' : 'scale(1)',
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                    animation: i === flavorIndex ? 'pulse-dot 1.5s ease-in-out infinite' : 'none',
                  }}
                />
              ))}
            </div>

            {/* Label numérique */}
            <span
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 300,
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.1em',
              }}
            >
              {progressLabel}
            </span>
          </div>

          {/* ── Styles injectés (pulse + responsive) ────────────────────── */}
          <style>{`
            @keyframes pulse-dot {
              0%, 100% { box-shadow: 0 0 0 0 currentColor; }
              50% { box-shadow: 0 0 0 4px transparent; }
            }

            /* Responsive mobile */
            @media (max-width: 768px) {
              .axion-image-block {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: auto !important;
                width: 100% !important;
                height: 50vh !important;
              }
              .axion-text-block {
                position: absolute !important;
                top: 50vh !important;
                left: 0 !important;
                right: auto !important;
                width: 100% !important;
                height: 50vh !important;
                padding: 1.5rem !important;
              }
              .axion-text-block h2 {
                font-size: 8vw !important;
              }
              .axion-text-block p {
                font-size: 1rem !important;
              }
              .axion-text-block li {
                font-size: 0.85rem !important;
              }
            }
          `}</style>
        </div>
      </section>
    </>
  );
}


