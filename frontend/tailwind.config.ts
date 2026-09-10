import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Surface & Canvas Tokens
        surface: "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-bright": "#f8f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "surface-variant": "#d3e4fe",
        "canvas-slate": "#F4F6F9",
        "surface-white": "#FFFFFF",
        "border-subtle": "#E2E8F0",

        // Text & Contrast
        "on-surface": "#0b1c30",
        "on-surface-variant": "#44474e",
        "text-primary": "#0F172A",
        "text-secondary": "#64748B",
        "text-tertiary": "#94A3B8",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        outline: "#74777f",
        "outline-variant": "#c4c6cf",
        "surface-tint": "#465f88",

        // Sovereign MoSPI Navy Tokens
        primary: "#002046",
        "on-primary": "#ffffff",
        "primary-container": "#1b365d",
        "on-primary-container": "#87a0cd",
        "inverse-primary": "#aec7f7",
        "primary-fixed": "#d6e3ff",
        "primary-fixed-dim": "#aec7f7",
        "on-primary-fixed": "#001b3d",
        "on-primary-fixed-variant": "#2e476f",
        "navy-hero-end": "#0B5C9E",

        // Action Saffron & Brand Tokens
        secondary: "#9a4600",
        "on-secondary": "#ffffff",
        "secondary-container": "#f47920",
        "on-secondary-container": "#612900",
        "secondary-fixed": "#ffdbc9",
        "secondary-fixed-dim": "#ffb68d",
        "on-secondary-fixed": "#321200",
        "on-secondary-fixed-variant": "#763300",
        "action-saffron-light": "#FFA730",
        "brand-ochre": "#EAA11F",

        // Tertiary / Government Slate
        tertiary: "#001e4f",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#003279",
        "on-tertiary-container": "#759df7",
        "tertiary-fixed": "#d9e2ff",
        "tertiary-fixed-dim": "#b0c6ff",
        "on-tertiary-fixed": "#001945",
        "on-tertiary-fixed-variant": "#094297",

        // Sovereign National Tricolor
        "tricolor-saffron": "#FF9933",
        "tricolor-white": "#FFFFFF",
        "tricolor-green": "#138808",

        // Semantic Status Indicators
        "status-mastered": "#1B873F",
        "status-in-progress": "#D97706",
        "status-gap-high": "#C2410C",
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        // Cadre Domain Tokens
        "domain-statistical": "#1B4CA1",
        "domain-technical": "#0D9488",
        "domain-governance": "#7C3AED",
        "domain-behavioural": "#D97706",

        // Backward compatibility mappings
        mospi: {
          navy: "#1b365d",
          navyDeep: "#11223b",
          blue: "#1b4ca1",
          lightBg: "#f4f6f9",
          saffron: "#f47920",
          saffronGold: "#ffa730",
          green: "#138808"
        }
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans", "Segoe UI", "sans-serif"],
        display: ["Noto Sans", "Inter", "sans-serif"],
        label: ["Inter", "sans-serif"]
      },
      spacing: {
        "space-3xs": "0.125rem",
        "space-2xs": "0.25rem",
        "space-xs": "0.5rem",
        "space-sm": "0.75rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        "space-2xl": "2.5rem",
        "space-3xl": "3rem",
        "gutter-mobile": "1rem",
        "gutter-desktop": "1.5rem",
        "container-max": "80rem"
      },
      boxShadow: {
        soft: "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
        card: "0 1px 3px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)",
        hover: "0 4px 6px -1px rgba(27, 54, 93, 0.08), 0 2px 4px -2px rgba(27, 54, 93, 0.04)",
        panel: "0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -4px rgba(15, 23, 42, 0.05)"
      }
    }
  },
  plugins: []
};

export default config;
