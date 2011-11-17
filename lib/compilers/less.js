(function() {
  var Compiler, FileSystem, Less, less, path;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __slice = Array.prototype.slice;

  path = require('path');

  less = require('less');

  Compiler = require('../compiler').Compiler;

  FileSystem = require('../filesystem').FileSystem;

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
        if (!this._parser) {
          this._parser = new less.Parser({
            paths: (function() {
              var child, dirs, _i, _len, _ref;
              dirs = ['.', './' + path.relative(process.cwd(), path.dirname(_this.source))];
              _ref = FileSystem.analyzeStructure(path.dirname(_this.source), false);
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                child = _ref[_i];
                dirs.push('./' + path.relative(process.cwd(), child));
              }
              return dirs;
            })(),
            filename: this.source
          });
          this._parser.parse(this.read(), function(err, tree) {
            var child, name, obj, _ref, _results;
            if (err) {
              console.log('[less] In ' + path.basename(err.filename) + ', ' + err.message);
            }
            _ref = _this._parser.imports.files;
            _results = [];
            for (name in _ref) {
              obj = _ref[name];
              child = _this.relatives[name];
              _results.push(child.changed.add(_this.onChange, _this));
            }
            return _results;
          });
        } else {
          this._parser.parse(this.read(), function(err, tree) {
            if (err) {
              return console.log('[less] In ' + path.basename(err.filename) + ', ' + err.message);
            } else {
              _this.changed.dispatch(_this);
              console.log('---------- Compiled Output ------------------');
              return console.log(tree.toCSS());
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
      return this;
    };

    Less.prototype.onChange = function() {
      var child;
      child = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return this.parse();
    };

    return Less;

  })();

}).call(this);
