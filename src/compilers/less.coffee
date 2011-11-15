path     = require 'path'
Compiler = require('../compiler').Compiler
less     = require 'less'

exports.Less = class Less extends Compiler
  
  # Less.parse([opts])
  parse: (opts...) ->
    throw new Error "In order to parse, source \"@source\" must be defined and of type `string`" if (typeof @source isnt "string") or (@source is null)
    try
      (new less.Parser
        paths: (=>
          dirs = ['.', './' + path.relative process.cwd(), path.dirname(@source)]
          for child in @childDirs(path.dirname(@source))
            dirs.push './' + path.relative process.cwd(), child
          return dirs
        )()
        filename: @source
      ).parse @read(), (err, tree) =>
        if err
          console.log '[less] In ' + path.basename(err.filename) + ', ' + err.message
        else
          @save @output, tree.toCSS(), opts[0] # Do some pub/sub action here to avoid all of the damn callbacks.
    catch err
      console.log err
    return @