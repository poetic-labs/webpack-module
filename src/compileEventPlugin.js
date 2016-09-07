function compileEventPlugin(eventEmitter) {
  this.compileEventEmitter = eventEmitter;
}

compileEventPlugin.prototype.apply = function(compiler) {
  compiler.plugin('compile', (params) => {
    this.compileEventEmitter.emit('compile');
  });

  compiler.plugin('compilation', (compilation) => {
    this.compileEventEmitter.emit('compilation');

    compilation.plugin('optimize', () => {
      this.compileEventEmitter.emit('optimize');
    });
  });

  compiler.plugin('emit', (compilation, callback) => {
    this.compileEventEmitter.emit('emit');
    callback();
  });

  compiler.plugin('after-emit', (compilation, callback) => {
    this.compileEventEmitter.emit('after-emit');
    callback();
  });

  compiler.plugin('failed', (error) => {
    this.compileEventEmitter.emit('failed');
  });

  compiler.plugin('invalid', (compilation) => {
    this.compileEventEmitter.emit('invalid');
  });

  compiler.plugin('after-compile', (compilation, callback) => {
    this.compileEventEmitter.emit('after-compile');
    callback();
  });
};

module.exports = compileEventPlugin;
