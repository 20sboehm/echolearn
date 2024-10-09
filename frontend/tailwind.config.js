/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			// fontFamily: {
			// 	sans: ['Segoe UI', 'sans-serif'],
			// },
			colors: {
				userHeaderColor: '#0D79A1',
				customBlue: '#82DEFF',
				featureBackground: '#33A1FD',
				eDark: '#1f1f1f',
				eDarker: '#151515',
				eBlack: '#050505',
				eBase: '#242424',
				eGray: '#999',
				eMedGray: '#666',
				eDarkGray: '#333',
				eBlue: '#0065b3',
				eLightBlue: '#0082e6',
				eGreen: '#009355',
				eWhite: '#ccc',
				eRed: '#a2042d',
				eHLT: '#ffffff10', // Highlight
				eStrongHLT: '#ffffff20' // Strong highlight
			},
		},
	},
	plugins: [],
}