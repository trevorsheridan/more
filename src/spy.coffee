fs = require 'fs'

exports.Spy = class Spy
    
  watch: (path, callback) ->
    @buildDirectoryTree
  
  introspectDirTree: (rootDir) ->
    fs.readdir(path, [callback])