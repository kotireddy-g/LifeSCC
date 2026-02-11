/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: '#8B5CF6',
                secondary: '#EC4899',
                accent: '#06B6D4'
            }
        }
    },
    plugins: []
};
