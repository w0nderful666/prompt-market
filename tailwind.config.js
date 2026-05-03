export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#22c55e',
        'primary-dark': '#16a34a',
        'primary-light': '#86efac',
        'bg-main': '#f0fdf4',
        'bg-card': '#ffffff',
        'text-main': '#1f2937',
        'text-secondary': '#6b7280',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
