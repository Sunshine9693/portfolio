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
          DEFAULT: '#F8FAFC',
          dark: '#F1F5F9',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          elevated: '#F1F5F9',
          border: 'rgba(148, 163, 184, 0.18)',
        },
        cyan: {
          DEFAULT: '#243E63',
          glow: 'rgba(36, 62, 99, 0.35)',
          light: '#36577F',
        },
        indigo: {
          DEFAULT: '#405A76',
          glow: 'rgba(36, 62, 99, 0.35)',
          light: '#405A76',
        },
        violet: {
          DEFAULT: '#405A76',
          glow: 'rgba(36, 62, 99, 0.35)',
          light: '#405A76',
        },
        slate: {
          main: '#172B43',
          muted: '#526174',
          subtle: '#526174',
        },
        emerald: {
          accent: '#28705A',
        }
      },
      fontFamily: {
        display: ['"Inter"', '"Segoe UI"', 'sans-serif'],
        heading: ['"Inter"', '"Segoe UI"', 'sans-serif'],
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"Inter"', '"Segoe UI"', 'sans-serif'],
      },
      borderColor: {
        subtle: 'rgba(148, 163, 184, 0.18)',
        'subtle-strong': 'rgba(148, 163, 184, 0.35)',
        cyan: 'rgba(36, 62, 99, 0.4)',
        violet: 'rgba(36, 62, 99, 0.4)',
      },
      boxShadow: {
        'glow-cyan': 'none',
        'glow-violet': 'none',
        'glow-subtle': 'none',
        'card-dev': '0 10px 30px -10px rgba(23, 43, 67, 0.08), 0 0 0 1px rgba(148, 163, 184, 0.12)',
        'card-dev-hover': '0 20px 40px -12px rgba(23, 43, 67, 0.10), 0 0 25px -5px rgba(36, 62, 99, 0.25)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle 800px at 70% 20%, rgba(36, 62, 99, 0.12) 0%, rgba(36, 62, 99, 0.1) 40%, rgba(11, 17, 32, 0.95) 80%)',
        'cyan-violet-gradient': 'linear-gradient(135deg, #243E63 0%, #405A76 50%, #405A76 100%)',
        'cyan-indigo-gradient': 'linear-gradient(135deg, #243E63 0%, #405A76 100%)',
        'card-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)',
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
