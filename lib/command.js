(function() {
  var Command, Compiler, Config, FileSystem, Less, More, fs, nomnom, path, signals, _,
    __slice = Array.prototype.slice;

  fs = require('fs');

  path = require('path');

  _ = require('underscore');

  signals = require('signals');

  nomnom = require('nomnom');

  Config = require('./config').Config;

  Compiler = require('./compiler').Compiler;

  Less = require('./compilers/less').Less;

  More = require('./more');

  FileSystem = require('./filesystem').FileSystem;

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
      var config, file, l, less, options, output_loc, save, source_loc, _i, _len, _ref, _results,
        _this = this;
      options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      options = _.flatten(options);
      config = Config.loadFrom(process.cwd() + '/config.json')['compiler']['css'];
      if (_.any(options, function(value) {
        return value === 'css' || (value === 'css' && value === 'watch');
      })) {
        source_loc = path.join(process.cwd(), path.normalize(config['input']));
        output_loc = path.join(process.cwd(), path.normalize(config['output']));
        less = {};
        _ref = FileSystem.getFilesInTree(FileSystem.analyzeStructure(source_loc, true, ['.less']));
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          try {
            l = new Less(file, less);
            l.parse();
            less[path.relative(config['input'], l.source)] = l;
            save = function(css) {
              var out, src, _ref2, _results2,
                _this = this;
              _ref2 = config['relation'];
              _results2 = [];
              for (src in _ref2) {
                out = _ref2[src];
                if (path.relative(source_loc, path.join(source_loc, path.normalize(src))) === path.relative(source_loc, this.source)) {
                  _results2.push(this.save(path.join(output_loc, out), css, function(res) {
                    return console.log("[less] wrote file: " + out);
                  }));
                } else {
                  _results2.push(void 0);
                }
              }
              return _results2;
            };
            if (_.all(options, function(value) {
              return value === 'css';
            })) {
              l.parse(save);
            }
            if (_.any(options, function(value) {
              return value === 'watch';
            })) {
              _results.push(l.watch(function() {
                return this.parse(save);
              }));
            } else {
              _results.push(void 0);
            }
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
      watch: {
        abbr: 'w',
        flag: true,
        help: 'Continously watch for changes.'
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
          return "More version " + More.VERSION;
        }
      }
    });
    return nomnom.parse();
  };

}).call(this);
