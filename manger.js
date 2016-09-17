"use strict";

var render = require('./render');
var draw = require('./draw');

var printPathsInfo = function(paths) {
  var numberOfPoints = 0;
  var l = paths.length;
  for (var i = 0; i < l; i++) {
    numberOfPoints += paths[i].length;
  }

  console.log("NoP: " + numberOfPoints);

  for (var i = 0; i < l; i++) {
    var path = paths[i];
    console.log("     -" + path.length);
  }
}

var processPoints = function(paths, response) {
  var numberOfPoints = 0;

  var angleThreshold = 3; // 171.887deg

  var l = paths.length;
  for (var i = 0; i < l; i++) {
    numberOfPoints += paths[i].length;
  }

  console.log("NoP: " + numberOfPoints);

  for (var i = 0; i < l; i++) {
    var path = paths[i];
    console.log("     -" + path.length);

    if (path.length < 3) { continue; }

    var removableIndexs = [];
    var k = path.length - 1;
    var Ax, Ay, Bx, By, dA, dB, dotProduct, alpha;
    for (var j = 1; j < k; j++) {
      Ax = path[j-1][0] - path[j][0];
      Ay = path[j-1][1] - path[j][1];

      Bx = path[j+1][0] - path[j][0];
      By = path[j+1][1] - path[j][1];

      dA = Math.hypot(Ax, Ay);
      dB = Math.hypot(Bx, By);

      dotProduct = Ax * Bx + Ay * By;

      alpha = Math.acos(dotProduct/(dA * dB));

      if (alpha >= angleThreshold) {
        removableIndexs.push(j);
      }
    }

    var numOfRemovableIndexs = removableIndexs.length;
    for (var m = numOfRemovableIndexs - 1; m >= 0; m--) {
      path.splice(removableIndexs[m], 1);
    }
  }

  for (var i = l - 1; i >= 0; i--) {
    if (paths[i].length == 1) {
      paths.splice(i, 1);
    }
  }

  response.send(JSON.stringify(paths));

  console.log("After:")
  printPathsInfo(paths);

  console.log("Calculate Arm Paths");
  var armPaths = render(paths);

  console.log("Start Drawing");
  draw(armPaths);
  console.log("Finished Drawing");
};

module.exports = processPoints;
