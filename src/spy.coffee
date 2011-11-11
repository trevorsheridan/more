fs = require 'fs'

exports.Spy = class Spy
    
  watch: (path, callback) ->
    fs.watch(path, (event, filename) -> console.log event)
    #callback?()