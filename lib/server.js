(function() {
  var Server, spawn;

  spawn = require('child_process').spawn;

  exports.Server = Server = (function() {

    function Server(src) {
      this.src = src;
      this.invoke();
    }

    Server.prototype.invoke = function() {
      var app;
      this.app = app = spawn('node', ['app.js']);
      app.stdout.on('data', function(data) {
        return console.log('[app] ' + data.toString());
      });
      return app.stderr.on('data', function(data) {
        return console.log('[app] ' + data.toString());
      });
    };

    return Server;

  })();

}).call(this);
