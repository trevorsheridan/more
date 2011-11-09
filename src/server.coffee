fs    = require 'fs'
spawn = require('child_process').spawn

exports.Server = class Server
  constuctor: (src) ->
    console.log 'hi'
    @src = src
    @invoke
    
  invoke: ->
    @app = app = spawn('node', @src)
    app.stdout.on 'data', (data) ->
      console.log 'data is here!'