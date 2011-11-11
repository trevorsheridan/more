# Exposes a command-line interface through nomnom, and a wrapper class to access commands within the library.

_      = require 'underscore'
path   = require 'path'
nomnom = require 'nomnom'

Config = require('./config').Config
Server = require('./server').Server
Less   = require('./compilers/less').Less


exports.Command = class Command
  
  command: (action, options, opts) -> # Dispatch incoming commands to the appropriate action
    flag = _.find(_.keys(options), (item) -> yes if item in opts)
    if @[action] and flag? then @[action](flag) # Check if there's a corresponding member (action) and a presence of a flag.
  
  compile: (flag) ->
    switch flag
      when 'css'
        config = Config.loadFrom(process.cwd() + '/config.json')
        for input, output of config['compiler']['css']
          try
            l = new Less(process.cwd() + '/less/' + input, process.cwd() + '/compiled/' + output)
            l.parse((res) -> console.log '[less] wrote file: ' + res.file)
          catch err
            console.log err #Write a better error message here.
  
  server: (flag) ->
    switch flag
      when 'start' then new Server process.cwd() + '/app.js' # FIX!


exports.run = ->
  
  # Commands
  nomnom.command('compile')
    .options
      css:
        abbr: 'c'
        flag: true
        help: ''
    .callback (options) ->
      Command::command('compile', options, ['css'])
    .help ''
    
  nomnom.command('server')
    .options
      start:
        abbr: 's'
        flag: true
        help: ''
    .callback (options) ->
      Command::command('server', options, ['start'])
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