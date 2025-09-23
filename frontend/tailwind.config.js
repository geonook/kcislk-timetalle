/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Notion風格極簡配色 - 主要使用系統灰階 + 單一強調色
        accent: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a'
        },
        // 深色模式專用色板 - 純黑OLED優化
        dark: {
          bg: '#000000',
          card: '#0a0a0a',
          hover: '#141414',
          border: '#1f1f1f',
          text: {
            primary: '#ffffff',
            secondary: '#a0a0a0',
            muted: '#666666'
          }
        },
        // 課程類型顏色編碼
        course: {
          english: '#3b82f6',
          ev: '#10b981',
          homeroom: '#8b5cf6',
          general: '#6b7280'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'Noto Sans TC', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        'notion': '6px'
      },
      boxShadow: {
        'notion': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'notion-hover': '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
        'dark': '0 1px 3px rgba(255, 255, 255, 0.05)',
        'dark-hover': '0 3px 6px rgba(255, 255, 255, 0.08)'
      },
      animation: {
        'fade': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      }
    },
  },
  plugins: [],
}