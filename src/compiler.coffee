fs = require 'fs'

exports.Compiler = class Compiler

  # Compiler.read()
  read: ->
    fs.readFileSync @f, 'utf-8'
  
  # Compiler.save(name, data)
  save: (out, data, opts...) ->
    fs.writeFile out, (new Buffer data, 'utf-8'), (err) ->
      if err then throw err
      opts[0].call this, {code: 1 ,file: out, data: data}