
var express = require('express');
var path = require('path');
var app = express();

var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, './app/assets')));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './app/assets/', 'index.html'));
});

app.listen(port);
console.log("App listening on port " + port);
