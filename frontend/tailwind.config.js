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
				eDark: '#1f1f1f',
				// eDarker: '#1a1a1a',
				eDarker: '#151515',
				// eBlack: '#050505',
				eBase: '#242424',
				eGray: '#999',
				eDarkGray: '#333',
				eBlue: '#0078d4',
				eWhite: '#ccc',
				eRed: '#D2042D',
				eHLT: '#ffffff10', // Highlight
				eStrongHLT: '#ffffff20' // Strong highlight
			},
		},
	},
	plugins: [],
}

