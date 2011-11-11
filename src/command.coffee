# Command class for e3. Exposes a command-line interface through nomnom, and a wrapper class to access commands within the library.

_      = require 'underscore'
fs     = require 'fs'
path   = require 'path'
spawn  = require('child_process').spawn
config = require('./config').config
less   = require 'less.js'


class Server
  
  constructor: (src) ->
    @src = src
    @invoke()
  
  invoke: ->
    @app = app = spawn 'node', ['app.js']
    
    app.stdout.on 'data', (data) ->
      console.log '[app] ' + data.toString()
    
    app.stderr.on 'data', (data) ->
      console.log '[app] ' + data.toString()


class Compiler
  
  # Compiler.read()
  read: ->
    fs.readFileSync @f, 'utf-8'
  
  # Compiler.save(name, data)
  save: (out, data, opts...) ->
    fs.writeFile out, (new Buffer data, 'utf-8'), (err) ->
      if err then throw err
      opts[0].call this, {code: 1 ,file: out, data: data}


class Less extends Compiler
  
  # Less.save(file, out)
  constructor: (file, out) ->
    @f = file
    @o = out
  
  # Less.parse([opts])
  parse: (opts...) ->
    (new less.Parser {paths: ['.', './less'], filename: @f}).parse @read(), (err, tree) =>
      if err then throw err
      @save @o, tree.toCSS(), opts[0] # Do some pub/sub action here to avoid all of the damn callbacks.


exports.Command = class Command
  
  command: (action, options, opts) -> # Dispatch incoming commands to the appropriate action
    flag = _.find(_.keys(options), (item) -> yes if item in opts)
    if @[action] and flag? then @[action](flag) # Check if there's a corresponding member (action) and a presence of a flag.
  
  compile: (flag) ->
    switch flag
      when 'css'
        config = config.loadFrom(process.cwd() + '/config.json')
        for input, output of config['compiler']['css']
          try
            l = new Less(process.cwd() + '/less/' + input, process.cwd() + '/compiled/' + output)
            l.parse((res) -> console.log '[less] wrote file: ' + res.file)
          catch err
            console.log err #Write a better error message here.
  
  server: (flag) ->
    switch flag
      when 'start' then new Server process.cwd() + '/app.js' # FIX!