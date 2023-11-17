/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {colors: {
      'Celifrut-green': '#7D9F3A',
      'Celifrut-green-dark': '#5e782b',
    },},
  },
  plugins: [],
}