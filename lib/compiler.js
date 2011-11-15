(function() {
  var Compiler, fs, path;
  var __slice = Array.prototype.slice;

  fs = require('fs');

  path = require('path');

  exports.Compiler = Compiler = (function() {

    function Compiler(source, output) {
      this.source = source;
      this.output = output;
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

    Compiler.prototype.childDirs = function(dir) {
      var d, file, _fn, _i, _len, _ref;
      var _this = this;
      d = new Array;
      _ref = fs.readdirSync(path.normalize(dir));
      _fn = function(file) {
        var child, children, _j, _len2, _ref2, _results;
        try {
          file = path.join(dir, file);
          if (fs.readdirSync(file)) d.push(file);
          _ref2 = children = _this.childDirs(file);
          _results = [];
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            child = _ref2[_j];
            if (children.length > 0) {
              _results.push(d.push(child));
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        } catch (_error) {}
      };
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        _fn(file);
      }
      return d;
    };

    return Compiler;

  })();

}).call(this);
