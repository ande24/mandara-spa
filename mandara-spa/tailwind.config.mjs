export default {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        backgroundImage: {
          "mandara-gradient": "linear-gradient(to bottom, #4C1D1D, #2D0E0E)", 
        },
        colors: {
          'dark-brown': '#301414',
          'light-brown': '#502424',
          'light-yellow': '#e0d8ad'
        },
        fontFamily: {
          pt_sans: ['var(--font-pt_sans)', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };