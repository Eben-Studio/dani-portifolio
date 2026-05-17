/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        'ink-muted': 'rgb(var(--color-ink-muted) / <alpha-value>)',
        'ink-strong': 'rgb(var(--color-ink-strong) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-strong': 'rgb(var(--color-accent-strong) / <alpha-value>)',
        'accent-strong-hover': 'rgb(var(--color-accent-strong-hover) / <alpha-value>)',
        'accent-deep': 'rgb(var(--color-accent-deep) / <alpha-value>)',
        'surface-1': 'rgb(var(--color-surface-1) / <alpha-value>)',
        'surface-2': 'rgb(var(--color-surface-2) / <alpha-value>)',
        'surface-3': 'rgb(var(--color-surface-3) / <alpha-value>)',
        'surface-4': 'rgb(var(--color-surface-4) / <alpha-value>)',
        'surface-5': 'rgb(var(--color-surface-5) / <alpha-value>)',
        'surface-6': 'rgb(var(--color-surface-6) / <alpha-value>)',
        'surface-7': 'rgb(var(--color-surface-7) / <alpha-value>)',
        'surface-8': 'rgb(var(--color-surface-8) / <alpha-value>)',
        'surface-9': 'rgb(var(--color-surface-9) / <alpha-value>)',
        'deep-shadow': 'rgb(var(--color-deep-shadow) / <alpha-value>)',
        white: 'rgb(var(--color-white) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}

