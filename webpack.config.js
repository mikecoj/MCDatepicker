const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
	console.log(env);
	let entry = env.prod ? './src/js/mc-calendar.js' : './sandbox/index.js';
	// env.prod ? entry : (entry = ['./demo/index.js', './src/css/mc-calendar.css', './demo/style.css']);
	const outputFilename = env.prod ? 'mc-calendar.min' : 'bundle';
	return {
		mode: env.prod ? 'production' : 'development',
		target: 'web',
		entry: entry,
		output: env.prod
			? {
					path: path.resolve(__dirname, 'dist'),
					library: 'MCDatepicker',
					libraryExport: 'default',
					libraryTarget: 'umd',
					filename: `${outputFilename}.js`,
					publicPath: ''
			  }
			: {},
		devServer: {
			open: true,
			disableHostCheck: true,
			contentBase: path.resolve(__dirname, './sandbox'),
			port: 9000,
			public: 'http://localhost:9000'
		},
		module: {
			rules: [
				{
					test: /\.s?css$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								postcssOptions: {
									plugins: [
										[
											'autoprefixer',
											{
												// Options
											}
										]
									]
								}
							}
						},
						'sass-loader'
					]
				},
				// {
				// 	test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|)$/i,
				// 	use: 'file-loader'
				// },
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: ['babel-loader']
				}
			]
		},
		optimization: {
			minimize: !!env.prod,
			minimizer: [
				new CssMinimizerPlugin(),
				new TerserPlugin({
					extractComments: true,
					// cache: true, // https://goo.gl/QVWRtq
					parallel: true, //https://goo.gl/hUkvnK
					terserOptions: {
						// https://goo.gl/y3psR1
						ecma: 5,
						parse: {
							html5_comments: false
						},
						format: {
							comments: false
						}
					}
				})
			]
		},
		plugins: [
			// new HtmlWebpackPlugin({
			// 	template: './src/template.html'
			// }),
			new MiniCssExtractPlugin({
				filename: `${outputFilename}.css`
			}),
			!env.prod &&
				new HtmlWebpackPlugin({
					template: path.resolve(__dirname, 'sandbox/template.html'),
					title: 'Datepicker Sandbox'
				}),
			new CleanWebpackPlugin()
		].filter(Boolean)
	};
};
