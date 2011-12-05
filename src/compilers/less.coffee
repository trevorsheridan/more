path     = require 'path'
less     = require 'less'
_        = require 'underscore'

Compiler = require('../compiler').Compiler
FileSystem = require('../filesystem').FileSystem

exports.Less = class Less extends Compiler
  
  constructor: (source, relatives) ->
    @relatives = relatives
    super source
  
  # Less.parse((string)[outfile], (Function)[callback])  
  parse: (callback...) ->
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
        # The context is always the parent, the child of the parent is what you work with.
        @_parser.parse @read(), (err, tree) => 
          if err
            console.log '[less] In ' + path.basename(err.filename) + ', ' + err.message
          # Add a listener to each of the children.
          @imports = _.keys @_parser.imports.files
          for child in @imports
            @relatives[path.normalize(child)].changed.add @changedCallback = (child, callback...) ->
              @onChange child, callback[0]
            , @
      else
        @_parser.parse @read(), (err, tree) =>
          if err
            console.log '[less] In ' + path.basename(err.filename) + ', ' + err.message
          else
            lastImports = @imports
            @imports = _.keys @_parser.imports.files
            for child in _.difference(lastImports, @imports)
              # Remove any (old) child that's not in the current imports.
              @relatives[path.normalize(child)].changed.remove @changedCallback
            for child in _.difference(@imports, lastImports)
              # Add any new children!
              @relatives[path.normalize(child)].changed.add @changedCallback = (child, callback...) ->
                @onChange child, callback[0]
              , @
            # Dispatch a "changed" event to anyone who cares.
            @changed.dispatch(@, if callback[0] then callback[0] else new Function)
            if (callback[0]) then callback[0].call @, tree.toCSS() else console.log tree.toCSS()
            # For some reason, the parser caches the old imports. So we will set it to an empty object.
            @_parser.imports.files = {}
    catch err
      console.log err
    return @
    
  onChange: (child, callback...) ->
    @parse if callback[0] then callback[0] else new Function # Hey! Now that my child changed, I need to update myself.