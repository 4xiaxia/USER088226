/** @type {import('tailwindcss').Config} */
/* ============================================
   Tailwind CSS 配置文件
   项目设计系统核心配置
   ============================================ */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui 主题颜色
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          // 项目自定义颜色
          50: '#f2fcf5',
          100: '#e1f8e8',
          500: '#2d6a4f',
          600: '#1b4332',
          700: '#081c15',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          // 项目自定义颜色
          100: '#fffbeb',
          500: '#d4a373',
          600: '#b08968',
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        brand: ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        'serif-brand': ['"Noto Serif SC"', 'serif'],
      },
      fontSize: {
        // 扩展字体大小规范
        '2xs': ['10px', { lineHeight: '14px' }],
        '3xs': ['9px', { lineHeight: '12px' }],
      },
      spacing: {
        // 扩展间距规范（基于 4px 基准）
        '4.5': '1.125rem', // 18px
        '13': '3.25rem',   // 52px
        '15': '3.75rem',   // 60px
        '18': '4.5rem',    // 72px
        '22': '5.5rem',    // 88px
        '26': '6.5rem',    // 104px
        '30': '7.5rem',    // 120px
      },
      boxShadow: {
        // 高级阴影系列
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'premium-sm': '0 2px 8px -1px rgba(0, 0, 0, 0.05)',
        'premium-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
        'premium-xl': '0 20px 40px -5px rgba(0, 0, 0, 0.15)',
        'premium-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        // 特殊阴影
        'inner-glow': 'inset 0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-emerald-lg': '0 0 40px rgba(16, 185, 129, 0.5)',
      },
      maxWidth: {
        // 内容宽度规范
        'content': '1200px',
        'narrow': '800px',
        'wide': '1400px',
      },
      zIndex: {
        // z-index 层级规范
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
      },
      transitionDuration: {
        // 扩展过渡时长
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '900': '900ms',
      },
      animation: {
        // 自定义动画
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
