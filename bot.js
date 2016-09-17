"use strict";
var mraa = require("mraa");
var servo = require("./servo");
var sleep = require("./sleep");
var render = require("./render");
var pen = {
    isDown: false,
  
    down: function() {
        console.log("Pen down");
        this.servo.write(0.55);
        sleep(0.5);
    },

    up: function() {
        console.log("Pen up");
        this.servo.write(0.0);
        sleep(0.5);
    }
};

pen.servo = new servo.Servo();

function Arm() {
  this.currentAngle = 0.0;

  this.angleOffset = 0.0;

  this.attach = function (pin) {
    this.pin = pin;
    
    this.servo = new servo.Servo();
    this.servo.attach(pin);
  }

  this.setAngle = function (angle) {
    console.log("Arm Pin:" + this.pin + " Set Angle:" + Number(angle).toFixed(4) + " Deg:" + Number(angle/Math.PI*180).toFixed(2));
    
    var signalAngle = Math.PI - (angle + this.angleOffset);
    this.servo.write(signalAngle);

    var deltaAngle = Math.abs(angle - this.currentAngle);
    this.currentAngle = angle;

    return deltaAngle * 1.0 + 0.2;
  }
}

var farArm = new Arm();
farArm.angleOffset = -0.50159265359;


var closeArm = new Arm();
closeArm.angleOffset = -0.04079632679;

function moveToPosition(x, y) {
  var angleResult = render([[[x,500 - y]]]);
  var alpha = angleResult[0][0][0];
  var beta = angleResult[0][0][1];
  
  console.log("------------------------");
  console.log(`Move to ${x}, ${y}`);
  console.log(alpha, beta);
  
  closeArm.setAngle(alpha);
  farArm.setAngle(beta);
}

function calibrate() {
  var a0 = new mraa.Aio(0);
  var a1 = new mraa.Aio(1);
  var i = 0;
  
  // Actual Output: 1.57079632679,  3.14159265359
  //               -0.04079632679, -0.50159265359
  // Actual Input:           1.53,           2.64
  
  while(true) {
    var beta = 2.64 + 0.5 * (0.5 - a1.readFloat());
    farArm.setAngle(beta);
    var alpha = 1.564585201052986 + 0.5 * (0.5 - a0.readFloat());
    closeArm.setAngle(alpha);
    
    if (i % 40 == 0) {
      console.log(`A0:${a0.readFloat()} A1:${a1.readFloat()}, ${alpha}, ${beta}`);
    }
    
    i++;
    sleep(0.05);
    
  }
}

var setup = function() {
  
    pen.servo.attach(6);
    pen.up();
  
    farArm.attach(5);
    farArm.servo.maxAngle = 2.9;
    farArm.setAngle(0); //0

    closeArm.attach(9);
    closeArm.setAngle(Math.PI); //Math.PI
    
    sleep(3.0);
  return;
    moveToPosition(0,0);
    sleep(0.5);
    pen.down();
    
    sleep(1.0);
  
    moveToPosition(0,500);
  
    sleep(1.0);
  
    moveToPosition(500,500);
  
  sleep(1.0);
//  
//    moveToPosition(500,0);
//  
//  sleep(1.0);
//  
//    moveToPosition(0,0);
//  sleep(1.0)
//    pen.up();

};

module.exports = {
    pen: pen,
    farArm: farArm,
    closeArm: closeArm,
    setup: setup
};
