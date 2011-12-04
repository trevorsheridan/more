(function() {
  var Base, Compiler, fs, path, signals,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  fs = require('fs');

  path = require('path');

  signals = require('signals');

  Base = require('./base').Base;

  exports.Compiler = Compiler = (function() {

    __extends(Compiler, Base);

    function Compiler(source) {
      this.source = source;
      this.setName(path.basename(source));
      Compiler.__super__.constructor.apply(this, arguments);
    }

    Compiler.prototype.read = function() {
      return fs.readFileSync(this.source, 'utf-8');
    };

    Compiler.prototype.save = function() {
      var callback, data, output;
      output = arguments[0], data = arguments[1], callback = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      fs.writeFileSync(output, new Buffer(data, 'utf-8'));
      if (callback[0] != null) {
        return callback[0].call(this, {
          code: 1,
          file: output,
          data: data
        });
      }
    };

    Compiler.prototype.watch = function() {
      var opts,
        _this = this;
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

    return Compiler;

  })();

}).call(this);
