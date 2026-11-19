/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          DEFAULT: '#fcf7f4',
          dark: '#f3e8e8',
          surface: '#fffdfb',
          card: '#fffdfb',
          elevated: '#f3e8e8',
          border: 'rgba(148, 111, 129, 0.18)',
        },
        cyan: {
          DEFAULT: '#a34f68',
          glow: 'rgba(163, 79, 104, 0.35)',
          light: '#95516d',
        },
        indigo: {
          DEFAULT: '#79628a',
          glow: 'rgba(163, 79, 104, 0.35)',
          light: '#79628a',
        },
        violet: {
          DEFAULT: '#79628a',
          glow: 'rgba(163, 79, 104, 0.35)',
          light: '#79628a',
        },
        slate: {
          main: '#3f303b',
          muted: '#725e6b',
          subtle: '#725e6b',
        },
        emerald: {
          accent: '#4f7466',
        }
      },
      fontFamily: {
        display: ['"Inter"', '"Segoe UI"', 'sans-serif'],
        heading: ['"Inter"', '"Segoe UI"', 'sans-serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"Inter"', '"Segoe UI"', 'sans-serif'],
      },
      borderColor: {
        subtle: 'rgba(148, 111, 129, 0.18)',
        'subtle-strong': 'rgba(148, 111, 129, 0.35)',
        cyan: 'rgba(163, 79, 104, 0.4)',
        violet: 'rgba(163, 79, 104, 0.4)',
      },
      boxShadow: {
        'glow-cyan': 'none',
        'glow-violet': 'none',
        'glow-subtle': 'none',
        'card-dev': '0 10px 30px -10px rgba(73, 45, 63, 0.08), 0 0 0 1px rgba(148, 111, 129, 0.12)',
        'card-dev-hover': '0 20px 40px -12px rgba(73, 45, 63, 0.10), 0 0 25px -5px rgba(163, 79, 104, 0.25)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle 800px at 70% 20%, rgba(163, 79, 104, 0.12) 0%, rgba(163, 79, 104, 0.1) 40%, rgba(252, 247, 244, 0.95) 80%)',
        'cyan-violet-gradient': 'linear-gradient(135deg, #a34f68 0%, #79628a 50%, #79628a 100%)',
        'cyan-indigo-gradient': 'linear-gradient(135deg, #a34f68 0%, #79628a 100%)',
        'card-gradient': 'linear-gradient(180deg, #fffdfb 0%, #fffdfb 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 5s ease-in-out infinite',
        'blink': 'blink 4s infinite',
        'fade-in': 'fade-in 0.35s ease-out both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.1)' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
