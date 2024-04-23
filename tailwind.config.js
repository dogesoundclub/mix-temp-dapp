const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addVariant }) {
      // this class is applied to `html` by `app/theme-efect.ts`, similar
      // to how `dark:` gets enabled
      addVariant("theme-system", ".theme-system &");
    }),
      require("tailwindcss-animate"),
    plugin(function({ addUtilities }) {
      addUtilities({
        '.border-border': {
          // Your declarations here
        },
        '.bg-background': {
          // Your declarations here
        },
        '.text-foreground': {
          // Your declarations here
        },
      })
    })
],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
