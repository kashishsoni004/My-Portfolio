/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // UX/Product portfolio palette
        brand: {
          400: '#0D9488', // Teal
          500: '#0D9488',
          600: '#0F766E',
        },
        charcoal: '#1E293B', // Dark Slate
        coolGray: '#64748B', // Neutral Gray
        offWhite: '#FAFAFA', // Soft White
      },
    },
  },
  plugins: [],
}

