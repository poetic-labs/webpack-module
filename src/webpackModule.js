var appRootDir = require('app-root-dir').get();
var fs = require("fs");
var webpackConfigFile = appRootDir + '/webpack/webpack.config.js';
var webpack = require("webpack");
var dynamicPlugin = require("./dynamicPlugin.js");

console.log(dynamicPlugin.prototype.apply);
var webpackModule = {
  bundle: function() {
    var config = {
      entry: './index.js',
      output: './bundle.js',
      plugins: [
        new dynamicPlugin({options: 'nada'})
      ]
    };

    if (fs.existsSync(webpackConfigFile)) {
      config = require(webpackConfigFile);
    }

    var compiler = webpack(config);

    compiler.run(function(err, stats) {
      if (err) {
         console.log(err);
      }
      console.log('compiling');
    });
  },
  webpack: webpack,

  //TODO webpack plugin
};

module.exports = webpackModule;
