(function() {
  var Command, parser;

  Command = new require('./command').Command;

  parser = require('nomnom');

  exports.run = function() {
    parser.command('compile').options({
      css: {
        abbr: 'c',
        flag: true,
        help: ''
      }
    }).callback(function(options) {
      return Command.prototype.command('compile', options, ['css']);
    }).help('');
    parser.command('server').options({
      start: {
        abbr: 's',
        flag: true,
        help: ''
      }
    }).callback(function(options) {
      return Command.prototype.command('server', options, ['start']);
    }).help('');
    parser.options({
      version: {
        abbr: 'v',
        flag: true,
        help: 'Display the current version.',
        callback: function() {
          return 'version 0.1.0';
        }
      }
    });
    return parser.parse();
  };

}).call(this);
