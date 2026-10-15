import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FBF8F1',
          100: '#F5EEDB',
          200: '#EBDBB2',
          300: '#DEC383',
          400: '#CFA84F',
          500: '#B8862D', // Primary Brand Gold
          600: '#A17024',
          700: '#83561F',
          800: '#6A441E',
          900: '#58381C',
        },
        ivory: {
          DEFAULT: '#FAF6EE',
          light: '#FDFCF7',
          dark: '#EFE7D4',
        },
        charcoal: {
          DEFAULT: '#11202A',
          deep: '#0B151C',
          light: '#1B313F',
          border: '#284153',
        },
        burgundy: {
          DEFAULT: '#512B2B',
          dark: '#3A1E1E',
          light: '#6E3A3A',
        }
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(184, 134, 45, 0.25)',
        'luxury': '0 10px 30px -5px rgba(17, 32, 42, 0.08), 0 0 0 1px rgba(184, 134, 45, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
