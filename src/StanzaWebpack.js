const appRootPath = require('app-root-dir').get();
const fs = require('fs');
const setupDependencies = require('./setup-dependencies.js');

const webpackConfigFile = appRootPath + '/webpack/webpack-config-overwrite.js';
const webpack = require('webpack');

class StanzaWebpack {
  constructor() {
    // assume stanza will declare the environment
    const environment = process.env.NODE_ENV;

    this.setupConfigs(environment);

    setupDependencies('stanza-webpack', this);

    // TODO: rename and think more about semantics of custom webpack file
    // Pass webpack to the extensible owner webpack config file for final say
    if (fs.existsSync(webpackConfigFile)) {
      const ownerConfig = require(webpackConfigFile);

      if (typeof ownerConfig.register === 'function') {
        ownerConfig.register(this);
      }
    }

    this.setupCompilers();

    // TODO: sync with JR about this request
    setupDependencies('stanza-webpack', this, 'requestCompiler');
  }

  setupCompilers() {
    this.clientCompiler = webpack(this.clientConfig);
    this.serverCompiler = webpack(this.serverConfig);
  }

  setupConfigs(environment) {
    const isProd = environment === 'production';

    this.serverConfig = {
      target: 'node',
      entry: './server/index.js',
      output: {
        filename: 'build/serverBundle.js'
      },
      plugins: [],
      module: {
        loaders: [],
      }
    }

    this.clientConfig = {
      target: 'web',
      entry: './client/index.js',
      output: {
        filename: 'build/clientBundle.js'
      },
      plugins: [],
      module: {
        loaders: [],
      }
    }
  }

  bundle(target) {
    // defaults to bundling both compilers
    let targetCompilers = ['client', 'server'];

    if (target) targetCompilers = [target];

    if (targetCompilers.includes('client')) {
      this.clientCompiler.run((err, stats) => {
        if (err) console.log(err);

        console.log('bundling server');
      });
    }

    if (targetCompilers.includes('server')) {
      this.serverCompiler.run((err, stats) => {
        if (err) console.log(err);

        console.log('bundling server');
      });
    }
  }

  bundleAndWatch(target) {
    // defaults to watching and bundling both compilers
    let targetCompilers = ['client', 'server'];

    if (target) targetCompilers = [target];

    if (targetCompilers.includes('client')) {
      this.clientWatcher = this.clientCompiler.watch({}, (err, stats) => {
        if (err) console.log(err);

        console.log('bundling client');
      });
    }

    if (targetCompilers.includes('server')) {
      this.serverWatcher = this.serverCompiler.watch({}, (err, stats) => {
        if (err) console.log(err);

        console.log('bundling server');
      });
    }
  }
};

module.exports = new StanzaWebpack();
