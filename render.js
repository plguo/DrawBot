"use strict";

//          (+y)
//           ^
//           |
//           |
// (-x) -----------> (+x)
//           |
//           |
//          (-y)

var basePosition = [-50, 170];//[0, 220];
var closeArmLength = 143.72; // 145;
var farArmLength = closeArmLength * 1.178; //1.85//169.34; // 165;

module.exports = function(cartesianPaths) {
  var armPaths = [];
  var lastArmConfiguration = 0;

  var numberOfCartesianPaths = cartesianPaths.length;
  for (var i = 0; i < numberOfCartesianPaths; i++) {
    var cartesianPath = cartesianPaths[i];
    var numberOfPositions = cartesianPath.length;

    var armPath = [];

    for (var j = 0; j < numberOfPositions; j++) {
      var cartesianPosition = cartesianPath[j];

      cartesianPosition[1] = 500 - cartesianPosition[1];
      
      cartesianPosition[0] /= 5;
      cartesianPosition[1] /= 5;
      

      var dx = cartesianPosition[0] + basePosition[0];
      var dy = cartesianPosition[1] + basePosition[1];
      var distance = Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2) );

      var beta = Math.acos( ( Math.pow(distance, 2)  -  Math.pow(closeArmLength, 2) - Math.pow(farArmLength, 2) ) / ( -2 * closeArmLength * farArmLength) );

      var alpha = Math.asin( Math.sin( beta ) * farArmLength / distance ) + Math.atan2(dy, dx);
      console.log(dx, dy, alpha, beta);
      armPath.push([alpha, beta]);
    }

    armPaths.push(armPath);
  }

  return armPaths;
}
