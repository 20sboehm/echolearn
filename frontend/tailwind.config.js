/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				userHeaderColor: '#0D79A1',
				customBlue: '#82DEFF',
			},
		},
	},
	plugins: [],
}

