/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'fancy-blue': 'rgba(88, 130, 193, 0.49)',
      }
    },
  },
  plugins: [],
}
