fs = require 'fs'

exports.Config = class Config
  
  #Config::loadFrom(loc)
  @loadFrom = (loc) ->
    try
      conf = fs.readFileSync loc, 'utf-8'
      @load conf
    catch err
      console.log 'No config file to read from at location: ' + err.path if err.code is 'ENOENT'
      process.exit 1
  
  #Config::load(data)
  @load = (data) ->
    try
      JSON.parse data
    catch err
      console.log 'The JSON parser reported the following error: ' + err
      process.exit 1