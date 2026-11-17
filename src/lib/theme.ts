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

export interface ColorWithAlpha {
  r: number;
  g: number;
  b: number;
  a: number; // 0 to 1
  hex6: string; // e.g. #0f766e
  hex8: string; // e.g. #0f766ecc
  rgba: string; // e.g. rgba(15, 118, 110, 0.8)
}

export function parseColorWithAlpha(
  input: string | undefined,
  defaultHex = "#0f766e"
): ColorWithAlpha {
  if (!input) input = defaultHex;
  const str = input.trim();

  // Support RGBA: rgba(r, g, b, a)
  const rgbaMatch = str.match(
    /^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i
  );
  if (rgbaMatch) {
    const r = Math.max(0, Math.min(255, parseInt(rgbaMatch[1], 10)));
    const g = Math.max(0, Math.min(255, parseInt(rgbaMatch[2], 10)));
    const b = Math.max(0, Math.min(255, parseInt(rgbaMatch[3], 10)));
    const a =
      rgbaMatch[4] !== undefined
        ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4])))
        : 1;
    const toH = (x: number) => x.toString(16).padStart(2, "0");
    const aHex = Math.round(a * 255)
      .toString(16)
      .padStart(2, "0");
    return {
      r,
      g,
      b,
      a: Math.round(a * 100) / 100,
      hex6: `#${toH(r)}${toH(g)}${toH(b)}`,
      hex8: `#${toH(r)}${toH(g)}${toH(b)}${aHex}`,
      rgba: `rgba(${r}, ${g}, ${b}, ${Math.round(a * 100) / 100})`,
    };
  }

  // Support HEX (3, 4, 6, 8)
  let clean = str.replace(/^#/, "");
  let a = 1;

  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  } else if (clean.length === 4) {
    const aPart = clean[3];
    clean = clean
      .slice(0, 3)
      .split("")
      .map((c) => c + c)
      .join("");
    a = parseInt(aPart + aPart, 16) / 255;
  } else if (clean.length === 8) {
    const aPart = clean.slice(6, 8);
    clean = clean.slice(0, 6);
    a = parseInt(aPart, 16) / 255;
  }

  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    clean = defaultHex.replace(/^#/, "").slice(0, 6);
    a = 1;
  }

  const n = parseInt(clean, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const toH = (x: number) => x.toString(16).padStart(2, "0");
  const aHex = Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");

  return {
    r,
    g,
    b,
    a: Math.max(0, Math.min(1, Math.round(a * 100) / 100)),
    hex6: `#${toH(r)}${toH(g)}${toH(b)}`,
    hex8: `#${toH(r)}${toH(g)}${toH(b)}${aHex}`,
    rgba: `rgba(${r}, ${g}, ${b}, ${Math.round(a * 100) / 100})`,
  };
}

export function rgbToHsv(
  r: number,
  g: number,
  b: number
): { h: number; s: number; v: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

export function hsvToRgb(
  h: number,
  s: number,
  v: number
): { r: number; g: number; b: number } {
  h = (((h % 360) + 360) % 360) / 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  v = Math.max(0, Math.min(100, v)) / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r = 0,
    g = 0,
    b = 0;
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function rgbaToHex(r: number, g: number, b: number, a = 1): string {
  const toH = (x: number) => x.toString(16).padStart(2, "0");
  const a255 = Math.round(Math.max(0, Math.min(1, a)) * 255);
  if (a255 >= 255) {
    return `#${toH(r)}${toH(g)}${toH(b)}`.toLowerCase();
  }
  return `#${toH(r)}${toH(g)}${toH(b)}${toH(a255)}`.toLowerCase();
}

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): RgbColor {
  const parsed = parseColorWithAlpha(hex);
  return { r: parsed.r, g: parsed.g, b: parsed.b };
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
  const primaryParsed = parseColorWithAlpha(settings?.primaryColor, "#0f766e");
  const darkParsed = parseColorWithAlpha(settings?.darkColor, "#042f2e");
  const secondaryParsed = parseColorWithAlpha(settings?.secondaryColor, "#ea580c");
  const accentParsed = parseColorWithAlpha(settings?.accentColor, "#f59e0b");

  const white: RgbColor = { r: 255, g: 255, b: 255 };
  const primary: RgbColor = { r: primaryParsed.r, g: primaryParsed.g, b: primaryParsed.b };
  const dark: RgbColor = { r: darkParsed.r, g: darkParsed.g, b: darkParsed.b };
  const secondary: RgbColor = { r: secondaryParsed.r, g: secondaryParsed.g, b: secondaryParsed.b };
  const accent: RgbColor = { r: accentParsed.r, g: accentParsed.g, b: accentParsed.b };

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

  --gradient-fusion: linear-gradient(135deg, ${secondaryParsed.rgba} 0%, ${accentParsed.rgba} 50%, ${lighterAccent} 100%);
  --gradient-teal: linear-gradient(135deg, ${darkParsed.rgba} 0%, ${primaryParsed.rgba} 60%, ${toHex(mix(white, primary, 0.85))} 100%);

  --theme-primary: ${primaryParsed.rgba};
  --theme-primary-hex: ${primaryParsed.hex8};
  --theme-primary-alpha: ${primaryParsed.a};

  --theme-dark: ${darkParsed.rgba};
  --theme-dark-hex: ${darkParsed.hex8};
  --theme-dark-alpha: ${darkParsed.a};

  --theme-secondary: ${secondaryParsed.rgba};
  --theme-secondary-hex: ${secondaryParsed.hex8};
  --theme-secondary-alpha: ${secondaryParsed.a};

  --theme-accent: ${accentParsed.rgba};
  --theme-accent-hex: ${accentParsed.hex8};
  --theme-accent-alpha: ${accentParsed.a};
}`;
}

