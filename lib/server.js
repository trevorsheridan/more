(function() {
  var Server, fs, spawn;

  fs = require('fs');

  spawn = require('child_process').spawn;

  exports.Server = Server = (function() {

    function Server() {}

    Server.prototype.constuctor = function(src) {
      console.log('hi');
      this.src = src;
      return this.invoke;
    };

    Server.prototype.invoke = function() {
      var app;
      this.app = app = spawn('node', this.src);
      return app.stdout.on('data', function(data) {
        return console.log('data is here!');
      });
    };

    return Server;

  })();

}).call(this);
