# Command class for e3. Exposes a command-line interface through nomnom, and a wrapper class to access commands within the library.

_     = require 'underscore'
fs    = require 'fs'
path  = require 'path'
spawn = require('child_process').spawn
less  = require 'less.js'

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
    
  read: ->
    return fs.readFileSync path.join(process.cwd(), @f), 'utf-8'
    
  save: (name, data) ->
    fs.writeFile name, (new Buffer data, 'utf-8'), (err) ->
      if err then throw err
      console.log('saved file!') # FIX!
    
    
class Less extends Compiler
  
  constructor: (file) ->
    @f = file
    @d = @read(@f)
    
  parse: ->
    that = @
    (new less.Parser {paths: ['.'], filename: @f}).parse @d, (err, tree) ->
      if err then throw err
      that.save('base2.css', tree.toCSS()) # FIX!
      

exports.Command = class Command
  
  command: (action, options, opts) -> # Dispatch incoming commands to the appropriate action
    flag = _.find(_.keys(options), (item) -> yes if item in opts)
    if @[action] and flag? then @[action](flag) # Check if there's a corresponding member (action) and a presence of a flag.
  
  compile: (flag) ->
    switch flag
      when 'css'
        l = new Less('base.less') # FIX!
        l.parse()
  
  server: (flag) ->
    switch flag
      when 'start' then new Server process.cwd() + '/app.js' # FIX!
  
  watch: (flag) ->
    switch flag
      when 'dev' then console.log 'watching for dev changes.'
    console.log 'watching for changes...'