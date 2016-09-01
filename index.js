// node node_modules/webpack/bin/webpack.js;

var path = require("path");
var webpack = require("webpack");

var PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
};

// returns a Compiler instance
var compiler = webpack({
    entry: {
      src: PATHS.src
    },
    output: {
      path: PATHS.build,
      filename: 'bundle.js'
    }
});

compiler.run(function(err, stats) {
  if (err) {
     console.log(err);
  }
});
