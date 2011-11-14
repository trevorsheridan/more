(function() {
  var Compiler, fs, path;
  var __slice = Array.prototype.slice;

  fs = require('fs');

  path = require('path');

  exports.Compiler = Compiler = (function() {

    function Compiler(filename, fileout) {
      this.f = filename;
      this.o = fileout;
    }

    Compiler.prototype.read = function() {
      return fs.readFileSync(this.f, 'utf-8');
    };

    Compiler.prototype.save = function() {
      var data, opts, out;
      out = arguments[0], data = arguments[1], opts = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      fs.writeFileSync(out, new Buffer(data, 'utf-8'));
      return opts[0].call(this, {
        code: 1,
        file: out,
        data: data
      });
    };

    Compiler.prototype.watch = function() {
      var opts;
      var _this = this;
      opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return fs.watch(path.dirname(this.f), function(event, filename) {
        return opts[0].call(_this);
      });
    };

    return Compiler;

  })();

}).call(this);
