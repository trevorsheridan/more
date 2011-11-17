(function() {
  var Command, Compiler, Config, FileSystem, Less, Sift, fs, nomnom, path, signals, _;
  var __slice = Array.prototype.slice;

  fs = require('fs');

  path = require('path');

  _ = require('underscore');

  signals = require('signals');

  nomnom = require('nomnom');

  Config = require('./config').Config;

  Compiler = require('./compiler').Compiler;

  Less = require('./compilers/less').Less;

  Sift = require('./sift');

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
      var config, file, l, less, options, outputDir, relations, save, sourceDir, watchFiles, _i, _len, _results;
      var _this = this;
      options = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      options = _.flatten(options);
      config = Config.loadFrom(process.cwd() + '/config.json')['compiler']['css'];
      if (_.any(options, function(value) {
        return value === 'css' || (value === 'css' && value === 'watch');
      })) {
        sourceDir = path.join(process.cwd(), config['input']);
        outputDir = path.join(process.cwd(), config['output']);
        relations = config['relation'];
        less = new Object;
        watchFiles = FileSystem.getFilesInTree(FileSystem.analyzeStructure(sourceDir, true));
        _results = [];
        for (_i = 0, _len = watchFiles.length; _i < _len; _i++) {
          file = watchFiles[_i];
          try {
            l = new Less(file, less);
            l.parse();
            less[l.name()] = l;
            save = function(css) {
              var out, src, _results2;
              var _this = this;
              _results2 = [];
              for (src in relations) {
                out = relations[src];
                if (path.join(sourceDir, src) === this.source) {
                  _results2.push(this.save(path.join(outputDir, out), css, function() {
                    return console.log('[less] wrote file: ' + _this.name());
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
          return "Sift version " + Sift.VERSION;
        }
      }
    });
    return nomnom.parse();
  };

}).call(this);
