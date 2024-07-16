/** @type {import('tailwindcss').Config} */

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: 'rgb(var(--primary) / <alpha-value>)',
				'primary-dark': 'rgb(var(--primary-dark) / <alpha-value>)',
				secondary: 'rgb(var(--secondary) / <alpha-value>)',
				'secondary-dark': 'rgb(var(--secondary-dark) / <alpha-value>)'
			}
		}
	},
	plugins: []
};
