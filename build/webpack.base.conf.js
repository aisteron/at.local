const path = require('path')
const fs = require('fs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const Critical = require('critical-css-webpack-plugin')

// Main const
// see more: https://github.com/vedees/webpack-template/blob/master/README.md#main-const
const PATHS = {
	src: path.join(__dirname, '../src'),
	dist: path.join(__dirname, '../dist'),
	assets: 'assets/'
}

// Pages const for HtmlWebpackPlugin
// see more: https://github.com/vedees/webpack-template/blob/master/README.md#html-dir-folder
// const PAGES_DIR = PATHS.src
const PAGES_DIR = `${PATHS.src}/pug/pages/`
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
	// BASE config
	externals: {
		paths: PATHS
	},
	entry: {
		app: PATHS.src,
		sms: `${PATHS.src}/sms.jsx`,
		orders: `${PATHS.src}/orders.jsx`,
	},
	output: {
		filename: `${PATHS.assets}js/[name].[hash].js`,
		path: PATHS.dist,
		publicPath: '/'
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					name: 'vendors',
					test: /node_modules/,
					chunks: 'all',
					enforce: true
				}
			}
		}
	},
	module: {
		rules: [{
			test: /\.pug$/,
			oneOf: [
				// this applies to <template lang="pug"> in Vue components
				{
					resourceQuery: /^\?vue/,
					use:
						[{
							loader: 'pug-plain-loader',
							options: { pretty: true }
						}]
				},
				// this applies to pug imports inside JavaScript
				{
					use:
						[{
							loader: 'pug-loader',
							options: { pretty: true }
						}]
				}

			]
		}, {
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: '/node_modules/'
		},
		{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: [
				{
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-react']
					}
				}
			],
		},
		{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				loader: {
					scss: 'vue-style-loader!css-loader!sass-loader'
				}
			}
		}, {
			test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
			loader: 'file-loader',
			options: {
				name: '[name].[ext]'
			}
		}, {
			test: /\.(png|jpg|gif|svg)$/,
			loader: 'file-loader',
			options: {
				name: '[name].[ext]'
			}
		}, {
			//test: /\.scss$/,
			test: /\.(sass|scss)$/,
			use: [
				'style-loader',
				MiniCssExtractPlugin.loader,
				{
					loader: 'css-loader',
					options: { sourceMap: true }
				}, {
					loader: 'postcss-loader',
					options: { sourceMap: true, config: { path: `./postcss.config.js` } }
				}, {
					loader: 'sass-loader',
					options: { sourceMap: true }
				}
			]
		}, {
			test: /\.css$/,
			use: [
				'style-loader',
				MiniCssExtractPlugin.loader,
				{
					loader: 'css-loader',
					options: { sourceMap: true }
				}, {
					loader: 'postcss-loader',
					options: { sourceMap: true, config: { path: `./postcss.config.js` } }
				}
			]
		}]
	},
	resolve: {
		alias: {
			'~': PATHS.src,
			'vue$': 'vue/dist/vue.js',
		}
	},
	plugins: [
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: `${PATHS.assets}css/[name].[hash].css`,
		}),
		new CopyWebpackPlugin([
			{ from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
			{ from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
			{ from: `${PATHS.src}/static`, to: '' },
		]),

		// Automatic creation any html pages (Don't forget to RERUN dev server)
		// see more: https://github.com/vedees/webpack-template/blob/master/README.md#create-another-html-files
		// best way to create pages: https://github.com/vedees/webpack-template/blob/master/README.md#third-method-best
		...PAGES.map(page => {
			return new HtmlWebpackPlugin({
				template: `${PAGES_DIR}/${page}`,
				filename: `./${page.replace(/\.pug/, '.html')}`
			})
		}
		),

		// ...PAGES.map(page => 
		// 	{
		// 		let filename = page.replace(/\.pug/,'')

		// 	return new Critical({
		// 		base: PATHS.dist,
		// 		src: `./${filename}.html`,
		// 		target: { css: PATHS.dist+`/assets/css/${filename}.crit.css`},
		// 		inline: false,
		// 		extract: true,
		// 		width: 393,
		// 		height: 873,
		//   	})
		// 	}
		// ),


	],

}
