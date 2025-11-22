/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#1a1a1a',
                surface: '#2a2a2a',
                primary: '#00ff00', // Neon Green
                danger: '#ff0000', // Neon Red
                info: '#00ccff', // Neon Blue
            },
            fontFamily: {
                mono: ['JetBrains Mono', 'monospace'],
            }
        },
    },
    plugins: [],
}
