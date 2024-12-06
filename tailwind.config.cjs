/** @type {import('tailwindcss').Config} */
const generateColors = {
  primary: "#5932EA",
  primary50: "#AC98F4",
  primary15: "#E6E0FC",
};

const rootColors = {
  orange: {
    50: "#fdf6f0",
    100: "#FDF3E7",
    200: "#f7d4af",
    300: "#F9CE9F",
    400: "#eb944d",
    500: "#F4A754",
    600: "#c05115",
    700: "#963c10",
    800: "#6a280a",
    900: "#3f1504",
  },
};

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...rootColors,
        ...generateColors,
      },
    },
    boxShadow: {
      box: "0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12)",
      sm: "0px 1px 0px 0px rgba(0, 0, 0, 0.16), 0px 1px 1px 0px rgba(0, 0, 0, 0.12)",
      xs: "0px 2px 0px 0px rgba(0, 0, 0, 0.02)",
      card: "0 2rem 3rem rgba(132, 139, 200, 0.18)",
      bottom: "0px 4px 4px 0px #00000026",
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
