(function() {
  var Compiler, FileSystem, Less, less, path, _,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = Array.prototype.slice;

  path = require('path');

  less = require('less');

  _ = require('underscore');

  Compiler = require('../compiler').Compiler;

  FileSystem = require('../filesystem').FileSystem;

  exports.Less = Less = (function() {

    __extends(Less, Compiler);

    function Less(source, relatives) {
      this.relatives = relatives;
      Less.__super__.constructor.call(this, source);
    }

    Less.prototype.parse = function() {
      var callback,
        _this = this;
      callback = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
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
            var child, _i, _len, _ref, _results;
            if (err) {
              console.log('[less] In ' + path.basename(err.filename) + ', ' + err.message);
            }
            _this.imports = _.keys(_this._parser.imports.files);
            _ref = _this.imports;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              child = _ref[_i];
              _results.push(_this.relatives[path.normalize(child)].changed.add(_this.changedCallback = function() {
                var callback, child;
                child = arguments[0], callback = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                return this.onChange(child, callback[0]);
              }, _this));
            }
            return _results;
          });
        } else {
          this._parser.parse(this.read(), function(err, tree) {
            var child, lastImports, _i, _j, _len, _len2, _ref, _ref2;
            if (err) {
              return console.log('[less] In ' + path.basename(err.filename) + ', ' + err.message);
            } else {
              lastImports = _this.imports;
              _this.imports = _.keys(_this._parser.imports.files);
              _ref = _.difference(lastImports, _this.imports);
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                child = _ref[_i];
                _this.relatives[path.normalize(child)].changed.remove(_this.changedCallback);
              }
              _ref2 = _.difference(_this.imports, lastImports);
              for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                child = _ref2[_j];
                _this.relatives[path.normalize(child)].changed.add(_this.changedCallback = function() {
                  var callback, child;
                  child = arguments[0], callback = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
                  return this.onChange(child, callback[0]);
                }, _this);
              }
              _this.changed.dispatch(_this, callback[0] ? callback[0] : new Function);
              if (callback[0]) {
                callback[0].call(_this, tree.toCSS());
              } else {
                console.log(tree.toCSS());
              }
              return _this._parser.imports.files = {};
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
      return this;
    };

    Less.prototype.onChange = function() {
      var callback, child;
      child = arguments[0], callback = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.parse(callback[0] ? callback[0] : new Function);
    };

    return Less;

  })();

}).call(this);
