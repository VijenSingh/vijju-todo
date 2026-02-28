/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <-- YEH NAYI LINE ADD KI HAI (Dark mode button chalane ke liye)
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}