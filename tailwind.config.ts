import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontWeight: {
        bold: "700", // Added font weight 700
        bolder: "900", // Added font weight 700
      },
      fontSize: {
        size_heading: '24px',
        size_subheading: '14px',
        size_para: '12px',
        size_subpara: '10px',
        size_0: "0px",
        size_1: "1px",
        size_2: "2px",
        size_3: "3px",
        size_4: "4px",
        size_5: "5px",
        size_6: "6px",
        size_7: "7px",
        size_8: "8px",
        size_9: "9px",
        size_10: "10px",
        size_12: "12px",
        size_13: "13px",
        size_14: "14px",
        size_15: "15px",
        size_16: "16px",
        size_17: "17px",
        size_18: "18px",
        size_19: "19px",
        size_20: "20px",
        size_22: "22px",
        size_24: "24px",
        size_25: "25px",
        size_30: "30px",
        size_35: "35px",
        size_50: "50px",
        size_60: "60px"
      },
      fontFamily: {
        mullish: ['Mulish', 'sans-serif'], // Replace 'CustomFont' with your font-family name
      },
      colors: {
        transparent: "transparent",
        main: "#4D39DF",
        lightMain: "#EEF1FF",
        whiteSmoke: "whitesmoke",
        lightgray: "#909090",
        highlightgray: "#EFEFEF",
        header_lightgray: "#F6F6F6",
        silver: "silver",
        gray: "gray",
        lightblack: "rgb(0 0 0 / 16%)",
        black: "#000",
        white: "#fff",
        Red: "red",
        _F6E69D: "#F6E69D",
        _A05D25: "#A05D25",
        _33658A: "#33658A",
        _2F4858: "#2F4858",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
