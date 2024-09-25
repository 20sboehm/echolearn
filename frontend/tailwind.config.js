/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				userHeaderColor: '#0D79A1',
				customBlue: '#82DEFF',
				featureBackground: '#33A1FD',

				// Dark mode colors (ed = Echolearn dark)
				edBase: '#242424', // check
				edDark: '#1f1f1f', // check
				edDarker: '#151515', // check
				edGray: '#999',
				edMedGray: '#666',
				edDarkGray: '#333', // check
				edWhite: '#ccc',
				edBlue: '#0078d4',
				edRed: '#D2042D',
				edHLT: '#ffffff10', // Highlight
				edStrongHLT: '#ffffff20', // Strong highlight

				// Light mode colors (el = Echolearn light)
				elBase: '#ffffff',
				elCloudWhite: '#f7f7f7',
				elDark: '#3f3f3f',
				elBlue: '#0078d4',
				elLightBlue: '#0082e6',
				elGray: '#eee',
				elMedGray: '#999',
				elDarkGray: '#666',
				elBlack: '#000000',
				elRed: '#D2042D',
				elHLT: '#00000010', // Highlight
				elStrongHLT: '#00000020', // Strong highlight
			},
		},
	},
	plugins: [],
}

