const appRootPath = require('app-root-dir').get();
const compileEventPlugin = require('./compileEventPlugin.js');
const findUp = require('find-up');
const fs = require('fs');
const path = require('path');
const pkgConf = require('pkg-conf');
const resolve = require('resolve');

const webpackConfigFile = appRootPath + '/webpack/webpack.config.js';
const webpack = require('webpack');

const EventEmitter = require('events');
const compileEventEmitter = new EventEmitter();

// how to hook into the event emitter
// compileEventEmitter.on('after-compile', function() {
  // console.log('done');
// });

class StanzaWebpack {
  constructor() {
    this.setDefaultConfig();

    // TODO update dynamic require code with new code from Kristy

    const devDependencies = pkgConf.sync('devDependencies');

    Object.keys(devDependencies).forEach(dependency => {
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
        // TODO: Add better error handling
        console.log(error);

        return false;
      }
    });

    //TODO: Pass this.config to the extensible owner webpack config for final
    //say

    // if (fs.existsSync(webpackConfigFile)) {
      // const ownerConfig = require(webpackConfigFile);
      // ownerConfig.register(this.config, compileEventEmitter);
    // }

    // add compile event loop plugin
    this.config.plugins.push(new compileEventPlugin(compileEventEmitter));
    this.compiler = webpack(this.config);
  }

  //TODO: Create a config constructor that builds webpack client/server configs
  setDefaultConfig() {
    this.config = {
      entry: './index.js',
      output: {
        filename: 'bundle.js'
      },
      plugins: [],
      module: {
        loaders: [],
      }
    }
  }

  bundle() {
    this.compiler.run((err, stats) => {
      if (err) console.log(err);

      console.log('compiling');
    });
  }

  bundleAndWatch() {
    this.watcher = this.compiler.watch({}, (err, stats) => {
      if (err) console.log(err);

      console.log('compiling');
    });
  }
};

module.exports = new StanzaWebpack();
