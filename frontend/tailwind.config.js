/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        cherry: '#D2042D',
        bone: '#FAFAFA'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Manrope', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
