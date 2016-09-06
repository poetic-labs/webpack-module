var pkgConf = require('pkg-conf');
var webpackModule = require('./src/webpackModule.js');

// node node_modules/webpack/bin/webpack.js;

// TODO create webpack module object that exposes webpack compile, webpack
// plugin event hooks, and webpack itself.
//
// TODO find and register npm packages that start with webpack? Pass wp-module
// into children
//
// TODO Build plugin that allows childrne to hook into events

// console.log(webpackModule);

pkgConf('dependencies').then(function(config) {
    var namespaceRegex = /stanza-webpack*/;
    var webpackModulePackages = Object.keys(config).filter(function(key) {
      return key.match(namespaceRegex);
    });

    console.log(webpackModulePackages);

    webpackModulePackages.forEach(function(package) {
      console.log(package);
    });
});

webpackModule.bundle();
