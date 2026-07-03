import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        yoshimoto: {
          red: "#E4032E",
          "red-dark": "#B00224",
          "red-light": "#FF3355",
        },
        warai: {
          yellow: "#FFD93B",
          "yellow-light": "#FFF3C4",
          orange: "#FF8A3D",
          cream: "#FFF9EC",
          ink: "#25211E",
        },
      },
      fontFamily: {
        sans: [
          "Hiragino Maru Gothic ProN",
          "Rounded Mplus 1c",
          "M PLUS Rounded 1c",
          "Hiragino Sans",
          "Noto Sans JP",
          "sans-serif",
        ],
      },
      boxShadow: {
        pop: "4px 4px 0 0 #25211E",
        "pop-sm": "2px 2px 0 0 #25211E",
        "pop-red": "4px 4px 0 0 #E4032E",
        "pop-yellow": "4px 4px 0 0 #FFD93B",
      },
    },
  },
  plugins: [],
};
export default config;
