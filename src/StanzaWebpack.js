// TODO: CLEAN UP CODE (use consts, =>);
var appRootPath = require('app-root-dir').get();
var dynamicPlugin = require(j./dynamicPlugin.js");
var fs = require("fs");
var path = require('path');
var pkgConf = require('pkg-conf');
var webpackConfigFile = appRootPath + '/webpack/webpack.config.js';
var webpack = require("webpack");
var EventEmitter = require('events');
var compileEventEmitter = new EventEmitter();

compileEventEmitter.on('after-compile', function() {
  console.log('done');
});

class StanzaWebpack {
  constructor() {
    this.setDefaultConfig();

    // TODO require plugins/loaders
    //
    // find from node modules then require and pass webpackModule

    var devDependencies = pkgConf.sync('devDependencies');

    Object.keys(devDependencies).forEach(function (dependency) {
      try {
        const dependencyPath = resolve.sync(dependency, { basedir: appRootPath });
        const dependencyPackageJsonPath = findUp.sync('package.json', { cwd: dependencyPath });
        const dependencyPackageJson = require(dependencyPackageJsonPath);
        const keywords = dependencyPackageJson.keywords || [];

        if (keywords.includes('stanza-webpack')) {
          const extensionPath = path.dirname(dependencyPackageJsonPath);
          const extension = require(extensionPath);

          if (typeof extension.register === 'function') {
            extension.register(this.config, compileEventEmitter);
          }
        }
      } catch (error) {
        // TODO: Add logging
        return false;
      }
    });

    //TODO: Pass this.config to the extensible owner webpack config for final
    //say

    // if (fs.existsSync(webpackConfigFile)) {
      // var ownerConfig = require(webpackConfigFile);
      // ownerConfig.register(this.config);
    // }

    this.bundle();
  }

  //TODO: Create a config constructor that builds webpack client/server configs
  setDefaultConfig() {
    this.config = {
      entry: './index.js',
      output: './bundle.js',
      plugins: [],

      module: {
        loaders: [],
      }
    }
  }

  bundle() {
    this.config.plugins.push(new dynamicPlugin(compileEventEmitter));

    // construct compiler
    this.compiler = webpack(this.config);

    this.compiler.run(function(err, stats) {
      if (err) {
         console.log(err);
      }
      console.log('compiling');
    });
  }
};

module.exports = new StanzaWebpack();
