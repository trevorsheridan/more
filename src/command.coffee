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
      
      watchFiles = FileSystem.getFilesInTree(FileSystem.analyzeStructure sourceDir, true)
      lessObjects = new Object
      for file in watchFiles
        try
          l = new Less(file, lessObjects)
          l.parse() # Initially parse the file.
          lessObjects[l.name()] = l
          
          if _.all(options, (value) => value is 'css') # Compile then return to the prompt.
            for src, out of relations
              if path.join(sourceDir, src) is file
                l.parse()
          
          if _.any(options, (value) => value is 'watch') # Start watching :)
            l.watch -> # Don't change the context here. It will auto adjust.
              @parse (css) -> # Don't change the context, leave this as a shinny arrow. The context will automatically switch to the active element.
                for src, out of relations
                  if path.join(sourceDir, src) is @source
                    @save path.join(outputDir, out), css, =>
                      console.log '[less] wrote file: ' + @name()
        
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