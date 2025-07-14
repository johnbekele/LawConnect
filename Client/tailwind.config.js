// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // 'media' for dark mode based on OS preference, 'class' for manual toggling
  theme: {
    extend: {},
  },
  plugins: [],
};
