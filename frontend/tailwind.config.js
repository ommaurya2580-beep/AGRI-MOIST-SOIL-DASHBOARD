/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agri: {
          green: '#15803d', // primary dark green
          light: '#dcfce7', // light green background
          accent: '#22c55e', // active green
        },
        alert: {
          critical: '#ef4444', // red
          warning: '#f59e0b', // orange
          info: '#3b82f6', // blue
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
