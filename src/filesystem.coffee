fs   = require 'fs'
path = require 'path'
_    = require 'underscore'

exports.FileSystem = class FileSystem

  # Compiler.childDirs((string)dir, (bool)withFiles, [(object)extensions])
  # Synchronous, recursive, directory analysis.
  @analyzeStructure: (dir, withFiles, extensions...) ->
    d = new Array
    for file in fs.readdirSync path.normalize(dir)
      do (file) =>
        try
          file = path.relative(process.cwd(), path.join(dir, file)) # File is a path relative to the cwd, this is in contrast to the absolute path prior.
          if (withFiles and _.contains extensions[0], path.extname file) or (withFiles and !extensions[0]) or fs.readdirSync file
            d.push file
          for child in children = @analyzeStructure file, withFiles, extensions[0]
            d.push child if children.length > 0
    return d
    
  @getFilesInTree: (tree) ->
    f = new Array
    for file in tree
      do (file) =>
        try
          f.push file if fs.readFileSync file
    return f