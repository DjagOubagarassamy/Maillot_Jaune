/* Configuration Tailwind : couleurs custom, polices et utilitaires personnalisés (font-perso, font-perso-titre) */
import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FFE645',
        mon_grey: '#989898'
      },
      fontFamily: {
        style_canyon: ["'Boldonse'", 'sans-serif'],
      }
    },
  },
  plugins: [
    plugin(({ addUtilities }) => addUtilities({
      '.font-perso-titre': { fontFamily: "'Boldonse', sans-serif", transform: 'skewX(15deg)' },
      '.font-perso': { fontFamily: "'Boldonse', sans-serif", letterSpacing: '0.075em' },
    })),
  ],
};
