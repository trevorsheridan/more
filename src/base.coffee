signals = require 'signals'

exports.Base = class Base
  
  constructor: (opts...) ->
    @changed = new signals.Signal
    
  name: ->
    return @_name
  
  setName: (name) ->
    @_name = name