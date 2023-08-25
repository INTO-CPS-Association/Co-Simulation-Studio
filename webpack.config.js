/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

//@ts-check
'use strict';

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require('path');

/** @type WebpackConfig */
const browserExtensionConfig = {
	context: path.join(__dirname, 'extension'),
	mode: 'development',
	target: 'webworker',
	entry: {
		browserMain: './src/browser/main.ts',
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, 'extension', 'dist'),
		libraryTarget: 'commonjs',
	},
	resolve: {
		mainFields: ['module', 'main'],
		extensions: ['.ts', '.js'],
		alias: {},
		fallback: {
			path: require.resolve("path-browserify"),
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
		],
	},
	externals: {
		vscode: 'commonjs vscode',
	},
	performance: {
		hints: false,
	},
	devtool: 'source-map',
};

module.exports = [browserExtensionConfig];
