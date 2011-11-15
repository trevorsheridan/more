(function() {
  var Compiler, Less, less, path;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __slice = Array.prototype.slice;

  path = require('path');

  Compiler = require('../compiler').Compiler;

  less = require('less');

  exports.Less = Less = (function() {

    __extends(Less, Compiler);

    function Less() {
      Less.__super__.constructor.apply(this, arguments);
    }

    Less.prototype.parse = function() {
      var opts;
      var _this = this;
      opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if ((typeof this.source !== "string") || (this.source === null)) {
        throw new Error("In order to parse, source \"@source\" must be defined and of type `string`");
      }
      try {
        (new less.Parser({
          paths: (function() {
            var child, dirs, _i, _len, _ref;
            dirs = ['.', './' + path.relative(process.cwd(), path.dirname(_this.source))];
            _ref = _this.childDirs(path.dirname(_this.source));
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              child = _ref[_i];
              dirs.push('./' + path.relative(process.cwd(), child));
            }
            return dirs;
          })(),
          filename: this.source
        })).parse(this.read(), function(err, tree) {
          if (err) {
            return console.log('[less] In ' + path.basename(err.filename) + ', ' + err.message);
          } else {
            return _this.save(_this.output, tree.toCSS(), opts[0]);
          }
        });
      } catch (err) {
        console.log(err);
      }
      return this;
    };

    return Less;

  })();

}).call(this);
