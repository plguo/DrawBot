"use strict";

// The program is using the Node.js built-in `fs` module
// to load the html file used to view the range finder status
var fs = require("fs");

// The program is using the Node.js built-in `path` module to find
// the file path to the html file used to view the range finder status
var path = require("path");

var bot = require("./bot");

var manger = require('./manger');

// Starts the built-in web server for the web page
// used to view or control the arm
var server = function(){
  var express = require('express');
  var app = express();

  var bodyParser = require('body-parser');

  app.use(bodyParser.json());

  // Serve up the main web page used for the robot arm
  function index(req, res) {
    function serve(err, data) {
      if (err) { return console.error(err); }
      res.send(data);
    }
    fs.readFile(path.join(__dirname, "index.html"), {encoding: "utf-8"}, serve);
  }

  app.get("/", index);

  app.post("/draw", function(request, response){
    manger(request.body, response);
  });

  app.listen(process.env. PORT || 3000);
}

// The main function calls `server()` to start up
// the built-in web server used to control the arm.
// It then starts reading the joystick every 50 ms, and using
// that data to control the stepper motors for the arm.
function main() {
  var x, y;

  server();

  bot.setup();

  console.log("Finished Setup");
}

main();
