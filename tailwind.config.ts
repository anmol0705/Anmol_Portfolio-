import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Terminal Luxury Palette
        obsidian: {
          DEFAULT: '#0a0a0a',
          50: '#171717',
          100: '#141414',
          200: '#0f0f0f',
          300: '#0a0a0a',
          400: '#080808',
          500: '#050505',
          600: '#030303',
          700: '#020202',
          800: '#010101',
          900: '#000000',
        },
        neon: {
          DEFAULT: '#00ff88',
          50: '#b3ffd9',
          100: '#99ffcc',
          200: '#66ffb3',
          300: '#33ff9f',
          400: '#00ff88',
          500: '#00e67a',
          600: '#00cc6d',
          700: '#00b35f',
          800: '#009952',
          900: '#008044',
        },
        cyber: {
          DEFAULT: '#ffcc00',
          50: '#fff5cc',
          100: '#ffeb99',
          200: '#ffe066',
          300: '#ffd633',
          400: '#ffcc00',
          500: '#e6b800',
          600: '#cca300',
          700: '#b38f00',
          800: '#997a00',
          900: '#806600',
        },
        matrix: {
          DEFAULT: '#003300',
          dark: '#001a00',
        },
        terminal: {
          green: '#39ff14',
          amber: '#ffb000',
          cyan: '#00ffff',
          white: '#f0f0f0',
        },
        // Shadcn compatible
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'SF Mono', 'monospace'],
        display: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'typewriter': 'typewriter 1s steps(40) infinite',
        'blink': 'blink 1s step-end infinite',
        'matrix-rain': 'matrix-rain 20s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', filter: 'brightness(1)' },
          '50%': { opacity: '1', filter: 'brightness(1.2)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'typewriter': {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'matrix-rain': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'grid-pattern': 'linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
    }
  },
  plugins: [tailwindcssAnimate],
};

export default config;
