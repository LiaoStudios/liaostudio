/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  future: {
    // su iOS/Android un tap può "incollare" lo stato :hover finché non
    // tocchi altrove — senza questo, gli effetti al passaggio del mouse
    // (watermark del logo, bottoni, card) restavano accesi in permanenza
    // sul telefono invece di essere solo un accenno. Con questo, hover:
    // e group-hover: si attivano solo dove esiste davvero un puntatore.
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
