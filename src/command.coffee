# Exposes a command-line interface through nomnom, and a wrapper class to access commands within the library.

_      = require 'underscore'
path   = require 'path'
nomnom = require 'nomnom'

fs     = require 'fs'

Config = require('./config').Config
Less   = require('./compilers/less').Less
Sift = require './sift'

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
    if _.any(o, (value) => value is 'css' or (value is 'css' and value is 'watch'))
      for source, output of config['compiler']['css']['relation']
        try
          source = path.join process.cwd(), config['compiler']['css']['input'], source
          output = path.join process.cwd(), config['compiler']['css']['output'], output
          new Less(source, output)
            .parse (res) ->
              console.log '[less] wrote file: ' + res.file
            .watch ->
              @parse (res) -> console.log '[less] wrote file: ' + res.file
        catch err
          console.log err

exports.run = ->
  
  nomnom.command('compile')
    .options
      css:
        abbr: 'c'
        flag: true
        help: 'Compile CSS.'
      watch:
        abbr: 'w'
        flag: true
        help: 'Continously watch for changes.'
    .callback (options) ->
      delete options['0'] and delete options['_']
      new Command 'compile', _.keys(options)
    .help ''
    
  nomnom.options
    version:
      abbr: 'v'
      flag: true
      help: 'Display the current version.'
      callback: ->
        return "Sift version #{Sift.VERSION}"
  
  nomnom.parse()