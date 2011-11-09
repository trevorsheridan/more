Command = new require('./command').Command
parser  = require 'nomnom'

exports.run = ->
  # Commands
  parser.command('compile')
    .options
      css:
        abbr: 'c'
        flag: true
        help: ''
    .callback (options) ->
      Command::command('compile', options, ['css'])
    .help ''
    
  parser.command('server')
    .options
      start:
        abbr: 's'
        flag: true
        help: ''
    .callback (options) ->
      Command::command('server', options, ['start'])
    .help ''
    
  # Global Options
  parser.options
    version:
      abbr: 'v'
      flag: true
      help: 'Display the current version.'
      callback: ->
        return 'version 0.1.0'
  
  parser.parse()