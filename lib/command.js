(function() {
  var Command, Compiler, Less, Server, config, fs, less, path, spawn, _;
  var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  _ = require('underscore');

  fs = require('fs');

  path = require('path');

  spawn = require('child_process').spawn;

  config = require('./config').config;

  less = require('less.js');

  Server = (function() {

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

  Compiler = (function() {

    function Compiler() {}

    Compiler.prototype.read = function() {
      return fs.readFileSync(this.f, 'utf-8');
    };

    Compiler.prototype.save = function() {
      var data, opts, out;
      out = arguments[0], data = arguments[1], opts = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      return fs.writeFile(out, new Buffer(data, 'utf-8'), function(err) {
        if (err) throw err;
        return opts[0].call(this, {
          code: 1,
          file: out,
          data: data
        });
      });
    };

    return Compiler;

  })();

  Less = (function() {

    __extends(Less, Compiler);

    function Less(file, out) {
      this.f = file;
      this.o = out;
    }

    Less.prototype.parse = function() {
      var opts;
      var _this = this;
      opts = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return (new less.Parser({
        paths: ['.', './less'],
        filename: this.f
      })).parse(this.read(), function(err, tree) {
        if (err) throw err;
        return _this.save(_this.o, tree.toCSS(), opts[0]);
      });
    };

    return Less;

  })();

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
      var input, l, output, _ref, _results;
      switch (flag) {
        case 'css':
          config = config.loadFrom(process.cwd() + '/config.json');
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

}).call(this);
