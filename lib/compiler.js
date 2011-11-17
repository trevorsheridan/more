(function() {
  var Compiler, fs, path;
  var __slice = Array.prototype.slice;

  fs = require('fs');

  path = require('path');

  exports.Compiler = Compiler = (function() {

    function Compiler(source) {
      this.source = source;
    }

    Compiler.prototype.read = function() {
      return fs.readFileSync(this.source, 'utf-8');
    };

    Compiler.prototype.save = function() {
      var data, opts, out;
      out = arguments[0], data = arguments[1], opts = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      fs.writeFileSync(out, new Buffer(data, 'utf-8'));
      if (opts[0] != null) {
        return opts[0].call(this, {
          code: 1,
          file: out,
          data: data
        });
      }
    };

    Compiler.prototype.watch = function() {
      var opts;
      var _this = this;
      opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      console.log('watching');
      return fs.stat(this.source, function(err, prevStats) {
        var callback, watch;
        if (err) throw err;
        return watch = fs.watch(_this.source, callback = function(event) {
          var watcher;
          if (event === 'rename') {
            watch.close();
            try {
              return watcher = fs.watch(_this.source, callback);
            } catch (_error) {}
          } else if (event === 'change') {
            return fs.stat(_this.source, function(err, stats) {
              if (err) throw err;
              if (stats.size === prevStats.size && stats.mtime.getTime() === prevStats.mtime.getTime()) {
                return;
              }
              prevStats = stats;
              if (opts[0] != null) return opts[0].call(_this);
            });
          }
        });
      });
    };

    return Compiler;

  })();

}).call(this);
