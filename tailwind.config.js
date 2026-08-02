/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        notebook: '#FAF8F3',
        pencil: '#2B2B2B',
        domino: '#111111',
        paper: '#DDD8CF',
        accent: '#3478F6',
      },
    },
  },
  plugins: [],
};
