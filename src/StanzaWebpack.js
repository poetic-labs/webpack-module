const appRootPath = require('app-root-dir').get();
const fs = require('fs');
const setupDependencies = require('./setup-dependencies.js');

const webpackConfigFile = appRootPath + '/webpack/webpack-config-overwrite.js';
const webpack = require('webpack');

class StanzaWebpack {
  constructor() {
    this.setDefaultConfig();

    setupDependencies('stanza-webpack', this.config);

    // Pass this.config to the extensible owner webpack config for final say
    // TODO: rename and think more about semantics of custom webpack file

    if (fs.existsSync(webpackConfigFile)) {
      const ownerConfig = require(webpackConfigFile);

      if (typeof ownerConfig.register === 'function') {
        ownerConfig.register(this.config);
      }
    }

    this.compiler = webpack(this.config);

    setupDependencies('stanza-webpack', this.compiler, 'requestCompiler');
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
