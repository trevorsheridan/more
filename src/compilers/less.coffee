Compiler = require('../compiler').Compiler
less     = require 'less.js'

exports.Less = class Less extends Compiler
  
  # Less.save(file, out)
  constructor: (file, out) ->
    @f = file
    @o = out
  
  # Less.parse([opts])
  parse: (opts...) ->
    (new less.Parser {paths: ['.', './less'], filename: @f}).parse @read(), (err, tree) =>
      if err then throw err
      @save @o, tree.toCSS(), opts[0] # Do some pub/sub action here to avoid all of the damn callbacks.