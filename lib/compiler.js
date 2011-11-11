(function() {
  var Compiler, fs;
  var __slice = Array.prototype.slice;

  fs = require('fs');

  exports.Compiler = Compiler = (function() {

    function Compiler() {}

    Compiler.prototype.read = function() {
      return fs.readFileSync(this.f, 'utf-8');
    };

    Compiler.prototype.save = function() {
      var data, opts, out;
      out = arguments[0], data = arguments[1], opts = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      return fs.writeFile(out, new Buffer(data, 'utf-8'), function(err) {
        if (err) throw err;
        return opts[0].call(this, {
          code: 1,
          file: out,
          data: data
        });
      });
    };

    return Compiler;

  })();

}).call(this);
