/**
 * Données produits partagées
 * AXION Electric Pre-Workout SHOT (60mL)
 */

export interface ProductData {
  id: string;
  slug: string;
  number: string;
  label: string;
  name: string;
  tagline: string;
  description: string;
  specs: string;
  cta: string;
  accent: string;
  background: string;
  modelPath: string;
  imageLeft: boolean;
  ingredients: { name: string; dose: string; role: string }[];
}

export const PRODUCTS: ProductData[] = [
  {
    id: "blue-razz",
    slug: "blue-razz",
    number: "01",
    label: "PRE-WORKOUT SHOT · 60ML",
    name: "Blue Razz",
    tagline: "Focus + Drive",
    description:
      "Grab it. Shoot it. Go. 60mL of clinically dosed performance in a single shot. No shaker, no mixing, no waiting. Built for serious lifters who train to perform.",
    specs: "200mg Caffeine · 4g L-Citrulline · 2g L-Tyrosine",
    cta: "Join the First Drop",
    accent: "#4F9EF8",
    background: "#040810",
    modelPath: "/models/blue-razz.glb",
    imageLeft: true,
    ingredients: [
      { name: "Caffeine", dose: "200mg", role: "Energy and focus. No crash." },
      { name: "L-Citrulline", dose: "4g", role: "Improved blood flow and stronger pumps." },
      { name: "L-Tyrosine", dose: "2g", role: "Enhanced focus and mental drive." },
      { name: "Beta-Alanine", dose: "2g", role: "Muscular endurance and performance." },
      { name: "L-Theanine", dose: "100mg", role: "Smooth energy. Reduced jitters." },
      { name: "Taurine", dose: "500mg", role: "Hydration and performance support." },
      { name: "Sodium", dose: "150mg", role: "Electrolyte balance and muscle function." },
    ],
  },
  {
    id: "mango",
    slug: "mango",
    number: "02",
    label: "PRE-WORKOUT SHOT · 60ML",
    name: "Mango",
    tagline: "Focus + Drive",
    description:
      "Not a powder. A shot. Fast-acting, clinically dosed, zero compromise. 60mL that hits in minutes. No mixing, no filler, no wasted effort. Built by lifters who were tired of underdosed pre-workouts.",
    specs: "200mg Caffeine · 4g L-Citrulline · 2g Beta-Alanine",
    cta: "Join the First Drop",
    accent: "#F5B942",
    background: "#0D0800",
    modelPath: "/models/mango.glb",
    imageLeft: false,
    ingredients: [
      { name: "Caffeine", dose: "200mg", role: "Energy and focus. No crash." },
      { name: "L-Citrulline", dose: "4g", role: "Improved blood flow and stronger pumps." },
      { name: "L-Tyrosine", dose: "2g", role: "Enhanced focus and mental drive." },
      { name: "Beta-Alanine", dose: "2g", role: "Muscular endurance and performance." },
      { name: "L-Theanine", dose: "100mg", role: "Smooth energy. Reduced jitters." },
      { name: "Taurine", dose: "500mg", role: "Hydration and performance support." },
      { name: "Sodium", dose: "150mg", role: "Electrolyte balance and muscle function." },
    ],
  },
  {
    id: "grape",
    slug: "grape",
    number: "03",
    label: "PRE-WORKOUT SHOT · 60ML",
    name: "Grape",
    tagline: "Focus + Drive",
    description:
      "Fast. Focused. Unstoppable. Every ingredient earns its place. Nothing hidden, nothing underdosed. Fully transparent formula, no proprietary blends. One shot is all it takes.",
    specs: "200mg Caffeine · 2g L-Tyrosine · 500mg Taurine",
    cta: "Join the First Drop",
    accent: "#9B72F5",
    background: "#07040F",
    modelPath: "/models/grape.glb",
    imageLeft: true,
    ingredients: [
      { name: "Caffeine", dose: "200mg", role: "Energy and focus. No crash." },
      { name: "L-Citrulline", dose: "4g", role: "Improved blood flow and stronger pumps." },
      { name: "L-Tyrosine", dose: "2g", role: "Enhanced focus and mental drive." },
      { name: "Beta-Alanine", dose: "2g", role: "Muscular endurance and performance." },
      { name: "L-Theanine", dose: "100mg", role: "Smooth energy. Reduced jitters." },
      { name: "Taurine", dose: "500mg", role: "Hydration and performance support." },
      { name: "Sodium", dose: "150mg", role: "Electrolyte balance and muscle function." },
    ],
  },
];
