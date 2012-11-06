if typeof require is 'function' and typeof exports is 'object' and typeof module is object
  Ubret = 
    Map: require'./controllers/Map'
    Statistics: require './controllers/Statistics'
    SubjectViewer: require './controllers/SubjectViewer'
    Table: require './controllers/Table'
  
  module.exports = Ubret
else
  window.Ubret = new Object