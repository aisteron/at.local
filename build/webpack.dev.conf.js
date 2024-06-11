const webpack =  require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const fs = require('fs')
const devWebpackConfig = merge(baseWebpackConfig, {
  // DEV config
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.dist,
    port: 7071,
    host: '0.0.0.0',
    overlay: {
      warnings: true,
      errors: true
    },
		setup(app){
      var bodyParser = require('body-parser');    
      app.use(bodyParser.urlencoded({extended : true}));
      app.use(bodyParser.json());
      
      app.post('/api', (req, res) => {

					if(req.body.action == 'callback'){
						const data = fs.readFileSync('./src/static/api/zayavka.json', 'utf8')
						res.send(data)
					}	
      });
    }
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig)
})
