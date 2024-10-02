/** @type {import('tailwindcss').Config} */
export const content = [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    screens: {
      xs: "390px",
    },
    colors: {
      background: "#ffffff",
      foreground: "#000000",
      green: {
        50: "#f9fbea",
        100: "#f0f6d1",
        200: "#e1eea8",
        300: "#c9e175",
        400: "#b3d14a",
        500: "#9bbe2e",
        600: "#73911f",
        700: "#586f1c",
        800: "#47581c",
        900: "#3c4b1c",
        950: "#1f290a",
      },
      orange: {
        50: "#fff7ed",
        100: "#feeed6",
        200: "#fcd8ac",
        300: "#fabc77",
        400: "#f79540",
        500: "#f4771b",
        600: "#df5a10",
        700: "#be4610",
        800: "#973715",
        900: "#7a3014",
        950: "#421608",
      },
      blue: {
        50: "#f1f9fe",
        100: "#e1f3fd",
        200: "#bde6fa",
        300: "#83d4f6",
        400: "#42bdee",
        500: "#19a6de",
        600: "#0c87c0",
        700: "#0b6a99",
        800: "#0d5a7f",
        900: "#114b69",
        950: "#0b2f46",
      },
      btn: {
        background: "hsl(var(--btn-background))",
        background_hover: "hsl(var(--btn-background-hover))",
      },
    },
  },
};
export const plugins = [];
