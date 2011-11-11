# Exposes a command-line interface through nomnom, and a wrapper class to access commands within the library.

_      = require 'underscore'
path   = require 'path'
nomnom = require 'nomnom'

Spy    = require('./spy').Spy
Less   = require('./compilers/less').Less
Config = require('./config').Config
Server = require('./server').Server

exports.Command = class Command
  
  constructor: ->
    @commands = {compile: ['css', 'watch'], server: ['start']}
  
  # Dispatch incoming commands to the appropriate action.
  invoke: (action, flags...) ->
    flags = _.flatten(flags)
    throw "The action passed to command isn't recognized." \
      if (_.any @commands, (value, key) => yes if action is key) isnt yes
    _.each flags, (flag) =>
      throw "The flag --#{flag} isn't recognized by the action '#{action}'" \
        if _.any(@commands[action], (value) => yes if flag is value) isnt yes    
    @[action](flags)
  
  compile: (options...) ->
    o = _.flatten(options)
    config = Config.loadFrom(process.cwd() + '/config.json')
    compile = =>
      for input, output of config['compiler']['css']
        try
          l = new Less(process.cwd() + '/less/' + input, process.cwd() + '/compiled/' + output)
          l.parse((res) -> console.log '[less] wrote file: ' + res.file)
        catch err
          console.log err # Make this better will ya?
    compile() if _.any(o, (value) => value is 'css')
    Spy::watch(process.cwd(), -> console.log 'called') if _.any(o, (value) => value is 'watch')
    
  server: (options...) ->
    switch flag
      when 'start' then new Server process.cwd() + '/app.js' # make this so the filename doesn't have to be app.js

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
      (new Command).invoke('compile', _.keys(options))
    .help ''
    
  nomnom.command('server')
    .options
      start:
        abbr: 's'
        flag: true
        help: ''
    .callback (options) ->
      delete options['0'] and delete options['_']
      (new Command).invoke('server', _.keys(options))
    .help ''
    
  nomnom.options
    version:
      abbr: 'v'
      flag: true
      help: 'Display the current version.'
      callback: ->
        return "Productivity version #{Productivity.VERSION}"
  
  nomnom.parse()