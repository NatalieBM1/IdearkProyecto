/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ideark: {
          // Primary Colors - Green Palette (Bangladesh Green as main)
          primary: '#4CAF50',        // Bangladesh Green (main)
          secondary: '#66BB6A',      // Light Bangladesh Green
          accent: '#388E3C',         // Dark Bangladesh Green
          
          // Dark Variants
          'primary-dark': '#388E3C',
          'secondary-dark': '#4CAF50',
          'accent-dark': '#2E7D32',
          
          // Light Variants
          'primary-light': '#66BB6A',
          'secondary-light': '#81C784',
          'accent-light': '#4CAF50',
          
          // Elegant Neutral Colors
          white: '#FFFFFF',
          'light-gray': '#F8FAFC',
          'medium-gray': '#94A3B8',
          'dark-gray': '#334155',
          'darker-gray': '#1E293B',
          'rich-black': '#0F172A',
          
          // Slate Palette for Elegance
          'slate-50': '#F8FAFC',
          'slate-100': '#F1F5F9',
          'slate-200': '#E2E8F0',
          'slate-300': '#CBD5E1',
          'slate-400': '#94A3B8',
          'slate-500': '#64748B',
          'slate-600': '#475569',
          'slate-700': '#334155',
          'slate-800': '#1E293B',
          'slate-900': '#0F172A',
          
          // Semantic Colors
          success: '#4CAF50',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
          
          // Glass Effect Colors
          'glass-bg': 'rgba(255, 255, 255, 0.25)',
          'glass-border': 'rgba(255, 255, 255, 0.18)',
        }
      },
      fontFamily: {
        'primary': ['Inter', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Georgia', 'Times New Roman', 'serif'],
      },
      borderRadius: {
        'soft': '12px',
        'modern': '20px',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'floating': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'scale-in': 'scale-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      }
    },
  },
  plugins: [],
}