spawn = require('child_process').spawn

exports.Server = class Server
  
  constructor: (src) ->
    @src = src
    @invoke()
  
  invoke: ->
    @app = app = spawn 'node', ['app.js']
    
    app.stdout.on 'data', (data) ->
      console.log '[app] ' + data.toString()
    
    app.stderr.on 'data', (data) ->
      console.log '[app] ' + data.toString()