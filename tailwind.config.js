/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Branding Palette dari project sebelumnya (D:\Cakrawala_UMJ)
        brand: {
          dark: '#350E08',       // Dark Brown
          chocolate: '#572106',  // Chocolate
          walnut: '#6B3D22',     // Walnut
          caramel: '#A98666',    // Caramel
          cream: '#FDFBF7',      // Soft warm background
          sand: '#F5EFE6',       // Muted warm card
          accent: '#C49A6C',     // Accent gold/caramel
        },
        // Branding Palette BAPEMA Cakrawala UMJ (PRD)
        cakrawala: {
          espresso: "#442013", // Latar utama / koran klasik
          chestnut: "#6A3822", // Aksen gradasi / border kartu
          white: "#FFFFFF",    // Sorotan pilar & swipe button
          cream: "#F4E7D3",    // Heading & logo Cakrawala
          ivory: "#E5D5C2",    // Efek cahaya & divider
          dark: "#2A130B",     // Deep dark background
          lightBg: "#FAF6F0",  // Background admin panel yang nyaman di mata
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "'Montserrat'", 'sans-serif'],
        heading: ["'Friz Quadrata'", "Georgia", "serif"],
        subheading: ["'Montserrat'", "sans-serif"],
        body: ["'Gotham'", "'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
