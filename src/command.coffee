# Exposes a command-line interface through nomnom, and a wrapper class to access commands within the library.

fs      = require 'fs'
path    = require 'path'
_       = require 'underscore'
signals = require 'signals'
nomnom  = require 'nomnom'

Config   = require('./config').Config
Compiler = require('./compiler').Compiler
Less     = require('./compilers/less').Less
Sift     = require './sift'
FileSystem = require('./filesystem').FileSystem

exports.Command = class Command
  
  constructor: (action, flags) ->
    @commands = {compile: ['css', 'watch'], server: ['start']}
    flags = _.flatten(flags)
    throw new Error "The action passed to command isn't recognized." if (_.any @commands, (value, key) => yes if action is key) isnt yes
    _.each flags, (flag) =>
      throw new Error "The flag --#{flag} isn't recognized by the action '#{action}'" if _.any(@commands[action], (value) => yes if flag is value) isnt yes    
    @[action](flags)
  
  compile: (options...) ->
    options = _.flatten(options)
    config  = Config.loadFrom(process.cwd() + '/config.json')['compiler']['css']
    if _.any(options, (value) => value is 'css' or (value is 'css' and value is 'watch'))
      sourceDir = path.join process.cwd(), config['input']
      outputDir = path.join process.cwd(), config['output']
      relations = config['relation']
      less = new Object
      for file in FileSystem.getFilesInTree FileSystem.analyzeStructure sourceDir, true, ['.less']
        try
          l = new Less(file, less)
          l.parse()
          less[l.name()] = l
          save = (css) -> # Context shouldn't change, it will automatically change by whoever calls it.
            for src, out of relations
              if path.join(sourceDir, src) is @source
                @save path.join(outputDir, out), css, =>
                  console.log "[less] wrote file: #{out}"
          if _.all(options, (value) => value is 'css')
            l.parse save
          if _.any(options, (value) => value is 'watch')
            l.watch -> # Context shouldn't change, it will automatically change by whoever calls it.
              @parse save
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