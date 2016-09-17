"use strict";

var bot = require("./bot");
var sleep = require("./sleep");

module.exports = function(servoPaths) {
  // Example input
  // [ [ [0.0, 0.0], [3.0, 4.0], [5.0,6.0] ],
  //   [ [0.0, 0.0], [7.0, 8.0] ]

  var numberOfPaths = servoPaths.length;

  for (var i = 0; i < numberOfPaths; i++) {
    var path = servoPaths[i];
    var numberOfPositions = path.length;

    for (var j = 0; j < numberOfPositions; j++) {
      var position = path[j];

      console.log("---------------------------")
      var deltaTime = [0,0];

      deltaTime[0] = bot.closeArm.setAngle(position[0]);
      deltaTime[1] = bot.farArm.setAngle(position[1]);

      var maxTime = Math.max(deltaTime[0], deltaTime[1]);
      console.log("Time: " + Number(maxTime).toFixed(3) + "s")
      sleep(maxTime);
      
      if (j == 0) {
        bot.pen.down();
        sleep(0.2);
      }
    }
    sleep(0.2);
    bot.pen.up();
    sleep(0.2);
  }
  
    bot.farArm.setAngle(0); //0

    bot.closeArm.setAngle(Math.PI); //Math.PI
}
