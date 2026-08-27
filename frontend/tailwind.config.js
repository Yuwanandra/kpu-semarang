/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FFFFFF',
        paperDeep: '#F2F2F2',
        ink: {
          DEFAULT: '#141414',
          soft: '#5A5A5A',
        },
        merah: {
          DEFAULT: '#CE1126',
          deep: '#9E0B1D',
          soft: '#E2505F',
        },
        abu: {
          DEFAULT: '#6B7280',
          dark: '#27272A',
          faint: '#F1F1F2',
        },
        biru: {
          DEFAULT: '#0B3B60',
          deep: '#072844',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'paper-grain':
          "radial-gradient(circle at 1px 1px, rgba(20,20,20,0.06) 1px, transparent 0)",
      },
      boxShadow: {
        stamp: '0 8px 30px -8px rgba(20,20,20,0.35)',
      },
    },
  },
  plugins: [],
};
