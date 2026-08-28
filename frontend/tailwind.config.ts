import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        surface: "#f8f9ff",
        "surface-dim": "#ccdbf4",
        "surface-bright": "#f8f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e6eeff",
        "surface-container-high": "#dde9ff",
        "surface-container-highest": "#d5e3fd",
        "on-surface": "#0d1c2f",
        "on-surface-variant": "#5a413a",
        "inverse-surface": "#233144",
        "inverse-on-surface": "#ebf1ff",
        outline: "#8e7069",
        "outline-variant": "#e2bfb6",
        "surface-tint": "#b02f02",
        primary: "#832000",
        "on-primary": "#ffffff",
        "primary-container": "#ac2d00",
        "on-primary-container": "#ffc8b9",
        secondary: "#9f4122",
        "secondary-container": "#fd8863",
        tertiary: "#3d4559",
        "tertiary-container": "#545c72",
        error: "#ba1a1a"
      },
      fontFamily: {
        sans: ["Public Sans", "Arial", "sans-serif"],
        label: ["Inter", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 2px 4px rgba(51, 65, 85, 0.05)",
        panel: "0 10px 15px rgba(51, 65, 85, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
