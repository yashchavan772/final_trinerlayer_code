/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)', // Deep space foundation
          foreground: 'var(--color-primary-foreground)' // gray-200
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // gray-900
          foreground: 'var(--color-secondary-foreground)' // gray-400
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // Electric cyan
          foreground: 'var(--color-accent-foreground)', // Deep space
          blue: 'var(--color-accent-blue)', // Electric cyan
          'blue-foreground': 'var(--color-accent-blue-foreground)', // Deep space
          green: 'var(--color-accent-green)', // Neon green
          'green-foreground': 'var(--color-accent-green-foreground)' // Deep space
        },
        background: 'var(--color-background)', // Primary canvas
        foreground: 'var(--color-foreground)', // gray-50
        surface: {
          DEFAULT: 'var(--color-surface)', // Card backgrounds
          foreground: 'var(--color-surface-foreground)' // gray-200
        },
        card: {
          DEFAULT: 'var(--color-card)', // gray-900
          foreground: 'var(--color-card-foreground)' // gray-200
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // gray-900
          foreground: 'var(--color-popover-foreground)' // gray-200
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // gray-800
          foreground: 'var(--color-muted-foreground)' // gray-500
        },
        border: 'var(--color-border)', // Electric cyan with opacity
        input: 'var(--color-input)', // gray-900
        ring: 'var(--color-ring)', // Electric cyan
        success: {
          DEFAULT: 'var(--color-success)', // Neon green
          foreground: 'var(--color-success-foreground)' // Deep space
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // gold
          foreground: 'var(--color-warning-foreground)' // Deep space
        },
        error: {
          DEFAULT: 'var(--color-error)', // red-500
          foreground: 'var(--color-error-foreground)' // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-500
          foreground: 'var(--color-destructive-foreground)' // white
        },
        text: {
          primary: 'var(--color-text-primary)', // gray-50
          secondary: 'var(--color-text-secondary)' // gray-500
        }
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)'
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        code: ['Fira Code', 'monospace'],
        mono: ['Fira Code', 'monospace']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      },
      boxShadow: {
        'glow-sm': '0 0 2px rgba(0, 234, 255, 0.3)',
        'glow-md': '0 0 4px rgba(0, 234, 255, 0.3)',
        'glow-lg': '0 0 8px rgba(0, 234, 255, 0.3)',
        'glow-xl': '0 0 16px rgba(0, 234, 255, 0.3)'
      },
      transitionTimingFunction: {
        'cyber': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      },
      animation: {
        'blink': 'blink 1s infinite'
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' }
        }
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animate')
  ]
}