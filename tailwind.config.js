import withMT from "@material-tailwind/react/utils/withMT";

/** @type {import('tailwindcss').Config} */
export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "440px"
      }
    },
    colors: {
      primary: "#4A5568",
      secondary: "#F7FAFC",
      blue: "#1451B8",
      orange: "#EF9814",
      gray: "#AAAAAA"
    }
  },
  plugins: []
});
