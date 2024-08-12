const fs = require('fs')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const Critical = require('critical-css-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin')

const PAGES_DIR = `${baseWebpackConfig.externals.paths.src}/pug/pages/`
let PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

PAGES = PAGES.map(el=>el.replace(".pug", ""))

const buildWebpackConfig = merge(baseWebpackConfig, {
  // BUILD config
  mode: 'production',
  plugins: [

		new CleanWebpackPlugin(),
		
		...PAGES.map(page => {
			return new Critical({
				base: baseWebpackConfig.externals.paths.dist,
				src: `./${page}.html`,
				target: { css: baseWebpackConfig.externals.paths.dist+`/assets/css/${page}.crit.css`},
				inline: false,
				extract: true,
				width: 393,
				height: 873,
				})
			}
		),

		new WebpackShellPlugin({
     onBuildStart:['echo • start deploy on at.ashaev.by'], 
     onBuildEnd:['bash deploy/start.sh']})
	]
})

module.exports = new Promise((resolve, reject) => {
  resolve(buildWebpackConfig)
})
