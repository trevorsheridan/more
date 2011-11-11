# Exposes a command-line interface through nomnom, and a wrapper class to access commands within the library.

_      = require 'underscore'
path   = require 'path'
nomnom = require 'nomnom'

Less   = require('./compilers/less').Less
Server = require('./server').Server
Config = require('./config').Config

exports.Command = class Command
  
  constructor: ->
    @commands = {compile: ['css', 'watch'], server: ['start']}
  
  invoke: (action, flags...) -> # Dispatch incoming commands to the appropriate action
    flags = _.flatten(flags)
    
    throw "The action passed to command isn't recognized." \ # Check if the action is a registered action
      if (_.any @commands, (value, key) => yes if action is key) isnt yes
    
    _.each flags, (flag) => # Iterate through each flag and check if it corresponds to the flags set for the given action.
      throw "The flag --#{flag} isn't recognized by the action '#{action}'" \
        if _.any(@commands[action], (value) => yes if flag is value) isnt yes
    
    @[action](flags)
  
  compile: (options...) ->
    
    o       = _.flatten(options)
    config  = Config.loadFrom(process.cwd() + '/config.json')
    
    compile = =>
      for input, output of config['compiler']['css']
        try
          l = new Less(process.cwd() + '/less/' + input, process.cwd() + '/compiled/' + output)
          l.parse((res) -> console.log '[less] wrote file: ' + res.file)
        catch err
          console.log err #Write a better error message here.
    
    compile() if _.any(o, (value) => value is 'css')
    
    new Spy(compile) if _.any(o, (value) => value is 'watch')
  
  server: (options...) ->
    switch flag
      when 'start' then new Server process.cwd() + '/app.js' # FIX!


class Spy

  constructor: (action) ->
    console.log action
  


exports.run = ->
  
  # Commands
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
    
  # Global Options
  nomnom.options
    version:
      abbr: 'v'
      flag: true
      help: 'Display the current version.'
      callback: ->
        return "Productivity version #{Productivity.VERSION}"
  
  nomnom.parse()