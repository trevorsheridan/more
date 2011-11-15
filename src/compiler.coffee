fs   = require 'fs'
path = require 'path'

exports.Compiler = class Compiler
  
  constructor: (filename, fileout) ->
    @f = filename
    @o = fileout
  
  read: ->
    fs.readFileSync @f, 'utf-8'
    
  save: (out, data, opts...) ->
    fs.writeFileSync out, (new Buffer data, 'utf-8')
    opts[0].call @, {code: 1, file: out, data: data}
  
  # Compiler.watch([callback])
  watch: (opts...) ->
    fs.watch path.dirname(@f), (event, filename) =>
      opts[0].call @
  
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