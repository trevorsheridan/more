fs   = require 'fs'
path = require 'path'

exports.FileSystem = class FileSystem

  # Compiler.childDirs((string)dir, (bool)withFiles)
  # Synchronous, recursive, directory analysis.
  @analyzeStructure: (dir, withFiles) ->
    d = new Array
    for file in fs.readdirSync path.normalize(dir)
      do (file) =>
        try
          file = path.join(dir, file)
          d.push file if withFiles or fs.readdirSync file
          for child in children = @analyzeStructure file, withFiles
            d.push child if children.length > 0
    return d
    
  @getFilesInTree: (tree) ->
    f = new Array
    for file in tree
      do (file) =>
        try
          f.push file if fs.readFileSync file
    return f