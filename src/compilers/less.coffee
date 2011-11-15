path     = require 'path'
Compiler = require('../compiler').Compiler
less     = require 'less'

exports.Less = class Less extends Compiler
  
  # Less.parse([opts])
  parse: (opts...) ->
    (new less.Parser {paths: ['.', './less'], filename: @f}).parse @read(), (err, tree) =>
      if err
        console.log '[less] In ' + path.basename(err.filename) + ', ' + err.message
      else
        @save @o, tree.toCSS(), opts[0] # Do some pub/sub action here to avoid all of the damn callbacks.
    return @