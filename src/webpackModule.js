var appRootDir = require('app-root-dir').get();
var fs = require("fs");
var webpackConfigFile = appRootDir + '/webpack/webpack.config.js';
var webpack = require("webpack");
var dynamicPlugin = require("./dynamicPlugin.js");

// TODO require plugins/loaders
//
// find from node modules then require and pass webpackModule

var webpackModule = {
  bundle: function() {
    this.plugins.push({ plugin: dynamicPlugin })

    var plugins =  this.plugins.map(function(pluginObject) {
                     return new pluginObject.plugin();
                   });

    console.log(plugins);

    var loaders = this.loaders;

    var config = {
      entry: './index.js',
      output: './bundle.js',
      plugins,
      module: {
        loaders,
      }
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

  loaders: [],

  plugins: [],

  register: function(child) {
    // child should be an object

    if (typeof child !== object) {
      throw new Error('A registering child must be an object.');
    }

    if (child.loader || child.loaders) {
      // example loader child = { loader: 'babel', test: /\.js?$/ }
      this.loaders.push(child);

    } else if (child.plugin) {
      // example plugin child = { plugin: dynamicPlugin, args: ['hello'] }
      this.plugins.push(child);

    } else {
      throw new Error('A registering child must declare a plugin, loader, or loaders property.');
    }
  },

  webpack: webpack,

  //TODO webpack plugin hook
};

module.exports = webpackModule;
