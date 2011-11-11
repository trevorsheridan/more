var express = require('express'), app = express.createServer();

app.configure(function() {
  app.use(express.static(__dirname + '/_public'));
});

app.get('*', function(req, res) {
  if (req.params[0] == '/')
    res.sendfile(__dirname + '/index.html');
  else
    res.sendfile(__dirname + '/' + (r = req.params[0], /\.(.*)$/i.exec(r) ? r : r + '.html'));
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});