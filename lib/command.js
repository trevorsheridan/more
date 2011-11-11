(function() {
  var Command, Config, Less, Server, nomnom, path, _;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  _ = require('underscore');

  path = require('path');

  nomnom = require('nomnom');

  Config = require('./config').Config;

  Server = require('./server').Server;

  Less = require('./compilers/less').Less;

  exports.Command = Command = (function() {

    function Command() {}

    Command.prototype.command = function(action, options, opts) {
      var flag;
      flag = _.find(_.keys(options), function(item) {
        if (__indexOf.call(opts, item) >= 0) return true;
      });
      if (this[action] && (flag != null)) return this[action](flag);
    };

    Command.prototype.compile = function(flag) {
      var config, input, l, output, _ref, _results;
      switch (flag) {
        case 'css':
          config = Config.loadFrom(process.cwd() + '/config.json');
          _ref = config['compiler']['css'];
          _results = [];
          for (input in _ref) {
            output = _ref[input];
            try {
              l = new Less(process.cwd() + '/less/' + input, process.cwd() + '/compiled/' + output);
              _results.push(l.parse(function(res) {
                return console.log('[less] wrote file: ' + res.file);
              }));
            } catch (err) {
              _results.push(console.log(err));
            }
          }
          return _results;
      }
    };

    Command.prototype.server = function(flag) {
      switch (flag) {
        case 'start':
          return new Server(process.cwd() + '/app.js');
      }
    };

    return Command;

  })();

  exports.run = function() {
    nomnom.command('compile').options({
      css: {
        abbr: 'c',
        flag: true,
        help: ''
      }
    }).callback(function(options) {
      return Command.prototype.command('compile', options, ['css']);
    }).help('');
    nomnom.command('server').options({
      start: {
        abbr: 's',
        flag: true,
        help: ''
      }
    }).callback(function(options) {
      return Command.prototype.command('server', options, ['start']);
    }).help('');
    nomnom.options({
      version: {
        abbr: 'v',
        flag: true,
        help: 'Display the current version.',
        callback: function() {
          return "Productivity version " + Productivity.VERSION;
        }
      }
    });
    return nomnom.parse();
  };

}).call(this);
