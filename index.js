const StanzaWebpack = require('./src/StanzaWebpack.js');

// node node_modules/webpack-module/index.js;

const webpack = StanzaWebpack.webpack;
const WebpackDevServer = StanzaWebpack.WebpackDevServer;
const clientConfig = StanzaWebpack.clientConfig;

StanzaWebpack.bundle();

new WebpackDevServer(webpack(clientConfig), {
  contentBase: '/build/',
  hot: true,
  inline: true,
  progress: true,
  proxy: {
    "*": "http://localhost:3000"
  },
  historyApiFallback: true,
  stats: 'errors',
}).listen(3001, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:3001');
});
