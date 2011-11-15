fs   = require 'fs'
path = require 'path'

exports.Compiler = class Compiler
  
  constructor: (source, output) ->
    @source = source
    @output = output
  
  read: ->
    fs.readFileSync @source, 'utf-8'
    
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
  
  # Synchronous, recursive directory tree lookup.
  childDirs: (dir) ->
    d = new Array
    for file in fs.readdirSync path.normalize(dir)
      do (file) =>
        try
          file = path.join(dir, file)
          d.push file if fs.readdirSync file
          for child in children = @childDirs file
            d.push child if children.length > 0
    return d