import {defineConfig} from 'vite';
import {materialShell} from 'material-shell/vite.js';
import {materialAll} from 'rollup-plugin-material-all';
import {mdicon2svg} from 'vite-plugin-mdicon2svg';
// import minifyLiterals from 'rollup-plugin-minify-template-literals';
// import {minifyHtml} from '@vdegenne/rollup-plugin-minify-html';
// import {viteSingleFile} from 'vite-plugin-singlefile';
// import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig({
	// base: './',
	resolve: {
		// preserveSymlinks: true,
	},
	server: {
		// proxy: {'/api': 'http://localhost:45085'},
	},
	build: {
		// outDir: 'docs',
		// emptyOutDir: false,
		// assetsInlineLimit: 6000,
		// rollupOptions: {
		// 	input: {
		// 		index: pathlib.resolve(__dirname, 'index.html'),
		// 		print: pathlib.resolve(__dirname, 'print/index.html'),
		// 	},
		// },
	},
	esbuild: {
		legalComments: 'none',
	},
	plugins: [
		// inject shell scripts in header
		materialShell({
			// pathToDefaultMaterialStyleSheet: './src/styles/stylesheets/material.css',
		}),
		materialAll(),
		mdicon2svg({
			variant: 'rounded',
			include: [
				'src/**/*.ts',
				// 'node_modules/@vdegenne/material-color-helpers/lib/elements/**/*.js',
			],
		}),

		/* DEV */
		// vscodeUiConnectorPlugin({
		// 	ignoredShadowDoms: ['color-picker', 'color-mode-picker'],
		// 	debug: true,
		// }),

		process.env.NODE_ENV === 'production'
			? [
					// minifyLiterals(),
					// minifyHtml(),
					// viteSingleFile({
					// 	useRecommendedBuildConfig: false,
					// }),
				]
			: [],

		// VitePWA({
		// 	registerType: 'autoUpdate',
		// 	includeAssets: ['*.{png,ico}', 'Roboto/**/*'],
		// 	manifest: {
		// 		icons: [
		// 			{
		// 				src: 'pwa-64x64.png',
		// 				sizes: '64x64',
		// 				type: 'image/png',
		// 			},
		// 			{
		// 				src: 'pwa-192x192.png',
		// 				sizes: '192x192',
		// 				type: 'image/png',
		// 			},
		// 			{
		// 				src: 'pwa-512x512.png',
		// 				sizes: '512x512',
		// 				type: 'image/png',
		// 				purpose: 'any',
		// 			},
		// 			{
		// 				src: 'maskable-icon-512x512.png',
		// 				sizes: '512x512',
		// 				type: 'image/png',
		// 				purpose: 'maskable',
		// 			},
		// 		],
		// 	},
		// }),
	],
});
