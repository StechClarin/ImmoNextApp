import type { Config } from "tailwindcss";

function withAlpha(variableName: string, fallbackRgb: string): string {
  return `rgb(var(${variableName}, ${fallbackRgb}) / <alpha-value>)`;
}

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: withAlpha("--color-brand-50", "240 253 250"),
          100: withAlpha("--color-brand-100", "204 251 241"),
          200: withAlpha("--color-brand-200", "153 246 228"),
          300: withAlpha("--color-brand-300", "94 234 212"),
          400: withAlpha("--color-brand-400", "45 212 191"),
          500: withAlpha("--color-brand-500", "20 184 166"),
          600: withAlpha("--color-brand-600", "13 148 136"),
          700: withAlpha("--color-brand-700", "15 118 110"),
          800: withAlpha("--color-brand-800", "17 94 89"),
          900: withAlpha("--color-brand-900", "19 78 74"),
          950: withAlpha("--color-brand-950", "4 47 46"),
        },
        fusion: {
          50: withAlpha("--color-fusion-50", "255 251 235"),
          100: withAlpha("--color-fusion-100", "254 243 199"),
          200: withAlpha("--color-fusion-200", "253 230 138"),
          300: withAlpha("--color-fusion-300", "252 211 77"),
          400: withAlpha("--color-fusion-400", "251 191 36"),
          500: withAlpha("--color-fusion-500", "245 158 11"),
          600: withAlpha("--color-fusion-600", "234 88 12"),
          700: withAlpha("--color-fusion-700", "194 65 12"),
          800: withAlpha("--color-fusion-800", "154 52 18"),
          900: withAlpha("--color-fusion-900", "124 45 18"),
        },
      },
      backgroundImage: {
        "fusion-gradient":
          "var(--gradient-fusion, linear-gradient(135deg, #f97316 0%, #f59e0b 50%, #eab308 100%))",
        "teal-gradient":
          "var(--gradient-teal, linear-gradient(135deg, #042f2e 0%, #0f766e 60%, #0d9488 100%))",
      },
    },
  },
  plugins: [],
};
export default config;
