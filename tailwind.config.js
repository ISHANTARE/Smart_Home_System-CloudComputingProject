/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-main': '#0B0D15',
        'bg-sidebar': '#0B0D15',
        'bg-card': '#111422',
        'bg-card-inner': '#161929',
        'bg-input': '#161929',
        'bg-hover': '#1a1d2e',
        'accent-blue': '#4F6EF7',
        'accent-cyan': '#22D3EE',
        'accent-teal': '#2DD4BF',
        'accent-purple': '#8B5CF6',
        'accent-pink': '#EC4899',
        'accent-red': '#EF4444',
        'accent-orange': '#F97316',
        'accent-amber': '#F59E0B',
        'accent-green': '#22C55E',
        'text-white': '#FFFFFF',
        'text-light': '#E2E8F0',
        'text-gray': '#94A3B8',
        'text-muted': '#64748B',
        'text-dark': '#475569',
        'border-line': '#1E2235',
        'border-light': '#262A3D',
        'tab-red': '#DC2626',
        'toggle-on': '#4F6EF7',
        'bar-dark': '#1E2235',
        'bar-active': '#4F6EF7',
        'dot-active': '#22D3EE',
        'dot-inactive': '#1E2235',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0, 0, 0, 0.2)',
        'glow-blue': '0 0 20px rgba(79, 110, 247, 0.3)',
        'glow-cyan': '0 0 12px rgba(34, 211, 238, 0.4)',
      }
    },
  },
  plugins: [],
};