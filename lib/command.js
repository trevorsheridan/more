(function() {
  var Command, Config, Less, Server, Spy, nomnom, path, _;
  var __slice = Array.prototype.slice;

  _ = require('underscore');

  path = require('path');

  nomnom = require('nomnom');

  Spy = require('./spy').Spy;

  Less = require('./compilers/less').Less;

  Config = require('./config').Config;

  Server = require('./server').Server;

  exports.Command = Command = (function() {

    function Command(action, flags) {
      var _this = this;
      this.commands = {
        compile: ['css', 'watch'],
        server: ['start']
      };
      flags = _.flatten(flags);
      if ((_.any(this.commands, function(value, key) {
        if (action === key) return true;
      })) !== true) {
        throw new Error("The action passed to command isn't recognized.");
      }
      _.each(flags, function(flag) {
        if (_.any(_this.commands[action], function(value) {
          if (flag === value) return true;
        }) !== true) {
          throw new Error("The flag --" + flag + " isn't recognized by the action '" + action + "'");
        }
      });
      this[action](flags);
    }

    Command.prototype.compile = function() {
      var compile, config, o, options;
      var _this = this;
      options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      o = _.flatten(options);
      config = Config.loadFrom(process.cwd() + '/config.json');
      compile = function() {
        var input, l, output, _ref, _results;
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
      };
      if (_.any(o, function(value) {
        return value === 'css';
      })) {
        compile();
      }
      if (_.any(o, function(value) {
        return value === 'watch';
      })) {
        return Spy.prototype.watch(process.cwd(), compile);
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
      },
      watch: {
        abbr: 'w',
        flag: true,
        help: ''
      }
    }).callback(function(options) {
      delete options['0'] && delete options['_'];
      return new Command('compile', _.keys(options));
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
