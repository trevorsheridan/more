(function() {
  var Command, Config, Less, Sift, nomnom, path, _;
  var __slice = Array.prototype.slice;

  _ = require('underscore');

  path = require('path');

  nomnom = require('nomnom');

  Config = require('./config').Config;

  Less = require('./compilers/less').Less;

  Sift = require('./sift');

  exports.Command = Command = (function() {

    function Command(action, flags) {
      var _this = this;
      this.commands = {
        compile: ['css', 'hunt'],
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
      var config, input, o, options, output, _ref, _results;
      var _this = this;
      options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      o = _.flatten(options);
      config = Config.loadFrom(process.cwd() + '/config.json');
      if (_.any(o, function(value) {
        return value === 'css' || (value === 'css' && value === 'hunt');
      })) {
        _ref = config['compiler']['css']['relation'];
        _results = [];
        for (input in _ref) {
          output = _ref[input];
          try {
            input = path.join(process.cwd(), config['compiler']['css']['input'], input);
            output = path.join(process.cwd(), config['compiler']['css']['output'], output);
            _results.push(new Less(input, output).parse(function(res) {
              return console.log('[less] wrote file: ' + res.file);
            }).watch(function() {
              return this.parse(function(res) {
                return console.log('[less] wrote file: ' + res.file);
              });
            }));
          } catch (err) {
            _results.push(console.log(err));
          }
        }
        return _results;
      }
    };

    return Command;

  })();

  exports.run = function() {
    nomnom.command('compile').options({
      css: {
        abbr: 'c',
        flag: true,
        help: 'Compile CSS.'
      },
      hunt: {
        abbr: 'w',
        flag: true,
        help: 'Continously hunt for changes.'
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
          return "Sift version " + Sift.VERSION;
        }
      }
    });
    return nomnom.parse();
  };

}).call(this);
