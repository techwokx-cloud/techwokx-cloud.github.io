import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#05050C",
        navy: {
          DEFAULT: "#0A0A16",
          800: "#0F0F1E",
          700: "#14142A",
          600: "#1B1B36",
          500: "#26264A",
        },
        violet: {
          DEFAULT: "#8B5CF6",
          600: "#7C3AED",
        },
        azure: {
          DEFAULT: "#3B82F6",
          600: "#2563EB",
        },
        mist: "#9AA1C4",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #7C3AED 0%, #3B82F6 100%)",
        "brand-gradient-radial":
          "radial-gradient(circle at 30% 20%, rgba(124,58,237,0.25), transparent 45%), radial-gradient(circle at 80% 60%, rgba(59,130,246,0.2), transparent 40%)",
      },
      boxShadow: {
        glow: "0 0 60px -15px rgba(124,58,237,0.45)",
      },
    },
  },
  plugins: [],
};
export default config;
