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
          DEFAULT: '#0B1120',
          dark: '#070C18',
          surface: '#0F172A',
          card: '#151D2E',
          elevated: '#1E293B',
          border: 'rgba(148, 163, 184, 0.18)',
        },
        cyan: {
          DEFAULT: '#38BDF8',
          glow: 'rgba(56, 189, 248, 0.35)',
          light: '#7DD3FC',
        },
        indigo: {
          DEFAULT: '#818CF8',
          glow: 'rgba(129, 140, 248, 0.35)',
          light: '#A5B4FC',
        },
        violet: {
          DEFAULT: '#A78BFA',
          glow: 'rgba(167, 139, 250, 0.35)',
          light: '#C4B5FD',
        },
        slate: {
          main: '#E2E8F0',
          muted: '#94A3B8',
          subtle: '#64748B',
        },
        emerald: {
          accent: '#34D399',
        }
      },
      fontFamily: {
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        sans: ['"Outfit"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"Space Mono"', 'Consolas', 'Courier New', 'monospace'],
      },
      borderColor: {
        subtle: 'rgba(148, 163, 184, 0.18)',
        'subtle-strong': 'rgba(148, 163, 184, 0.35)',
        cyan: 'rgba(56, 189, 248, 0.4)',
        violet: 'rgba(167, 139, 250, 0.4)',
      },
      boxShadow: {
        'glow-cyan': '0 0 30px -5px rgba(56, 189, 248, 0.35)',
        'glow-violet': '0 0 35px -5px rgba(129, 140, 248, 0.35)',
        'glow-subtle': '0 0 25px -5px rgba(56, 189, 248, 0.15)',
        'card-dev': '0 10px 30px -10px rgba(7, 12, 24, 0.8), 0 0 0 1px rgba(148, 163, 184, 0.12)',
        'card-dev-hover': '0 20px 40px -12px rgba(7, 12, 24, 0.9), 0 0 25px -5px rgba(56, 189, 248, 0.25)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle 800px at 70% 20%, rgba(56, 189, 248, 0.12) 0%, rgba(129, 140, 248, 0.1) 40%, rgba(11, 17, 32, 0.95) 80%)',
        'cyan-violet-gradient': 'linear-gradient(135deg, #38BDF8 0%, #818CF8 50%, #A78BFA 100%)',
        'cyan-indigo-gradient': 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
        'card-gradient': 'linear-gradient(180deg, #151D2E 0%, #0F172A 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 5s ease-in-out infinite',
        'blink': 'blink 4s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        blink: {
          '0%, 90%, 100%': { transform: 'scaleY(1)' },
          '95%': { transform: 'scaleY(0.1)' },
        }
      }
    },
  },
  plugins: [],
}
