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
				eDark: '#1f1f1f',
				eDarker: '#151515',
				eBlack: '#050505',
				eBase: '#242424',
				eGray: '#999',
				eMedGray: '#666',
				eDarkGray: '#333',
				eBlue: '#0078d4',
				eWhite: '#ccc',
				eRed: '#D2042D',
				eHLT: '#ffffff10', // Highlight
				eStrongHLT: '#ffffff20', // Strong highlight

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
				elBlack: '#9f9f9f',
				elRed: '#D2042D',
				elLavender: '#DBD3EB', // Sidebar Light mode Highlight
				elHLT: '#00000010', // Highlight
				elStrongHLT: '#00000020', // Strong highlight

			},
		},
	},
	plugins: [],
}

