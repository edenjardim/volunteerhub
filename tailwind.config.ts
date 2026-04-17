import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        primary:   { DEFAULT: '#0F172A', foreground: '#FFFFFF' },
        secondary: { DEFAULT: '#2563EB', foreground: '#FFFFFF' },
        accent:    { DEFAULT: '#7C3AED', foreground: '#FFFFFF' },
        success:   { DEFAULT: '#16A34A', foreground: '#FFFFFF' },
        danger:    { DEFAULT: '#DC2626', foreground: '#FFFFFF' },
        warning:   { DEFAULT: '#F59E0B', foreground: '#FFFFFF' },
        surface:   '#FFFFFF',
        border:    '#E2E8F0',
        muted:     '#64748B',
      },
      borderRadius: { DEFAULT: '8px', lg: '12px', xl: '16px' },
      boxShadow: {
        card:   '0 1px 3px rgba(0,0,0,0.04)',
        hover:  '0 4px 16px rgba(0,0,0,0.08)',
        modal:  '0 20px 60px rgba(0,0,0,0.2)',
        glow:   '0 0 0 3px rgba(37,99,235,0.12)',
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease',
        'slide-up':   'slideUp 0.3s ease',
        'slide-in':   'slideIn 0.3s ease',
        'spin-slow':  'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' },              to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(8px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideIn: { from: { transform: 'translateX(-8px)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}

export default config
