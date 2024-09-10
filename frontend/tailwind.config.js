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
				// eDarkGray: '#222831',
				// eDarkGray: '#222222',
				// eGray: '#393E46',
				// eGray: '#2e3238',
				// eBlue: '#00ADB5', 1b2027
				eBlack: '#15191e',
				eDark: '#1c2229',
				// eDark: '#1b2027',
				eBase: '#222831',
				eGray: '#999',
				eBlue: '#0078d4',
				// eWhite: '#EEEEEE'
				eWhite: '#ccc'
			},
		},
	},
	plugins: [],
}

