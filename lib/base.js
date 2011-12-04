(function() {
  var Base, signals,
    __slice = Array.prototype.slice;

  signals = require('signals');

  exports.Base = Base = (function() {

    function Base() {
      var opts;
      opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.changed = new signals.Signal;
    }

    Base.prototype.name = function() {
      return this._name;
    };

    Base.prototype.setName = function(name) {
      return this._name = name;
    };

    return Base;

  })();

}).call(this);
