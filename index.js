// node node_modules/webpack/bin/webpack.js;

var path = require("path");
var webpack = require("webpack");

function build() {

  // returns a Compiler instance
  var compiler = webpack({
      entry: {
        src: './src/'
      },
      output: {
        filename: 'bundle.js'
      }
  });

  compiler.run(function(err, stats) {
    if (err) {
       console.log(err);
    }
    console.log(stats);
  });
};

build();
