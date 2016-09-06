function dynamicPlugin(eventEmitter) {
  this.compileEventEmitter = eventEmitter;
}

dynamicPlugin.prototype.apply = function(compiler) {
  var compileEventEmitter = this.compileEventEmitter;

  compiler.plugin("compile", function(params) {
    compileEventEmitter.emit('compile');
  });

  compiler.plugin("compilation", function(compilation) {
    compileEventEmitter.emit('compilation');

    compilation.plugin("optimize", function() {
      compileEventEmitter.emit('optimize');
    });
  });

  compiler.plugin("emit", function(compilation, callback) {
    compileEventEmitter.emit('emit');
    callback();
  });

  compiler.plugin("after-compile", function(compilation, callback) {
    compileEventEmitter.emit('after-compile');
    callback();
  });
};

module.exports = dynamicPlugin;
