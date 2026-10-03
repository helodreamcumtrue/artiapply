import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "sans-serif"],
        poppins: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
      colors: {
        background: "#f8fafc",
        foreground: "#0f172a",
        card: {
          DEFAULT: "#ffffff",
          border: "rgba(226, 232, 240, 0.85)",
        },
        primary: {
          DEFAULT: "#0f172a",
          hover: "#1e293b",
          light: "#4f46e5",
          glow: "rgba(15, 23, 42, 0.08)",
        },
        accent: {
          cyan: "#0284c7",
          emerald: "#059669",
          rose: "#e11d48",
          amber: "#d97706",
          purple: "#7c3aed",
        },
        surface: {
          50: "#ffffff",
          100: "#f8fafc",
          200: "#f1f5f9",
          300: "#e2e8f0",
          400: "#cbd5e1",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      borderRadius: {
        'card-sm': '18px',
        'card': '26px',
        'card-lg': '32px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(15, 23, 42, 0.03), 0 6px 18px -3px rgba(15, 23, 42, 0.04), 0 16px 36px -6px rgba(15, 23, 42, 0.03)',
        'card-hover': '0 2px 6px rgba(15, 23, 42, 0.04), 0 12px 28px -4px rgba(15, 23, 42, 0.08), 0 24px 44px -8px rgba(15, 23, 42, 0.05)',
        'card-subtle': '0 1px 2px rgba(15, 23, 42, 0.03), 0 3px 10px -2px rgba(15, 23, 42, 0.04)',
        'pill': '0 2px 10px -1px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.03)',
        glow: '0 4px 14px 0 rgba(15, 23, 42, 0.12)',
        'glow-cyan': '0 4px 14px 0 rgba(2, 132, 199, 0.15)',
        'glow-emerald': '0 4px 14px 0 rgba(5, 150, 105, 0.15)',
      },
    },
  },
  plugins: [],
};
export default config;
