/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: 'class',
	theme: {
		extend: {
			// fontFamily: {
			// 	sans: ['Segoe UI', 'sans-serif'],
			// },
			colors: {
				userHeaderColor: '#0D79A1',
				customBlue: '#82DEFF',
				featureBackground: '#33A1FD',

				// Dark mode colors (ed = Echolearn dark)
				edBase: '#242424', // check
				edDark: '#1f1f1f', // check
				edDarker: '#151515', // check
				edGray: '#999',
				edLightGray: '#C1C6C8',
				edMedGray: '#666',
				edDarkGray: '#333', // check
				edDividerGray: '#393939',
				edWhite: '#ccc',
				edBlue: '#0078d4',
				edDarkBlue: '#004880',
				edSoftBlue: '#407196',
				edLightBlue: '#33a7ff',
				edRed: '#D2042D',
				edDarkRed: '#af0426',
				edGreen: '#009355',
				edDarkGreen: '#00663c',
				edHLT: '#ffffff10', // Highlight
				edStrongHLT: '#ffffff20', // Strong highlight

				// Light mode colors (el = Echolearn light)
				elBase: '#ffffff',
				elCloudWhite: '#f7f7f7',
				elDark: '#3f3f3f',
				elBlue: '#0078d4',
				elLightBlue: '#0082e6',
				elSkyBlue: '#87CEEB',
				elGray: '#eee',  // also use for light mode card and editor back ground <- note for easy to find if need change
				elLightGray: '#e5e5e5',
				elMedGray: '#999',
				elDarkGray: '#374151', // bg-gray-700
				elDividerGray: '#ccc',
				elBlack: '#9f9f9f',
				elLavender: '#DBD3EB', // Sidebar Light mode Highlight
				elHLT: '#00000010', // Highlight
				elStrongHLT: '#00000020', // Strong highlight
			},
		},
	},
	plugins: [],
}