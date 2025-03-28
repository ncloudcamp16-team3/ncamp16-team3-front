/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                "brand-1": "#FFF7EF",
                "brand-2": "#F2DFCE",
                "brand-3": "#E9A260",
                "brand-4": "#363636",
                "brand-5": "#FDF1E5",
            },
        },
    },
    plugins: [],
};
