const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = merge(common, {
// 	mode: 'development',
// 	output: {
// 		path: path.resolve(__dirname, 'dist'),
// 		filename: 'mc-calendar.js'
// 	},
// 	// optimization: {
// 	// 	splitChunks: {
// 	// 		cacheGroups: {
// 	// 			calendar: {
// 	// 				name: 'mc-calendar',
// 	// 				test: /mc-calendar\.s?css$/,
// 	// 				chunks: 'all',
// 	// 				enforce: true
// 	// 			}
// 	// 		}
// 	// 	}
// 	// },
// 	plugins: [
// 		new HtmlWebpackPlugin({
// 			template: './src/template.html'
// 		}),
// 		new MiniCssExtractPlugin({ chunkFilename: '[id].min.css' }),
// 		new CleanWebpackPlugin()
// 	],
// 	module: {
// 		rules: [
// 			{
// 				test: /\.css$/,
// 				use: [MiniCssExtractPlugin.loader, 'css-loader']
// 			}
// 			// {
// 			// 	test: /\.js$/,
// 			// 	exclude: /node_modules/,
// 			// 	use: ['babel-loader']
// 			// }
// 		]
// 	},
// 	devtool: 'inline-source-map'
// });
