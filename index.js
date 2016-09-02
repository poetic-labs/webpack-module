// node node_modules/webpack/bin/webpack.js;

var fs = require("fs");
var path = require("path");
var webpack = require("webpack");
var appRootDir = require('app-root-dir').get();

// TODO write webpack config in webpack folder

var webpackDir = appRootDir + '/webpack/';
var webpackConfigFile = appRootDir + '/webpack/webpack.config.js';

if (!fs.existsSync(webpackDir)) {
  fs.mkdirSync(appRootDir + '/webpack/');
}

if (!fs.existsSync(webpackConfigFile)) {
  var webpackConfig = "module.exports = {\n  entry: './index.js',\n  output: './bundle.js',\n};"

  fs.appendFileSync(appRootDir + '/webpack/webpack.config.js', webpackConfig);
}

// TODO read config when running webpack

var config = require(webpackConfigFile);

// TODO expose webpack and a webpack compile function

function build() {
  // returns a Compiler instance
  var compiler = webpack(config);

  compiler.run(function(err, stats) {
    if (err) {
       console.log(err);
    }
    console.log(stats);
  });
};

build();
