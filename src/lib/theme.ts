import { AgencySettings } from "@/types/immo";

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  darkColor: string;
  secondaryColor: string;
  accentColor: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "teal-fusion",
    name: "Teal & Fusion Congo",
    description: "Charte officielle originale : Teal profond, Or et Orange dynamique.",
    primaryColor: "#0f766e",
    darkColor: "#042f2e",
    secondaryColor: "#ea580c",
    accentColor: "#f59e0b",
  },
  {
    id: "ocean-gold",
    name: "Bleu Océan & Or Royal",
    description: "Bleu d'affaires prestigieux contrasté par un or éclatant.",
    primaryColor: "#1d4ed8",
    darkColor: "#0f172a",
    secondaryColor: "#ea580c",
    accentColor: "#eab308",
  },
  {
    id: "emerald-amber",
    name: "Vert Émeraude & Ambre",
    description: "Évoque la nature et les résidences écologiques de standing.",
    primaryColor: "#047857",
    darkColor: "#064e3b",
    secondaryColor: "#d97706",
    accentColor: "#f59e0b",
  },
  {
    id: "bordeaux-prestige",
    name: "Bordeaux & Champagne",
    description: "Atmosphère luxueuse et feutrée pour l'immobilier d'exception.",
    primaryColor: "#881337",
    darkColor: "#4c0519",
    secondaryColor: "#e11d48",
    accentColor: "#fbbf24",
  },
  {
    id: "slate-copper",
    name: "Noir Élégant & Cuivre",
    description: "Design contemporain, sobre et ultra-moderne.",
    primaryColor: "#27272a",
    darkColor: "#09090b",
    secondaryColor: "#c2410c",
    accentColor: "#f97316",
  },
  {
    id: "indigo-coral",
    name: "Indigo & Corail",
    description: "Palette créative et énergique pour une vitrine moderne.",
    primaryColor: "#4338ca",
    darkColor: "#1e1b4b",
    secondaryColor: "#f43f5e",
    accentColor: "#fb923c",
  },
];

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RgbColor {
  let c = (hex || "").replace(/^#/, "").trim();
  if (c.length === 3) {
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  }
  if (!/^[0-9a-fA-F]{6}$/.test(c)) {
    return { r: 15, g: 118, b: 110 }; // Fallback Teal
  }
  const n = parseInt(c, 16);
  return {
    r: (n >> 16) & 255,
    g: (n >> 8) & 255,
    b: n & 255,
  };
}

function mix(c1: RgbColor, c2: RgbColor, weight: number): RgbColor {
  const w = Math.max(0, Math.min(1, weight));
  return {
    r: Math.round(c1.r * (1 - w) + c2.r * w),
    g: Math.round(c1.g * (1 - w) + c2.g * w),
    b: Math.round(c1.b * (1 - w) + c2.b * w),
  };
}

function toRgbString(c: RgbColor): string {
  return `${c.r} ${c.g} ${c.b}`;
}

function toHex(c: RgbColor): string {
  const h = (v: number) => v.toString(16).padStart(2, "0");
  return `#${h(c.r)}${h(c.g)}${h(c.b)}`;
}

export function generateThemeCss(settings?: Partial<AgencySettings>): string {
  const primaryHex = settings?.primaryColor || "#0f766e";
  const darkHex = settings?.darkColor || "#042f2e";
  const secondaryHex = settings?.secondaryColor || "#ea580c";
  const accentHex = settings?.accentColor || "#f59e0b";

  const white: RgbColor = { r: 255, g: 255, b: 255 };
  const primary = hexToRgb(primaryHex);
  const dark = hexToRgb(darkHex);
  const secondary = hexToRgb(secondaryHex);
  const accent = hexToRgb(accentHex);

  // Échelle de teintes Brand (50 -> 950)
  const brandShades = {
    50: toRgbString(mix(white, primary, 0.06)),
    100: toRgbString(mix(white, primary, 0.16)),
    200: toRgbString(mix(white, primary, 0.32)),
    300: toRgbString(mix(white, primary, 0.5)),
    400: toRgbString(mix(white, primary, 0.7)),
    500: toRgbString(mix(white, primary, 0.86)),
    600: toRgbString(primary),
    700: toRgbString(mix(primary, dark, 0.3)),
    800: toRgbString(mix(primary, dark, 0.6)),
    900: toRgbString(mix(primary, dark, 0.85)),
    950: toRgbString(dark),
  };

  // Échelle de teintes Fusion (50 -> 900)
  const fusionShades = {
    50: toRgbString(mix(white, accent, 0.08)),
    100: toRgbString(mix(white, accent, 0.2)),
    200: toRgbString(mix(white, accent, 0.38)),
    300: toRgbString(mix(white, accent, 0.58)),
    400: toRgbString(mix(white, accent, 0.8)),
    500: toRgbString(accent),
    600: toRgbString(secondary),
    700: toRgbString(mix(secondary, { r: 120, g: 30, b: 10 }, 0.25)),
    800: toRgbString(mix(secondary, { r: 90, g: 20, b: 5 }, 0.5)),
    900: toRgbString(mix(secondary, { r: 60, g: 15, b: 5 }, 0.75)),
  };

  const lighterAccent = toHex(mix(white, accent, 0.85));

  return `:root {
  --color-brand-50: ${brandShades[50]};
  --color-brand-100: ${brandShades[100]};
  --color-brand-200: ${brandShades[200]};
  --color-brand-300: ${brandShades[300]};
  --color-brand-400: ${brandShades[400]};
  --color-brand-500: ${brandShades[500]};
  --color-brand-600: ${brandShades[600]};
  --color-brand-700: ${brandShades[700]};
  --color-brand-800: ${brandShades[800]};
  --color-brand-900: ${brandShades[900]};
  --color-brand-950: ${brandShades[950]};

  --color-fusion-50: ${fusionShades[50]};
  --color-fusion-100: ${fusionShades[100]};
  --color-fusion-200: ${fusionShades[200]};
  --color-fusion-300: ${fusionShades[300]};
  --color-fusion-400: ${fusionShades[400]};
  --color-fusion-500: ${fusionShades[500]};
  --color-fusion-600: ${fusionShades[600]};
  --color-fusion-700: ${fusionShades[700]};
  --color-fusion-800: ${fusionShades[800]};
  --color-fusion-900: ${fusionShades[900]};

  --gradient-fusion: linear-gradient(135deg, ${secondaryHex} 0%, ${accentHex} 50%, ${lighterAccent} 100%);
  --gradient-teal: linear-gradient(135deg, ${darkHex} 0%, ${primaryHex} 60%, ${toHex(mix(white, primary, 0.85))} 100%);

  --theme-primary: ${primaryHex};
  --theme-dark: ${darkHex};
  --theme-secondary: ${secondaryHex};
  --theme-accent: ${accentHex};
}`;
}

