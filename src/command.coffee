# Exposes a command-line interface through nomnom, and a wrapper class to access commands within the library.

_      = require 'underscore'
path   = require 'path'
nomnom = require 'nomnom'

Less   = require('./compilers/less').Less
Config = require('./config').Config
Server = require('./server').Server

exports.Command = class Command
  
  constructor: (action, flags) ->
    @commands = {compile: ['css', 'watch'], server: ['start']}
    flags = _.flatten(flags)
    throw new Error "The action passed to command isn't recognized." if (_.any @commands, (value, key) => yes if action is key) isnt yes
    _.each flags, (flag) =>
      throw new Error "The flag --#{flag} isn't recognized by the action '#{action}'" if _.any(@commands[action], (value) => yes if flag is value) isnt yes    
    @[action](flags)
  
  compile: (options...) ->
    o = _.flatten(options)
    config = Config.loadFrom(process.cwd() + '/config.json') # Add validation by passing an object of keys to validate against. Add this in later.
    compile = =>
      for input, output of config['compiler']['css']['relations']
        try
          l = new Less(path.join(process.cwd(), config['compiler']['css']['io']['input'], input), path.join(process.cwd(), config['compiler']['css']['io']['output'], output))
          l.parse((res) -> console.log '[less] wrote file: ' + res.file)
        catch err
          console.log err
    compile() if _.any(o, (value) => value is 'css')
    Spy::watch(process.cwd(), compile) if _.any(o, (value) => value is 'watch')
    
    
#   server: (options...) ->
#     switch flag
#       when 'start' then new Server process.cwd() + '/app.js' # make this so the filename doesn't have to be app.js

exports.run = ->
  
  nomnom.command('compile')
    .options
      css:
        abbr: 'c'
        flag: true
        help: ''
      watch:
        abbr: 'w'
        flag: true
        help: ''
    .callback (options) ->
      delete options['0'] and delete options['_']
      new Command 'compile', _.keys(options)
    .help ''
    
#   nomnom.command('server')
#     .options
#       start:
#         abbr: 's'
#         flag: true
#         help: ''
#     .callback (options) ->
#       delete options['0'] and delete options['_']
#       new Command 'server', _.keys(options)
#     .help ''
    
  nomnom.options
    version:
      abbr: 'v'
      flag: true
      help: 'Display the current version.'
      callback: ->
        return "Productivity version #{Productivity.VERSION}"
  
  nomnom.parse()