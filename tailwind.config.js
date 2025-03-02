import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        reemkufi: ["Reem Kufi", "sans-serif"],
        pacifico: ["Pacifico", "sans-serif"],
        notoarabic: ["Noto Naskh Arabic", "sans-serif"],

      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
}
