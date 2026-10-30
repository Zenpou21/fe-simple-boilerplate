// HeroUI theme, loaded by Tailwind through `@plugin "./hero.ts"` in index.css.
// Change the brand color here and every button, link and focus ring follows.
import { heroui } from "@heroui/react";

export default heroui({
  themes: {
    light: {
      colors: {
        primary: {
          50: "#F0F7FF",
          100: "#E1ECFF",
          200: "#C3D9FF",
          300: "#A5C6FF",
          400: "#5A9FFF",
          500: "#2570F5",
          600: "#1E5FD8",
          700: "#184BB5",
          800: "#12378E",
          900: "#0C1F5C",
          DEFAULT: "#2570F5",
          foreground: "#ffffff",
        },
        focus: "#2570F5",
      },
      layout: {
        radius: { small: "8px", medium: "8px" },
        borderWidth: { small: "1px", medium: "1px", large: "2px" },
      },
    },
  },
});
