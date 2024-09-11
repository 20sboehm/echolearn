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
				featureBackground: '#33A1FD',
				eBlack: '#1a1a1a',
				eDark: '#1f1f1f',
				eBase: '#242424',
				eGray: '#999',
				eDarkGray: '#333',
				eBlue: '#0078d4',
				eWhite: '#ccc',
				eHighlight: '#ffffff10'
			},
		},
	},
	plugins: [],
}

