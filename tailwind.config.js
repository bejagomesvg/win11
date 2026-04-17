/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Segoe UI"', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 30px 80px rgba(15, 23, 42, 0.35)',
      },
      keyframes: {
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.94)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        floatUp: 'floatUp 320ms ease-out',
        popIn: 'popIn 180ms ease-out',
      },
    },
  },
  plugins: [],
};
