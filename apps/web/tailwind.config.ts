import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'vc-black': '#111111',
        'vc-gray-dark': '#333333',
        'vc-gray-mid': '#777777',
        'vc-gray-light': '#DDDDDD',
        'vc-white': '#FFFFFF',
        'vc-green': '#1A5C2E'
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
        sans: ['Inter', 'sans-serif']
      },
      borderRadius: {
        'DEFAULT': '0.125rem',
        'lg': '0.25rem',
        'xl': '0.5rem',
        'full': '9999px'
      },
      spacing: {
        'gutter': '24px',
        'lg': '48px',
        'xl': '80px',
        'base': '8px',
        'container-max': '1280px',
        'md': '24px',
        'sm': '12px',
        'margin-mobile': '16px',
        'xs': '4px'
      }
    },
  },
  plugins: [],
};

export default config;
