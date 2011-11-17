path     = require 'path'
less     = require 'less'

Compiler = require('../compiler').Compiler
FileSystem = require('../filesystem').FileSystem

exports.Less = class Less extends Compiler
  
  # Less.parse((string)[outfile], (Function)[callback])
  
  parse: (opts...) ->
    throw new Error "In order to parse, source \"@source\" must be defined and of type `string`" if (typeof @source isnt "string") or (@source is null)
    try
      if (!@_parser)
        @_parser = new less.Parser
          paths: (=>
            dirs = ['.', './' + path.relative process.cwd(), path.dirname(@source)]
            for child in FileSystem.analyzeStructure path.dirname(@source), false
              dirs.push './' + path.relative process.cwd(), child
            return dirs
          )()
          filename: @source
        @_parser.parse @read(), (err, tree) => # The context is always the parent, the child of the parent is what you work with.
          if err
            console.log '[less] In ' + path.basename(err.filename) + ', ' + err.message
          for name, obj of @_parser.imports.files # Who are your children?
            child = @relatives[name]
            child.changed.add @onChange, @ # Would you (@) like to know when your children change?
      else
        @_parser.parse @read(), (err, tree) =>
          if err
            console.log '[less] In ' + path.basename(err.filename) + ', ' + err.message
          else
            @changed.dispatch(@)
            console.log '---------- Compiled Output ------------------'
            console.log tree.toCSS() # This is where we will actually save the file if it's a file that needs to be saved.
            # @save opts[0], tree.toCSS(), opts[1]
    catch err
      console.log err
    return @
    
  onChange: (child...) ->
    @parse() # Hey! Now that my child changed, I need to update myself.