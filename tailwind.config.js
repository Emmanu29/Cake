export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      animation: {
        flame: 'flame 1s ease-in-out infinite alternate',
        smoke: 'smoke 2s ease-out forwards',
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        flame: {
          '0%': { transform: 'scaleY(1)' },
          '100%': { transform: 'scaleY(1.1)' },
        },
        smoke: {
          '0%': { height: '3px', opacity: '0.7' },
          '100%': { height: '12px', opacity: '0', transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}