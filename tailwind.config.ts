import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ibmPlexSans: ["var(--font-ibm-plex-sans)", "sans-serif"],
        monaSans: ["var(--font-monaSans)", "sans-serif"],
      },
      colors: {
        ui: {
          primary: "#0F0F0F",
          secondary: "#FFFFFF",
          muted: "#464545",
          stroke: "#353A4B",
          lightBlue: "#D2E4FC",
          light: "#F5F9FF",
          dark: "#25252C",
          midnight: "#161616",
          midnightAccent: "#1A1A1A",
          gray: "#9E9E9E",
          highlight: "#C4FE61",
          green: "#9AFC1F",
          yellow: "#F6AB54",
          red: "#F66754",
          danger: "#CB2828",
        },
        textSecondary: "rgba(196, 196, 196, 1)",
        darkBlueBg: "rgba(40, 81, 249, 0.05)",
        darkBg: "rgba(70, 69, 69, 0.3)",
        darkerBg: "rgba(27, 27, 27, 1)",
        lightBlue: "#F5F9FF",
        lighterBlue: "rgba(245, 249, 255, 1)",
        darkBlue: "rgba(210, 228, 252, 0.5)",
        grey: "rgba(53, 58, 75, 0.6)",
        lightGrey: "#E5E5E5",
        dark: "#464545",
        lighterDark: "rgba(70, 69, 69, 0.15)",
        lightDark: "rgba(70, 69, 69, 1)",
        link: "#3A5A99",
        darkGrey: "#090910",
        overlay: "rgba(9, 9, 16, 0.85)",
        danger: "rgba(178, 28, 28, 1)",
        lighterGrey: "rgba(217, 217, 217, 1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "health-linear":
          "linear-gradient(90deg, rgba(219,0,0,1) 0%, rgba(255,226,0,1) 50%, rgba(0,153,7,1) 100%)",
      },
      borderRadius: {
        lg: "10px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
