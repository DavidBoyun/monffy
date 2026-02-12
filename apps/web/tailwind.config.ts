import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        monffy: {
          purple: "#6E54FF",   // Exact Monad Purple
          light: "#A78BFA",    // Lighter purple for hover/accent
          lavender: "#E2DCFF", // Soft lavender for highlights
          pink: "#EC4899",
          gold: "#F59E0B",
          mint: "#3CBD2C",
          blue: "#146AEB",
          red: "#FF494A",
        },
        monad: {
          DEFAULT: "#6E54FF",
          black: "#0A0A14",
          dark: "#0d0d19",
          surface: "#1a1a2e",
          "surface-light": "#222244",
          text: "#f2ebf9",
          border: "rgba(255, 255, 255, 0.06)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "bounce-slow": "bounce 2s infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-in-right": "slide-in-right 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
        "spin-slow": "spin 8s linear infinite",
        "shimmer": "shimmer 2s linear infinite",
        "glow-border": "glow-border 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "scan": "scan 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(110, 84, 255, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(110, 84, 255, 0.6)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(24px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "glow-border": {
          "0%, 100%": { borderColor: "rgba(110, 84, 255, 0.2)" },
          "50%": { borderColor: "rgba(110, 84, 255, 0.5)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "scan": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(300px)", opacity: "0" },
        },
      },
      backgroundImage: {
        "monad-gradient": "linear-gradient(135deg, #0d0d19 0%, #1a1a2e 100%)",
        "glass-gradient": "linear-gradient(180deg, rgba(13, 13, 25, 0.7) 0%, rgba(13, 13, 25, 0.3) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
