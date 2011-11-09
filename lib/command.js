(function() {
  var Command, Compiler, Less, Server, fs, spawn, _;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  _ = require('underscore');

  fs = require('fs');

  spawn = require('child_process').spawn;

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

    return Compiler;

  })();

  Less = (function() {

    __extends(Less, Compiler);

    function Less() {}

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
      switch (flag) {
        case 'css':
          return console.log('start the less compiler.');
      }
    };

    Command.prototype.server = function(flag) {
      switch (flag) {
        case 'start':
          return new Server(process.cwd() + '/app.js');
      }
    };

    Command.prototype.watch = function(flag) {
      switch (flag) {
        case 'dev':
          console.log('watching for dev changes.');
      }
      return console.log('watching for changes...');
    };

    return Command;

  })();

}).call(this);
