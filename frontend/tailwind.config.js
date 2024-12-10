/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        work: ['Work Sans', 'sans-serif'],
      },
      backgroundImage: {
        // 'button-bg': 'linear-gradient(120deg, #FFDAB9, #FFA500, #FF8C00, #FF4500)',
        // 'button-bg': 'linear-gradient(120deg, #FF4500, #FFA500, #FF8C00, #FF4500)',
        'bg': 'linear-gradient(98.63deg, #d3f3fc 0%, #fde2e4 50%, #ffffff 100%)', //  General background
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}