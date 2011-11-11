(function() {
  var Config, fs;

  fs = require('fs');

  exports.config = Config = (function() {

    function Config() {}

    Config.loadFrom = function(loc) {
      var conf;
      try {
        conf = fs.readFileSync(loc, 'utf-8');
        return this.load(conf);
      } catch (err) {
        if (err.code === 'ENOENT') {
          return console.log('No config file to read from at location: ' + err.path);
        }
      }
    };

    Config.load = function(data) {
      try {
        return JSON.parse(data);
      } catch (err) {
        console.log('The JSON parser reported the following error: ' + err);
        return process.exit(1);
      }
    };

    return Config;

  })();

}).call(this);
