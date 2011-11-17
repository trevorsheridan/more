(function() {
  var FileSystem, fs, path;

  fs = require('fs');

  path = require('path');

  exports.FileSystem = FileSystem = (function() {

    function FileSystem() {}

    FileSystem.analyzeStructure = function(dir, withFiles) {
      var d, file, _fn, _i, _len, _ref;
      var _this = this;
      d = new Array;
      _ref = fs.readdirSync(path.normalize(dir));
      _fn = function(file) {
        var child, children, _j, _len2, _ref2, _results;
        try {
          file = path.join(dir, file);
          if (withFiles || fs.readdirSync(file)) d.push(file);
          _ref2 = children = _this.analyzeStructure(file, withFiles);
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

    FileSystem.getFilesInTree = function(tree) {
      var f, file, _fn, _i, _len;
      var _this = this;
      f = new Array;
      _fn = function(file) {
        try {
          if (fs.readFileSync(file)) return f.push(file);
        } catch (_error) {}
      };
      for (_i = 0, _len = tree.length; _i < _len; _i++) {
        file = tree[_i];
        _fn(file);
      }
      return f;
    };

    return FileSystem;

  })();

}).call(this);
