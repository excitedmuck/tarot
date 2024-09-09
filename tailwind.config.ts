import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        purple: {
          200: '#e9d8fd',
          300: '#d6bcfa',
          600: '#805ad5',
          700: '#6b46c1',
          900: '#44337a',
        },
        indigo: {
          900: '#3c366b',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
