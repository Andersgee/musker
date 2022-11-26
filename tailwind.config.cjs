/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      "sm": "500px",
      "md": "600px",
      "lg": "700px",
      "xl": "988px",
      "2xl": "1078px",
      "3xl": "1266px",
    },
    container: {
      screens: {
        "sm": "500px",
        "md": "600px",
        "lg": "700px",
        "xl": "988px",
        "2xl": "1078px",
        "3xl": "1266px",
      },
      center: true,
    },
    extend: {
      fontFamily: {
        paragraph: ["var(--font-paragraph)"],
      },
      keyframes: {
        strokedraw: {
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        strokedraw: "strokedraw 2.5s cubic-bezier(0.33, 0.4, 0.96, 0.6) forwards",
        slowstrokedraw: "strokedraw 10s cubic-bezier(0.33, 0.4, 0.96, 0.6) forwards",
        muskstrokedraw: "strokedraw 1s cubic-bezier(.17,.67,.72,.78) forwards",
        muskstrokedrawslowlinear: "strokedraw 3s cubic-bezier(0,0,0,0) forwards infinite",
      },
      boxShadow: {
        imageborder: "inset 0 2px 4px 0 hsla(0, 0%, 0%, .2)",
      },

      gridTemplateColumns: {
        "phone": "1fr",
        "sm": "64px 1fr",
        "md": "80px 1fr",
        "lg": "80px 620px",
        "xl": "80px 620px 288px",
        "2xl": "80px 620px 358px",
        "3xl": "288px 620px 358px",
      },
      gridTemplateRows: {
        phone: "3rem 1fr 3rem",
        sm: "3rem 1fr",
      },
    },
  },
  plugins: [],
};
