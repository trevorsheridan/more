# Command class for e3. Exposes a command-line interface through nomnom, and a wrapper class to access commands within the library.

_     = require 'underscore'
fs    = require 'fs'
spawn = require('child_process').spawn

class Server
  constructor: (src) ->
    @src = src
    @.invoke()
  invoke: ->
    @app = app = spawn 'node', ['app.js']
    app.stdout.on 'data', (data) ->
      console.log '[app] ' + data.toString()
    app.stderr.on 'data', (data) ->
      console.log '[app] ' + data.toString()

class Compiler
  constructor: ->
    

class Less extends Compiler
  constructor: ->
    
  

exports.Command = class Command
  command: (action, options, opts) -> # Dispatch incoming commands to the appropriate action
    flag = _.find(_.keys(options), (item) -> yes if item in opts)
    if @[action] and flag? then @[action](flag) # Check if there's a corresponding member (action) and a presence of a flag.
  compile: (flag) ->
    switch flag
      when 'css'
        console.log 'start the less compiler.'
  server: (flag) ->
    switch flag
      when 'start'
        new Server process.cwd() + '/app.js' # TODO: Give this some luv!
  watch: (flag) ->
    switch flag
      when 'dev' then console.log 'watching for dev changes.'
    console.log 'watching for changes...'