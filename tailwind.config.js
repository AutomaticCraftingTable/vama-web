const plugin = require('tailwindcss/plugin')

module.exports = {
    theme: {
        extend: {
            colors: {
                'red': '#ff0000',
                'primary': 'rgb(var(--light-primary))',
                'secondary': 'rgb(var(--light-secondary))',
                'text-light':'rgb(var(--light-text-light))',
                'text-dark':'rgb(var(--light-text-dark))',
                'background':'rgb(var(--light-background))',
                'accent':'rgb(var(--light-accent))',
                'text-secondary':'rgb(var(--light-text-secondary))'
            }
        }
    },
    content: ["./resources/**/*.js", "./resources/**/*.vue",],
    plugins: [plugin(function ({addComponents, addVariant, addBase}) {
        addBase({
            ':root': {
                '--light-primary': '74 195 206',
                '--light-secondary': '237 237 237',
                '--light-text-light': '255 255 255',
                '--light-text-dark': '0 0 0',
                '--light-background': '255 255 255',
                '--light-accent': '2 176 192',
                '--light-text-secondary': '128 128 128'
            },
        });
    }),],
}