path     = require 'path'
less     = require 'less'

Compiler = require('../compiler').Compiler
FileSystem = require('../filesystem').FileSystem

exports.Less = class Less extends Compiler
  
  # Less.parse((string)[outfile], (Function)[callback])
  parse: (opts...) ->
  
    console.log opts
    
    throw new Error "In order to parse, source \"@source\" must be defined and of type `string`" if (typeof @source isnt "string") or (@source is null)
    try
      (new less.Parser
        paths: (=>
          dirs = ['.', './' + path.relative process.cwd(), path.dirname(@source)]
          for child in FileSystem.analyzeStructure path.dirname(@source), false
            dirs.push './' + path.relative process.cwd(), child
          return dirs
        )()
        filename: @source
      ).parse @read(), (err, tree) =>
        if err
          console.log '[less] In ' + path.basename(err.filename) + ', ' + err.message
        else
          @save opts[0], tree.toCSS(), opts[1]
    catch err
      console.log err
    return @