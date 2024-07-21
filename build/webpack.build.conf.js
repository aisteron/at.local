const fs = require('fs')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const Critical = require('critical-css-webpack-plugin')

const PAGES_DIR = `${baseWebpackConfig.externals.paths.src}/pug/pages/`
let PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

PAGES = PAGES.map(el=>el.replace(".pug", ""))

const buildWebpackConfig = merge(baseWebpackConfig, {
  // BUILD config
  mode: 'production',
  plugins: [

			...PAGES.map(page => {
				
				//let filename = page.replace(/\.pug/,'')
				
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
	]
})

module.exports = new Promise((resolve, reject) => {
  resolve(buildWebpackConfig)
})
