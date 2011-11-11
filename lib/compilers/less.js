(function() {
  var Compiler, Less, less;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __slice = Array.prototype.slice;

  Compiler = require('../compiler').Compiler;

  less = require('less.js');

  exports.Less = Less = (function() {

    __extends(Less, Compiler);

    function Less(file, out) {
      this.f = file;
      this.o = out;
    }

    Less.prototype.parse = function() {
      var opts;
      var _this = this;
      opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (new less.Parser({
        paths: ['.', './less'],
        filename: this.f
      })).parse(this.read(), function(err, tree) {
        if (err) throw err;
        return _this.save(_this.o, tree.toCSS(), opts[0]);
      });
    };

    return Less;

  })();

}).call(this);
