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

/** @type WebpackConfig */
const browserLanguageServerConfig = {
	context: path.join(__dirname, 'language-server'),
	mode: 'development',
	target: 'webworker',
	entry: {
		browserMain: './src/browser/main.ts',
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, 'language-server', 'dist'),
		libraryTarget: 'var',
		library: 'languageServerExportVar',
	},
	resolve: {
		mainFields: ['module', 'main'],
		extensions: ['.ts', '.js'],
		alias: {},
		fallback: {
			fs: false,
			http: false,
			https: false,
			module: false,
			path: require.resolve("path-browserify"),
			stream: false,
			url: false,
			zlib: false
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
					}
				]
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"]
			}
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

module.exports = [browserExtensionConfig, browserLanguageServerConfig];
