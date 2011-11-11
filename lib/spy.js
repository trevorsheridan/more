(function() {
  var Spy, fs;

  fs = require('fs');

  exports.Spy = Spy = (function() {

    function Spy() {}

    Spy.prototype.watch = function(path, callback) {
      return fs.watch(path, function(event, filename) {
        return console.log(event);
      });
    };

    return Spy;

  })();

}).call(this);
