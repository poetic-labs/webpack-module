const appRootPath = require('app-root-dir').get();
const fs = require('fs');
const setupDependencies = require('./setup-dependencies.js');

const webpackConfigFile = appRootPath + '/webpack/webpack-config-overwrite.js';
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

class StanzaWebpack {
  constructor() {
    // assume stanza will declare the environment
    const environment = process.env.NODE_ENV;

    this.webpack = webpack;
    this.WebpackDevServer = WebpackDevServer;

    this.setupConfigs(environment);

    setupDependencies('stanza-webpack', this);

    if (fs.existsSync(webpackConfigFile)) {
      const ownerConfig = require(webpackConfigFile);

      if (typeof ownerConfig.register === 'function') {
        ownerConfig.register(this);
      }
    }

    this.setupCompilers();

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
        filename: 'build/server/entry.js'
      },
      plugins: [],
      module: {
        loaders: [],
      }
    }

    this.clientConfig = {
      target: 'web',
      entry: [
        'webpack-dev-server/client?http://localhost:3001/',
        'webpack/hot/only-dev-server',
        './client/index.jsx',
      ],
      output: {
        path: require("path").resolve("./build/"),
        filename: 'client.entry.js'
      },
      resolve: {
        extensions: ['', '.js', '.jsx']
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
      ],
      module: {
        loaders: [{
          test: /\.jsx$/,
          exclude: /node_modules/,
          loader: "babel",
          query: {
            presets: [ 'es2015', 'react', 'react-hmre' ]
          }
        }]
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
