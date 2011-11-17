fs      = require 'fs'
path    = require 'path'
signals = require 'signals'

Base = require('./base').Base

exports.Compiler = class Compiler extends Base
  
  constructor: (source, relatives) ->
    @source = source
    @setName path.basename source
    @relatives = relatives
    super
  
  # Compiler.read()
  read: ->
    fs.readFileSync @source, 'utf-8'
  
  # Compiler.save(out, data, [callback])
  save: (out, data, opts...) ->
    fs.writeFileSync out, (new Buffer data, 'utf-8')
    opts[0].call @, {code: 1, file: out, data: data} if opts[0]?
  
  # Compiler.watch([callback])
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