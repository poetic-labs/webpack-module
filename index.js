// node node_modules/webpack/bin/webpack.js;

var webpack = require("webpack");

// returns a Compiler instance
var compiler = webpack({
  entry: "./index.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
});

compiler.run(function(err, stats) {
  console.log(stats || err);
});
