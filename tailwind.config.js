/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          lavender: '#EADCF8',
          lavenderDark: '#D4BBF0',
          purple: '#B39DDB',
          purpleDark: '#7E57C2',
          cream: '#FEFDF5',
          creamDark: '#FFF9E6',
          pink: '#FFD6E8',
          pinkDark: '#F48FB1',
          yellow: '#FFF3B0',
          yellowDark: '#FFE066',
          mint: '#D8F3DC',
          peach: '#FFE5D9',
          text: '#4A3B52',
          textMuted: '#7A6B82',
        }
      },
      fontFamily: {
        bubbly: ['Fredoka', 'Quicksand', 'sans-serif'],
        handwriting: ['Caveat', 'Patrick Hand', 'cursive'],
        body: ['Quicksand', 'Nunito', 'sans-serif'],
      },
      boxShadow: {
        'cute': '0 8px 24px -4px rgba(147, 112, 219, 0.2), 0 4px 12px -2px rgba(147, 112, 219, 0.1)',
        'cute-lg': '0 16px 36px -6px rgba(147, 112, 219, 0.25), 0 8px 16px -4px rgba(147, 112, 219, 0.15)',
        'inner-soft': 'inset 0 2px 6px 0 rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        'float-medium': 'float 3s ease-in-out infinite',
        'float-fast': 'float 2s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGentle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.9' },
        },
        sparkle: {
          '0%, 100%': { transform: 'scale(0.8) rotate(0deg)', opacity: '0.4' },
          '50%': { transform: 'scale(1.2) rotate(15deg)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
