/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
const { createThemes } = require('tw-colors');
const colors = require('tailwindcss/colors');

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: [
		createThemes({
			blue: {
				primary: colors.blue[900],
				'primary-dark': colors.blue[950],
				secondary: colors.orange[500],
				'secondary-dark': colors.orange[600]
			},
			purple: {
				primary: colors.purple[800],
				'primary-dark': colors.purple[900],
				secondary: colors.orange[500],
				'secondary-dark': colors.orange[600]
			},
			teal: {
				primary: colors.teal[600],
				'primary-dark': colors.teal[700],
				secondary: colors.orange[500],
				'secondary-dark': colors.orange[600]
			},
			amber: {
				primary: colors.amber[600],
				'primary-dark': colors.amber[700],
				secondary: colors.blue[600],
				'secondary-dark': colors.blue[700]
			},
			yellow: {
				primary: colors.yellow[500],
				'primary-dark': colors.yellow[600],
				secondary: colors.purple[600],
				'secondary-dark': colors.purple[700]
			},
			pink: {
				primary: colors.pink[700],
				'primary-dark': colors.pink[800],
				secondary: colors.lime[500],
				'secondary-dark': colors.lime[600]
			}
		})
	]
};
