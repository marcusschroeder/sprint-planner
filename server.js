var config = require("./config.json")
var express = require('express');
var fs = require('file-system');
var bodyParser = require('body-parser');
var ws = require("nodejs-websocket");
var app = express()

app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json


app.post('/sprint/:id', function (req, res) {
    console.log("POST " + req.originalUrl);
    fs.writeFile(config.data + req.params.id + ".json", JSON.stringify(req.body), function (err) {
      if (err) {
        res.status(404).send("data not found");
      };
    });

    res.status(204).send();
});

app.get('/sprint/:id', function (req, res) {
    console.log("GET " + req.originalUrl);
    fs.readFile(config.data + req.params.id + ".json", {encoding: "utf8"}, function (err, data) {
        if (err) {
          res.status(404).send("data not found");
        } else {
          var payload = JSON.parse(data)
          res.status(200).send(payload)
        }
    });
});

var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port

    fs.mkdir("data")
    
    console.log('App listening at http://%s:%s', host, port)

})

// Scream server example: "hi" -> "HI!!!"
var websocketServer = ws.createServer(function (conn) {
  console.log("New connection")
  conn.on("text", function (str) {
    console.log("Received "+str)
    conn.sendText(str.toUpperCase()+"!!!")
  })
  conn.on("close", function (code, reason) {
    console.log("Connection closed")
  })
}).listen(8001)