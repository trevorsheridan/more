(function() {
  var Spy, fs;

  fs = require('fs');

  exports.Spy = Spy = (function() {

    function Spy() {}

    Spy.prototype.watch = function(path, callback) {
      return this.buildDirectoryTree;
    };

    Spy.prototype.introspectDirTree = function(rootDir) {
      return fs.readdir(path, [callback]);
    };

    return Spy;

  })();

}).call(this);
