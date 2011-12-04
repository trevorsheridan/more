fs      = require 'fs'
path    = require 'path'
signals = require 'signals'

Base = require('./base').Base

exports.Compiler = class Compiler extends Base
  
  constructor: (source) ->
    @source = source
    @setName path.basename(source)
    super
  
  # Compiler.read()
  read: ->
    fs.readFileSync @source, 'utf-8'
  
  # Compiler.save(output, data, [callback])
  save: (output, data, callback...) ->
    fs.writeFileSync output, (new Buffer data, 'utf-8')
    callback[0].call @, {code: 1, file: output, data: data} if callback[0]?
  
  # Compiler.watch([callback])
  # Much of this was inspired by CoffeeScript's implementation. It's damn near perfect.
  watch: (opts...) ->
    fs.stat @source, (err, prevStats) =>
      throw err if err
      watch = fs.watch @source, callback = (event) =>
        if event is 'rename'
          watch.close()
          try
            watcher = fs.watch @source, callback
        else if event is 'change'
          fs.stat @source, (err, stats) =>
            throw err if err
            return if stats.size is prevStats.size and
              stats.mtime.getTime() is prevStats.mtime.getTime()
            prevStats = stats
            opts[0].call @ if opts[0]?